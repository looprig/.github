---
id: reference/packages/eval/compare
title: compare package · compare
description: Reference for the compare package at github.com/looprig/eval/compare, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 401
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

# compare package · compare

Import path: `github.com/looprig/eval/compare`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Compare(baseline, candidate eval.Report) (Comparison, error)`

### Methods {#methods}

- `func (e *InvalidReportError) Error() string`
- `func (e *InvalidReportError) Unwrap() error`
- `func (e *NonFiniteMeasurementError) Error() string`
- `func (e *EvaluatorRevisionDriftError) Error() string`

### Types {#types}

```go
type CaseClass string
```

```go
type CaseKey struct {
	ScenarioID string
	Evaluator  eval.Name
}
```

```go
type TrialResult struct {
	TrialIndex   int
	Status       eval.AssessmentStatus
	Measurements []eval.Measurement
}
```

```go
type Distribution struct {
	Count int
	Mean  float64
	Min   float64
	Max   float64
}
```

```go
type MeasurementDelta struct {
	Name          eval.Name
	Unit          eval.Unit
	BaselineUnit  eval.Unit
	CandidateUnit eval.Unit
	UnitMismatch  bool
	Baseline      Distribution
	Candidate     Distribution
}
```

```go
type CaseComparison struct {
	Key               CaseKey
	Class             CaseClass
	Compatible        bool
	BaselineRevision  eval.Revision
	CandidateRevision eval.Revision
	Baseline          []TrialResult
	Candidate         []TrialResult
	Distributions     []MeasurementDelta
}
```

```go
type Comparison struct {
	Cases []CaseComparison
}
```

```go
type ComparisonSide string
```

```go
type InvalidReportError struct {
	Side ComparisonSide

	Cause error
}
```

```go
type NonFiniteMeasurementError struct{}
```

```go
type EvaluatorRevisionDriftError struct{}
```

### Constants {#constants}

`CaseAdded`, `CaseRemoved`, `CaseIncompatible`, `CaseErrored`, `CaseUnverified`, `CaseFailed`, `CaseChanged`, `CaseUnchanged`, `SideBaseline`, `SideCandidate`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `EvaluatorRevisionDriftError`, `InvalidReportError`, `NonFiniteMeasurementError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [compare/compare.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/compare/compare.go)
- [compare/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/compare/errors.go)

Adjacent tests at the same commit:

- [compare/compare_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/compare/compare_test.go)
- [compare/index_internal_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/compare/index_internal_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
