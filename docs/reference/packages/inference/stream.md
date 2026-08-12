---
id: reference/packages/inference/stream
title: stream package · stream
description: Reference for the stream package at github.com/looprig/inference/stream, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 115
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

# stream package · stream

Import path: `github.com/looprig/inference/stream`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func FramesToChunks(frames *StreamReader[StreamFrame], mapFrame func(StreamFrame) ([]content.Chunk, error)) *StreamReader[content.Chunk]`
- `func FramesToChunksWithResult(frames *StreamReader[StreamFrame], mapFrame func(StreamFrame) ([]content.Chunk, error), producer StreamResultProducer) *StreamReader[content.Chunk]`
- `func NewStreamReader[T any](next func() (T, error), closer func() error) *StreamReader[T]`
- `func NewStreamReaderWithResult[T any](next func() (T, error), closer func() error, producer StreamResultProducer) *StreamReader[T]`

### Methods {#methods}

- `func (e *StreamReaderError) Error() string`
- `func (e *StreamResultError) Error() string`
- `func (e *StreamResultError) Unwrap() error`
- `func (r *StreamReader[T]) Next() (T, error)`
- `func (r *StreamReader[T]) Result() (StreamResult, bool)`
- `func (r *StreamReader[T]) Close() error`

### Types {#types}

`FinishReason`, `StreamFrame`, `StreamResult`, `StreamResultProducer`, `StreamOperation`, `StreamReaderFailure`, `StreamReaderError`, `StreamResultError`, `StreamReader`

### Constants {#constants}

`FinishReasonUnknown`, `FinishReasonStop`, `FinishReasonLength`, `FinishReasonToolUse`, `FinishReasonContentFilter`, `StreamOperationNext`, `StreamOperationClose`, `StreamReaderFailureNilReceiver`, `StreamReaderFailureMissingNext`, `StreamReaderFailureMissingFrameMapper`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `StreamReaderError`, `StreamResultError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [stream/chunkstream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/chunkstream.go)
- [stream/finishreason.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/finishreason.go)
- [stream/frame.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/frame.go)
- [stream/result.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/result.go)
- [stream/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/stream.go)

Adjacent tests at the same commit:

- [stream/chunkstream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/chunkstream_test.go)
- [stream/result_attempts_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/result_attempts_test.go)
- [stream/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/stream/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
