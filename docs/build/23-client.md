---
id: build/23-client
title: Framework-neutral web clients
description: Compose transport, history folding, live joins, actions, and cleanup before choosing a browser view binding.
audience: developer
section: build
order: 23
publication: source-workspace
examples:
  - stage-20-web-client
proofs:
  transport-and-contract: [source-client-sdk-core-package, central-client-stage20-session-client-source]
  fold-and-join: source-client-sdk-core-package
  vanilla-binding: central-client-stage20-vanilla-session-source
  optional-svelte-binding: [source-client-sdk-svelte-package, central-client-stage20-svelte-page-source]
  lifecycle-proof: central-client-stage20-session-client-proof
---

# Framework-neutral web clients

The Go web handler is released with [client v0.1.0](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca). The browser SDK is source-workspace: `sdk/core` is the private `@looprig/client` transport/folding library, and `sdk/svelte` is the private `@looprig/svelte` adapter. The [module packages](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk) are evidence for the current source, not installable release claims.

## Transport and contract {#transport-and-contract}

Start with `LooprigTransport`, `BFFTransport`, or `ServeTransport`. The cold path lists sessions, reads status and journal pages, creates or restores sessions, submits input, responds to gates, and interrupts. Every response is validated against the shared JSON schemas. Non-2xx responses become typed `LooprigError` subclasses; aborts become `RequestAbortedError`, fetch failures become `NetworkError`, and malformed bodies become `MalformedResponseError`.

`BFFTransport` defaults to `/api/v1`, obtains and caches a CSRF token lazily, shares an in-flight mint, and retries CSRF rejection exactly once. `ServeTransport` uses an explicit base URL, optional bearer token, and direct `/v1` routes without CSRF. A create idempotency key is generated once and reused by the caller across retries; restore, input, gate, and interrupt do not pretend to be idempotent.

## Folding, live joins, and actions {#fold-and-join}

`SseFrameParser` handles arbitrary chunk boundaries, UTF-8, heartbeats, and bounded lines. The live source is a separate `LiveFrameSource` factory. `fold` applies history and live enduring frames to the same `SessionView`, merges tool cards by execution ID, records queued inputs and compaction markers, and returns typed `FoldError` values for malformed deltas or upstream error frames. It does not mutate the input view.

`joinSessionView` opens live first, buffers frames while it pages the durable journal, filters enduring frames below the live tip, then follows the source. It can reconnect with a fixed delay and cursor. Abort checks happen between steps. Cleanup calls the live iterator's `return()` without waiting forever on a stuck read, so UI teardown remains bounded.

## Vanilla binding {#vanilla-binding}

The [stage 20 vanilla binding](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/vanilla-session.ts) uses only the DOM and the framework-neutral client. `bindVanillaSession` renders `SessionView.content`, wires submit and interrupt events, and returns a disposer that disconnects the live join and removes both DOM listeners. This is the second layer: it is a binding, not a second protocol implementation.

## Optional Svelte binding and lifecycle proof {#optional-svelte-binding}

The source-workspace [Svelte page](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/SessionPage.svelte) composes `LiveSessionViewStore`, `SessionComposerStore`, and `GateStore`. Its `$effect` starts live/gate polling and returns cleanup that stops both. The store keeps the latest view and typed errors, masks a gate after response, and stops polling without treating an in-flight response as authoritative.

React, Vue, and Solid are possible consumers of the same core transport, `SessionView`, and action methods. They are not shipped bindings in this source-workspace proof. Do not copy a framework-specific claim or snippet into a release guide until that adapter has its own package and tests.

The [SessionClient test](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/session-client.test.ts) proves the important boundary: an injected transport must be paired with an injected live source, and disconnect invokes the active async iterator's `return()` at least once. That is the cleanup contract to preserve when writing another binding.
