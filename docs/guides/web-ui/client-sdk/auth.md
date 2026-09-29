---
id: guides/web-ui/client-sdk/auth
title: Authentication and recovery
description: Supply cookie or token credentials to Factory, refresh an expired browser session once per burst of 401s, reopen a failed ClientLink after re-authenticating, and keep retained commands readable across both.
audience: developer
section: guides
order: 8
publication: released
proofs:
  who-owns-identity: [release-npm-looprig-client]
  credential-hooks: [release-npm-looprig-client]
  refresh-an-expired-cookie: [release-npm-looprig-client]
  reopen-a-failed-link: [release-npm-looprig-client, release-npm-looprig-react]
  retained-commands-across-re-authentication: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client, release-npm-looprig-react]
  proof: [release-npm-looprig-client, release-npm-looprig-react]
---

# Authentication and recovery

A browser session outlives its credentials. Cookies expire, tokens rotate, and a WebSocket that fails during that window must not keep retrying with a dead identity. `@looprig/client` does not log anyone in. It gives the application three seams: credential hooks for every request, a fetch wrapper that refreshes once on `401`, and a controller that re-authenticates before it reopens a failed link. This page covers all three and how retained commands survive them.

## Who owns identity

[Factory](/docs/modules/factory) verifies callers through an identity verifier and authorizer that the deployment injects, and it guards ClientLink connections and state-changing requests with trusted origins and CSRF checks. The application owns login, logout, and whatever endpoint re-mints an expired browser session. The client only carries the result.

| Deployment | REST credentials | ClientLink credentials |
| --- | --- | --- |
| Factory serves the page, cookie session | The browser cookie. Pass no `restHeaders`. | The same cookie on the WebSocket upgrade. Pass no `connectionToken`. |
| Bearer token from an external identity provider | `restHeaders()` returns an `Authorization` header. | `connectionToken()`, plus `subscriptionToken()` where the deployment issues per-channel tokens. |

[Carbon](/docs/products/carbon) is the first case. Its SPA is served by the same process as Factory, so it constructs the client with a base URL and no credentials at all.

## Credential hooks

`FactoryCredentials` combines the REST and ClientLink hooks. Every hook is called on demand, so it can return the current value from a token store.

```ts
import { createFactoryClient, type FactoryCredentials } from "@looprig/client";

declare const tokens: { current(): Promise<string> };

const credentials: FactoryCredentials = {
  // Merged into every REST read and every command read-back.
  async restHeaders() {
    return { Authorization: `Bearer ${await tokens.current()}` };
  },
  // Called by the WebSocket client whenever it needs a connection token.
  connectionToken: () => tokens.current(),
  // Called per channel, with the channel name, when a subscription opens.
  subscriptionToken: async ({ channel }) => tokens.current(),
};

const client = createFactoryClient({ baseUrl: "https://factory.example", credentials });
```

The link decides at construction whether a connection token hook exists. Leave `connectionToken` undefined for a cookie deployment rather than installing a hook that cannot produce a token. `subscriptionData({ channel })` is also available when a deployment expects extra subscription data.

## Refresh an expired cookie

`createRefreshingFetch(fetchImpl, refresh)` wraps a fetch for cookie deployments. Every request is sent with `credentials: "same-origin"`. When a response is `401`, the wrapper calls `refresh()` and, if it resolves `true`, sends the same request once more.

```ts
import { createFactoryClient, createRefreshingFetch } from "@looprig/client";

// The application's own endpoint that re-mints the session cookie.
async function refreshSession(): Promise<boolean> {
  const response = await fetch("/auth/refresh", { method: "POST", credentials: "same-origin" });
  return response.ok;
}

const authedFetch = createRefreshingFetch(globalThis.fetch.bind(globalThis), refreshSession);
const client = createFactoryClient({ fetch: authedFetch });
```

The wrapper is deliberately narrow:

