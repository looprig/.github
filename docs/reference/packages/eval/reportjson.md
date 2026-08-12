---
id: reference/packages/eval/reportjson
title: reportjson package · reportjson
description: Reference for the reportjson package at github.com/looprig/eval/reportjson, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 406
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

# reportjson package · reportjson

Import path: `github.com/looprig/eval/reportjson`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Encode(r eval.Report) ([]byte, error)`
- `func Decode(data []byte) (eval.Report, error)`
- `func NewFileSink(dir string) *FileSink`

### Methods {#methods}

- `func (e *DecodedTargetError) Error() string`
- `func (c TargetErrorClass) Validate() error`
- `func (e *UnknownVersionError) Error() string`
- `func (e *ReportTooLargeError) Error() string`
- `func (e *MalformedReportError) Error() string`
- `func (e *NonFiniteValueError) Error() string`
- `func (e *InvalidReportError) Error() string`
- `func (e *InvalidReportError) Unwrap() error`
- `func (e *EncodeError) Error() string`
- `func (e *EncodeError) Unwrap() error`
- `func (e *InvalidReportIDError) Error() string`
- `func (e *PathEscapeError) Error() string`
- `func (e *PathEscapeError) Unwrap() error`
- `func (e *DirectoryError) Error() string`
- `func (e *DirectoryError) Unwrap() error`
- `func (e *WriteError) Error() string`
- `func (e *WriteError) Unwrap() error`
- `func (s *FileSink) WriteReport(ctx context.Context, r eval.Report) error`

### Types {#types}

```go
type TargetErrorClass string
```

```go
type DecodedTargetError struct {
	Class TargetErrorClass
}
```

```go
type UnknownVersionError struct {
	Version string
}
```

```go
type ReportTooLargeError struct {
	Size int
	Max  int
}
```

```go
type MalformedReportError struct {
	Reason string
}
```

```go
type NonFiniteValueError struct{}
```

```go
type InvalidReportError struct {
	Cause error
}
```

```go
type EncodeError struct {
	Cause error
}
```

```go
type InvalidReportIDError struct {
	Reason string
}
```

```go
type PathEscapeError struct {
	Dir   string
	Cause error
}
```

```go
type DirectoryError struct {
	Dir   string
	Cause error
}
```

```go
type WriteError struct {
	Cause error
}
```

```go
type FileSink struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`MaxReportBytes`, `TargetErrorTimeout`, `TargetErrorCancelled`, `TargetErrorInvalidObservation`, `TargetErrorFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DecodedTargetError`, `DirectoryError`, `EncodeError`, `InvalidReportError`, `InvalidReportIDError`, `MalformedReportError`, `NonFiniteValueError`, `PathEscapeError`, `ReportTooLargeError`, `UnknownVersionError`, `WriteError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [reportjson/codec.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/codec.go)
- [reportjson/errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/errors.go)
- [reportjson/sink.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/sink.go)

Adjacent tests at the same commit:

- [reportjson/codec_fuzz_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/codec_fuzz_test.go)
- [reportjson/codec_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/codec_test.go)

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
