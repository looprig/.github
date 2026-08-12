---
id: reference/packages/harness/serve
title: serve package · serve
description: Reference for the Harness HTTP read and live-session serving seams.
audience: developer
section: reference
order: 151
publication: released
examples:
  - stage-19-http-serve
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# serve package · serve

Import path: `github.com/looprig/harness/pkg/serve`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`ReadHandler` serves capabilities, session lists, status, and public journals through a `Reader`. Generic `Handler` adds live session creation, input, gate response, interruption, and shutdown through structural `Rig` and `LiveSession` interfaces. `Server` validates binding policy and creates an `http.Server`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Handler[S LiveSession, O any](rig Rig[S, O], reads Reader, opts ...Option) http.Handler`
- `func ReadHandler(reads Reader, opts ...Option) http.Handler`
- `func WithAuth(authn func(*http.Request) error) Option`
- `func WithMaxBodyBytes(n int64) Option`
- `func WithInsecurePublicBind() ServerOption`
- `func Server(addr string, h http.Handler, opts ...ServerOption) (*http.Server, error)`

### Methods {#methods}

- `func (e SessionNotFoundError) Error() string`
- `func (e LoopNotFoundError) Error() string`
- `func (e StoreReadError) Error() string`
- `func (e StoreReadError) Unwrap() error`
- `func (e *NonPublicEventError) Error() string`
- `func (e PublicBindWithoutAuthError) Error() string`
- `func (e InvalidAddrError) Error() string`
- `func (e InvalidAddrError) Unwrap() error`
- `func (e InvalidParamError) Error() string`
- `func (s StatusEvent) MarshalJSON() ([]byte, error)`

### Types {#types}

`SessionNotFoundError`, `LoopNotFoundError`, `StoreReadError`, `NonPublicEventError`, `PublicBindWithoutAuthError`, `InvalidAddrError`, `Option`, `InvalidParamError`, `Page`, `JournalPage`, `Reader`, `SessionSummary`, `SessionList`, `StatusEvent`, `SessionStatus`, `EventJournalPage`, `LiveSession`, `Rig`, `ServerOption`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `SessionNotFoundError`, `LoopNotFoundError`, `StoreReadError`, `NonPublicEventError`, `PublicBindWithoutAuthError`, `InvalidAddrError`, `InvalidParamError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/serve/ephemeral.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/ephemeral.go)
- [pkg/serve/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/errors.go)
- [pkg/serve/handlers_capabilities.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_capabilities.go)
- [pkg/serve/handlers_control.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_control.go)
- [pkg/serve/handlers_events.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_events.go)
- [pkg/serve/handlers_gate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_gate.go)
- [pkg/serve/handlers_lifecycle.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_lifecycle.go)
- [pkg/serve/handlers_read.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_read.go)
- [pkg/serve/idempotency.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/idempotency.go)
- [pkg/serve/middleware.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/middleware.go)
- [pkg/serve/mux.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/mux.go)
- [pkg/serve/options.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/options.go)
- [pkg/serve/parse.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/parse.go)
- [pkg/serve/read_server.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/read_server.go)
- [pkg/serve/reader.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/reader.go)
- [pkg/serve/registry.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/registry.go)
- [pkg/serve/serve.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/serve.go)
- [pkg/serve/server.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/server.go)
- [pkg/serve/server_core.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/server_core.go)
- [pkg/serve/visibility.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/visibility.go)

Adjacent tests at the same commit:

- [pkg/serve/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/deps_test.go)
- [pkg/serve/ephemeral_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/ephemeral_fuzz_test.go)
- [pkg/serve/errors_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/errors_test.go)
- [pkg/serve/fixtures_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/fixtures_test.go)
- [pkg/serve/handlers_capabilities_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_capabilities_test.go)
- [pkg/serve/handlers_control_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_control_test.go)
- [pkg/serve/handlers_events_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_events_test.go)
- [pkg/serve/handlers_gate_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_gate_test.go)
- [pkg/serve/handlers_lifecycle_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_lifecycle_test.go)
- [pkg/serve/handlers_read_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/handlers_read_test.go)
- [pkg/serve/idempotency_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/idempotency_test.go)
- [pkg/serve/join_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/join_test.go)
- [pkg/serve/middleware_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/middleware_test.go)
- [pkg/serve/mux_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/mux_test.go)
- [pkg/serve/options_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/options_test.go)
- [pkg/serve/parse_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/parse_test.go)
- [pkg/serve/privacy_visibility_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/privacy_visibility_test.go)
- [pkg/serve/read_server_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/read_server_test.go)
- [pkg/serve/reader_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/reader_test.go)
- [pkg/serve/registry_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/registry_test.go)
- [pkg/serve/schema_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/schema_test.go)
- [pkg/serve/server_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/server_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
