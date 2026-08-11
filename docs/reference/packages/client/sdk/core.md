---
id: reference/packages/client/sdk/core
title: Client core SDK package
description: Private source-workspace transport, SSE parser, folding, joining, validation, and live-source contracts for browser clients.
audience: developer
section: reference
order: 231
publication: source-workspace
examples:
  - stage-20-web-client
proofs:
  package-role: source-client-sdk-core-package
  exported-surface: [source-client-sdk-core-package, central-client-stage20-session-client-source]
  lifecycle-and-errors: [source-client-sdk-core-package, central-client-stage20-session-client-proof]
  source-proof: central-client-stage20-session-client-proof
---

# `@looprig/client`

Private TypeScript package in the [source-workspace SDK](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/core). It is not a released npm package in this corpus.

## Package role {#package-role}

Core owns protocol contracts and deterministic projection. `LooprigTransport` is the cold HTTP plane, `LiveFrameSource` is the live SSE boundary, `fold` is a pure view reducer, and `joinSessionView` coordinates durable journal pages with live frames. Keep this core independent of any UI framework.

## Exported surface {#exported-surface}

The package exports UUID, event/frame, session, gate, request/response, and capability types; schema constants and validators; `LooprigError` subclasses; `BFFTransport`, `ServeTransport`, `createClient`, and `createBFFClient`; `SseFrameParser` and `parseSseStream`; `emptySessionView`, `fold`, `joinSessionView`, and `createFetchLiveFrameSource`; `textBlock`; and `GATE_APPROVAL_ACTIONS`/`GateApprovalAction`.

`RequestOptions`, list/history/create options, `FetchLike`, and `LiveFrameSource` are the extension seams. `FoldError` records unknown ephemeral kinds, unknown chunk types, malformed deltas, and upstream frame errors rather than silently dropping them.

## Lifecycle and errors {#lifecycle-and-errors}

Transport validates every response with AJV. BFF lazily mints CSRF and retries a rejection once; Serve uses an explicit base URL and optional bearer token. The SSE parser caps an unterminated line at 1 MiB, handles arbitrary chunk boundaries, and emits a typed in-band error frame. `joinSessionView` opens live first, filters history below the live tip, optionally reconnects, and calls the live iterator's `return()` during teardown without waiting forever.

Errors are code-based and typed: invalid body, missing session, idempotency conflict, internal, gate capacity, CSRF/origin policy, abort, network, malformed response, and live connection errors have separate classes. Do not parse message text. Create idempotency keys once and reuse them across retry attempts.

## Source proof {#source-proof}

The [core package manifest](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/core/package.json), source, and stage 20 tests are pinned at the reviewed client commit. The [SessionClient proof](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/session-client.test.ts) verifies paired transport/live injection and iterator cleanup.
