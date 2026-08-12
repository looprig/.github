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

Import path: `github.com/looprig/harness/pkg/serve`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package serve hosts the HTTP surface over a live session.

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

```go
type SessionNotFoundError struct {
	SessionID uuid.UUID
}
```

```go
type LoopNotFoundError struct {
	LoopID uuid.UUID
}
```

```go
type StoreReadError struct {
	Op    string
	Cause error
}
```

```go
type NonPublicEventError struct {
	Visibility event.EventVisibility
}
```

```go
type PublicBindWithoutAuthError struct {
	Addr string
}
```

```go
type InvalidAddrError struct {
	Addr  string
	Cause error
}
```

```go
type Option func(*config)
```

```go
type InvalidParamError struct {
	Param  string
	Reason string
}
```

```go
type Page struct {
	Skip  int
	Limit int
}
```

```go
type JournalPage struct {
	From  uint64
	Limit int
}
```

```go
type Reader interface {
	ListSessions(ctx context.Context, page Page) (SessionList, error)
	ReadStatus(ctx context.Context, id uuid.UUID) (SessionStatus, error)
	ReadJournal(ctx context.Context, id uuid.UUID, page JournalPage) (EventJournalPage, error)
}
```

```go
type SessionSummary struct {
	SessionID    uuid.UUID `json:"session_id"`
	State        string    `json:"state,omitempty"`
	Title        string    `json:"title,omitempty"`
	CreatedAt    time.Time `json:"created_at,omitzero"`
	LastActiveAt time.Time `json:"last_active_at,omitzero"`
}
```

```go
type SessionList struct {
	Sessions []SessionSummary `json:"sessions"`
	Skip     int              `json:"skip"`
	Limit    int              `json:"limit"`
	NextSkip int              `json:"next_skip"`
	Done     bool             `json:"done"`
}
```

```go
type StatusEvent struct {
	JournalSeq uint64
	Event      event.Event
}
```

```go
type SessionStatus struct {
	SessionID      uuid.UUID    `json:"session_id"`
	State          string       `json:"state,omitempty"`
	LastJournalSeq uint64       `json:"last_journal_seq"`
	ActiveTurnID   uuid.UUID    `json:"active_turn_id,omitzero"`
	WaitingGateID  uuid.UUID    `json:"waiting_gate_id,omitzero"`
	LastTurn       *StatusEvent `json:"last_turn,omitempty"`
	LastStep       *StatusEvent `json:"last_step,omitempty"`
	UpdatedAt      time.Time    `json:"updated_at,omitzero"`
}
```

```go
type EventJournalPage struct {
	Events         []StatusEvent `json:"events"`
	NextJournalSeq uint64        `json:"next_journal_seq"`
	Done           bool          `json:"done"`
}
```

```go
type LiveSession interface {
	SessionID() uuid.UUID
	Submit(ctx context.Context, blocks []content.Block) (uuid.UUID, error)
	SubscribeEvents(filter event.EventFilter) (event.Subscription, error)
	RespondGate(ctx context.Context, response gate.GateResponse) error
	Interrupt(ctx context.Context) (bool, error)
}
```

```go
type Rig[S LiveSession, O any] interface {
	NewSession(ctx context.Context, opts ...O) (S, error)
	RestoreSession(ctx context.Context, id uuid.UUID) (S, error)
}
```

```go
type ServerOption func(*serverConfig)
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `InvalidAddrError`, `InvalidParamError`, `LoopNotFoundError`, `NonPublicEventError`, `PublicBindWithoutAuthError`, `SessionNotFoundError`, `StoreReadError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/serve/ephemeral.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/ephemeral.go)
- [pkg/serve/errors.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/errors.go)
- [pkg/serve/handlers_capabilities.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_capabilities.go)
- [pkg/serve/handlers_control.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_control.go)
- [pkg/serve/handlers_events.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_events.go)
- [pkg/serve/handlers_gate.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_gate.go)
- [pkg/serve/handlers_lifecycle.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_lifecycle.go)
- [pkg/serve/handlers_read.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_read.go)
- [pkg/serve/idempotency.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/idempotency.go)
- [pkg/serve/middleware.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/middleware.go)
- [pkg/serve/mux.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/mux.go)
- [pkg/serve/options.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/options.go)
- [pkg/serve/parse.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/parse.go)
- [pkg/serve/read_server.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/read_server.go)
- [pkg/serve/reader.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/reader.go)
- [pkg/serve/registry.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/registry.go)
- [pkg/serve/serve.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/serve.go)
- [pkg/serve/server.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/server.go)
- [pkg/serve/server_core.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/server_core.go)
- [pkg/serve/visibility.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/visibility.go)

Adjacent tests at the same commit:

- [pkg/serve/deps_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/deps_test.go)
- [pkg/serve/ephemeral_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/ephemeral_fuzz_test.go)
- [pkg/serve/errors_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/errors_test.go)
- [pkg/serve/fixtures_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/fixtures_test.go)
- [pkg/serve/handlers_capabilities_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_capabilities_test.go)
- [pkg/serve/handlers_control_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_control_test.go)
- [pkg/serve/handlers_events_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_events_test.go)
- [pkg/serve/handlers_gate_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_gate_test.go)
- [pkg/serve/handlers_lifecycle_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_lifecycle_test.go)
- [pkg/serve/handlers_read_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/handlers_read_test.go)
- [pkg/serve/idempotency_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/idempotency_test.go)
- [pkg/serve/join_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/join_test.go)
- [pkg/serve/middleware_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/middleware_test.go)
- [pkg/serve/mux_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/mux_test.go)
- [pkg/serve/options_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/options_test.go)
- [pkg/serve/parse_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/parse_test.go)
- [pkg/serve/privacy_visibility_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/privacy_visibility_test.go)
- [pkg/serve/read_server_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/read_server_test.go)
- [pkg/serve/reader_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/reader_test.go)
- [pkg/serve/registry_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/registry_test.go)
- [pkg/serve/schema_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/schema_test.go)
- [pkg/serve/server_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/server_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
