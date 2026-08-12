---
id: guides/harness/commands/change-loop
title: Change Loop configuration
description: Queue supported model, effort, mode, and runtime changes at a safe boundary.
audience: developer
section: guides
order: 9
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  public-controller-contract: [release-github-com-looprig-harness]
  mode-changes: [release-github-com-looprig-harness]
  model-and-effort-changes: [release-github-com-looprig-harness]
  error-categories-and-ownership: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Change Loop configuration

Loop configuration changes are actor-owned and take effect at the next turn
boundary. A running turn keeps the mode, model, effort, and tool registry it
started with. The public application surface is a `loop.Controller`; the
runtime sends live command values internally and records the committed
configuration as enduring events.

## Public controller contract

```go
type Controller interface {
	Handle
	SetMode(context.Context, ModeName) error
	Change(context.Context, ...Change) error
	Interrupt(context.Context) error
}

type Change interface {
	InferenceModel() (model.Model, bool)
	InferenceEffort() (model.Effort, bool)
	change()
}

func ChangeModel(model model.Model) Change
func ChangeEffort(effort model.Effort) Change
```

The `Change` marker is sealed. Consumers use `ChangeModel` and `ChangeEffort`,
not a hand-written implementation. A batch is folded last-write-wins per field
and validated atomically by the actor. An empty batch returns
`*loop.ChangeError{Kind: loop.ChangeNoChanges}` before a command is sent.

The corresponding live command types are:

```go
const (
	CommandSetLoopMode         CommandName  = "SetLoopMode"
	CommandChangeLoopInference CommandName  = "ChangeLoopInference"
	SetLoopModeAck             CommandField = "Ack"
	ChangeLoopInferenceAck     CommandField = "Ack"
)

type SetLoopMode struct {
	Header
	Mode string                  `json:"mode,omitzero"`
	Ack  chan<- LoopChangeResult `json:"-"`
}

type ChangeLoopInference struct {
	Header
	Model     model.Model             `json:"model,omitzero"`
	Effort    model.Effort            `json:"effort,omitzero"`
	SetModel  bool                    `json:"set_model,omitzero"`
	SetEffort bool                    `json:"set_effort,omitzero"`
	Ack       chan<- LoopChangeResult `json:"-"`
}

type LoopChangeResult struct {
	Err    error
	Mode   string
	Model  model.Model
	Effort model.Effort
}
```

These are control commands, not `MarshalCommand` arms. The durable records are
`event.LoopModeChanged` and `event.LoopInferenceChanged`; restore folds those
events to determine the next-turn configuration. The actor requires a non-nil,
buffered `Ack` because it performs one non-blocking direct send. `Validate` on
either command returns `*command.InvalidCommandError` for a nil channel and
`*command.UnbufferedAckError` for an unbuffered channel.

## Mode changes

The empty `ModeName` selects the base mode. Any non-empty mode must be declared
by the loop definition. On success, the controller's `Handle.Mode()` and
`Handle.Model()` are updated from the actor's committed result, not from a
speculative client value. An unknown mode, a closing or exited loop, a durable
append failure, or an invalid model/effort returns `*loop.ChangeError` and
leaves the previous configuration in place.

```go
func selectMode(ctx context.Context, c loop.Controller, mode loop.ModeName) error {
	if err := c.SetMode(ctx, mode); err != nil {
		var changeErr *loop.ChangeError
		if errors.As(err, &changeErr) {
			log.Printf("mode %q refused: %s", changeErr.Mode, changeErr.Kind)
		}
		return err
	}
	return nil
}
```

## Model and effort changes

Use the currently reported model when changing only effort, or pass a validated
replacement model together with an effort in one atomic batch:

```go
func raiseEffort(ctx context.Context, c loop.Controller) error {
	current := c.Model()
	return c.Change(ctx,
		loop.ChangeModel(current),
		loop.ChangeEffort(model.EffortHigh),
	)
}
```

The batch does not partially apply. The actor validates the full model and effort
before it emits `LoopInferenceChanged`. A live turn still uses its original
runtime. The next turn resolves the new secret-free model descriptor and effort.

```mermaid
%%{init: {"theme":"dark"}}%%
sequenceDiagram
    participant App as Application
    participant C as loop.Controller
    participant L as Loop actor
    participant J as Journal

    App->>C: SetMode or Change
    C->>L: live control command + buffered Ack
    L->>L: validate complete request
    L->>J: append LoopModeChanged or LoopInferenceChanged
    J-->>L: durable success
    L-->>C: LoopChangeResult
    C-->>App: update Handle view and return
    Note over L: current turn unchanged; next turn uses committed values
```

## Error categories and ownership

```go
const (
	ChangeInvalidMode          ChangeErrorKind = "invalid_mode"
	ChangeInvalidModel         ChangeErrorKind = "invalid_model"
	ChangeInvalidEffort        ChangeErrorKind = "invalid_effort"
	ChangeNoChanges            ChangeErrorKind = "no_changes"
	ChangeLoopShuttingDown     ChangeErrorKind = "loop_shutting_down"
	ChangeLoopExited           ChangeErrorKind = "loop_exited"
	ChangeContextDone          ChangeErrorKind = "context_done"
	ChangeDurableAppendFailed  ChangeErrorKind = "durable_append_failed"
)

type ChangeError struct {
	Kind  ChangeErrorKind
	Mode  ModeName
	Tool  string
	Cause error
}
```

The source also defines external-tool-specific `ChangeErrorKind` values; those
are covered on [Install and remove Loop tools](/docs/guides/harness/commands/manage-loop-tools). Use
`errors.As` and inspect `Kind`, never parse `Error()` text.

The public contract is [`pkg/loop/controller.go`](https://github.com/looprig/harness/blob/main/pkg/loop/controller.go).
The exact live-channel validation is proved by
[`pkg/command/loop_change_test.go`](https://github.com/looprig/harness/blob/main/pkg/command/loop_change_test.go),
and the actor boundary, atomicity, durable event, and next-turn behavior are
exercised by the loop controller tests in the Harness runtime. These links are
proofs of the behavior described here; applications still call the controller
rather than constructing `SetLoopMode` themselves.

## Source and proof

- [`loop.Controller` change surface](https://github.com/looprig/harness/blob/main/pkg/loop/controller.go)
- [`loop change command validation`](https://github.com/looprig/harness/blob/main/pkg/command/loop_change_test.go)
- [`controller atomicity and boundary tests`](https://github.com/looprig/harness/blob/main/pkg/loop/controller_test.go)
