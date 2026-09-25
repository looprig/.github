---
id: guides/tui/components/sessions
title: Session Completion
description: Present secret-free session records in a bounded, keyboard-selectable completion tray.
audience: developer
section: guides
order: 14
publication: released
proofs:
  session-item: release-github-com-looprig-tui
  session-tray: release-github-com-looprig-tui
  search: release-github-com-looprig-tui
  row-selection: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Session Completion

`SessionComplete` renders records for a session browser. Each `SessionItem` is already formatted and secret-free. The widget draws a `SESSIONS` header with a count, then two content rows per record with a spacer row between records. It keeps the accent rail continuous, bands the selected record with `styles.SelectedRowWithRail`, and selects by record rather than by rendered line.

## Session item

```go
items := []components.SessionItem{
	{
		ID:          "session-001",
		Title:       "Investigate the parser",
		Current:     true, // the session backing the active Agent
		Description: "parser regression in the tokenizer", // searchable, not drawn
		State:       "idle",
		Activity:    "2 minutes ago",
		LastUsed:    "today",
		ShortID:     "001",
	},
}

tray := components.NewSessionComplete(items)
fmt.Println(tray.Selected().ID)
fmt.Println(tray.ViewWindow(72, 8))
```

`ID` is the payload passed to the browser's `ResumeSession`. `Title`, `State`, `Activity`, `LastUsed`, and `ShortID` are display fields; the first row shows the title with state and activity, and the second shows the date and short ID. `Current` marks the active session independently of the cursor. `Description` is used only for search. Do not pass journal bodies or credentials in this view model.

## Session tray

`NewSessionComplete` copies the input slice and returns `nil` for an empty list. The tray provides `Selected`, `Cursor`, `Len`, `Up`, `Down`, `Filter`, and `SelectWindowRow`, plus a bounded `ViewWindow(width, maxRows)`. The header takes four rows, so a window shorter than that renders nothing. `Cursor` is a record index, not a row index.

## Search

`Filter(query)` narrows the list without rebuilding it. Titles are fuzzy-matched and underlined, and a record also matches when its `Description`, `ID`, or `ShortID` contains the query. Those fields are not drawn, so such hits carry no underline. A blank query restores the full list, the header count reads like `2 of 9 sessions`, and an empty result shows `No matching sessions`. `Selected` resolves through the original index, so the resumed ID is correct however the filter reordered the rows. The screen feeds the composer's text into `Filter` while the `/resume` tray is open.

The browser owns sorting, filtering, and the call to `ResumeSession`. This component only paints the list and reports a selected record. See [Session Adapter](/docs/guides/tui/runtime/session-adapter) for the agent that receives the resumed session.

## Row selection

When a pointer event names a rendered row, pass the row and maximum row count to `SelectWindowRow`. The component maps that row to a record and returns whether the selection changed. Either content row of a record selects it, while header rows and the spacer between records are inert. This keeps pointer selection stable when the list is taller than the terminal.

## Source

- [Session completion](https://github.com/looprig/tui/blob/main/components/sessioncomplete.go)

## Proof

- [Session completion tests](https://github.com/looprig/tui/blob/main/components/sessioncomplete_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
