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
  runtime-choices: release-github-com-looprig-tui
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

The access profile has no setter. It is fixed session metadata supplied through `SessionPresentation`. This keeps permission context visible and prevents a runtime tray from appearing to change authorization.

## Source

- [Agent command and gate methods](https://github.com/looprig/tui/blob/main/internal/presentation/agent.go)
- [Command dispatch and timeouts](https://github.com/looprig/tui/blob/main/internal/presentation/commands.go)
- [Interaction action routing](https://github.com/looprig/tui/blob/main/internal/presentation/interaction.go)
- [Session command state](https://github.com/looprig/tui/blob/main/internal/presentation/sessioncore.go)
- [Runtime choice interfaces](https://github.com/looprig/tui/blob/main/internal/presentation/runtimecontrol.go)

## Proof

- [Command tests](https://github.com/looprig/tui/blob/main/internal/presentation/commands_test.go)
- [Interaction tests](https://github.com/looprig/tui/blob/main/internal/presentation/interaction_test.go)
- [Agent contract tests](https://github.com/looprig/tui/blob/main/internal/presentation/agent_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
