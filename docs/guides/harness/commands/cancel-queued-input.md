---
id: guides/harness/commands/cancel-queued-input
title: Cancel queued input
description: Cancel admitted input that has not begun its Turn.
audience: developer
section: guides
order: 11
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  command-shape: [release-github-com-looprig-harness]
  outcome-semantics: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Cancel queued input

`CancelQueuedInput` retracts a submit that was admitted to a loop inbox but has
not begun a Turn. It is resolved by the target loop actor, which owns the queue;
the session does not inspect and remove an item from the queue itself. That
actor ownership avoids a session-side time-of-check/time-of-use race.

## Command shape

```go
type CancelQueuedInput struct {
	Header
	identity.Coordinates
	TargetCommandID uuid.UUID `json:"target_command_id,omitzero"`
}
```

`Coordinates.SessionID` and `Coordinates.LoopID` select the owning loop. The
`TargetCommandID` is the original `UserInput` or `SubagentResult` header ID,
which is also present in the admitting `event.InputQueued.Cause.CommandID`.
There is no `Ack`; the result is observed through events.

```go
// The runtime normally constructs this command. A consumer should prefer its
// session/delegation API, but this is the exact shape a journal adapter sees.
cmd := command.CancelQueuedInput{
	Header: command.Header{CommandID: cancelID},
	Coordinates: identity.Coordinates{SessionID: sessionID, LoopID: loopID},
	TargetCommandID: queuedInputID,
}
if err := command.ValidateCommand(cmd); err != nil {
	var invalid *command.CommandValidationError
	if errors.As(err, &invalid) {
		log.Printf("cannot retract %s: %s", invalid.Field, invalid.Rule)
	}
	return err
}
```

Validation requires all three coordinates/IDs plus the universal command ID.
Missing `SessionID`, `LoopID`, or `TargetCommandID` returns a typed
`*command.CommandValidationError` with `RuleRequired`.

## Outcome semantics

If the target is still in the actor-owned inbox, the loop publishes an enduring
`event.InputCancelled` with `Reason: event.CancelClientRetracted` and the target
command ID in its cause. If it already started, folded, was returned, or was
never known, the retract is a no-op. The caller infers that state from the
resolution event it already observed; a no-op is not an error.

```mermaid
%%{init: {"theme":"dark"}}%%
sequenceDiagram
    participant App as Cancellation owner
    participant L as Target loop
    participant E as Event fan-in

    App->>L: CancelQueuedInput{TargetCommandID}
    L->>L: inspect actor-owned inbox
    alt still queued
        L->>L: remove exact command ID
        L->>E: InputCancelled{CancelClientRetracted}
    else started, folded, or unknown
        L-->>App: no point reply; no-op
    end
```

The cancellation command itself can be appended for audit. Its transient
transport has no channel and restore can safely replay it because the actor's
queue lookup is idempotent. The target input's own durable record is not erased;
the cancellation event is the authoritative resolution.

The source is [`pkg/command/cancel_queued_input.go`](https://github.com/looprig/harness/blob/main/pkg/command/cancel_queued_input.go).
The queue ownership and event behavior are proved by the loop managed-queue
tests and [`pkg/command/cancel_queued_input_test.go`](https://github.com/looprig/harness/blob/main/pkg/command/cancel_queued_input_test.go).
This page documents an internal command shape; ordinary applications should use
the higher-level delegation/session operation that owns the original request.

## Source and proof

- [`CancelQueuedInput`](https://github.com/looprig/harness/blob/main/pkg/command/cancel_queued_input.go)
- [`managed queue ownership`](https://github.com/looprig/harness/blob/main/pkg/loop/managed_queue_test.go)
- [`cancel command validation`](https://github.com/looprig/harness/blob/main/pkg/command/cancel_queued_input_test.go)
