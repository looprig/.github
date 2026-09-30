---
id: guides/web-ui/sessions/binding
title: Binding a session
description: Name a session by tenant and session id, subscribe its ClientLink channel, and understand what Factory binds when a browser starts watching.
audience: developer
section: guides
order: 17
publication: released
proofs:
  name-the-session: [release-npm-looprig-client]
  subscribe-the-session-channel: [release-npm-looprig-client]
  what-factory-binds: [release-npm-looprig-client]
  one-binding-per-channel: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Binding a session

Binding connects one session view to the session's live channel on the application's ClientLink. After binding, Factory relays the session's committed public events, live previews, and repair signals to that view. The public boundary is `ClientLink.subscribe`; the React adapter wraps it as `FactoryLinkStore.bind` and `useSessionBinding`. Binding is a read: it never places the session on a Host.

## Name the session

A session is addressed by a pair: the tenant Factory authenticated you into and the session id. Read the tenant once from Factory's bootstrap document, and take session ids from the recent-session list or from a create you minted.

```ts
import { createFactoryClient, textBlock } from "@looprig/client";

const client = createFactoryClient({ baseUrl: "https://factory.example" });
const { tenant_id: tenantId } = await client.reads.readBootstrap();

// Either an existing session...
const page = await client.reads.listRecentSessions({ limit: 20 });
const existing = page.sessions[0]?.session_id;

// ...or a new one. The session id is minted in the browser before sending.
const create = client.commands.create({ agentId: "coder", blocks: [textBlock("Hello")] });
const sessionId = existing ?? create.sessionId;
```

`readBootstrap` refuses any bootstrap body other than a single non-empty `tenant_id` of at most 256 bytes. The React `FactoryIdentityProvider` performs this read for you (see [Link and identity providers](/docs/guides/web-ui/react/link-and-identity)).

## Subscribe the session channel

`subscribe` opens the channel `session:<tenant>:<session>`, with both parts URL-encoded. Its callbacks receive validated values only.

```ts
await client.link.connect(); // negotiates the wire version once per link

const subscription = client.link.subscribe({
  tenantId,
  sessionId,
  onPublication: (publication) => {
    // enduring_publication, ephemeral_publication, or journal_tip
  },
  onReset: (reset) => {
    // session.reset: Factory saw a gap in this link's delivery; repair.
  },
  onError: (error) => {
    // Refusal, transport drop, or re-subscribe: repair from your cursor.
  },
});

await subscription.ready; // resolves only after Factory authorized the channel
console.log(subscription.state, subscription.version); // "subscribed", 1
```

| Member | Meaning |
|---|---|
| `ready` | resolves after authorization; rejects with the refusal |
| `state` | `unsubscribed`, `subscribing`, or `subscribed` |
| `version` | negotiated sessionwire version, set once authorized |
| `unsubscribe()` | ends the subscription and detaches the channel; idempotent |

A subscription token or data can be supplied per channel through `ClientLinkCredentials.subscriptionToken` and `subscriptionData` (see [Authentication and recovery](/docs/guides/web-ui/client-sdk/auth)).

## What Factory binds

Factory authorizes each subscription through its injected authorizer and then records a delivery binding for that connection and channel. Two browsers watching one session are two bindings and one demand for the session's live tail; while a Host owns the session, Factory relays that tail to every binding. Factory enables no transport recovery or positioning, so it never replays what a connection missed. When a subscription is interrupted by a transport drop, or re-subscribes afterwards, the client reports it through `onError` so the view repairs from its durable cursor rather than appending above a hole. [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect) describes that repair.

## One binding per channel

The underlying transport allows one subscription per channel per connection, so always call `unsubscribe()` before binding the same session again. Share one ClientLink across the application rather than one per view. In React, `FactoryLinkStore` owns the link, coalesces reconnects, and rejoins each binding on its own; `useSessionBinding` subscribes a mounted view and keeps its cursor across reconnects (see [Session views and lists](/docs/guides/web-ui/react/session-view)).

## Source

`subscribe`, the channel name, readiness, and interruption reporting are in [`packages/client/src/clientlink.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/clientlink.ts). The bootstrap and session list reads are in [`factory-rest.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-rest.ts). The shared link store is in [`packages/react/src/stores/connection.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/connection.ts) and the hook in [`use-connection.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-connection.ts).

## Proof

[`clientlink.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/clientlink.test.ts) covers subscription readiness, validation of publications, and interruption reporting. [`connection.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/connection.test.ts) and [`use-factory-link.strict.test.tsx`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-factory-link.strict.test.tsx) pin one link per application, per-binding rejoin, and single cancellation under StrictMode. Server behavior belongs to the [Factory module](/docs/modules/factory).
