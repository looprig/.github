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

Import path: `github.com/looprig/inference/codec/openaiapi`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package openaiapi exposes the source-defined API.

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
type UnsupportedChoiceCountError struct {
	N int
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
type ChatRequest struct {
	Model          string             `json:"model"`
	Messages       []chatMessage      `json:"messages"`
	Tools          []chatTool         `json:"tools,omitempty"`
	ResponseFormat *responseFormat    `json:"response_format,omitempty"`
	ToolChoice     string             `json:"tool_choice,omitempty"`
	Temperature    *float64           `json:"temperature,omitempty"`
	TopP           *float64           `json:"top_p,omitempty"`
	MaxTokens      *int               `json:"max_tokens,omitempty"`
	Stop           []string           `json:"stop,omitempty"`
	Stream         bool               `json:"stream,omitempty"`
	StreamOptions  *chatStreamOptions `json:"stream_options,omitempty"`

	ReasoningEffort string `json:"reasoning_effort,omitempty"`
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateKeyError`, `ServerDecodeError`, `StreamTerminatedError`, `UnsupportedBlockError`, `UnsupportedChoiceCountError`, `UnsupportedChunkError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/openaiapi/codec.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/codec.go)
- [codec/openaiapi/decode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/decode.go)
- [codec/openaiapi/encode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/encode.go)
- [codec/openaiapi/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/errors.go)
- [codec/openaiapi/server_decode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_decode.go)
- [codec/openaiapi/server_encode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_encode.go)
- [codec/openaiapi/server_stream.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_stream.go)
- [codec/openaiapi/stream.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/stream.go)
- [codec/openaiapi/types.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/types.go)

Adjacent tests at the same commit:

- [codec/openaiapi/codec_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/codec_test.go)
- [codec/openaiapi/decode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/decode_test.go)
- [codec/openaiapi/encode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/encode_test.go)
- [codec/openaiapi/encode_toolargs_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/encode_toolargs_test.go)
- [codec/openaiapi/encode_unsupported_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/encode_unsupported_test.go)
- [codec/openaiapi/fuzz_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/fuzz_test.go)
- [codec/openaiapi/server_decode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_decode_test.go)
- [codec/openaiapi/server_encode_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_encode_test.go)
- [codec/openaiapi/server_roundtrip_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_roundtrip_test.go)
- [codec/openaiapi/server_stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/server_stream_test.go)
- [codec/openaiapi/stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/openaiapi/stream_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
