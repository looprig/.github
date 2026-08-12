---
id: reference/packages/core/content/streamaccumulator
title: streamaccumulator package · content/streamaccumulator
description: Reference for the streamaccumulator package at github.com/looprig/core/content/streamaccumulator, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 2
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  package-role: release-github-com-looprig-core
  exported-surface: release-github-com-looprig-core
  functions-and-methods: release-github-com-looprig-core
  types: release-github-com-looprig-core
  constants-and-variables: release-github-com-looprig-core
  ownership-and-errors: release-github-com-looprig-core
  source-and-runnable-proof: release-github-com-looprig-core
---

# streamaccumulator package · content/streamaccumulator

Import path: `github.com/looprig/core/content/streamaccumulator`. The source is pinned to github.com/looprig/core@v0.5.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

- `func (a *Thinking) Add(chunk *content.ThinkingChunk)`
- `func (a Thinking) Block() *content.ThinkingBlock`
- `func (a Thinking) Empty() bool`
- `func (a *Text) Add(chunk *content.TextChunk)`
- `func (a Text) Block() *content.TextBlock`
- `func (a Text) Empty() bool`
- `func (a *ToolUses) Add(chunk *content.ToolUseChunk)`
- `func (a ToolUses) Blocks() []content.ToolUseBlock`
- `func (a ToolUses) Empty() bool`

### Types {#types}

`Thinking`, `Text`, `ToolUses`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [content/streamaccumulator/streamaccumulator.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/streamaccumulator/streamaccumulator.go)

Adjacent tests at the same commit:

- [content/streamaccumulator/streamaccumulator_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/streamaccumulator/streamaccumulator_test.go)

Run `GOWORK=off go test ./...` from the `core` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
