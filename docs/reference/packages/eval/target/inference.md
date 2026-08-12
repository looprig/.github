---
id: reference/packages/eval/target/inference
title: inference package · target/inference
description: Reference for the inference package at github.com/looprig/eval/target/inference, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 408
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-eval
  exported-surface: release-github-com-looprig-eval
  functions: release-github-com-looprig-eval
  methods: release-github-com-looprig-eval
  types: release-github-com-looprig-eval
  constants: release-github-com-looprig-eval
  variables: release-github-com-looprig-eval
  ownership-and-errors: release-github-com-looprig-eval
  source-and-runnable-proof: release-github-com-looprig-eval
---

# inference package · target/inference

Import path: `github.com/looprig/eval/target/inference`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithName(name eval.Name) Option`
- `func WithRevision(rev eval.Revision) Option`
- `func WithSubjectID(id string) Option`
- `func WithClock(now func() time.Time) Option`
- `func NewTarget(client llm.Client, template llm.Request, opts ...Option) eval.Target`

### Methods {#methods}

- `func (e *InferenceError) Error() string`
- `func (e *InferenceError) Unwrap() error`
- `func (e *EmptyResponseError) Error() string`
- `func (e *IdentityError) Error() string`
- `func (e *IdentityError) Unwrap() error`
- `func (e *ObservationInvalidError) Error() string`
- `func (e *ObservationInvalidError) Unwrap() error`

### Types {#types}

```go
type InferenceError struct {
	Cause error
}
```

```go
type EmptyResponseReason string
```

```go
type EmptyResponseError struct {
	Reason EmptyResponseReason
}
```

```go
type IdentityError struct {
	Cause error
}
```

```go
type ObservationInvalidError struct {
	Cause error
}
```

```go
type Option func(*options)
```

### Constants {#constants}

`ReasonNilResponse`, `ReasonNilMessage`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `EmptyResponseError`, `IdentityError`, `InferenceError`, `ObservationInvalidError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [target/inference/conform.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/conform.go)
- [target/inference/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/errors.go)
- [target/inference/project.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/project.go)
- [target/inference/target.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/target.go)

Adjacent tests at the same commit:

- [target/inference/conform_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/conform_test.go)
- [target/inference/target_integration_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/target_integration_test.go)
- [target/inference/target_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target/inference/target_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
