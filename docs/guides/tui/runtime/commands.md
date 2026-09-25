---
id: guides/tui/runtime/commands
title: Commands and Gates
description: Route input, compaction, interrupts, runtime choices, and gate replies through the typed Agent surface.
audience: developer
section: guides
order: 7
publication: released
proofs:
  input-and-compaction: release-github-com-looprig-tui
  interrupts: release-github-com-looprig-tui
  gate-replies: release-github-com-looprig-tui
  permission-cards: release-github-com-looprig-tui
  runtime-choices: release-github-com-looprig-tui
  keys-and-the-key-panel: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Commands and Gates

The TUI treats user actions as typed requests. The Bubble Tea update loop starts a bounded command, then renders the result or waits for the corresponding Harness event. A request result is not a substitute for an event: the session owns queueing, validation, and durable state.

## Input and compaction

`Agent.Submit` sends blocks to the active loop. `Agent.SubmitToLoop` sends the same blocks to the focused loop in the modern viewport. Both return an input ID that later events use as `Cause.CommandID`. `Agent.CompactToLoop` requests manual conversation compaction for one exact loop and returns its command ID.

```go
blocks := []content.Block{
	content.TextBlock{Text: "Summarize the current workspace"},
}

inputID, err := agent.SubmitToLoop(ctx, focusedLoopID, blocks)
if err != nil {
	return err
}
fmt.Println("queued input", inputID)

compactID, err := agent.CompactToLoop(ctx, focusedLoopID)
if err != nil {
	return err
}
fmt.Println("requested compaction", compactID)
```

The exact block constructor depends on the `core/content` version used by the application. The important boundary is that the TUI passes validated `content.Block` values and the session publishes the authoritative turn events.

## Interrupts

`Agent.Interrupt` returns `(cancelled, error)`. The screen gives it a bounded context so a wedged session cannot block the update loop. `StatusInterrupting` remains visible until a terminal turn event resolves the interrupt. A user pressing interrupt does not locally erase the live projection.

## Gate replies

Permission and AskUser replies identify the loop that opened the prompt plus the tool execution ID. Use `Approve` for a one-time or always-for-this-workspace approval, `Deny` for a fail-secure rejection, and `ProvideAnswer` for an AskUser response. Host-raised form and open-URL gates use `RespondGate` with the Harness gate ID and one of the advertised actions. Form values are JSON values keyed by schema field name. The session rejects an action the gate did not advertise.

```go
if err := agent.Approve(ctx, promptLoopID, toolExecutionID, gate.ApprovalApprove); err != nil {
	var notOpen *sessionadapter.GateNotOpenError
	if errors.As(err, &notOpen) {
		// The prompt was already resolved. Keep the UI fail-secure.
		return nil
	}
	return err
}
```

Never infer a gate ID from a tool name or send a reply to the active loop when the prompt carries another loop ID. Multi-loop sessions deliberately keep those coordinates explicit.

## Permission cards

A permission prompt renders as one card: the tool name, the request summary, an optional diff of the pending change, every unmet requirement with the exact rules an "always" approval would persist, and one selectable row per available action. Arrow keys move the band and Enter resolves the banded row. Esc denies.

| Key | Action | When it is offered |
| --- | --- | --- |
| `y` | `Approve` once | Always. |
| `a` | `Approve always for this workspace` | Only when at least one requirement carries a reusable rule candidate. |
| `n`, Esc | `Deny` | Always. |

The accelerators match the rendered keystroke, not the underlying key code. Ctrl+A, Alt+A and Shift+A therefore do nothing on the card; before tui v0.17.0 each of them could persist a workspace-wide approval for a keystroke meant for the composer. Caps Lock `A` is also inert because it cannot be told apart from Shift+A, while the arrow keys and Enter still reach every action. A prompt with no candidates offers only Approve and Deny, so the card never presents a persistence action that would save nothing. The AskUser card follows the same rule for its `o` (other) and `1` to `9` choice keys.

When the frame is too small to show every requirement and candidate, the card switches to a warning with a Deny-only control. Enter, Esc and `n` deny, and the approval keys stay inert until the full authorization context fits again. The screen also snapshots that completeness before a dismissing key is routed, so a key cannot approve details that appear only on the next frame.

