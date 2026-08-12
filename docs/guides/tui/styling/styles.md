---
id: guides/tui/styling/styles
title: Styles and Layout Tokens
description: Apply the TUI's semantic Lip Gloss styles and width-safe background helpers to custom terminal components.
audience: developer
section: guides
order: 16
publication: released
proofs:
  semantic-tokens: release-github-com-looprig-tui
  cards-and-trays: release-github-com-looprig-tui
  width-safe-fills: release-github-com-looprig-tui
  status-and-notices: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Styles and Layout Tokens

Styles are semantic tokens rather than a configurable theme object. The package exposes Lip Gloss values that can be composed into a row without importing the screen. The current palette is dark-terminal oriented: a calm blue for headings and action rails, lime for active work, red for failures, gray for quiet rails, and dark blue fills for selected tray rows.

## Semantic tokens

| Visual role | Public token | Use |
| --- | --- | --- |
| User rail | `AccentBarStyle` | Left edge of user and queued rows. |
| Composer | `BoxStyle` and `InputAccent` | Low-footprint input editor. |
| Action card | `CardRailStyle`, `CardTitleStyle`, `CardHintStyle` | Permission and AskUser cards. |
| Selection | `CardSelectedBg`, `TraySelectedBg`, `CardSelectedStyle` | Selected gate or completion row. |
| Tool result | `ToolCallStyle`, `ToolResultStyle` | Quiet subordinate tool details. |
| Workflow | `WorkflowActivityStyle`, `WorkflowActivityMarker` | Durable workflow activity rail. |

Use `ToolNode(styles.NodeRunning)` for a status-colored tool or subagent glyph. `NodeOK` and `NodeFailed` select the other semantic states. The styles package owns the color choice, so a host does not need to duplicate the failure palette.

## Cards and trays

Card styles intentionally differ from completion trays. A pending gate is an action-required panel and uses the blue card rail. A completion row uses `TraySelectedBg`, which is lighter and keeps faint path or description text readable. The style values are reusable, but the component decides which rows exist and which item is selected.

```go
line := styles.CardRailStyle.Render(styles.AccentBar) + " " +
	styles.CardTitleStyle.Render("Approve") + "  " +
	styles.CardHintStyle.Render("once")

open, reset := styles.DeriveBackgroundSGR(styles.TraySelectedBg)
line = styles.FillLineBackgroundWith(line, 56, open, reset)
fmt.Println(line)
```

## Width-safe fills

`DeriveBackgroundSGR` returns an open and reset pair from a color without hardcoding terminal escape sequences. `FillLineBackground` uses the shared panel fill. `FillLineBackgroundWith` accepts a caller-derived pair, reopens it after nested resets, and pads to the requested display width. An empty open pair leaves the line unchanged as a fail-safe.

Do not use a plain Lip Gloss background wrapper when a row contains Glamour or nested Lip Gloss spans. Their full resets can stop a background halfway across the row. The helper exists to keep the panel continuous.

## Status and notices

`StatusWorkingStyle` and `StatusWorkingAltStyle` provide the active pulse. `StatusStyle` is the quiet fallback. `NoticeInfoStyle`, `NoticeWarnStyle`, and `NoticeErrorStyle` are selected through `NoticeStyle(level)`, which treats unknown levels as info instead of inventing an alarming color.

## Source

- [Style tokens and fill helpers](https://github.com/looprig/tui/blob/main/styles/styles.go)
- [Card and tray tokens](https://github.com/looprig/tui/blob/main/styles/card.go)

## Proof

- [Styles behavior tests](https://github.com/looprig/tui/blob/main/styles/styles_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.15.1)
