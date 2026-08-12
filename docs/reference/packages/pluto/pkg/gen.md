---
id: reference/packages/pluto/pkg/gen
title: Pluto scenario generation package
description: Structured-output scenario generation with preflight validation and partial acceptance.
audience: developer
section: reference
order: 257
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

# `github.com/looprig/pluto/pkg/gen`

Scenario generation package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen).

## Package role {#package-role}

`gen` turns a table and generation request into scenario documents. The generated scenarios are artifacts for a later evaluation run.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Append(path string, tableFile []byte, specs []packfile.ScenarioSpec, generatedBy string) ([]byte, error)`
- `func Generate(ctx context.Context, client inference.Client, req Request) (Result, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Request struct {
	Doc    *packfile.Document
	Table  string
	N      int
	Focus  string
	Intent string
	Model  model.Model
}
```

```go
type Result struct {
	Accepted  []packfile.ScenarioSpec
	Rejected  []Rejection
	InputText string
}
```

```go
type Rejection struct {
	ID     string
	Reason string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/gen/append.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen/append.go)
- [pkg/gen/gen.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen/gen.go)
- [pkg/gen/prompt.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen/prompt.go)

Adjacent tests at the same commit:

- [pkg/gen/append_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen/append_test.go)
- [pkg/gen/gen_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen/gen_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
