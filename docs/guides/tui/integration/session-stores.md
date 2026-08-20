---
id: guides/tui/integration/session-stores
title: Session Stores and Durable Replay
description: Supply the narrow event-replayer seam the TUI adapter uses for restore repaint and journal-gap repair.
audience: developer
section: guides
order: 21
publication: released
proofs:
  replay-opener: release-github-com-looprig-tui
  replayopener: release-github-com-looprig-tui
  constructor-selection: release-github-com-looprig-tui
  gap-repair: release-github-com-looprig-tui
  ownership: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Session Stores and Durable Replay

The TUI adapter does not own a journal cursor. It accepts a `ReplayOpener` that opens a public event replayer for one session. The Harness `sessionstore.Store` is the production implementation. This keeps durable storage policy in the application while giving the adapter enough authority to repaint history and repair a lost live-delivery range.

## ReplayOpener

```go
type ReplayOpener interface {
	OpenEventReplayer(
		sessionID uuid.UUID,
		request sessionstore.ReplayRequest,
	) (journal.EventReplayer, error)
}
```

The adapter opens the initial replayer from the beginning for `NewWithReplay` or `Restore`. It drains the cursor into a materialized backlog, folds visible events, and retains the highest journal sequence consumed. A replay error during initialization closes the session controller before returning the error.

## Constructor selection

Use `sessionadapter.New` when no history must be replayed. Use `NewWithReplay` when a new session has committed setup events before the client subscribes. Use `Restore` when the Harness session was restored and the TUI must reconstruct committed transcript state and pending gates before showing live output.

```go
var adapter *sessionadapter.Adapter
var err error
switch state {
case "new-with-primers":
	adapter, err = sessionadapter.NewWithReplay(ctx, sess, store)
case "restored":
	adapter, err = sessionadapter.Restore(ctx, sess, store)
default:
	adapter = sessionadapter.New(sess)
}
if err != nil {
	return err
}
```

## Gap repair

When a live subscription closes with a Harness hub loss, the adapter connects a replacement subscription before opening the journal gap. It replays from the last delivered sequence, drops overlapping deliveries, forwards the missing range in order, and then forwards newer live events. If the journal cannot repair the range, the subscription exposes the typed error rather than silently skipping history.

This ordering is important for a terminal UI. The user should see a durable event once, in journal order, even when a bounded in-memory hub buffer overflowed while the terminal was rendering.

## Ownership

The store owns its file or remote persistence and the session controller owns the session lifecycle. The adapter owns replay cursors only for the duration of initialization or repair and closes them when done. The TUI consumes the adapter's `EventStream`; it should not call `OpenEventReplayer` directly.

## Source

- [Replay opener and adapter initialization](https://github.com/looprig/tui/blob/main/sessionadapter/adapter.go)
- [Gap-repairing replay subscription](https://github.com/looprig/tui/blob/main/sessionadapter/replaying_subscription.go)

## Proof

- [Adapter replay tests](https://github.com/looprig/tui/blob/main/sessionadapter/adapter_test.go)
- [Gap-repair tests](https://github.com/looprig/tui/blob/main/sessionadapter/replaying_subscription_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
