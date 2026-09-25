---
id: guides/web-ui/client-sdk/ownership
title: Transport and ownership
description: Choose the browser BFF or direct ServeTransport boundary, understand CSRF and bearer ownership, and cancel requests deliberately.
audience: developer
section: guides
order: 7
publication: released
proofs:
  browser-and-server-boundaries: [release-github-com-looprig-client]
  cancel-and-retry: [release-github-com-looprig-client]
  serve-authorization: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Transport and ownership

## Browser and server boundaries

Use `BFFTransport` in a same-origin browser. It resolves requests under `/api/v1`, keeps the bearer credential in the BFF, and lazily requests a CSRF token only when a control request needs one. The token is cached in memory, shared among concurrent callers, and sent in `X-CSRF-Token`; a rejected token causes one remint and one replay.

Use `ServeTransport` only where the caller is trusted to hold a direct serve credential. Its `baseUrl` points at `/v1`, with no `/api` prefix. A supplied token becomes `Authorization: Bearer <token>`; an injected `fetch` can implement another scheme or credential source.

```ts
import { BFFTransport, ServeTransport } from "@looprig/client";

const browser = new BFFTransport();
const service = new ServeTransport({
  baseUrl: "https://serve.example/v1",
  token: serviceToken,
});
```

Both classes extend shared HTTP plumbing. The UI can depend on `LooprigTransport` and leave URL, headers, JSON parsing, validation, and typed error mapping to the selected implementation.

## Cancel and retry

Every request accepts an optional `AbortSignal`. Aborting before or during a fetch yields `RequestAbortedError`, which is distinct from `NetworkError`. Pass the same signal through a route-owned controller and abort it when the route no longer owns the request.

```ts
const controller = new AbortController();
const pending = client.readHistory(sessionId, { signal: controller.signal });

onRouteLeave(() => controller.abort());

try {
  renderHistory(await pending);
} catch (error) {
  if (error instanceof RequestAbortedError) return;
  showTransportError(error);
}
```

Control requests on the BFF include CSRF handling; direct `ServeTransport` requests do not. Keep ownership explicit: a browser adapter owns its controller and cleanup, while a service process owns its token and retry policy.

## Source

The shared request pipeline, CSRF cache and retry, BFF and serve URL differences, abort behavior, and auth headers are in [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/transport.ts). Direct bearer behavior is asserted in [`sdk/core/test/serve-transport.test.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/test/serve-transport.test.ts).

## Proof

The transport source shows that read methods do not request CSRF headers, while BFF control methods mint and retry the token exactly once. Serve transport tests verify the `Authorization` header, no-header behavior without a token, direct `/v1` paths, and idempotency forwarding.

