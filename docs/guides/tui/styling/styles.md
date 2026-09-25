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
  selection-band: release-github-com-looprig-tui
  diff-and-banner-tokens: release-github-com-looprig-tui
  width-safe-fills: release-github-com-looprig-tui
  status-and-notices: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Styles and Layout Tokens

Styles are semantic tokens rather than a configurable theme object. The package exposes Lip Gloss values that can be composed into a row without importing the screen. The current palette is dark-terminal oriented: a calm blue for headings, action rails, and the selection band, lime for active work, red for failures, and a quiet dark neutral for rails.

## Semantic tokens

| Visual role | Public token | Use |
| --- | --- | --- |
| User rail | `AccentBarStyle` | Left edge of user and queued rows. |
| Composer | `BoxStyle` and `InputAccent` | Low-footprint input editor. |
| Action card | `CardRailStyle`, `CardTitleStyle`, `CardHintStyle` | Permission and AskUser cards. |
| Selection | `SelectedRow`, `SelectedRowWithRail` | Selected gate action, AskUser choice, or tray row. |
| Current value | `CurrentChoiceStyle` | The live value in a picker, independent of the cursor. |
| Diff rows | `DiffAdditionBackgroundColor`, `DiffDeletionBackgroundColor` | Added and removed rows in a permission-card diff. |
| Startup banner | `BannerNameStyle`, `BannerSessionStyle` | Agent name line and `Session:` line. |
| Tool result | `ToolCallStyle`, `ToolResultStyle` | Quiet subordinate tool details. |
| Workflow | `WorkflowActivityStyle`, `WorkflowActivityMarker` | Durable workflow activity rail. |

Use `ToolNode(styles.NodeRunning)` for a status-colored tool or subagent glyph. `NodeOK` and `NodeFailed` select the other semantic states. The styles package owns the color choice, so a host does not need to duplicate the failure palette.

## Cards and trays

A pending gate is an action-required panel: it uses the blue card rail on the `CardPanelBg` fill, with `CardKeyStyle` for pressable keys and `CardHintStyle` for quiet labels. Completion trays share the neutral panel fill (`PanelBg` is an alias of `CardPanelBg`) and the `RailColor` rail used by user rows and the composer. The style values are reusable, but the component decides which rows exist and which item is selected.

```go
line := styles.CardRailStyle.Render(styles.AccentBar) + " " +
	styles.CardTitleStyle.Render("Approve") + "  " +
	styles.CardHintStyle.Render("once")

open, reset := styles.DeriveBackgroundSGR(styles.CardPanelBg)
line = styles.FillLineBackgroundWith(line, 56, open, reset)
fmt.Println(line)
```

## Selection band

`SelectedRow(row, width)` bands a row with the one shared selection fill, the light brand blue of `CardBorderColor`, and pads it to `width` display columns. There is no cursor glyph: the band is the cursor. Because the fill is light, the row's own styling is stripped and redrawn near-black so it stays legible. `SelectedRowWithRail(rail, body, width)` does the same while drawing a panel's left-edge glyph in the fill color, so the rail runs unbroken into the band. Neither function truncates; clip the row to the surface width first.

```go
// Clip first: SelectedRow pads to width but never truncates.
// ansi is github.com/charmbracelet/x/ansi.
row := ansi.Truncate(label, 60, "…")
fmt.Println(styles.SelectedRowWithRail(styles.AccentBar, " "+row, 60))
```

The fill itself is not exported, which keeps every surface on the same selection color. `CardSelectedBg` and `CardSelectedStyle` remain exported, but the TUI's own gate cards and trays now band selections through `SelectedRow`.

## Diff and banner tokens

The permission card colorizes an already-rendered unified diff with Chroma's `github-dark` style and tints changed rows with `DiffAdditionBackgroundColor` and `DiffDeletionBackgroundColor`, both dark enough that highlighted text stays readable. The startup banner renders the agent name in `BannerNameStyle` and the session line in `BannerSessionStyle`.

## Width-safe fills

`DeriveBackgroundSGR` returns an open and reset pair from a color without hardcoding terminal escape sequences. `FillLineBackground` uses the shared panel fill. `FillLineBackgroundWith` accepts a caller-derived pair, reopens it after nested resets, and pads to the requested display width. An empty open pair leaves the line unchanged as a fail-safe.

Do not use a plain Lip Gloss background wrapper when a row contains Glamour or nested Lip Gloss spans. Their full resets can stop a background halfway across the row. The helper exists to keep the panel continuous.

## Status and notices

`StatusWorkingStyle` and `StatusWorkingAltStyle` provide the active pulse. `StatusStyle` is the quiet fallback. `NoticeInfoStyle`, `NoticeWarnStyle`, and `NoticeErrorStyle` are selected through `NoticeStyle(level)`, which treats unknown levels as info instead of inventing an alarming color.

## Source

- [Style tokens and fill helpers](https://github.com/looprig/tui/blob/main/styles/styles.go)
- [Card and tray tokens](https://github.com/looprig/tui/blob/main/styles/card.go)
- [Shared selection band](https://github.com/looprig/tui/blob/main/styles/selection.go)

## Proof

- [Styles behavior tests](https://github.com/looprig/tui/blob/main/styles/styles_test.go)
- [Selection band tests](https://github.com/looprig/tui/blob/main/styles/selection_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
