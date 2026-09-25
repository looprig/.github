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
  model-picker: release-github-com-looprig-tui
  selection-and-windows: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Completion Trays

The completion widgets share a cursor and tray vocabulary while keeping candidate discovery outside the package. Constructors return `nil` for no matches, `Selected` returns the typed record, and `ViewWindow` keeps the selected row visible inside a bounded terminal panel.

## Slash completion

`SlashCmd` carries a `Name` and `Desc`. `SlashCommands` is the canonical catalog with `/clear`, `/compact`, and `/exit`. `NewSlashComplete` fuzzy-matches the query against command names with the Bubbles list filter, ignores an optional leading slash, and hides the tray when nothing matches. `NewSlashCompleteWithCommands` builds the same tray from a caller-owned catalog for product-specific commands.

```go
tray := components.NewSlashComplete("/com")
if tray != nil {
	tray.Down()
	selected := tray.Selected()
	fmt.Println(selected.Name, selected.Desc)
	fmt.Println(tray.ViewWindow(72, 6))
}
```

Matches are ranked by the fuzzy score, and the matched characters are underlined. Descriptions are not searched. The widget only presents and selects. Package `tui` maps the selected name to an action.

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

`ValueItem` is the common typed choice record used by runtime mode, model, and effort trays. `NewValueComplete(items, query)` fuzzy-matches `Label` first and then each alias; alias hits appear after label hits and carry no underline because the alias is not drawn. `Description` is shown but deliberately not searched. The `ID` is the opaque payload passed to a `RuntimeController`, and `Selected` resolves it through the unfiltered index so filtering cannot change which choice Enter picks.

```go
choices := []components.ValueItem{
	{ID: "balanced", Label: "Balanced", Description: "Default reasoning", Aliases: []string{"default"}},
	{ID: "fast", Label: "Fast", Description: "Lower latency"},
}
tray := components.NewValueComplete(choices, "default") // matches the alias
if tray != nil {
	fmt.Println(tray.Selected().ID) // balanced
}
```

## Model picker

`NewModelComplete(items)` builds the grouped model tray. Items are grouped by `ValueItem.Provider` in catalog order, an empty provider becomes `Other`, and each group gets an uppercase heading row with a blank separator between groups. Headings and separators are inert, so a cursor or pointer can select only a model. The tray draws a `MODELS` header with a count such as `3 of 12 models` and shows `No matching models` when a search empties it.

```go
models := components.NewModelComplete([]components.ValueItem{
	{ID: "sonnet", Provider: "Anthropic", Label: "claude-sonnet", Current: true},
	{ID: "gpt", Provider: "OpenAI", Label: "gpt-5"},
})
models.Filter("open")         // a provider hit keeps its whole group
fmt.Println(models.Selected().ID) // gpt
fmt.Println(models.ViewWindow(72, 10))
```

`Filter` narrows a live tray without rebuilding it, and a blank query restores the unfiltered list. A provider match keeps its whole group; otherwise a group survives when a model name, alias, or opaque ID matches. An item with `Current` set is selected when the tray opens and stays marked in `styles.CurrentChoiceStyle` after the cursor moves.

## Selection and windows

`Up` and `Down` wrap. `SelectWindowRow` selects relative to the currently visible bounded window and ignores out-of-range rows, header rows, and inert headings. `ViewWidth` and `ViewWindow` clamp ANSI-aware display width, so a long description cannot widen the terminal frame. The selected row is always banded with `styles.SelectedRowWithRail`. There is no caller-supplied selection fill, so every tray and gate card shows selection the same way.

## Source

- [Slash completion](https://github.com/looprig/tui/blob/main/components/slashcomplete.go)
- [File completion](https://github.com/looprig/tui/blob/main/components/filecomplete.go)
- [Value completion](https://github.com/looprig/tui/blob/main/components/valuecomplete.go)
- [Shared tray engine](https://github.com/looprig/tui/blob/main/components/traylist.go)

## Proof

- [Slash completion tests](https://github.com/looprig/tui/blob/main/components/slashcomplete_test.go)
- [File completion tests](https://github.com/looprig/tui/blob/main/components/filecomplete_test.go)
- [Value completion tests](https://github.com/looprig/tui/blob/main/components/valuecomplete_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
