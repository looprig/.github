---
id: reference/packages/harness/hub
title: hub package · hub
description: Reference for Harness session event publication, subscriptions, persistence faults, and turn reservations.
audience: developer
section: reference
order: 145
publication: released
examples:
  - stage-07-session-events
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

# hub package · hub

Import path: `github.com/looprig/harness/pkg/hub`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package hub implements the session-level event fan-in: a publish/subscribe hub with a federated-quiescence model.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithCommitObserver(observer func(event.Event)) Option`
- `func WithAppender(a eventAppender) Option`
- `func WithFactory(f *event.Factory) Option`
- `func WithFaultReporter(r FaultReporter) Option`
- `func New(sessionID uuid.UUID, opts ...Option) *Hub`

### Methods {#methods}

- `func (e *PublishBoundaryError) Error() string`
- `func (e *PublishBoundaryError) Unwrap() error`
- `func (e *HustleActivityError) Error() string`
- `func (e *TurnStartReservationError) Error() string`
- `func (e *SessionAbortedError) Error() string`
- `func (e *SessionAbortedError) Unwrap() error`
- `func (e *SessionPersistenceFault) Error() string`
- `func (e *SessionPersistenceFault) Unwrap() error`
- `func (*SessionPersistenceFault) FatalPublication() bool`
- `func (h *Hub) SubscribeEvents(filter event.EventFilter) (*EventSubscription, error)`
- `func (h *Hub) PublishEvent(ctx context.Context, ev event.Event) error`
- `func (h *Hub) PublishEventChecked(ctx context.Context, ev event.Event) error`
- `func (h *Hub) PublishInternalEventChecked(ctx context.Context, ev event.Event) error`
- `func (h *Hub) ExpectTurn(ctx context.Context, subagentLoopID uuid.UUID)`
- `func (h *Hub) CancelExpectTurn(ctx context.Context, subagentLoopID uuid.UUID)`
- `func (h *Hub) AcquireHustleActivity(ctx context.Context, runID hustle.RunID) (*HustleActivityLease, error)`
- `func (l *HustleActivityLease) Release(ctx context.Context) error`
- `func (h *Hub) StopSession(ctx context.Context)`
- `func (h *Hub) AbortSession(cause error) <-chan struct{}`
- `func (h *Hub) WaitIdle(ctx context.Context) error`
- `func (h *Hub) IsIdle() bool`
- `func (h *Hub) FailWaiters(err error) uint64`
- `func (h *Hub) ClearWaiterFailure(token uint64)`
- `func (e *SubscriptionLossError) Error() string`
- `func (e *SubscriptionLossError) Unwrap() error`
- `func (s *EventSubscription) Events() <-chan event.Delivery`
- `func (s *EventSubscription) Close() error`
- `func (s *EventSubscription) Err() error`
- `func (h *Hub) ReserveTurnStart(loopID uuid.UUID) (*TurnStartReservation, error)`
- `func (r *TurnStartReservation) Release()`
- `func (r *TurnStartReservation) PublishTurnStarted(ctx context.Context, started event.TurnStarted) error`
- `func (r *TurnStartReservation) PublishTurnStartedChecked(ctx context.Context, started event.TurnStarted) (committed bool, err error)`

### Types {#types}

```go
type Option func(*Hub)
```

```go
type PublishBoundaryReason string
```

```go
type PublishBoundaryError struct {
	Reason    PublishBoundaryReason
	EventType string
	Cause     error
}
```

```go
type HustleActivityReason string
```

```go
type HustleActivityError struct {
	Reason HustleActivityReason
	RunID  hustle.RunID
}
```

```go
type TurnStartReservationReason string
```

```go
type TurnStartReservationError struct {
	Reason TurnStartReservationReason
	LoopID uuid.UUID
}
```

```go
type SessionPersistenceFault struct {
	Event event.Event

	Cause error
}
```

```go
type SessionAbortedError struct{ Cause error }
```

```go
type FaultReporter interface {
	ReportFault(ctx context.Context, fault *SessionPersistenceFault)
}
```

```go
type Hub struct {
	// contains filtered or unexported fields
}
```

```go
type HustleActivityLease struct {
	// contains filtered or unexported fields
}
```

```go
type SessionPhase uint8
```

```go
type SubscriptionLossError struct {
	DroppedClass event.Class
	Cause        error
}
```

```go
type EventSubscription struct {
	// contains filtered or unexported fields
}
```

```go
type TurnStartReservation struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`PublishBoundaryNilEvent`, `PublishBoundaryVisibility`, `PublishBoundaryClass`, `PublishBoundarySession`, `PublishBoundaryType`, `PublishBoundaryInvalid`, `HustleActivityInvalidRunID`, `HustleActivityDuplicate`, `HustleActivityStopped`, `TurnStartReservationInvalidLoop`, `TurnStartReservationStopped`, `TurnStartReservationMismatch`, `TurnStartReservationReleased`, `TurnStartReservationReused`, `SessionIdle`, `SessionActive`, `SessionStopped`

### Variables {#variables}

`ErrSessionStopped`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `HustleActivityError`, `PublishBoundaryError`, `SessionAbortedError`, `SessionPersistenceFault`, `SubscriptionLossError`, `TurnStartReservationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/hub/deps.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/deps.go)
- [pkg/hub/errors.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/errors.go)
- [pkg/hub/fault.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/fault.go)
- [pkg/hub/hub.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/hub.go)
- [pkg/hub/state.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/state.go)
- [pkg/hub/subscription.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/subscription.go)
- [pkg/hub/turn_start.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/turn_start.go)

Adjacent tests at the same commit:

- [pkg/hub/deps_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/deps_test.go)
- [pkg/hub/durability_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/durability_test.go)
- [pkg/hub/durable_tap_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/durable_tap_test.go)
- [pkg/hub/fault_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/fault_test.go)
- [pkg/hub/hub_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/hub_test.go)
- [pkg/hub/hustle_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/hustle_test.go)
- [pkg/hub/permission_review_publish_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/permission_review_publish_test.go)
- [pkg/hub/state_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/state_test.go)
- [pkg/hub/subscription_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/subscription_test.go)
- [pkg/hub/turn_start_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hub/turn_start_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
