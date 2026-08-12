---
id: reference/packages/inference/wire/ndjson
title: ndjson package · wire/ndjson
description: Reference for the ndjson package at github.com/looprig/inference/wire/ndjson, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 120
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# ndjson package · wire/ndjson

Import path: `github.com/looprig/inference/wire/ndjson`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package ndjson frames a newline-delimited JSON body into one raw stream frame per line: StreamFrame.Data is the line's bytes and Name is empty.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Framer() codec.StreamFramer`
- `func DecodeStreamFrames(body io.ReadCloser) (*stream.StreamReader[stream.StreamFrame], error)`

### Methods {#methods}

- `func (e *FramerError) Error() string`
- `func (e *FramerError) Unwrap() error`

### Types {#types}

```go
type FramerError struct {
	Reason string
	Err    error
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `FramerError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [wire/ndjson/ndjson.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/wire/ndjson/ndjson.go)

Adjacent tests at the same commit:

- [wire/ndjson/ndjson_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/wire/ndjson/ndjson_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
