---
id: reference/packages/pluto/pkg/profile
title: Pluto profile package
description: Requirements, restrictions, and qualified/restricted/rejected/unverified profile dispositions.
audience: developer
section: reference
order: 261
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

# `github.com/looprig/pluto/pkg/profile`

Profile qualification package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile).

## Package role {#package-role}

Profiles turn a scorecard into an explicit disposition. They are policy inputs for qualification, not session authorization or live tool gates.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Evaluate(card Card, p Profile) (Result, error)`

### Methods {#methods}

- `func (d Disposition) Rank() int`
- `func (r Requirement) Validate() error`
- `func (p Profile) Validate() error`

### Types {#types}

```go
type Card interface {
	Dimensions() ([]qual.DimensionScore, error)
	FindingCount(code eval.FindingCode) int
	SeverityCount(s eval.Severity) int
}
```

```go
type Outcome string
```

```go
type RequirementResult struct {
	Requirement Requirement
	Outcome     Outcome
}
```

```go
type RestrictionResult struct {
	Restriction Restriction
	Applied     bool
}
```

```go
type Result struct {
	Profile      eval.Name
	Revision     eval.Revision
	Disposition  Disposition
	Requirements []RequirementResult
	Restrictions []RestrictionResult
}
```

```go
type Disposition string
```

```go
type Requirement struct {
	Dimension   eval.Name
	MinScore    *float64
	MinCoverage *float64

	FindingCode     eval.FindingCode
	MaxFindingCount *int

	Severity         eval.Severity
	MaxSeverityCount *int
}
```

```go
type Restriction struct {
	Description string
	Requirement Requirement
}
```

```go
type Profile struct {
	Name         eval.Name
	Revision     eval.Revision
	Requirements []Requirement
	Restrictions []Restriction
}
```

### Constants {#constants}

`Met`, `Violated`, `Undecided`, `Qualified`, `Restricted`, `Rejected`, `Unverified`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/profile/evaluate.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile/evaluate.go)
- [pkg/profile/profile.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile/profile.go)

Adjacent tests at the same commit:

- [pkg/profile/evaluate_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile/evaluate_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
