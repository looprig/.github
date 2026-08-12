---
id: reference/packages/pluto/pkg/plutotest
title: Pluto test package
description: Offline testing helpers for running a Pluto pack and checking qualification dispositions.
audience: developer
section: reference
order: 259
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

# `github.com/looprig/pluto/pkg/plutotest`

Testing helpers in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest).

## Package role {#package-role}

Package plutotest wires a Pluto pack execution into ordinary go test, and gates a test on the derived qualification disposition.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Run(t *testing.T, spec RunSpec) qual.Scorecard`
- `func RequireDisposition(t *testing.T, card qual.Scorecard, p profile.Profile, allowed ...profile.Disposition)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type RunSpec struct {
	Manifest qual.Manifest
	Packs    []qual.Pack
	Target   eval.Target
	Trials   int
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/plutotest/run.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest/run.go)

Adjacent tests at the same commit:

- [pkg/plutotest/card_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest/card_test.go)
- [pkg/plutotest/run_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest/run_test.go)

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
