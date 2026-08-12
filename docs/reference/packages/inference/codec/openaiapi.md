---
id: reference/packages/inference/codec/openaiapi
title: openaiapi package · codec/openaiapi
description: Reference for the openaiapi package at github.com/looprig/inference/codec/openaiapi, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 106
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

# openaiapi package · codec/openaiapi

Import path: `github.com/looprig/inference/codec/openaiapi`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DecodeResponse(body []byte) (*inference.Response, error)`
- `func BuildChatRequest(req inference.Request, stream bool) (ChatRequest, error)`
- `func EncodeRequest(req inference.Request, stream bool) ([]byte, error)`
- `func NewStream(body io.ReadCloser) *stream.StreamReader[content.Chunk]`

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
- `func (e *ServerDecodeError) Error() string`
- `func (e *DuplicateKeyError) Error() string`
- `func (e *UnsupportedChoiceCountError) Error() string`
- `func (e *StreamTerminatedError) Error() string`
- `func (e *UnsupportedChunkError) Error() string`
- `func (c *wireChatContent) UnmarshalJSON(data []byte) error`
- `func (e *serverStreamEncoder) WriteChunk(chunk content.Chunk) error`
- `func (e *serverStreamEncoder) Finish(result stream.StreamResult) error`
- `func (e *serverStreamEncoder) Fail(err error) error`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

`Codec`, `UnsupportedBlockError`, `ServerDecodeError`, `DuplicateKeyError`, `UnsupportedChoiceCountError`, `StreamTerminatedError`, `UnsupportedChunkError`, `ChatRequest`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnsupportedBlockError`, `ServerDecodeError`, `DuplicateKeyError`, `UnsupportedChoiceCountError`, `StreamTerminatedError`, `UnsupportedChunkError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/openaiapi/codec.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/codec.go)
- [codec/openaiapi/decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/decode.go)
- [codec/openaiapi/encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/encode.go)
- [codec/openaiapi/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/errors.go)
- [codec/openaiapi/server_decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_decode.go)
- [codec/openaiapi/server_encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_encode.go)
- [codec/openaiapi/server_stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_stream.go)
- [codec/openaiapi/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/stream.go)
- [codec/openaiapi/types.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/types.go)

Adjacent tests at the same commit:

- [codec/openaiapi/codec_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/codec_test.go)
- [codec/openaiapi/decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/decode_test.go)
- [codec/openaiapi/encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/encode_test.go)
- [codec/openaiapi/encode_toolargs_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/encode_toolargs_test.go)
- [codec/openaiapi/encode_unsupported_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/encode_unsupported_test.go)
- [codec/openaiapi/fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/fuzz_test.go)
- [codec/openaiapi/server_decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_decode_test.go)
- [codec/openaiapi/server_encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_encode_test.go)
- [codec/openaiapi/server_roundtrip_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_roundtrip_test.go)
- [codec/openaiapi/server_stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/server_stream_test.go)
- [codec/openaiapi/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openaiapi/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
