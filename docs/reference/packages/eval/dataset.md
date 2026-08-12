---
id: reference/packages/eval/dataset
title: dataset package · dataset
description: Reference for the dataset package at github.com/looprig/eval/dataset, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 402
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

# dataset package · dataset

Import path: `github.com/looprig/eval/dataset`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Load(ctx context.Context, dir, name string) (*Dataset, error)`
- `func Decode(ctx context.Context, r io.Reader, name string) (*Dataset, error)`
- `func Encode(w io.Writer, scenarios []eval.Scenario) error`
- `func DecodeRecord(data []byte) (eval.Scenario, error)`
- `func EncodeRecord(sc eval.Scenario) ([]byte, error)`

### Methods {#methods}

- `func (e *UnknownVersionError) Error() string`
- `func (e *RecordTooLargeError) Error() string`
- `func (e *FileTooLargeError) Error() string`
- `func (e *MalformedRecordError) Error() string`
- `func (e *DuplicateScenarioError) Error() string`
- `func (e *InvalidScenarioError) Error() string`
- `func (e *InvalidScenarioError) Unwrap() error`
- `func (e *PathEscapeError) Error() string`
- `func (e *PathEscapeError) Unwrap() error`
- `func (e *OpenError) Error() string`
- `func (e *OpenError) Unwrap() error`
- `func (e *DirectoryError) Error() string`
- `func (e *DirectoryError) Unwrap() error`
- `func (e *ReadError) Error() string`
- `func (e *ReadError) Unwrap() error`
- `func (e *EncodeError) Error() string`
- `func (e *EncodeError) Unwrap() error`
- `func (e *WriteError) Error() string`
- `func (e *WriteError) Unwrap() error`

### Types {#types}

`Dataset`, `UnknownVersionError`, `RecordTooLargeError`, `FileTooLargeError`, `MalformedRecordError`, `DuplicateScenarioError`, `InvalidScenarioError`, `PathEscapeError`, `OpenError`, `DirectoryError`, `ReadError`, `EncodeError`, `WriteError`

### Constants {#constants}

`MaxRecordBytes`, `MaxFileBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownVersionError`, `RecordTooLargeError`, `FileTooLargeError`, `MalformedRecordError`, `DuplicateScenarioError`, `InvalidScenarioError`, `PathEscapeError`, `OpenError`, `DirectoryError`, `ReadError`, `EncodeError`, `WriteError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [dataset/dataset.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/dataset/dataset.go)
- [dataset/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/dataset/errors.go)
- [dataset/json.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/dataset/json.go)

Adjacent tests at the same commit:

- [dataset/json_fuzz_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/dataset/json_fuzz_test.go)
- [dataset/json_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/dataset/json_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
