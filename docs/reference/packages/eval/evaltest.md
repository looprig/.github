---
id: reference/packages/eval/evaltest
title: evaltest package · evaltest
description: Reference for the evaltest package at github.com/looprig/eval/evaltest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 403
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

# evaltest package · evaltest

Import path: `github.com/looprig/eval/evaltest`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func RequirePass(tb TB, report eval.Report)`
- `func RequireVerified(tb TB, report eval.Report)`
- `func Run(tb TB, suite eval.Suite, target eval.Target, evaluators ...eval.Evaluator) eval.Report`
- `func RunScenario(tb TB, scenario eval.Scenario, target eval.Target, evaluators ...eval.Evaluator) eval.Report`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type TB interface {
	Helper()

	Logf(format string, args ...any)

	Errorf(format string, args ...any)
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

- [evaltest/assert.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaltest/assert.go)
- [evaltest/render.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaltest/render.go)
- [evaltest/run.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaltest/run.go)

Adjacent tests at the same commit:

- [evaltest/run_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaltest/run_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
