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
  row-selection: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Session Completion

`SessionComplete` renders records for a session browser. Each `SessionItem` is already formatted and secret-free. The widget presents two content rows per record plus an unboxed spacer row, keeps the accent rail continuous, and selects by record rather than by rendered line.

## Session item

```go
items := []components.SessionItem{
	{
		ID:       "session-001",
		Title:    "Investigate the parser",
		State:    "idle",
		Activity: "2 minutes ago",
		LastUsed: "today",
		ShortID:  "001",
	},
}

tray := components.NewSessionComplete(items)
fmt.Println(tray.Selected().ID)
fmt.Println(tray.ViewWindowBackground(72, 6, styles.TraySelectedBg))
```

`ID` is the payload passed to the browser's `ResumeSession`. `Title`, `State`, `Activity`, `LastUsed`, and `ShortID` are display fields. Do not pass journal bodies or credentials in this view model.

## Session tray

`NewSessionComplete` copies the input slice and returns `nil` for an empty list. The tray provides `Selected`, `Cursor`, `Up`, `Down`, and `SelectWindowRow`, plus a bounded `ViewWindowBackground`. A row with `row % 3 == 2` is the spacer and is intentionally inert.

The browser owns sorting, filtering, and the call to `ResumeSession`. This component only paints the list and reports a selected record. See [Session Adapter](/docs/guides/tui/runtime/session-adapter) for the agent that receives the resumed session.

## Row selection

When a pointer or keyboard event names a rendered row, pass the row and maximum row count to `SelectWindowRow`. The component maps that row to a record, ignores the spacer, and returns whether the selection changed. This keeps pointer selection stable when the list is taller than the terminal.

## Source

- [Session completion](https://github.com/looprig/tui/blob/main/components/sessioncomplete.go)

## Proof

- [Session completion tests](https://github.com/looprig/tui/blob/main/components/sessioncomplete_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
