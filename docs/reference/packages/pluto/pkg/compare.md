---
id: reference/packages/pluto/pkg/compare
title: Pluto comparison package
description: Candidate and incumbent scorecard comparison with explicit unmatched and skipped cases.
audience: developer
section: reference
order: 256
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/compare`

Comparison package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/compare).

## Package role {#package-role}

The package compares two qualification scorecards without erasing differences in coverage. A baseline/candidate comparison is an analysis artifact, not an evaluation history.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Compare(candidate, incumbent qual.Scorecard) (Comparison, error)`

### Methods {#methods}

- `func (s Side) Validate() error`
- `func (e *RoleMismatchError) Error() string`

### Types {#types}

`Side`, `UnmatchedTable`, `TableComparison`, `Comparison`, `RoleMismatchError`

### Constants {#constants}

`SideCandidateOnly`, `SideIncumbentOnly`, `SideSkipped`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `RoleMismatchError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/compare/compare.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/compare/compare.go)

Adjacent tests at the same commit:

- [pkg/compare/compare_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/compare/compare_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
