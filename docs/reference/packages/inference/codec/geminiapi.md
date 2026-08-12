---
id: reference/packages/inference/codec/geminiapi
title: geminiapi package · codec/geminiapi
description: Reference for the geminiapi package at github.com/looprig/inference/codec/geminiapi, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 105
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

# geminiapi package · codec/geminiapi

Import path: `github.com/looprig/inference/codec/geminiapi`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DecodeResponse(body []byte) (*inference.Response, error)`
- `func BuildGenerateContentRequest(req inference.Request) (GenerateContentRequest, error)`
- `func EncodeRequest(req inference.Request) ([]byte, error)`

### Methods {#methods}

- `func (Codec) MatchRequest(req *http.Request) bool`
- `func (Codec) DecodeRequest(req *http.Request) (codec.DecodedRequest, error)`
- `func (Codec) WriteResponse(w http.ResponseWriter, resp *inference.Response) error`
- `func (Codec) OpenStream(w http.ResponseWriter) (codec.StreamEncoder, error)`
- `func (Codec) WriteError(w http.ResponseWriter, err error)`
- `func (Codec) EncodeRequest(req inference.Request, _ codec.RequestMode) (codec.EncodedRequest, error)`
- `func (Codec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (Codec) DecodeEvent(event []byte) ([]content.Chunk, error)`
- `func (e *EncodeError) Error() string`
- `func (e *EncodeError) Unwrap() error`
- `func (e *UnsupportedBlockError) Error() string`
- `func (e *DecodeError) Error() string`
- `func (e *DecodeError) Unwrap() error`
- `func (e *ServerDecodeError) Error() string`
- `func (e *DuplicateKeyError) Error() string`
- `func (e *StreamTerminatedError) Error() string`
- `func (e *UnsupportedChunkError) Error() string`
- `func (e *serverStreamEncoder) WriteChunk(chunk content.Chunk) error`
- `func (e *serverStreamEncoder) Finish(result stream.StreamResult) error`
- `func (e *serverStreamEncoder) Fail(err error) error`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

`Codec`, `EncodeError`, `UnsupportedBlockError`, `DecodeError`, `ServerDecodeError`, `DuplicateKeyError`, `StreamTerminatedError`, `UnsupportedChunkError`, `GenerateContentRequest`, `GenerateContentResponse`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `EncodeError`, `UnsupportedBlockError`, `DecodeError`, `ServerDecodeError`, `DuplicateKeyError`, `StreamTerminatedError`, `UnsupportedChunkError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/geminiapi/codec.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/codec.go)
- [codec/geminiapi/decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/decode.go)
- [codec/geminiapi/encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/encode.go)
- [codec/geminiapi/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/errors.go)
- [codec/geminiapi/server_decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_decode.go)
- [codec/geminiapi/server_encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_encode.go)
- [codec/geminiapi/server_stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_stream.go)
- [codec/geminiapi/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/stream.go)
- [codec/geminiapi/types.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/types.go)

Adjacent tests at the same commit:

- [codec/geminiapi/codec_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/codec_test.go)
- [codec/geminiapi/decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/decode_test.go)
- [codec/geminiapi/encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/encode_test.go)
- [codec/geminiapi/encode_toolresult_unsupported_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/encode_toolresult_unsupported_test.go)
- [codec/geminiapi/fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/fuzz_test.go)
- [codec/geminiapi/server_decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_decode_test.go)
- [codec/geminiapi/server_encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_encode_test.go)
- [codec/geminiapi/server_roundtrip_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_roundtrip_test.go)
- [codec/geminiapi/server_stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/server_stream_test.go)
- [codec/geminiapi/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/geminiapi/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