- Concurrent `401`s share one refresh call.
- A second `401` after a successful refresh is returned to the caller, not refreshed again.
- A refresh that resolves `false` or throws leaves the original `401` as the result.
- Only a request with no body or a string body is replayed, because only those can be resent byte for byte. A stream body returns its `401`.

## Reopen a failed link

A WebSocket cannot answer `401` the way a REST call does, so an expired cookie shows up as a failed connect. `LinkRecoveryController` fixes that order: it runs an authenticated REST probe through the refreshing fetch, which re-mints the cookie if needed, and only then reopens the link.

```ts
import { LinkRecoveryController, type FactoryClient } from "@looprig/client";

// The client must be built with the refreshing fetch, so the probe's 401
// re-mints the cookie before the link is reopened.
function recoverLink(client: FactoryClient): LinkRecoveryController {
  const recovery = new LinkRecoveryController({
    probe: (signal) => client.reads.readBootstrap({ signal }),
    open: () => { void client.link.connect().then(() => recovery.update("connected"), () => recovery.update("failed")); },
  });
  return recovery;
}

// Report each state change. Only "failed" schedules an attempt, and
// "connected" resets the backoff and cancels anything pending.
// recovery.update("failed");
// recovery.cancel(); // on teardown: aborts a probe in flight and skips its reopen
```

Attempts wait 2 seconds, doubling to at most 60 seconds, and each probe is bounded at 5 seconds. The link is reopened even when the probe fails, so a transient fault does not strand it. A schedule that is cancelled and made again, as React StrictMode does, does not count as an attempt. `reopenFailedLink(probe, open)` is the same probe-then-open step without the schedule. In React, `useLinkRecovery()` runs this controller against the provider's link state, and `FactoryIdentityProvider` rebuilds the client when its `authGeneration` changes at login or logout. See [Link and identity providers](/docs/guides/web-ui/react/link-and-identity).

## Retained commands across re-authentication

A command whose acknowledgement was lost is kept in `localStorage` by `PendingSlot` and read back by identity before any resend. See [Commands and gates](/docs/guides/web-ui/client-sdk/commands). The read-back goes through a `CommandResolver`. `createCommandResolver(fetchImpl, baseUrl)` uses only the fetch it is given and adds no `restHeaders`, so give it the refreshing fetch in a cookie deployment:

```ts
import { createCommandResolver, createRefreshingFetch } from "@looprig/client";

declare const refreshSession: () => Promise<boolean>;

const authedFetch = createRefreshingFetch(globalThis.fetch.bind(globalThis), refreshSession);
// Reads GET /v1/sessions/{sid}/commands/{cid}. Only a valid 404 command_not_found
// (or session_not_found for a create) proves the command was never admitted.
const resolver = createCommandResolver(authedFetch);
```

A read-back that fails for any other reason, including an unrecovered `401`, leaves the command retained with an unknown outcome. It is never resent on a guess. Slots are keyed by a namespace you choose, so give each signed-in principal its own namespace if one browser profile can hold several accounts.

## Source

The refreshing fetch is in [`packages/client/src/factory-auth.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-auth.ts), link recovery is in [`packages/client/src/link-recovery.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/link-recovery.ts), and the credential types are in [`packages/client/src/client.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/client.ts) and [`packages/client/src/clientlink.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/clientlink.ts). Retained commands and the resolver are in [`packages/client/src/pending-store.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/pending-store.ts), and the React hook is [`packages/react/src/use-link-recovery.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-link-recovery.ts).

## Proof

[`packages/client/test/factory-auth.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/factory-auth.test.ts) covers same-origin credentials, one shared refresh, the second-`401` and refused-refresh cases, body replay safety, probe-before-reopen, the backoff schedule and its reset, StrictMode-safe cancellation, and abort on teardown. [`packages/client/test/pending-store.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/pending-store.test.ts) covers the resolver's `404` rules and unknown outcomes. Continue with [React](/docs/guides/web-ui/react) or [Session lifecycle](/docs/guides/web-ui/sessions).
