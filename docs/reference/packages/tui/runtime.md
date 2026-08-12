---
id: reference/packages/tui/runtime
title: TUI runtime package
description: Process-level terminal runtime that installs signals, logging, output capture, and bounded agent teardown.
audience: [developer, operator]
section: reference
order: 243
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/runtime`

Process runtime in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime).

## Package role {#package-role}

`runtime` composes the terminal process around a caller-supplied agent factory. It owns process plumbing and teardown, not session persistence or model-provider configuration.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Run(ctx context.Context, newAgent func(context.Context) (tui.Agent, error), banner Banner, options ...tui.Option) int`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

`Banner`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [runtime/run.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime/run.go)

Adjacent tests at the same commit:

- [runtime/api_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime/api_test.go)
- [runtime/run_test.go](https://github.com/looprig/tui/blob/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime/run_test.go)

Run `GOWORK=off go test ./...` from the `tui` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
