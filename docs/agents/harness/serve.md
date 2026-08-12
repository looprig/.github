---
id: agents/harness/serve
title: Harness HTTP serving
description: Expose read-only catalog/history and authenticated live Session controls through the generic Harness HTTP surface.
audience: agent
section: agents/harness
order: 34
publication: released
proofs:
  choose-a-plane:
    - release-github-com-looprig-harness
  trust-and-visibility-rules:
    - release-github-com-looprig-harness
  read-dtos-and-cursors:
    - release-github-com-looprig-harness
  human-routes:
    - release-github-com-looprig-harness
  source-tests-runnable-proof:
    - release-github-com-looprig-harness
  server:
    - release-github-com-looprig-harness
  example:
    - release-github-com-looprig-harness
---

# HTTP serving

## Choose a plane

| API | Plane | Required seams |
| --- | --- | --- |
| `serve.ReadHandler(reads, opts...)` | capabilities, list, status, public journal only | `serve.Reader` |
| `serve.Handler[S, O](rig, reads, opts...)` | read plane plus create/restore, submit, interrupt, gate responses, event stream, lifecycle controls | `serve.Rig[S,O]`, `serve.LiveSession`, `serve.Reader` |
| `serve.Server(addr, handler, opts...)` | hardened `http.Server` construction; does not listen | handler and optional explicit `WithInsecurePublicBind` |
| `catalogreader.New(catalog, store)` | concrete `serve.Reader` over sessionstore projection/history | `*sessionstore.Catalog`, `*sessionstore.Store` |

`serve.Reader` is stateless and read-only: `ListSessions`, `ReadStatus`, and
`ReadJournal` consult durable projections/history, not a live in-process
session. `serve.LiveSession` is intentionally narrower than
`session.SessionController`; `serve.Rig` is generic so the package does not
import concrete rig/session types.

## Trust and visibility rules

- `serve.WithAuth` installs request authentication; middleware authenticates
  before applying the body cap (`WithMaxBodyBytes`).
- `serve.Server` rejects a public or empty-host bind without auth, returning
  `*serve.PublicBindWithoutAuthError`. `WithInsecurePublicBind` is an explicit
  opt-in, not a default.
- Public reads contain only public enduring events. Internal events and
  `GatePrepared` are excluded; `serve` validates event-bearing DTOs again
  before writing them.
- Command endpoints use request idempotency keys and the command codec. A
  retry must not create a second durable effect; inspect typed HTTP/serve
  errors rather than matching response text.
- `StatusEvent` serializes `event.Event` through `event.MarshalEvent`; do not
  rely on generic `encoding/json` interface encoding.

## Read DTOs and cursors

`SessionSummary` is the list projection. `SessionStatus` carries state,
`LastJournalSeq`, active turn/gate IDs, and codec-safe last turn/step summaries.
`EventJournalPage` carries ordered `StatusEvent` values plus
`NextJournalSeq`/`Done`; pass the next cursor as `from_journal_seq`.

## Human routes

[`/docs/guides/harness/http-server`](/docs/guides/harness/http-server) maps
creation, authentication, public-bind protection, read endpoints, session
lifecycle, commands, gates, event streaming/visibility, idempotency, and
errors. Package contracts are [`/docs/reference/packages/harness/serve`](/docs/reference/packages/harness/serve)
and [`/docs/reference/packages/harness/serve/catalogreader`](/docs/reference/packages/harness/serve/catalogreader).

## Source, tests, runnable proof

- [`pkg/serve/serve.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/serve.go), [`pkg/serve/server.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/server.go), [`pkg/serve/options.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/options.go), [`pkg/serve/visibility.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/visibility.go).
- [`pkg/serve/handlers_read.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/handlers_read.go), [`pkg/serve/handlers_control.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/handlers_control.go), [`pkg/serve/handlers_events.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/handlers_events.go), [`pkg/serve/idempotency.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/idempotency.go).
- [`pkg/serve/server_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/server_test.go), [`pkg/serve/privacy_visibility_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/privacy_visibility_test.go), [`pkg/serve/idempotency_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/idempotency_test.go), [`pkg/serve/catalogreader/reader_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/catalogreader/reader_test.go).
- [`examples/serving/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/serving/example_test.go).
