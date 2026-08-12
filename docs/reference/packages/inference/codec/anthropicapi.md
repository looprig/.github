---
id: reference/packages/inference/codec/anthropicapi
title: anthropicapi package · codec/anthropicapi
description: Reference for the anthropicapi package at github.com/looprig/inference/codec/anthropicapi, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 103
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

# anthropicapi package · codec/anthropicapi

Import path: `github.com/looprig/inference/codec/anthropicapi`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DecodeResponse(body []byte) (*inference.Response, error)`
- `func EncodeRequest(req inference.Request, stream bool) ([]byte, error)`
- `func MatchCountTokensRequest(req *http.Request) bool`
- `func DecodeCountTokensRequest(req *http.Request) (codec.DecodedRequest, error)`
- `func WriteCountTokensResponse(w http.ResponseWriter, inputTokens int) error`

### Methods {#methods}

- `func (Codec) MatchRequest(req *http.Request) bool`
- `func (Codec) DecodeRequest(req *http.Request) (codec.DecodedRequest, error)`
- `func (Codec) WriteResponse(w http.ResponseWriter, resp *inference.Response) error`
- `func (Codec) OpenStream(w http.ResponseWriter) (codec.StreamEncoder, error)`
- `func (Codec) WriteError(w http.ResponseWriter, err error)`
- `func (Codec) EncodeRequest(req inference.Request, mode codec.RequestMode) (codec.EncodedRequest, error)`
- `func (Codec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (Codec) DecodeEvent(event []byte) ([]content.Chunk, error)`
- `func (e *UnsupportedBlockError) Error() string`
- `func (e *UnsupportedConversationError) Error() string`
- `func (e *StreamAPIError) Error() string`
- `func (e *ServerDecodeError) Error() string`
- `func (e *DuplicateKeyError) Error() string`
- `func (e *StreamTerminatedError) Error() string`
- `func (e *UnsupportedChunkError) Error() string`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`

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
type StreamAPIError struct {
	Type    string
	Message string
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

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateKeyError`, `ServerDecodeError`, `StreamAPIError`, `StreamTerminatedError`, `UnsupportedBlockError`, `UnsupportedChunkError`, `UnsupportedConversationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/anthropicapi/codec.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/codec.go)
- [codec/anthropicapi/decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/decode.go)
- [codec/anthropicapi/encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/encode.go)
- [codec/anthropicapi/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/errors.go)
- [codec/anthropicapi/server_decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_decode.go)
- [codec/anthropicapi/server_encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_encode.go)
- [codec/anthropicapi/server_error.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_error.go)
- [codec/anthropicapi/server_stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_stream.go)
- [codec/anthropicapi/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/stream.go)
- [codec/anthropicapi/types.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/types.go)

Adjacent tests at the same commit:

- [codec/anthropicapi/codec_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/codec_test.go)
- [codec/anthropicapi/decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/decode_test.go)
- [codec/anthropicapi/encode_cache_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/encode_cache_test.go)
- [codec/anthropicapi/encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/encode_test.go)
- [codec/anthropicapi/fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/fuzz_test.go)
- [codec/anthropicapi/server_decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_decode_test.go)
- [codec/anthropicapi/server_encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_encode_test.go)
- [codec/anthropicapi/server_fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_fuzz_test.go)
- [codec/anthropicapi/server_roundtrip_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_roundtrip_test.go)
- [codec/anthropicapi/server_stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/server_stream_test.go)
- [codec/anthropicapi/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/anthropicapi/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
