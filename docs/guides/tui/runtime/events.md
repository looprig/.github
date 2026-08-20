---
id: guides/tui/runtime/events
title: Events and Projections
description: Subscribe to the all-loop event stream and rebuild the committed display with the same pure fold used for restore.
audience: developer
section: guides
order: 6
publication: released
proofs:
  agent-contract: release-github-com-looprig-tui
  all-loop-delivery: release-github-com-looprig-tui
  fold-and-compare: release-github-com-looprig-tui
  failed-child-cards: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Events and Projections

The public event seam is `tui.EventStream`, an alias for the Harness subscription contract. The screen opens one stream with `tui.AllLoopsEventFilter`, reads deliveries until the stream closes, and folds each event into the live projection. The same fold is available as `tui.FoldDisplay` for tests and cold restore.

## Agent contract

An `Agent` exposes the session operations and event seams the TUI needs:

```go
type Agent interface {
	SessionID() uuid.UUID
	Submit(context.Context, []content.Block) (uuid.UUID, error)
	SubmitToLoop(context.Context, uuid.UUID, []content.Block) (uuid.UUID, error)
	CompactToLoop(context.Context, uuid.UUID) (uuid.UUID, error)
	ActiveLoopID() uuid.UUID
	Interrupt(context.Context) (bool, error)
	Close(context.Context) error
	AcceptsImages(uuid.UUID) bool
	Subscribe(event.EventFilter) (EventStream, error)
	ReplayBacklog(context.Context) ([]event.Event, error)
	Approve(context.Context, uuid.UUID, uuid.UUID, gate.ApprovalAction) error
	Deny(context.Context, uuid.UUID, uuid.UUID) error
	ProvideAnswer(context.Context, uuid.UUID, uuid.UUID, string) error
	RespondGate(context.Context, gate.ID, string, map[string]json.RawMessage) error
}
```

The imports in the signature are `core/content`, `core/uuid`, `harness/pkg/event`, and `harness/pkg/gate`. The interface is structural. A Harness-backed session adapter satisfies it without the TUI depending on a product agent package.

## All-loop delivery

```go
filter := tui.AllLoopsEventFilter()
stream, err := agent.Subscribe(filter)
if err != nil {
	return err
}
defer stream.Close()

for delivery := range stream.Events() {
	projection = tui.FoldDisplay(append(history, delivery.Event))
	_ = projection.EventCount()
}
if err := stream.Err(); err != nil {
	return err
}
```

The filter requests `Ephemeral: All` and `Enduring: All`. Ephemeral deliveries keep live tokens and tool activity moving for every loop. Enduring deliveries rebuild committed transcript state and session-global workflow activity. Session-scoped events bypass the loop scope. Consumers close the stream when they close the agent.

## Fold and compare

`FoldDisplay(events)` is order-sensitive and side-effect-free. `DisplayProjection.CommittedLen` counts finalized transcript entries, `EventCount` reports folded deliveries, and `PendingPrompts` counts permission and AskUser prompts. `EqualTranscript` compares the committed transcript while ignoring live-only thinking duration, which cannot be reconstructed from durable history.

Use this fold when asserting that a restored session paints the same committed conversation as the original live sequence. Do not use `EqualTranscript` as a render-loop equality check. It performs a deep comparison intended for restore verification.

## Failed child cards

A failed child card shows the child's own terminal failure reason, and that reason is truncated to a single line of eighty display runes, ellipsis included. When a child's failure reason is nil or empty, the card retains the parent's tool-result fallback unchanged.

Live and restored child cards render the same persisted message, because the codec stores the failure text verbatim and restore replays it through the same fold. The codec adds no prefix to that message; the restored error keeps its stable kind in a separate field, and the card reads the stored message.

## Source

- [Agent and event stream](https://github.com/looprig/tui/blob/main/internal/presentation/agent.go)
- [Display projection and fold](https://github.com/looprig/tui/blob/main/internal/presentation/restore.go)
- [Subscription command loop](https://github.com/looprig/tui/blob/main/internal/presentation/commands.go)
- [Root aliases and fold function](https://github.com/looprig/tui/blob/main/api.go)

## Proof

- [Agent contract tests](https://github.com/looprig/tui/blob/main/internal/presentation/agent_test.go)
- [Restore projection tests](https://github.com/looprig/tui/blob/main/internal/presentation/restore_test.go)
- [Command and subscription tests](https://github.com/looprig/tui/blob/main/internal/presentation/commands_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
