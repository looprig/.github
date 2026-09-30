---
id: guides/web-ui/client-sdk/index
title: Client SDK
description: Build a browser client for Factory with @looprig/client, one framework-neutral package for REST reads, the ClientLink WebSocket, commands, and Core wire validation.
audience: developer
section: guides
order: 1
publication: released
proofs:
  install-the-package: [release-npm-looprig-client]
  create-one-client-per-application: [release-npm-looprig-client]
  what-the-client-contains: [release-npm-looprig-client]
  package-boundary: [release-npm-looprig-client]
  report-the-contract-version: [release-npm-looprig-client]
  where-to-go-next: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Client SDK

`@looprig/client` lets a browser application list agents and sessions, read a session's public journal, follow its live output, and send commands, all against a [Factory](/docs/modules/factory) deployment. Factory is the public boundary. The client never talks to a Host or a Harness runtime directly, and everything it receives is validated against the Core `sessionwire/v1` records that Factory serves (see [Core](/docs/modules/core)). The package has no framework dependency. React applications add [`@looprig/react`](/docs/guides/web-ui/react), which is built on the same objects.

## Install the package

The package is published on npm under Apache-2.0 and declares Node 22 or newer for tooling. Its runtime dependencies are `ajv` for schema validation, `centrifuge` for the WebSocket, and `json-schema-to-ts` for the derived types.

```sh
npm install @looprig/client@0.3.0
```

## Create one client per application

`createFactoryClient` builds one ClientLink and the REST planes that share its credentials. Construct it once, near the root of the application, rather than per view: the link owns a WebSocket, and every session view subscribes through it.

```ts
import { createFactoryClient, type FactoryClient } from "@looprig/client";

// Omit baseUrl when Factory serves the page. REST calls then use relative
// /v1/... paths and the link connects to the relative /v1/realtime.
const sameOrigin: FactoryClient = createFactoryClient();

// With a base URL, the realtime endpoint is derived from it: http becomes
// ws, https becomes wss, and /v1/realtime is appended.
const crossOrigin = createFactoryClient({ baseUrl: "https://factory.example" });

// The link is created disconnected. Open it once the application is ready.
const negotiated = await crossOrigin.link.connect();
console.log(negotiated.version); // Core wire version 1
```

Pass `realtimeUrl` to override the derived WebSocket address, for example when a proxy exposes realtime on another host.

## What the client contains

| Member | Type | Purpose |
| --- | --- | --- |
| `reads` | `FactoryReads` | Validated REST reads: bootstrap, agents, sessions, status, journal, gates, and retained objects. |
| `link` | `ClientLink` | The ClientLink WebSocket: connect, per-session subscriptions, and command RPC. |
| `commands` | `FactoryCommands` | Builds retry-stable `PendingCommand` values for create, input, interrupt, restore, and gate responses. |
| `clock` | `Clock` | Defaults to `Date.now`. Inject a fixed clock in tests. |
| `idGenerator` | `IdGenerator` | Defaults to a UUID v4 generator. Command and session IDs come from it. |

`FactoryClientOptions` accepts `fetch`, `baseUrl`, `realtimeUrl`, `credentials`, `clock`, `idGenerator`, and `clientLinkFactory`. The last one takes a `ClientLinkConstructor`, which is how tests and Carbon's SPA replace the real socket with a double. Credentials combine the REST header hook and the ClientLink token hooks described in [Authentication and recovery](/docs/guides/web-ui/client-sdk/auth).

## Package boundary

Import everything from the package root. Deep imports are not part of the published surface, and the package's own surface test checks that every emitted module is reachable from the root. Release 0.3.0 carries only the Factory-native client. It has no Harness serve transport, no SSE parser, and no legacy constructor. The earlier prebuilt web UI bundle has been retired, and [Carbon](/docs/products/carbon) now ships its own SPA on these packages.

## Report the contract version

Since 0.3.0 the package exports `contractInfo`, a frozen record of its own version and the Core contract whose schemas and fixtures it vendors. Log it at startup or show it in an about panel, so a bug report names the exact wire contract the browser validated against.

```ts
import { contractInfo } from "@looprig/client";

// { clientVersion: "0.3.0", coreVersion: "v0.12.0", sessionwireVersion: 1 }
console.info(
  `@looprig/client ${contractInfo.clientVersion}, Core ${contractInfo.coreVersion}, sessionwire v${contractInfo.sessionwireVersion}`,
);
```

`coreVersion` is the Core release tag the schemas were copied from, and `sessionwireVersion` is the wire version the client negotiates with Factory.

## Where to go next

| Task | Guide |
| --- | --- |
| Read sessions, journals, gates, and objects over REST | [Factory REST client](/docs/guides/web-ui/client-sdk/factory-rest) |
| Connect the WebSocket and subscribe to a session | [ClientLink and live streams](/docs/guides/web-ui/client-sdk/clientlink) |
| Show text, reasoning, and tool calls while a model is still working | [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews) |
| Send input, interrupt, restore, and answer gates | [Commands and gates](/docs/guides/web-ui/client-sdk/commands) |
| Turn journal events into transcript rows | [Folding session state](/docs/guides/web-ui/client-sdk/fold) |
| Handle schema failures and Core error codes | [Validation and errors](/docs/guides/web-ui/client-sdk/validation) |
| Refresh expired auth and reopen a failed link | [Authentication and recovery](/docs/guides/web-ui/client-sdk/auth) |
| Keep a view correct across drops and reloads | [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect) |

## Source

The client constructor and its option types are in [`packages/client/src/client.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/client.ts), the public barrel is [`packages/client/src/index.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/index.ts), `contractInfo` is in [`packages/client/src/contract-info.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/contract-info.ts), and the shared `FetchLike` and `RequestOptions` types are in [`packages/client/src/transport.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/transport.ts). The package manifest is [`packages/client/package.json`](https://github.com/looprig/client/blob/v0.3.0/packages/client/package.json).

## Proof

[`packages/client/test/surface.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/surface.test.ts) checks the exported surface, confirms that the removed serve transport is absent, rejects framework dependencies, and installs the packed artifact into a standalone consumer that typechecks and runs. [`packages/client/test/vanilla-consumer.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/vanilla-consumer.test.ts) exercises the package without a framework, and [`packages/client/test/contract.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/contract.test.ts) checks that `contractInfo` matches the package manifest, the vendored Core `VERSION` file, and the negotiated wire version, and that it is frozen. Continue with the [Factory REST client](/docs/guides/web-ui/client-sdk/factory-rest).
