---
id: reference/packages/tui/styles
title: TUI styles package
description: Pure terminal palette, background, markdown, notice, and tool-node rendering helpers.
audience: developer
section: reference
order: 245
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  functions: release-github-com-looprig-tui
  methods: release-github-com-looprig-tui
  types: release-github-com-looprig-tui
  constants: release-github-com-looprig-tui
  variables: release-github-com-looprig-tui
  ownership-and-errors: release-github-com-looprig-tui
  source-and-runnable-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/styles`

Rendering palette in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/styles).

## Package role {#package-role}

Package styles holds the shared lipgloss styles and glamour helpers for the LoopRig TUI.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ToolNode(s NodeStatus) string`
- `func NoticeStyle(level uint8) lipgloss.Style`
- `func DeriveBackgroundSGR(bg color.Color) (open, reset string)`
- `func FillLineBackground(line string, width int) string`
- `func FillLineBackgroundWith(line string, width int, open, reset string) string`
- `func NewMarkdownRenderer(width int) (*glamour.TermRenderer, error)`
- `func RenderMarkdown(r *glamour.TermRenderer, markdown string, width int) (string, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type NodeStatus uint8
```

### Constants {#constants}

`Dot`, `NodeOK`, `NodeFailed`, `NodeRunning`, `AccentBar`, `AccentBarPrompt`, `WorkflowActivityMarker`, `WorkflowActivityContinuationMarker`, `ThinkingHeader`, `SubagentCursor`, `RailColor`

### Variables {#variables}

`CardBorderColor`, `CardPanelBg`, `CardSelectedBg`, `TraySelectedBg`, `CardRailStyle`, `WorkflowActivityStyle`, `CardTitleStyle`, `CardKeyStyle`, `CardHintStyle`, `CardSelectedStyle`, `DotColor`, `MarkdownHeadingColor`, `MarkdownInlineCodeColor`, `MarkdownCodeNeutralColor`, `LitDot`, `FailColor`, `UserStyle`, `InterruptedStyle`, `StatusStyle`, `StatusWorkingStyle`, `StatusWorkingAltStyle`, `QueuedStyle`, `QueuedLabelStyle`, `HeadlineStyle`, `NoticeInfoStyle`, `NoticeWarnStyle`, `NoticeErrorStyle`, `ToolCallStyle`, `ToolResultStyle`, `AccentBarStyle`, `InputAccent`, `PanelBg`, `UserBgStyle`, `BoxStyle`, `PromptHeaderStyle`, `PromptHintStyle`, `PromptCursorStyle`, `SubagentStyle`, `ThinkingStyle`, `RailStyle`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [styles/card.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/card.go)
- [styles/markdown_tables.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/markdown_tables.go)
- [styles/styles.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/styles.go)

Adjacent tests at the same commit:

- [styles/markdown_table_fuzz_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/markdown_table_fuzz_test.go)
- [styles/markdown_tables_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/markdown_tables_test.go)
- [styles/styles_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/styles/styles_test.go)

Run `go test ./...` from a checkout of the `tui` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
