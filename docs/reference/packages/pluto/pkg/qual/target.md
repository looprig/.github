---
id: reference/packages/pluto/pkg/qual/target
title: Pluto scripted target package
description: Deterministic scripted observations for offline Pluto qualification tests.
audience: developer
section: reference
order: 263
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  functions: release-github-com-looprig-pluto
  methods: release-github-com-looprig-pluto
  types: release-github-com-looprig-pluto
  constants: release-github-com-looprig-pluto
  variables: release-github-com-looprig-pluto
  ownership-and-errors: release-github-com-looprig-pluto
  source-and-runnable-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/qual/target`

Deterministic target fixture in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target).

## Package role {#package-role}

The package implements a scripted `qual.Target` for offline table and profile tests. It replaces a provider call with a declared observation script; it is not a production provider.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewScripted(name string, scripts map[string]Script) *Scripted`

### Methods {#methods}

- `func (s *Scripted) Name() string`
- `func (s *Scripted) Observe(_ context.Context, sc eval.Scenario) (eval.Observation, error)`
- `func (e *UnscriptedScenarioError) Error() string`

### Types {#types}

`ToolCall`, `Structured`, `StructuredErr`, `Script`, `Scripted`, `UnscriptedScenarioError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnscriptedScenarioError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/qual/target/scripted.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted.go)

Adjacent tests at the same commit:

- [pkg/qual/target/scripted_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
