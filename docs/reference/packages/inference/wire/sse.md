---
id: reference/packages/inference/wire/sse
title: sse package · wire/sse
description: Reference for the sse package at github.com/looprig/inference/wire/sse, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 121
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

# sse package · wire/sse

Import path: `github.com/looprig/inference/wire/sse`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

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

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `FramerError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [wire/sse/sse.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/wire/sse/sse.go)

Adjacent tests at the same commit:

- [wire/sse/sse_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/wire/sse/sse_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
