---
id: reference/packages/eval/judge
title: judge package · judge
description: Reference for the judge package at github.com/looprig/eval/judge, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 405
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

# judge package · judge

Import path: `github.com/looprig/eval/judge`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

Package judge implements the structured-output model judge: an eval.Evaluator that scores a sample's conversation against a rubric by calling an inference.Client with strict structured output.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithMeasurementName(name eval.Name) Option`
- `func New(r rubric.Rubric, client inference.Client, template inference.Request, opts ...Option) eval.Evaluator`

### Methods {#methods}

- `func (e *UnsupportedStructuredOutputError) Error() string`
- `func (e *UnsupportedStructuredOutputError) Unwrap() error`
- `func (e *RequestInvalidError) Error() string`
- `func (e *RequestInvalidError) Unwrap() error`
- `func (e *InferenceError) Error() string`
- `func (e *InferenceError) Unwrap() error`
- `func (e *MalformedOutputError) Error() string`
- `func (e *MalformedOutputError) Unwrap() error`
- `func (e *ScoreRangeError) Error() string`
- `func (e *MessageIndexError) Error() string`
- `func (e *QuoteNotFoundError) Error() string`
- `func (e *RubricInvalidError) Error() string`
- `func (e *RubricInvalidError) Unwrap() error`

### Types {#types}

```go
type UnsupportedStructuredOutputError struct {
	Cause error
}
```

```go
type RequestInvalidError struct {
	Cause error
}
```

```go
type InferenceError struct {
	Cause error
}
```

```go
type MalformedOutputError struct {
	Reason eval.StructuredErrorReason
	Cause  error
}
```

```go
type ScoreRangeError struct {
	Score    float64
	Min      float64
	Max      float64
	HasScore bool
}
```

```go
type MessageIndexError struct {
	Index int
	Len   int
}
```

```go
type QuoteNotFoundError struct {
	Index int
}
```

```go
type RubricInvalidError struct {
	Cause error
}
```

```go
type Option func(*options)
```

```go
type QuotedEvidence struct {
	MessageIndex int    `json:"message_index"`
	Quote        string `json:"quote"`
}
```

```go
type ScoreOutput struct {
	Score    float64          `json:"score"`
	Reason   string           `json:"reason"`
	Evidence []QuotedEvidence `json:"evidence"`
}
```

### Constants {#constants}

`ScoreSchemaRevision`, `MaxReasonBytes`, `MaxEvidenceQuotes`, `MaxQuoteBytes`

### Variables {#variables}

`ScoreSchemaV1`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `InferenceError`, `MalformedOutputError`, `MessageIndexError`, `QuoteNotFoundError`, `RequestInvalidError`, `RubricInvalidError`, `ScoreRangeError`, `UnsupportedStructuredOutputError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [judge/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/errors.go)
- [judge/judge.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/judge.go)
- [judge/prompt.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/prompt.go)
- [judge/schema.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/schema.go)

Adjacent tests at the same commit:

- [judge/judge_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/judge_test.go)
- [judge/schema_fuzz_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/schema_fuzz_test.go)

Run `go test ./...` from a checkout of the `eval` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
