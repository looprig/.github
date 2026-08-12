---
id: reference/packages/tui/components
title: TUI components package
description: Bounded terminal input and completion widgets for files, sessions, slash commands, and runtime values.
audience: developer
section: reference
order: 241
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

# `github.com/looprig/tui/components`

Reusable widgets in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/components).

## Package role {#package-role}

Package components exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewFileComplete(items []FileItem) *FileComplete`
- `func NewInputBox() InputBox`
- `func NewSessionComplete(items []SessionItem) *SessionComplete`
- `func NewSlashComplete(prefix string) *SlashComplete`
- `func NewSlashCompleteWithCommands(prefix string, commands []SlashCmd) *SlashComplete`
- `func NewValueComplete(items []ValueItem, query string) *ValueComplete`

### Methods {#methods}

- `func (f *FileComplete) Selected() FileItem`
- `func (f *FileComplete) Cursor() int`
- `func (f *FileComplete) Up()`
- `func (f *FileComplete) Down()`
- `func (f *FileComplete) SelectWindowRow(row, maxRows int) bool`
- `func (f *FileComplete) View() string`
- `func (f *FileComplete) ViewWidth(width int) string`
- `func (f *FileComplete) ViewWindow(width, maxRows int) string`
- `func (f *FileComplete) ViewWindowBackground(width, maxRows int, selectedBg color.Color) string`
- `func (b *InputBox) SetMinLines(n int)`
- `func (b *InputBox) SetBackground(bg color.Color)`
- `func (b *InputBox) SetVerticalPadding(n int)`
- `func (b InputBox) Height() int`
- `func (b *InputBox) Value() string`
- `func (b *InputBox) Reset()`
- `func (b *InputBox) SetValue(s string)`
- `func (b *InputBox) Resize(width int)`
- `func (b *InputBox) Focus() tea.Cmd`
- `func (b *InputBox) Update(msg tea.Msg) tea.Cmd`
- `func (b *InputBox) View() string`
- `func (s *SessionComplete) Selected() SessionItem`
- `func (s *SessionComplete) Cursor() int`
- `func (s *SessionComplete) Up()`
- `func (s *SessionComplete) Down()`
- `func (s *SessionComplete) SelectWindowRow(row, maxRows int) bool`
- `func (s *SessionComplete) ViewWindowBackground(width, maxRows int, selectedBg color.Color) string`
- `func (s *SlashComplete) Selected() SlashCmd`
- `func (s *SlashComplete) Cursor() int`
- `func (s *SlashComplete) Up()`
- `func (s *SlashComplete) Down()`
- `func (s *SlashComplete) SelectWindowRow(row, maxRows int) bool`
- `func (s *SlashComplete) View() string`
- `func (s *SlashComplete) ViewWidth(width int) string`
- `func (s *SlashComplete) ViewWindow(width, maxRows int) string`
- `func (s *SlashComplete) ViewWindowBackground(width, maxRows int, selectedBg color.Color) string`
- `func (v *ValueComplete) Selected() ValueItem`
- `func (v *ValueComplete) Cursor() int`
- `func (v *ValueComplete) Len() int`
- `func (v *ValueComplete) Up()`
- `func (v *ValueComplete) Down()`
- `func (v *ValueComplete) SelectWindowRow(row, maxRows int) bool`
- `func (v *ValueComplete) ViewWindowBackground(width, maxRows int, selectedBg color.Color) string`
- `func (v *ValueComplete) ViewWindow(width, maxRows int) string`

### Types {#types}

```go
type FileItem struct {
	Path  string
	IsDir bool
}
```

```go
type FileComplete struct {
	// contains filtered or unexported fields
}
```

```go
type InputBox struct {
	// contains filtered or unexported fields
}
```

```go
type SessionItem struct {
	ID       string
	Title    string
	State    string
	Activity string
	LastUsed string
	ShortID  string
}
```

```go
type SessionComplete struct {
	// contains filtered or unexported fields
}
```

```go
type SlashCmd struct {
	Name string
	Desc string
}
```

```go
type SlashComplete struct {
	// contains filtered or unexported fields
}
```

```go
type ValueItem struct {
	ID          string
	Label       string
	Description string
	Aliases     []string
}
```

```go
type ValueComplete struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

`SlashCommands`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [components/completiontray.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/completiontray.go)
- [components/filecomplete.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/filecomplete.go)
- [components/input.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/input.go)
- [components/sessioncomplete.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/sessioncomplete.go)
- [components/slashcomplete.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/slashcomplete.go)
- [components/valuecomplete.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/valuecomplete.go)

Adjacent tests at the same commit:

- [components/filecomplete_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/filecomplete_test.go)
- [components/input_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/input_test.go)
- [components/sessioncomplete_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/sessioncomplete_test.go)
- [components/slashcomplete_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/slashcomplete_test.go)
- [components/valuecomplete_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/components/valuecomplete_test.go)

Run `go test ./...` from a checkout of the `tui` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
