---
id: build/22-serving
title: Session serving and live events
description: Expose session capabilities, durable reads, control routes, and a cancellable SSE stream through the released harness serving package.
audience: [developer, operator]
section: build
order: 22
publication: released
examples:
  - stage-19-http-serve
proofs:
  narrow-serving-seams: release-github-com-looprig-harness
  routes-and-planes: release-github-com-looprig-harness
  limits-and-errors: release-github-com-looprig-harness
  runnable-proof: release-github-com-looprig-harness
---

# Session serving and live events

The released [harness module v0.24.2](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb) keeps HTTP composition at a narrow boundary. `serve.Handler` receives a `Rig[S,O]` for live creation/restoration and a `Reader` for durable projections. It does not import a session implementation, an LLM client, or a storage backend. `serve.ReadHandler` builds only the read plane when the process has no live rig.

## Narrow serving seams {#narrow-serving-seams}

`LiveSession` supplies `SessionID`, `Submit`, `SubscribeEvents`, `RespondGate`, and `Interrupt`. `Reader` supplies `ListSessions`, `ReadStatus`, and `ReadJournal`. The rig owns `NewSession` and `RestoreSession`. This split matters operationally: durable status and history can be read on any pod, while submit, interrupt, gate response, and live SSE require a live session in that process.

The event stream carries two classes. Enduring events have a journal sequence and are replayable; ephemeral events describe live progress and are not part of the durable history. A heartbeat is an SSE comment. The server subscribes to all loops, closes the subscription on return, and stops on client cancellation or a broken writer.

## Routes and planes {#routes-and-planes}

The discovery route is `GET /v1/capabilities`. Lifecycle and control routes are `POST /v1/sessions`, `POST /v1/sessions/{sid}/restore`, `POST /v1/sessions/{sid}/input`, `POST /v1/sessions/{sid}/interrupt`, and `POST /v1/sessions/{sid}/gates/{gid}`. The live route is `GET /v1/sessions/{sid}/events`. Read routes are `GET /v1/sessions`, `GET /v1/sessions/{sid}/status`, and `GET /v1/sessions/{sid}/journal`.

The list, status, and journal routes read durable projections. They do not consult the live registry and therefore work for a session that is not resident on this process. Journal pages contain Enduring events only; `GatePrepared` is not exposed as history. Control routes return small JSON envelopes, including a command ID for input and an `interrupted` boolean for interrupt.

## Limits and errors {#limits-and-errors}

Request bodies are capped at 1 MiB by default; `WithMaxBodyBytes` can tighten the positive limit but cannot disable it. List and journal paging defaults to 100 and rejects values above 1,000. The SSE stream sends a `: ping` comment every 20 seconds by default. `Server` uses bounded header/read/idle timeouts, leaves write timeout open for the long-lived stream, and rejects public non-loopback binding without `WithAuth` or an explicit `WithInsecurePublicBind` opt-in.

Malformed IDs and paging are 400 responses. Missing sessions are 404. Invalid JSON, empty input, unknown blocks, and oversized bodies are 400. Backend and subscription failures are generic 500 responses; causes remain in server logs rather than leaking through the wire. `serve.Server` returns typed `InvalidAddrError` and `PublicBindWithoutAuthError` before it returns an `http.Server`.

## Runnable proof {#runnable-proof}

The reviewed serving fixture prints the capabilities document, creates one session, and exercises a protected control route. Its source and route tests are pinned to the [harness release commit](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve).
