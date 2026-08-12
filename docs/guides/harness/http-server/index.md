---
id: guides/harness/http-server/index
title: Overview
description: Expose Harness Session reads and controls through the built-in HTTP server.
audience: developer
section: guides
order: 16
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  request-planes: [release-github-com-looprig-harness]
  route-contract: [release-github-com-looprig-harness]
  compose-the-handler: [release-github-com-looprig-harness]
  source-and-runnable-proof: [release-github-com-looprig-harness]
---

# Overview

`github.com/looprig/harness/pkg/serve` is the HTTP composition seam for a live
Harness session. It does not import `pkg/session`, a store, or an inference
implementation. The composition root supplies a `Rig` for live sessions and a
`Reader` for durable reads, then chooses the complete or read-only surface.

## Request planes {#request-planes}

The complete handler has three deliberately separate planes:

| Plane | Routes | Dependency | Meaning |
| --- | --- | --- | --- |
| Discovery | `GET /v1/capabilities` | read plane | Protocol version and feature list. |
| Live/control | create, restore, input, interrupt, gates, events | `Rig` plus an in-process registry | Operates only on sessions live in this process. |
| Durable reads | list, status, journal | `Reader` | Reads catalog or journal state without consulting the registry. |

`ReadHandler` registers only discovery and durable reads. A control path is not
"disabled" by a runtime check in that mode: it is absent from the mux and
therefore returns the standard `net/http` 404.

```mermaid
%%{init: {"theme":"dark"}}%%
flowchart LR
    C[HTTP client] --> M[method plus path mux]
    M --> A[auth middleware]
    A --> B[body cap middleware]
    B --> L[Live handlers]
    B --> R[Read handlers]
    L --> G[LiveSession registry]
    L --> F[Rig NewSession or RestoreSession]
    R --> D[Reader durable projection or journal]
    L --> S[SSE subscription]
```

Authentication is applied before the body cap and before a route handler. A
live lookup releases the registry lock before calling the session. A read never
needs a live session on the current process.

## Route contract {#route-contract}

These are the ten patterns registered by `Handler`. The method is part of each
Go 1.22 pattern. A matching path with the wrong method is a 405 from the mux;
an unknown path is a plain 404 before a serve handler runs.

| Method and path | Request body or query | Success |
| --- | --- | --- |
| `GET /v1/capabilities` | none | `200 application/json`, protocol document |
| `POST /v1/sessions` | optional `{"blocks":[...]}` and optional `Idempotency-Key` | `201`, `{"session_id": "...", "command_id": "..."}`; `command_id` is omitted for idle create |
| `GET /v1/sessions` | `skip` default `0`, `limit` default `100` | `200`, `SessionList` |
| `POST /v1/sessions/{sid}/restore` | none | `200`, `{"session_id":"..."}` |
| `POST /v1/sessions/{sid}/input` | required non-empty `{"blocks":[...]}` | `200`, `{"command_id":"..."}` |
| `POST /v1/sessions/{sid}/interrupt` | none | `200`, `{"interrupted":true\|false}` |
| `POST /v1/sessions/{sid}/gates/{gid}` | `{"action":"...","values":{...}}` | `202`, `{}` after durable acceptance |
| `GET /v1/sessions/{sid}/events` | none | `200 text/event-stream` |
| `GET /v1/sessions/{sid}/status` | none | `200`, `SessionStatus` |
| `GET /v1/sessions/{sid}/journal` | `from_journal_seq` default `0`, `limit` default `100` | `200`, `EventJournalPage` |

The complete capability response is stable and ordered:

```json
{"protocol":"looprig.serve","version":1,"features":["journal","live_sse","ephemeral_sse","gate_response"]}
```

The read-only response advertises `features: ["journal"]`. Capability
discovery is not health, tenancy, or authentication status.

## Compose the handler {#compose-the-handler}

The public contracts are intentionally narrow:

```go
type LiveSession interface {
	SessionID() uuid.UUID
	Submit(context.Context, []content.Block) (uuid.UUID, error)
	SubscribeEvents(event.EventFilter) (event.Subscription, error)
	RespondGate(context.Context, gate.GateResponse) error
	Interrupt(context.Context) (bool, error)
}

type Rig[S LiveSession, O any] interface {
	NewSession(context.Context, ...O) (S, error)
	RestoreSession(context.Context, uuid.UUID) (S, error)
}

type Reader interface {
	ListSessions(context.Context, Page) (SessionList, error)
	ReadStatus(context.Context, uuid.UUID) (SessionStatus, error)
	ReadJournal(context.Context, uuid.UUID, JournalPage) (EventJournalPage, error)
}

func Handler[S LiveSession, O any](rig Rig[S, O], reads Reader, opts ...Option) http.Handler
func ReadHandler(reads Reader, opts ...Option) http.Handler
func Server(addr string, h http.Handler, opts ...ServerOption) (*http.Server, error)
```

An application can keep its concrete session type while `serve` remains
independent of the session package:

```go
func buildHTTP(rig serve.Rig[*mySession, mySessionOption], reader serve.Reader) (*http.Server, error) {
	// WithAuth is the request trust boundary. The callback may inspect headers,
	// a mTLS identity, or a proxy assertion and returns a non-nil error to deny.
	h := serve.Handler(rig, reader, serve.WithAuth(authenticate), serve.WithMaxBodyBytes(2<<20))
	// Server validates the address and applies the SSE-safe timeout defaults.
	return serve.Server("127.0.0.1:8080", h)
}
```

The returned handler carries an internal proof of whether `WithAuth` was
installed. Pass it directly to `Server`; wrapping it in ordinary middleware
removes that proof and makes a public bind fail closed.

## Source and runnable proof {#source-and-runnable-proof}

- [`Handler`, `ReadHandler`, and route patterns](https://github.com/looprig/harness/blob/main/pkg/serve/mux.go)
- [`LiveSession`, `Rig`, and the generic seam](https://github.com/looprig/harness/blob/main/pkg/serve/serve.go)
- [`Reader` and response DTOs](https://github.com/looprig/harness/blob/main/pkg/serve/reader.go)
- [`Handler` route and method tests](https://github.com/looprig/harness/blob/main/pkg/serve/mux_test.go)
- [`capabilities` wire contract tests](https://github.com/looprig/harness/blob/main/pkg/serve/handlers_capabilities_test.go)

Run the package tests from the `harness` repository:

```sh
go test ./pkg/serve
```