When the tool supplied a mutation preview, the card shows the unified diff with syntax highlighting and tinted added and removed rows. [WriteFile](/docs/guides/tools/built-in-tools/writefile) and [EditFile](/docs/guides/tools/built-in-tools/editfile) produce it when the gate opens. The TUI does no diffing of its own. While the global Ctrl+T fold is collapsed, the diff is limited to 12 rows so the actions stay on screen; expanding shows the rest within the frame. The preview travels only on the live `PermissionRequested` event and is never journaled, so a prompt rebuilt from durable history after a restore has no diff.

## Runtime choices

An optional `RuntimeCatalog` lists per-loop `ModeOption`, `ModelOption`, and `EffortOption` values. An optional `RuntimeController` changes only those per-loop inference controls:

```go
type RuntimeCatalog interface {
	LoopRuntimeOptions(context.Context, uuid.UUID) (tui.LoopRuntimeOptions, error)
}

type RuntimeController interface {
	SetMode(context.Context, uuid.UUID, tui.ModeID) error
	SetModel(context.Context, uuid.UUID, tui.ModelID) error
	SetEffort(context.Context, uuid.UUID, tui.EffortID) error
}
```

Each option can set `Current` to mark the value that is live on the loop, and `ModelOption.Provider` groups the model tray under provider headings. The tray opens on the current choice and keeps it marked in `styles.CurrentChoiceStyle` while the selection band shows what Enter would choose. The model and session trays are searchable: while they are open, the composer becomes their search field and the draft is restored when the tray closes. Model search matches provider and model names, then aliases and opaque IDs. Session search fuzzy-matches titles and also matches a summary's `Description` and ID.

The access profile has no setter. It is fixed session metadata supplied through `SessionPresentation`. This keeps permission context visible and prevents a runtime tray from appearing to change authorization.

## Keys and the key panel

Pressing `?` on an empty composer opens a transient key legend below it. The next key of any kind closes the panel and then does its normal job, so nothing is swallowed. A `?` typed into a non-empty composer, an open tray, or a prompt card is ordinary input.

| Keys | Action |
| --- | --- |
| Ctrl+C | Quit |
| Esc | Interrupt the turn |
| Enter, Shift+Enter or Ctrl+J | Send, newline |
| Ctrl+N, Ctrl+P | Next and previous loop |
| Ctrl+T | Fold or unfold all |
| Tab, Up and Down | Complete, move in a tray |
| PgUp and PgDn, Home and End | Scroll the transcript |

The legend is drawn from the same bindings the screen dispatches on, and narrow terminals drop whole trailing columns rather than truncating them. It is separate from any `/help` command, which would commit text into the transcript.

## Source

- [Agent command and gate methods](https://github.com/looprig/tui/blob/main/internal/presentation/agent.go)
- [Command dispatch and timeouts](https://github.com/looprig/tui/blob/main/internal/presentation/commands.go)
- [Interaction action routing](https://github.com/looprig/tui/blob/main/internal/presentation/interaction.go)
- [Session command state](https://github.com/looprig/tui/blob/main/internal/presentation/sessioncore.go)
- [Runtime choice interfaces](https://github.com/looprig/tui/blob/main/internal/presentation/runtimecontrol.go)
- [Permission card rendering](https://github.com/looprig/tui/blob/main/internal/presentation/prompt.go)
- [Diff preview rendering](https://github.com/looprig/tui/blob/main/internal/presentation/diffview.go)
- [Key panel](https://github.com/looprig/tui/blob/main/internal/presentation/keypanel.go)

## Proof

- [Command tests](https://github.com/looprig/tui/blob/main/internal/presentation/commands_test.go)
- [Interaction tests](https://github.com/looprig/tui/blob/main/internal/presentation/interaction_test.go)
- [Agent contract tests](https://github.com/looprig/tui/blob/main/internal/presentation/agent_test.go)
- [Diff preview tests](https://github.com/looprig/tui/blob/main/internal/presentation/diffview_test.go)
- [Key panel tests](https://github.com/looprig/tui/blob/main/internal/presentation/keypanel_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
