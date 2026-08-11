---
id: modules/client
title: Client module
description: Source-workspace reference for the released Go web handler and private browser transport, folding, live, and Svelte adapter packages.
audience: developer
section: modules
order: 23
publication: source-workspace
examples:
  - stage-20-web-client
proofs:
  go-handler: release-github-com-looprig-client
  core-sdk: [source-client-sdk-core-package, central-client-stage20-session-client-source]
  svelte-sdk: [source-client-sdk-svelte-package, central-client-stage20-svelte-page-source]
  cleanup-proof: central-client-stage20-session-client-proof
---

# Client module

The Go module is released as [github.com/looprig/client v0.1.0](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca). The TypeScript packages are private source-workspace packages: `sdk/core` is `@looprig/client` and `sdk/svelte` is `@looprig/svelte`, both at [the pinned source commit](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk). Do not turn their `0.0.0` private package files into release-install instructions.

## Go handler {#go-handler}

`github.com/looprig/client/pkg/webui` exports `FS` and `Handler`. `FS` embeds the built UI assets. `Handler` serves assets under the embedded `dist` tree, constrains paths, and falls back to `dist/index.html` for SPA routes. Traversal and missing-index tests are part of the release proof; a missing embedded index returns an internal server error rather than an empty success.

## Core SDK {#core-sdk}

`@looprig/client` exports wire types and validators, `LooprigTransport`, `BFFTransport`, `ServeTransport`, `createClient`, `createBFFClient`, `SseFrameParser`, `parseSseStream`, `fold`, `joinSessionView`, `createFetchLiveFrameSource`, `textBlock`, and gate action constants. The transport is the cold boundary, SSE is the live boundary, folding is a pure projection, and joining coordinates history with live frames. AJV validation runs at every response/frame boundary.

Errors are typed by code and transport condition: server codes map to `InvalidBodyError`, `SessionNotFoundError`, `IdempotencyConflictError`, `InternalServerError`, and `GateCapacityError`; BFF policy maps to `CSRFRejectedError` and `OriginNotAllowedError`; unknown codes remain `UnknownLooprigError`. Abort, network, malformed response, and live connection failures have separate classes. A caller should not parse message text.

## Svelte SDK {#svelte-sdk}

The optional source-workspace adapter exports `SessionListStore`, `SessionStatusStore`, `SessionHistoryStore`, `LiveSessionViewStore`, `SessionComposerStore`, and `GateStore`. Refreshes are last-started-wins; failed refreshes retain prior data and set `error`. The live store joins history and SSE, has idempotent `start` and synchronous `stop`, and records the last fold error. The gate store polls with a self-scheduling timeout, masks an answered gate, and discards stale results after stop.

## Cleanup proof {#cleanup-proof}

The [stage 20 web example](../examples/index.md#stage-20-web-client) typechecks the framework-neutral client, runs Svelte checks, and exercises deterministic cleanup. Its `SessionClient` requires an injected transport and matching `LiveSourceFactory` together; disconnect aborts the controller, invokes the active iterator's `return()`, and returns a disposer. Vanilla, Svelte, React, Vue, and Solid can all consume the core view/actions; only vanilla and the optional Svelte source adapter are reviewed here.
