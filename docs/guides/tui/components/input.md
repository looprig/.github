---
id: guides/tui/components/input
title: InputBox
description: Use the public InputBox editor for auto-growing text input, display-column sizing, and modern panel rendering.
audience: developer
section: guides
order: 12
publication: released
proofs:
  constructor: release-github-com-looprig-tui
  editing: release-github-com-looprig-tui
  sizing-and-rendering: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# InputBox

`components.InputBox` wraps a Bubble Tea textarea with the TUI's `▌` prompt rail. It has no character limit, no line numbers, and no `> ` prompt. The editor grows with visual rows between a configurable minimum and maximum, so a wrapped long line counts toward its visible height just like a multi-line value.

## Constructor

```go
box := components.NewInputBox()
box.Resize(80)
box.SetValue("Summarize the current turn")

fmt.Println(box.Value())
fmt.Println(box.Height())
fmt.Println(box.View())
```

`NewInputBox` returns a focused value. Call `Focus` when the host creates or reactivates it, and pass Bubble Tea messages to `Update`. `Reset` clears the current value without replacing the widget.

## Editing

`Enter` remains available to the host as the submit action. Literal newlines use Shift+Enter when the terminal reports Kitty keyboard enhancements and Ctrl+J as a universal fallback. That split is intentional: the TUI can submit on plain Enter while still allowing multi-line prompts.

```go
cmd := box.Focus()
_ = cmd // return this command from a Bubble Tea Init or focus handler

cmd = box.Update(msg)
_ = cmd // return the textarea command from Update
if strings.TrimSpace(box.Value()) != "" {
	// The host decides when the value becomes a content.Block slice.
	box.Reset()
}
```

## Sizing and rendering

`Resize(width)` subtracts the left rail and padding before sizing the inner textarea. `SetMinLines` changes the visible lower bound. `SetVerticalPadding` adds rows above and below the text without changing the editor's auto-grow range. `SetBackground` enables the modern full-width panel fill and reopens the background after internal ANSI resets. The default widget remains the lightweight scrollback composer.

The `View` result is a string. It can be embedded in a `tea.View` or composed with the screen's layout. The widget does not decide submission, slash dispatch, or which loop receives a prompt.

## Source

- [InputBox implementation](https://github.com/looprig/tui/blob/main/components/input.go)

## Proof

- [InputBox behavior tests](https://github.com/looprig/tui/blob/main/components/input_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
