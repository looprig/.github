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
  errors-are-typed: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Session controller

The value returned by `Rig.NewSession` and `Rig.RestoreSession` is a
`session.SessionController`. The interface intentionally separates ordinary
data-plane work from trusted lifecycle mutations. The concrete runtime also
implements `session.GateHost`, but that capability is a separate assertion.

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
