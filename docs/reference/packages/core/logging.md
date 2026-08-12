---
id: reference/packages/core/logging
title: logging package · logging
description: Reference for the logging package at github.com/looprig/core/logging, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 3
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

# logging package · logging

Import path: `github.com/looprig/core/logging`. The source is pinned to github.com/looprig/core@v0.5.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cfg Config) *slog.Logger`
- `func ParseLevel(s string) (slog.Level, error)`

### Methods {#methods}

- `func (e *LevelError) Error() string`

### Types {#types}

`Config`, `LevelError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `LevelError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [logging/logging.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/logging/logging.go)

Adjacent tests at the same commit:

- [logging/logging_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/logging/logging_test.go)

Run `GOWORK=off go test ./...` from the `core` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
