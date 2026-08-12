---
id: guides/web-ui/client-sdk/index
title: Client SDK
description: Use the typed Looprig client transport as the stable boundary between a web interface and session HTTP and live-event contracts.
audience: developer
section: guides
order: 1
publication: released
proofs:
  transport-and-client-boundary: [release-github-com-looprig-client]
  choose-a-transport: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Client SDK

## Transport and client boundary

The public `LooprigTransport` interface covers the cold session surface: `listSessions`, `readStatus`, and `readHistory`, plus `createSession`, `restoreSession`, `submit`, `respondGate`, and `interrupt`. Each method parses its response through the SDK validators before resolving. Live SSE is a separate seam, which keeps request/response behavior independent from the long-lived event stream.

```ts
import {
  createBFFClient,
  createClient,
  type LooprigTransport,
} from "@looprig/client";

const browserClient: LooprigTransport = createBFFClient();
const appClient = createClient(browserClient);

const page = await appClient.listSessions({ skip: 0, limit: 25 });
const status = await appClient.readStatus("session-id");
```

`createClient` accepts any `LooprigTransport`, including a test double or a custom implementation. `createBFFClient` constructs the same-origin `BFFTransport`, whose default base path is `/api/v1`.

## Choose a transport

`BFFTransport` is the normal browser choice. It calls relative `/api/v1/...` paths, carries a lazily minted CSRF token on control requests, and does not hold a bearer token. The BFF supplies the server-side credential when it forwards the request.

`ServeTransport` is for a trusted server-side caller, a Node process, a CLI, or a test harness that talks directly to `pkg/serve`. Its required `baseUrl` points at unprefixed `/v1` routes. When `token` is supplied, shared HTTP plumbing sends `Authorization: Bearer <token>` on every request. A custom `fetch` can attach another authentication scheme.

```ts
import { ServeTransport } from "@looprig/client";

const serverClient = new ServeTransport({
  baseUrl: "https://serve.internal.example/v1",
  token: process.env.LOOPRIG_TOKEN,
});

const created = await serverClient.createSession({
  blocks: [{ type: "text", text: "Hello" }],
});
```

Both transports share one implementation of URL construction, JSON decoding, runtime validation, typed HTTP errors, and abort handling. This makes the same `LooprigTransport` contract usable by a browser adapter and a trusted service without duplicating protocol logic.

## Source

The public client composition and its `createBFFClient` default are implemented in [`sdk/core/src/client.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/client.ts). The transport interface, shared HTTP implementation, `BFFTransport`, and `ServeTransport` are in [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/transport.ts).

## Proof

The transport implementation shows that both concrete classes satisfy `LooprigTransport` and share the response-validation path. The client module shows that `createClient` is a thin composition and that `createBFFClient` is the ergonomic same-origin entry point. Continue with [SessionClient](/docs/guides/web-ui/client-sdk/session-client/) for a framework-neutral live facade or [Events and live streams](/docs/guides/web-ui/client-sdk/events/) for the raw event plane.

