---
id: guides/tui/integration/harness
title: Harness Sessions and Gates
description: Compose a Harness session with the TUI adapter and make restore decisions before the Bubble Tea program starts.
audience: developer
section: guides
order: 19
publication: released
proofs:
  session-composition: release-github-com-looprig-tui
  restore-decisions: release-github-com-looprig-tui
  gate-routing: release-github-com-looprig-tui
  ownership: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Harness Sessions and Gates

The TUI consumes Harness sessions. The application composes the Rig, chooses the session store and workspace policy, performs any startup restore, and passes the resulting `session.SessionController` to `sessionadapter`. The TUI then subscribes through the adapter and answers the gates that Harness publishes.

## Session composition

```go
func openAgent(ctx context.Context) (tui.Agent, error) {
	// The Rig and session configuration belong to the application. This
	// placeholder stands for the application's session factory.
	sess, store, err := openHarnessSession(ctx)
	if err != nil {
		return nil, err
	}

	if restored {
		return sessionadapter.Restore(ctx, sess, store)
	}
	return sessionadapter.NewWithReplay(ctx, sess, store)
}
```

The exact Rig options depend on the application. The adapter's stable contract is the `session.SessionController` plus `ReplayOpener` seam. See [Harness](/docs/guides/harness) for the session lifecycle and [Session Stores and Durable Replay](/docs/guides/tui/integration/session-stores) for the replay dependency.

## Restore decisions

Restore decisions happen before the main TUI starts. `restore.NewDecider` implements Harness's `session.RestoreDecider` through a narrow `restore.UI`:

```go
decider := restore.NewDecider(restore.NewTerminalUI())

// The application passes decider to the Harness Rig before calling its
// blocking restore operation.
rigOptions = append(rigOptions, rig.WithRestoreDecider(decider))
```

Info-only drift is accepted and surfaced without blocking. Warn-level drift is shown to the UI for a y/n decision. An accepting decision is attributed to the user. Context cancellation or a prompt error returns a non-accepting decision with the cause, which Harness treats as fail-secure rejection.

The public `Decider.DecideRestore` method is the one call Harness makes. It partitions the assessment into warn and informational changes, calls `UI.Notify` for info-only changes, and calls `UI.ConfirmDrift` only when a warn-level change needs an operator decision.

## Gate routing

The adapter indexes open permission gates by the loop ID and tool execution ID from the event header. `Approve`, `Deny`, and `ProvideAnswer` therefore route to the loop that opened the prompt, even when the user is focused on another loop. Form and open-URL gates carry a direct Harness gate ID and use `RespondGate`.

This is the presentation side of the same boundary described by [Tools](/docs/guides/tools). A tool declares and prepares a requirement, Harness evaluates it, and the TUI renders the resulting prompt. The TUI does not create grants or bypass a gate.

## Ownership

The application owns the Rig and session store. The adapter owns the wrapper and closes the session controller exactly once. The screen owns no Harness goroutine beyond its subscription reader. The process runner bounds shutdown. Keeping those owners separate is what lets a late handoff close safely without closing a store still needed by a replacement.

## Source

- [Session adapter](https://github.com/looprig/tui/blob/main/sessionadapter/adapter.go)
- [Restore decider](https://github.com/looprig/tui/blob/main/restore/decider.go)

## Proof

- [Adapter behavior tests](https://github.com/looprig/tui/blob/main/sessionadapter/adapter_test.go)
- [Restore decision tests](https://github.com/looprig/tui/blob/main/restore/decider_test.go)
- [Restore UI tests](https://github.com/looprig/tui/blob/main/restore/confirm_test.go)
- [Session adapter example](https://github.com/looprig/tui/blob/main/examples/sessionadapter/example_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
