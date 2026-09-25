---
id: guides/tui/runtime/session-adapter
title: Session Adapter
description: Adapt a Harness session controller to the TUI Agent contract with optional durable replay and gate indexing.
audience: developer
section: guides
order: 10
publication: released
proofs:
  adapter-boundary: release-github-com-looprig-tui
  constructor-choices: release-github-com-looprig-tui
  replay-and-gates: release-github-com-looprig-tui
  ownership: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Session Adapter

`github.com/looprig/tui/sessionadapter` adapts a Harness `session.SessionController` to the root `tui.Agent` surface. It delegates session operations, owns the live event subscription bridge, and optionally replays durable Enduring events so the screen can repaint before it starts consuming live deliveries. It does not own a root context, a workspace garbage-collection loop, or a second session lifetime.

## Adapter boundary

```go
// The application composes the Harness session. The adapter owns only the
// presentation-facing wrapper and returns a *sessionadapter.Adapter, which
// satisfies tui.Agent.
adapter := sessionadapter.New(sessionController)
var agent tui.Agent = adapter

stream, err := agent.Subscribe(tui.AllLoopsEventFilter())
if err != nil {
	return err
}
defer stream.Close()
```

The plain `New` constructor is explicit and ephemeral: it has no replay backlog. Use it when the client knows there is no committed primer history to repaint or when a test needs the smallest adapter. A production client that promises enduring delivery should choose one of the replay constructors.

## Constructor choices

| Constructor | Session state | Replay behavior |
| --- | --- | --- |
| `New(sess)` | New or headless session. | No cold replay. |
| `NewWithReplay(ctx, sess, store)` | New session with committed primers. | Replays public Enduring history from the beginning. |
| `Restore(ctx, sess, store)` | Restored session. | Reconstructs backlog and open-gate index before return. |

Both replay constructors take a `ReplayOpener`. The adapter needs only this narrow store seam:

```go
type ReplayOpener interface {
	OpenEventReplayer(uuid.UUID, sessionstore.ReplayRequest) (journal.EventReplayer, error)
}
```

`*sessionstore.Store` satisfies the interface. Keeping the dependency narrow lets tests provide a scripted journal and keeps session storage ownership in the Harness composition root.

## Replay and gates

During construction, the adapter folds visible `GateOpened` and `GateResolved` events into a `(loopID, toolExecutionID)` index. `Approve`, `Deny`, and `ProvideAnswer` use that index to address the Harness gate opened by the correct loop. `RespondGate` addresses a host-raised gate by its Harness `gate.ID` directly.

If no matching gate is open, the adapter returns `*GateNotOpenError` with the loop and tool execution IDs. The error is `errors.As`-able and fail-secure: no guessed gate is touched.

## Ownership

`Adapter.Close` calls the wrapped session controller's shutdown exactly once. Subscription readers stop with the adapter. The Harness session owns workspace leases, snapshots, the event journal, and garbage collection. Read [Workspaces and Session Presentation](/docs/guides/tui/integration/workspaces) for what the screen displays and [Session Stores and Durable Replay](/docs/guides/tui/integration/session-stores) for the storage seam.

## Source

- [Session adapter](https://github.com/looprig/tui/blob/main/sessionadapter/adapter.go)
- [Gap-repairing subscription](https://github.com/looprig/tui/blob/main/sessionadapter/replaying_subscription.go)

## Proof

- [Adapter behavior tests](https://github.com/looprig/tui/blob/main/sessionadapter/adapter_test.go)
- [Replay subscription tests](https://github.com/looprig/tui/blob/main/sessionadapter/replaying_subscription_test.go)
- [Adapter API compile-time proof](https://github.com/looprig/tui/blob/main/sessionadapter/api_test.go)
- [Session adapter example](https://github.com/looprig/tui/blob/main/examples/sessionadapter/example_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
