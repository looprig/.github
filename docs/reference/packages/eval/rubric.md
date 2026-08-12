---
id: reference/packages/eval/rubric
title: rubric package · rubric
description: Reference for the rubric package at github.com/looprig/eval/rubric, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 407
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

# rubric package · rubric

Import path: `github.com/looprig/eval/rubric`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

Package rubric declares evaluation rubrics: the trusted definition of what "good" means for a model judge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Catalog() []Rubric`

### Methods {#methods}

- `func (e *ValidationError) Error() string`
- `func (e *DuplicateCriterionError) Error() string`
- `func (c Criterion) Validate() error`
- `func (r Rubric) Validate() error`
- `func (r Rubric) ScoreRange() (float64, float64)`
- `func (r Rubric) PassThreshold() float64`

### Types {#types}

```go
type ValidationError struct {
	Field string

	Reason string
}
```

```go
type DuplicateCriterionError struct{}
```

```go
type Criterion struct {
	ID          eval.Name
	Description string
	MinScore    float64
	MaxScore    float64
}
```

```go
type Anchor struct {
	Score       float64
	Label       eval.Name
	Description string
}
```

```go
type Rubric struct {
	Name       eval.Name
	Revision   eval.Revision
	Scope      eval.Scope
	Definition string
	Criteria   []Criterion
	Anchors    []Anchor
}
```

### Constants {#constants}

`MaxDefinitionBytes`, `MaxCriterionDescriptionBytes`, `MaxAnchorDescriptionBytes`, `MaxCriteria`, `MaxAnchors`

### Variables {#variables}

`AnswerRelevanceV1`, `GroundednessV1`, `InstructionAdherenceV1`, `GoalAdherenceV1`, `ToxicityV1`, `VulgarityV1`, `InternetUseAppropriatenessV1`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateCriterionError`, `ValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [rubric/catalog.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/rubric/catalog.go)
- [rubric/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/rubric/errors.go)
- [rubric/rubric.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/rubric/rubric.go)

Adjacent tests at the same commit:

- [rubric/rubric_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/rubric/rubric_test.go)

Run `go test ./...` from a checkout of the `eval` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
