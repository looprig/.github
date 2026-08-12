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
  functions-and-methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants-and-variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# openairesponses package · codec/openairesponses

Import path: `github.com/looprig/inference/codec/openairesponses`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

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
- `func (e *serverStreamEncoder) WriteChunk(chunk content.Chunk) error`
- `func (e *serverStreamEncoder) Finish(result stream.StreamResult) error`
- `func (e *serverStreamEncoder) Fail(err error) error`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`
- `func (Codec) DecodeEvent(event []byte) ([]content.Chunk, error)`

### Types {#types}

`Codec`, `UnsupportedBlockError`, `UnsupportedConversationError`, `ServerDecodeError`, `DuplicateKeyError`, `StreamTerminatedError`, `UnsupportedChunkError`, `StreamAPIError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnsupportedBlockError`, `UnsupportedConversationError`, `ServerDecodeError`, `DuplicateKeyError`, `StreamTerminatedError`, `UnsupportedChunkError`, `StreamAPIError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/openairesponses/codec.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/codec.go)
- [codec/openairesponses/decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/decode.go)
- [codec/openairesponses/encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/encode.go)
- [codec/openairesponses/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/errors.go)
- [codec/openairesponses/server_decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_decode.go)
- [codec/openairesponses/server_encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_encode.go)
- [codec/openairesponses/server_error.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_error.go)
- [codec/openairesponses/server_stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_stream.go)
- [codec/openairesponses/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/stream.go)
- [codec/openairesponses/types.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/types.go)

Adjacent tests at the same commit:

- [codec/openairesponses/decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/decode_test.go)
- [codec/openairesponses/encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/encode_test.go)
- [codec/openairesponses/fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/fuzz_test.go)
- [codec/openairesponses/server_decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_decode_test.go)
- [codec/openairesponses/server_encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_encode_test.go)
- [codec/openairesponses/server_roundtrip_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_roundtrip_test.go)
- [codec/openairesponses/server_stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/server_stream_test.go)
- [codec/openairesponses/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/openairesponses/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
