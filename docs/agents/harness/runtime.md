---
id: agents/harness/runtime
title: Harness runtime control and events
description: Route commands through live sessions and consume validated event delivery, terminal outcomes, and shutdown signals.
audience: agent
section: agents/harness
order: 30
publication: released
proofs:
  lifecycle:
    - release-github-com-looprig-harness
  commands:
    - release-github-com-looprig-harness
  event-contract:
    - release-github-com-looprig-harness
  consumers-and-ownership:
    - release-github-com-looprig-harness
  human-routes:
    - release-github-com-looprig-harness
  source-tests-runnable-proof:
    - release-github-com-looprig-harness
---

# Runtime control and events

## Lifecycle

```text
Session.Submit -> TurnStarted -> (TokenDelta / ToolCall* / StepDone)*
               -> TurnDone | TurnFailed | TurnInterrupted
Session.Shutdown -> SessionStopped -> subscription teardown
```

`InputQueued`, `TurnFoldedInto`, `TurnRejected`, gate, compaction, delegation,
workspace, process, and restore records can occur between these milestones.
`TurnStarted` carries the submit command cause; `StepDone` commits one finalized
AI/tool group; exactly one terminal turn event ends a turn. Observe, do not infer,
the outcome from the `Submit` return value.

## Commands

`pkg/command` owns the sealed intent envelope and JSON codec. Use
`ValidateCommand`, `MarshalCommand`, and `UnmarshalCommand`; match
`*command.CommandValidationError`, `CommandDecodeError`, and
`CommandEncodeError` with typed checks.

| Command/surface | Behavior | Durable or transient |
| --- | --- | --- |
| `command.UserInput` / `Session.Submit` | admits blocks; outcome is event fan-in; queued input may fold or start a later turn | intent is durable; acceptance channel is transient |
| `command.Interrupt` / `Session.Interrupt` | cancels active work and emits `TurnInterrupted` when applicable | live ack plus durable outcome |
| `command.Compact` / `Session.Compact` and `CompactToLoop` | requests a loop-scoped compaction attempt | command/event records and waiter reply |
| `ApproveToolCall`, `DenyToolCall`, `ProvideUserInput` / `Session.RespondGate` | route by `GateRoute` and `ToolExecutionID` to the pending gate | response is validated; decision/events are durable |
| `SetLoopMode`, `ChangeLoopInference` / `loop.Controller` | apply atomically at the next turn boundary | live control; `LoopModeChanged` or `LoopInferenceChanged` is the durable record |
| `Shutdown` / `SessionController.Shutdown` | closes admission, cancels/drains owned work, publishes `SessionStopped` | live ack plus durable lifecycle event |

Control commands with an `Ack` require the documented non-nil, buffered channel;
ack channels are `json:"-"`. Do not serialize them or use a command's ack as a
replacement for event observation.

## Event contract

| Type | Meaning |
| --- | --- |
| `event.Event` | sealed root; every value has one lifecycle `Class`, one `Scope`, a `Header`, and `Visibility` |
| `event.Header` | `identity.Coordinates`, `EventID`, `CreatedAt`, `Cause`, and visibility; producer-stamped |
| `event.Class` | `Ephemeral` is reconstructable and not journaled; `Enduring` is journaled; terminal events are enduring and `EndsTurn()` |
| `event.Subscription` | `Events() <-chan Delivery`, `Close()`, `Err()`; close intentionally and inspect typed loss errors |
| `event.Delivery` | event plus live `JournalSeq`; `0` for ephemeral, monotonic sequence for enduring |
| `event.EventFilter` | separate `Ephemeral` and `Enduring` `LoopScope` interests; filtering happens before bounded egress |
| `event.Factory` | sole header/event stamping seam for fresh IDs and creation time |

Use `event.MarshalEvent`/`UnmarshalEvent` and `ValidateEvent`. Public streams
must exclude `Visibility == event.Internal`; the HTTP read plane filters private
records again. `SessionStopped` does not itself close a subscription: close it,
or handle hub loss/teardown.

## Consumers and ownership

- `session.Session.SubscribeEvents(filter)` is the normal consumer seam.
- `hub.Hub` is the session-owned fan-in implementation. Its
  `PublishEventChecked`, `ReserveTurnStart`, `WaitIdle`, and `StopSession`
  operations belong at the runtime composition boundary; loops only receive a
  narrow publisher.
- Event delivery is not persistence acknowledgement. A durable event is
  appended before its journal sequence is exposed; an ephemeral event has no
  sequence and may be dropped by declared filter or bounded delivery policy.
- Close subscriptions before releasing the session. Shutdown owns loop,
  Hustle, gate, process, workspace, and hub teardown; the caller owns the
  outer store/backend close.

## Human routes

[`/docs/guides/harness/commands`](/docs/guides/harness/commands) covers command
variants and validation; [`/docs/guides/harness/events`](/docs/guides/harness/events)
covers envelope, filtering, lifecycle, tool, gate, delegation, and compaction
events; [`/docs/guides/harness/turn`](/docs/guides/harness/turn) and
[`/docs/guides/harness/step`](/docs/guides/harness/step) cover boundaries;
[`/docs/guides/harness/session-runtime/subscriptions`](/docs/guides/harness/session-runtime/subscriptions)
and [`/docs/guides/harness/session-runtime/shutdown`](/docs/guides/harness/session-runtime/shutdown)
cover live consumption.

## Source, tests, runnable proof

- [`pkg/command/command.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/command/command.go), [`pkg/command/validate.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/command/validate.go), [`pkg/command/marshal.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/command/marshal.go), [`pkg/command/validate_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/command/validate_test.go).
- [`pkg/event/event.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/event.go), [`pkg/event/filter.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/filter.go), [`pkg/event/marshal.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/marshal.go), [`pkg/event/turn.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/turn.go), [`pkg/event/validate_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/validate_test.go).
- [`pkg/hub/hub.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hub/hub.go), [`pkg/hub/subscription.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hub/subscription.go), [`pkg/hub/subscription_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hub/subscription_test.go).
- [`examples/lifecycle/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/lifecycle/example_test.go) and [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go).
