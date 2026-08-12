---
id: reference/packages/tui/sessionadapter
title: TUI session adapter package
description: Session adapter lifecycle, cold replay, live gap repair, and gate-safe actions for terminal clients.
audience: developer
section: reference
order: 244
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  functions: release-github-com-looprig-tui
  methods: release-github-com-looprig-tui
  types: release-github-com-looprig-tui
  constants: release-github-com-looprig-tui
  variables: release-github-com-looprig-tui
  ownership-and-errors: release-github-com-looprig-tui
  source-and-runnable-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/sessionadapter`

Session bridge in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter).

## Package role {#package-role}

The adapter turns a `session.SessionController` into the agent shape consumed by the TUI. It folds public enduring history, subscribes to live enduring and ephemeral events, and tracks open gates. It is not a session store and does not make ephemeral events durable.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(sess session.SessionController) *Adapter`
- `func NewWithReplay(ctx context.Context, sess session.SessionController, store ReplayOpener) (*Adapter, error)`
- `func Restore(ctx context.Context, sess session.SessionController, store ReplayOpener) (*Adapter, error)`

### Methods {#methods}

- `func (a *sessionAdapter) Submit(ctx context.Context, blocks []content.Block) (uuid.UUID, error)`
- `func (a *sessionAdapter) SubmitToLoop(ctx context.Context, loopID uuid.UUID, blocks []content.Block) (uuid.UUID, error)`
- `func (a *sessionAdapter) ActiveLoopID() uuid.UUID`
- `func (a *sessionAdapter) AcceptsImages(loopID uuid.UUID) bool`
- `func (a *sessionAdapter) Subscribe(filter event.EventFilter) (event.Subscription, error)`
- `func (a *sessionAdapter) ReplayBacklog(_ context.Context) ([]event.Event, error)`
- `func (a *sessionAdapter) SessionID() uuid.UUID`
- `func (a *sessionAdapter) Controller() session.SessionController`
- `func (a *sessionAdapter) Interrupt(ctx context.Context) (bool, error)`
- `func (e *GateNotOpenError) Error() string`
- `func (a *sessionAdapter) Approve(ctx context.Context, loopID, callID uuid.UUID, action gate.ApprovalAction) error`
- `func (a *sessionAdapter) Deny(ctx context.Context, loopID, callID uuid.UUID) error`
- `func (a *sessionAdapter) ProvideAnswer(ctx context.Context, loopID, callID uuid.UUID, answer string) error`
- `func (a *sessionAdapter) RespondGate(ctx context.Context, gateID gate.ID, action string, values map[string]json.RawMessage) error`
- `func (a *sessionAdapter) Close(ctx context.Context) error`
- `func (a *sessionAdapter) CompactToLoop(ctx context.Context, loopID uuid.UUID) (uuid.UUID, error)`

### Types {#types}

```go
type Adapter = sessionAdapter
```

```go
type ReplayOpener interface {
	OpenEventReplayer(uuid.UUID, sessionstore.ReplayRequest) (journal.EventReplayer, error)
}
```

```go
type GateNotOpenError struct {
	LoopID          uuid.UUID
	ToolExecutionID uuid.UUID
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `GateNotOpenError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [sessionadapter/adapter.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter/adapter.go)
- [sessionadapter/replaying_subscription.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter/replaying_subscription.go)

Adjacent tests at the same commit:

- [sessionadapter/adapter_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter/adapter_test.go)
- [sessionadapter/api_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter/api_test.go)
- [sessionadapter/replaying_subscription_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter/replaying_subscription_test.go)

Run `GOWORK=off go test ./...` from the `tui` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
