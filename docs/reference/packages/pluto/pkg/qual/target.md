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

Package target provides deterministic eval.Target fixtures for offline pack tests.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewScripted(name string, scripts map[string]Script) *Scripted`

### Methods {#methods}

- `func (s *Scripted) Name() string`
- `func (s *Scripted) Observe(_ context.Context, sc eval.Scenario) (eval.Observation, error)`
- `func (e *UnscriptedScenarioError) Error() string`

### Types {#types}

```go
type ToolCall struct {
	Name    eval.Name
	ID      string
	IsError bool
}
```

```go
type Structured struct {
	SchemaName     eval.Name
	SchemaRevision eval.Revision
}
```

```go
type StructuredErr struct {
	Schema eval.Revision
	Reason eval.StructuredErrorReason
}
```

```go
type Script struct {
	Reply         string
	Duration      time.Duration
	ToolCalls     []ToolCall
	Structured    *Structured
	StructuredErr *StructuredErr
	Err           error
}
```

```go
type Scripted struct {
	// contains filtered or unexported fields
}
```

```go
type UnscriptedScenarioError struct{}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnscriptedScenarioError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/qual/target/scripted.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted.go)

Adjacent tests at the same commit:

- [pkg/qual/target/scripted_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted_test.go)

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
