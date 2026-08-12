---
id: reference/packages/eval/exact
title: exact package · exact
description: Reference for the exact package at github.com/looprig/eval/exact, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 404
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

# exact package · exact

Import path: `github.com/looprig/eval/exact`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func MaxErrorRate(r float64) RateOption`
- `func ToolErrorRate(opts ...RateOption) eval.Evaluator`
- `func MaxDuration(limit time.Duration) eval.Evaluator`
- `func SchemaResult() eval.Evaluator`
- `func RequiredText(substrings ...string) eval.Evaluator`
- `func ForbiddenText(substrings ...string) eval.Evaluator`
- `func RequiredTool(name string) eval.Evaluator`
- `func ForbiddenTool(name string) eval.Evaluator`
- `func NoToolCall(name string) eval.Evaluator`

### Methods {#methods}

- `func (e toolErrorRate) Descriptor() eval.Descriptor`
- `func (e toolErrorRate) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`
- `func (e maxDuration) Descriptor() eval.Descriptor`
- `func (e maxDuration) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`
- `func (e schemaResult) Descriptor() eval.Descriptor`
- `func (e schemaResult) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`
- `func (e requiredText) Descriptor() eval.Descriptor`
- `func (e requiredText) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`
- `func (e forbiddenText) Descriptor() eval.Descriptor`
- `func (e forbiddenText) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`
- `func (e toolPresence) Descriptor() eval.Descriptor`
- `func (e toolPresence) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error)`

### Types {#types}

`RateOption`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [exact/operational.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/operational.go)
- [exact/structured.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/structured.go)
- [exact/text.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/text.go)
- [exact/tool.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/tool.go)

Adjacent tests at the same commit:

- [exact/operational_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/operational_test.go)
- [exact/structured_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/structured_test.go)
- [exact/text_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/text_test.go)
- [exact/tool_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/tool_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
