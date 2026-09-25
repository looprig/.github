---
id: guides/harness/session-runtime/controller
title: Session controller
description: Use the live control surface returned by a Rig.
audience: developer
section: guides
order: 10
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  data-plane-contract: [release-github-com-looprig-harness]
  control-plane-contract: [release-github-com-looprig-harness]
  gate-host-contract: [release-github-com-looprig-harness]
  optional-capabilities: [release-github-com-looprig-harness]
  errors-are-typed: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Session controller

The value returned by `Rig.NewSession` and `Rig.RestoreSession` is a
`session.SessionController`. The interface intentionally separates ordinary
data-plane work from trusted lifecycle mutations. The concrete runtime also
implements `session.GateHost` and several other optional capabilities, each
discovered by its own type assertion.

## Data-plane contract

This is the exact published `session.Session` interface:

```go
type Session interface {
	SessionID() uuid.UUID
	ActiveLoop() loop.Handle
	Loop(uuid.UUID) (loop.Handle, bool)
	Submit(context.Context, []content.Block) (uuid.UUID, error)
	SubmitToLoop(context.Context, uuid.UUID, []content.Block) (uuid.UUID, error)
	Compact(context.Context) (uuid.UUID, error)
	CompactToLoop(context.Context, uuid.UUID) (uuid.UUID, error)
	SubscribeEvents(event.EventFilter) (event.Subscription, error)
	RespondGate(context.Context, gate.GateResponse) error
	Interrupt(context.Context) (bool, error)
}
```

The returned command or input UUID is a correlation identity, not a promise
that a turn has started. Observe the resulting Reply or terminal event on the
subscription.

## Control-plane contract

`SessionController` embeds the data plane and adds the trusted mutations:

```go
type SessionController interface {
	Session
	SetActiveLoop(context.Context, uuid.UUID) error
	LoopController(uuid.UUID) (loop.Controller, bool)
	CheckpointWorkspace(context.Context) (workspacestore.Ref, error)
	RestoreWorkspace(context.Context, workspacestore.Ref) error
	Shutdown(context.Context) error
}
```

`loop.Controller` is the exact loop-scoped mutation view:

```go
type Controller interface {
	Handle
	SetMode(context.Context, ModeName) error
	Change(context.Context, ...Change) error
	Interrupt(context.Context) error
}
```

`Handle` itself is read-only:

```go
type Handle interface {
	ID() uuid.UUID
	Mode() ModeName
	Model() model.Model
}
```

Callers should retain the controller only for the session lifetime and close
it once. Loop handles remain registered when an agent turn becomes idle; they
are not disposable worker handles.

## Gate-host contract

An integration that opens a form or open-URL prompt asserts the separate
host-owned capability:

```go
type GateHost interface {
	OpenHostGate(context.Context, uuid.UUID, gate.Gate, gate.Payload) (gate.ID, error)
	AwaitGateAnswer(context.Context, gate.ID) (gate.Answer, error)
	CloseGate(context.Context, gate.ID, gate.CloseReason) error
}
```

`OpenHostGate` accepts only `gate.KindForm` and `gate.KindOpenURL` with
`gate.ResolverSession`. It derives the public schema or origin from the
validated private payload. Permission and ask-user loop gates are deliberately
not reachable through this interface. The opener must either await the answer
or close the gate, including after a cancelled wait.

```go
func hostCapability(c session.SessionController) (session.GateHost, error) {
	host, ok := c.(session.GateHost)
	if !ok {
		return nil, fmt.Errorf("session does not expose host gates")
	}
	return host, nil
}
```

## Optional capabilities

These interfaces in `pkg/session` are not methods on `Session` or
`SessionController`. Assert on the value the Rig returned; a false result means
the session cannot do that, not that an error occurred. A wrapper around a live
session must forward the method, or it silently opts the wrapped session out.

| Interface | Method | Use it to |
| --- | --- | --- |
| `Liveness` | `Done() <-chan struct{}` | `select` on teardown. The channel closes when teardown begins, not when it finishes. |
| `IdleWaiter` | `WaitIdle(context.Context) error` | Wait for whole-session quiescence; returns the terminal reason if the session failed or stopped. A foreign primary loop never reaches whole-session idle. |
| `Releaser` | `ReleaseResidency(context.Context) error` | Give up this process's runtime while leaving the session restorable. See [shutdown](/docs/guides/harness/session-runtime/shutdown). |
| `ResidencyAbandoner` | `AbandonResidency(context.Context) error` | Release residency the way a crash would, writing nothing. |
| `PersistenceFaultReporter` | `PersistenceFaulted() <-chan struct{}`, `PersistenceFault() error` | Notice that a required journal append failed and the session can never persist again. |
| `LeaseEpochReporter` | `LeaseEpoch() (epoch uint64, held bool)` | Read the journal single-writer lease epoch this process holds; `(0, false)` once the lease is released or lost. |
| `WorkspaceReporter` | `WorkspaceStatus() WorkspaceStatus` | Read the workspace's physical and logical roots and the checkpoint it was restored from. |
| `CommittedPublicEventProvider` | `CommittedPublicEvents() (CommittedPublicEventSource, bool)` | Subscribe to a stream whose every delivery carries the committed public bytes. See [subscriptions](/docs/guides/harness/session-runtime/subscriptions). |

`runtimecommand.Provider` (`RuntimeCommands() (Applier, bool)`) is the same
pattern for applying Host-admitted commands with durable dispositions.

```go
faults, reportsFaults := controller.(session.PersistenceFaultReporter)
live, reportsDone := controller.(session.Liveness)
abandoner, canAbandon := controller.(session.ResidencyAbandoner)
if reportsFaults && reportsDone && canAbandon {
	go func() {
		select {
		case <-faults.PersistenceFaulted():
			// The fault is permanent for this process. Release without writing
			// so a successor restores the session from the journal.
			if err := abandoner.AbandonResidency(context.Background()); err != nil {
				log.Printf("abandon residency: %v", err)
			}
		case <-live.Done():
			// Teardown began for another reason.
		}
	}()
}
```

A `LeaseEpoch` result is a report about the instant of the call, not a
reservation; work stamped with it can still be refused as stale.
`WorkspaceStatus` reports `Root` and `LogicalRoot` live, but its checkpoint
fields are as of restore and do not refresh.

## Errors are typed

Session refusals use `*session.SessionError` with a closed
`SessionErrorKind`. A caller can distinguish a missing loop, an exited actor,
closing, a durable persistence fault, or an unsupported native compaction
without parsing text. Gate operations use `*session.GateError`, and loop
configuration uses `*loop.ChangeError`.

```go
var se *session.SessionError
if errors.As(err, &se) {
	switch se.Kind {
	case session.SessionLoopNotFound, session.SessionLoopExited:
		// Refresh the loop view.
	case session.SessionClosing:
		// Stop admitting work.
	case session.SessionFaulted:
		// Surface the durable fault and require operator recovery.
	}
}
```

## Source and proof

- [`Session`, `GateHost`, and `SessionController`](https://github.com/looprig/harness/blob/main/pkg/session/session.go)
- [`SessionError` and `GateError`](https://github.com/looprig/harness/blob/main/pkg/session/errors.go)
- [`loop.Handle` and `loop.Controller`](https://github.com/looprig/harness/blob/main/pkg/loop/controller.go)
- [`GateHost` external-consumer proof](https://github.com/looprig/harness/blob/main/pkg/rig/gate_host_test.go)
