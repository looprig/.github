---
id: reference/packages/inference/codec/servertest
title: servertest package · codec/servertest
description: Reference for the servertest package at github.com/looprig/inference/codec/servertest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 108
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

# servertest package · codec/servertest

Import path: `github.com/looprig/inference/codec/servertest`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package servertest provides a reusable contract suite for codec.ServerCodec implementations.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Run(t *testing.T, cfg Config)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Factory func() codec.ServerCodec
```

```go
type Config struct {
	NewCodec Factory

	Method string
	Path   string

	ContentType string

	ValidBody []byte

	UnmatchedMethod string
	UnmatchedPath   string

	WrongContentType string

	MalformedBody []byte

	SampleResponse *inference.Response

	SampleChunks []content.Chunk

	SampleResult stream.StreamResult

	SampleError error

	ForeignProviderStateResponse *inference.Response
	ForeignProviderStateMarker   string
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

- [codec/servertest/contract.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/servertest/contract.go)

Adjacent tests at the same commit:

- [codec/servertest/contract_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/servertest/contract_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
