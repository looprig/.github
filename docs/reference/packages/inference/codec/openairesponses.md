---
id: reference/packages/inference/codec/openairesponses
title: openairesponses package · codec/openairesponses
description: Reference for the openairesponses package at github.com/looprig/inference/codec/openairesponses, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 107
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

# openairesponses package · codec/openairesponses

Import path: `github.com/looprig/inference/codec/openairesponses`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package openairesponses is the OpenAI Responses API wire dialect (POST /v1/responses): a genuinely different, items-based shape from OpenAI Chat Completions (codec/openaiapi), not a flat messages array.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DecodeResponse(body []byte) (*inference.Response, error)`
- `func EncodeRequest(req inference.Request, stream bool) ([]byte, error)`

### Methods {#methods}

- `func (Codec) MatchRequest(req *http.Request) bool`
- `func (Codec) DecodeRequest(req *http.Request) (codec.DecodedRequest, error)`
- `func (Codec) WriteResponse(w http.ResponseWriter, resp *inference.Response) error`
- `func (Codec) OpenStream(w http.ResponseWriter) (codec.StreamEncoder, error)`
- `func (Codec) WriteError(w http.ResponseWriter, err error)`
- `func (Codec) EncodeRequest(req inference.Request, mode codec.RequestMode) (codec.EncodedRequest, error)`
- `func (Codec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (e *UnsupportedBlockError) Error() string`
- `func (e *UnsupportedConversationError) Error() string`
- `func (e *ServerDecodeError) Error() string`
- `func (e *DuplicateKeyError) Error() string`
- `func (e *StreamTerminatedError) Error() string`
- `func (e *UnsupportedChunkError) Error() string`
- `func (e *StreamAPIError) Error() string`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`
- `func (Codec) DecodeEvent(event []byte) ([]content.Chunk, error)`

### Types {#types}

```go
type Codec struct{}
```

```go
type UnsupportedBlockError struct {
	Block string
}
```

```go
type UnsupportedConversationError struct {
	Conversation string
}
```

```go
type ServerDecodeError struct {
	Reason string
	Detail string
}
```

```go
type DuplicateKeyError struct {
	Key string
}
```

```go
type StreamTerminatedError struct{}
```

```go
type UnsupportedChunkError struct {
	Chunk string
}
```

```go
type StreamAPIError struct {
	Code    string
	Message string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateKeyError`, `ServerDecodeError`, `StreamAPIError`, `StreamTerminatedError`, `UnsupportedBlockError`, `UnsupportedChunkError`, `UnsupportedConversationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/openairesponses/codec.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/codec.go)
- [codec/openairesponses/decode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/decode.go)
- [codec/openairesponses/encode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/encode.go)
- [codec/openairesponses/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/errors.go)
- [codec/openairesponses/server_decode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_decode.go)
- [codec/openairesponses/server_encode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_encode.go)
- [codec/openairesponses/server_error.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_error.go)
- [codec/openairesponses/server_stream.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_stream.go)
- [codec/openairesponses/stream.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/stream.go)
- [codec/openairesponses/types.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/types.go)

Adjacent tests at the same commit:

- [codec/openairesponses/decode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/decode_test.go)
- [codec/openairesponses/encode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/encode_test.go)
- [codec/openairesponses/fuzz_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/fuzz_test.go)
- [codec/openairesponses/server_decode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_decode_test.go)
- [codec/openairesponses/server_encode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_encode_test.go)
- [codec/openairesponses/server_roundtrip_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_roundtrip_test.go)
- [codec/openairesponses/server_stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/server_stream_test.go)
- [codec/openairesponses/stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openairesponses/stream_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
