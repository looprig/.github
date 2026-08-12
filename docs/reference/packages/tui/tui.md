---
id: reference/packages/tui/tui
title: TUI root package
description: Terminal screen construction, event projection, agent seams, status values, and typed attachment errors.
audience: developer
section: reference
order: 240
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

# `github.com/looprig/tui`

Root presentation package in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c).

## Package role {#package-role}

Package tui exposes the reusable Looprig terminal interface.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(ctx context.Context, agent Agent, open OpenAgent, banner AgentBanner, options ...Option) Screen`
- `func WithSessionBrowser(browser SessionBrowser) Option`
- `func WithSessionPresentation(p SessionPresentation) Option`
- `func FoldDisplay(events []event.Event) DisplayProjection`
- `func AllLoopsEventFilter() event.EventFilter`
- `func RenderStatusLine(status Status) string`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type EventStream = presentation.EventStream
```

```go
type Agent = presentation.Agent
```

```go
type OpenAgent = presentation.OpenAgent
```

```go
type AgentBanner = presentation.AgentBanner
```

```go
type AgentHolder = presentation.AgentHolder
```

```go
type TerminalErrorHolder = presentation.TerminalErrorHolder
```

```go
type HandoffFinalizer = presentation.HandoffFinalizer
```

```go
type Screen = presentation.Screen
```

```go
type DisplayProjection = presentation.DisplayProjection
```

```go
type RestoreBacklogError = presentation.RestoreBacklogError
```

```go
type RuntimeCatalog = presentation.RuntimeCatalog
```

```go
type RuntimeController = presentation.RuntimeController
```

```go
type ModeID = presentation.ModeID
```

```go
type ModelID = presentation.ModelID
```

```go
type EffortID = presentation.EffortID
```

```go
type ModeOption = presentation.ModeOption
```

```go
type ModelOption = presentation.ModelOption
```

```go
type EffortOption = presentation.EffortOption
```

```go
type LoopRuntimeOptions = presentation.LoopRuntimeOptions
```

```go
type SessionPresentation = presentation.SessionPresentation
```

```go
type SessionPresenter = presentation.SessionPresenter
```

```go
type SessionID = presentation.SessionID
```

```go
type SessionSummary = presentation.SessionSummary
```

```go
type SessionBrowser = presentation.SessionBrowser
```

```go
type Option = presentation.Option
```

```go
type Status = presentation.Status
```

```go
type ToolStatus = presentation.ToolStatus
```

```go
type ToolCallView = presentation.ToolCallView
```

```go
type EmptyInputError = input.EmptyInputError
```

```go
type UnsupportedAttachmentError = input.UnsupportedAttachmentError
```

```go
type BinaryAttachmentError = input.BinaryAttachmentError
```

```go
type ImageUnsupportedError = input.ImageUnsupportedError
```

```go
type DeniedAttachmentError = input.DeniedAttachmentError
```

```go
type AttachmentTooLargeError = input.AttachmentTooLargeError
```

```go
type AttachmentNotFoundError = input.AttachmentNotFoundError
```

```go
type AttachmentReadError = input.AttachmentReadError
```

### Constants {#constants}

`StatusIdle`, `StatusRunning`, `StatusInterrupting`, `StatusResetting`, `ToolRunning`, `ToolOK`, `ToolError`, `ToolCancelled`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [api.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/api.go)
- [errors.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/errors.go)

Adjacent tests at the same commit:

- [api_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/api_test.go)

Run `go test ./...` from a checkout of the `tui` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
