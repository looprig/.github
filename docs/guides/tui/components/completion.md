---
id: guides/tui/components/completion
title: Completion Trays
description: Render and navigate slash commands, filesystem paths, and typed runtime choices with reusable completion widgets.
audience: developer
section: guides
order: 13
publication: released
proofs:
  slash-completion: release-github-com-looprig-tui
  file-completion: release-github-com-looprig-tui
  value-completion: release-github-com-looprig-tui
  selection-and-windows: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Completion Trays

The completion widgets share a cursor and tray vocabulary while keeping candidate discovery outside the package. Constructors return `nil` for no matches, `Selected` returns the typed record, and `ViewWindow` keeps the selected row visible inside a bounded terminal panel.

## Slash completion

`SlashCmd` carries a `Name` and `Desc`. `SlashCommands` is the canonical catalog with `/clear`, `/compact`, and `/exit`. `NewSlashComplete` performs case-insensitive relevance ranking, ignores an optional leading slash, and hides the tray when nothing matches. `NewSlashCompleteWithCommands` copies a caller-owned catalog for product-specific commands.

```go
tray := components.NewSlashComplete("/com")
if tray != nil {
	tray.Down()
	selected := tray.Selected()
	fmt.Println(selected.Name, selected.Desc)
	fmt.Println(tray.ViewWindow(72, 6))
}
```

Exact name matches rank before prefix matches, related words, and substring matches. The widget only presents and selects. Package `tui` maps the selected name to an action.

## File completion

`FileItem` carries the completion `Path` and an `IsDir` flag. `NewFileComplete` renders an `@path` label and adds `/` to directories so a folder reads as drillable. Paths remain byte-for-byte unchanged for selection. Control runes are replaced only in display output.

```go
files := []components.FileItem{
	{Path: "src", IsDir: true},
	{Path: "src/main.go"},
}
tray := components.NewFileComplete(files)
tray.SelectWindowRow(1, 4)
fmt.Println(tray.Selected().Path)
fmt.Println(tray.ViewWindow(60, 4))
```

The package does not read the filesystem. The screen or composition root supplies the filtered candidates.

## Value completion

`ValueItem` is the common typed choice record used by runtime mode, model, and effort trays. Matching checks `Label`, `Description`, and each alias. The `ID` is the opaque payload passed to a `RuntimeController`.

```go
choices := []components.ValueItem{
	{ID: "balanced", Label: "Balanced", Description: "Default reasoning", Aliases: []string{"default"}},
	{ID: "fast", Label: "Fast", Description: "Lower latency"},
}
tray := components.NewValueComplete(choices, "default")
if tray != nil {
	fmt.Println(tray.Selected().ID)
	}
```

## Selection and windows

`Up` and `Down` wrap. `SelectWindowRow` selects relative to the currently visible bounded window and ignores out-of-range rows. `ViewWidth` and `ViewWindow` clamp ANSI-aware display width, so a long description cannot widen the terminal frame. Use `ViewWindowBackground` when the host owns an animated or custom selected-row fill.

## Source

- [Slash completion](https://github.com/looprig/tui/blob/main/components/slashcomplete.go)
- [File completion](https://github.com/looprig/tui/blob/main/components/filecomplete.go)
- [Value completion](https://github.com/looprig/tui/blob/main/components/valuecomplete.go)

## Proof

- [Slash completion tests](https://github.com/looprig/tui/blob/main/components/slashcomplete_test.go)
- [File completion tests](https://github.com/looprig/tui/blob/main/components/filecomplete_test.go)
- [Value completion tests](https://github.com/looprig/tui/blob/main/components/valuecomplete_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.16.1)
