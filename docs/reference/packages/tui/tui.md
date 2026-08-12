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
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui`

Root presentation package in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c).

## Package role {#package-role}

The package turns a session-facing `Agent` and event stream into a terminal `Screen`. `FoldDisplay` is a presentation projection; it does not become a second event journal or session store.

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

No exported types are declared in this package.

### Constants {#constants}

`StatusIdle`, `StatusRunning`, `StatusInterrupting`, `StatusResetting`, `ToolRunning`, `ToolOK`, `ToolError`, `ToolCancelled`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [api.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/api.go)
- [errors.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/errors.go)

Adjacent tests at the same commit:

- [api_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/api_test.go)

Run `GOWORK=off go test ./...` from the `tui` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
