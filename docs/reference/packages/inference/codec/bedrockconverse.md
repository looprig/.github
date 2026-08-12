---
id: reference/packages/inference/codec/bedrockconverse
title: bedrockconverse package · codec/bedrockconverse
description: Reference for the bedrockconverse package at github.com/looprig/inference/codec/bedrockconverse, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 104
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

# bedrockconverse package · codec/bedrockconverse

Import path: `github.com/looprig/inference/codec/bedrockconverse`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func EncodeRequest(req inference.Request) ([]byte, error)`
- `func EncodeCountTokensInput(req inference.Request) ([]byte, error)`
- `func DecodeResponse(body []byte) (*inference.Response, error)`

### Methods {#methods}

- `func (Codec) EncodeRequest(req inference.Request, _ codec.RequestMode) (codec.EncodedRequest, error)`
- `func (Codec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (e *UnsupportedBlockError) Error() string`
- `func (e *UnsupportedConversationError) Error() string`
- `func (e *ToolSchemaError) Error() string`
- `func (e *ToolInputError) Error() string`
- `func (e *EncodeError) Error() string`
- `func (e *EncodeError) Unwrap() error`
- `func (e *DecodeError) Error() string`
- `func (e *DecodeError) Unwrap() error`
- `func (e *StreamDecodeError) Error() string`
- `func (e *StreamDecodeError) Unwrap() error`
- `func (e *StreamAPIError) Error() string`
- `func (Codec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

```go
type Codec struct{}
```

```go
type UnsupportedBlockError struct {
	Block  string
	Reason string
}
```

```go
type UnsupportedConversationError struct {
	Conversation string
}
```

```go
type ToolSchemaError struct {
	Tool   string
	Reason string
}
```

```go
type ToolInputError struct {
	Tool   string
	Reason string
}
```

```go
type EncodeError struct {
	Reason string
	Err    error
}
```

```go
type DecodeError struct {
	Reason string
	Err    error
}
```

```go
type StreamDecodeError struct {
	Reason string
	Err    error
}
```

```go
type StreamAPIError struct {
	Type    string
	Message string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DecodeError`, `EncodeError`, `StreamAPIError`, `StreamDecodeError`, `ToolInputError`, `ToolSchemaError`, `UnsupportedBlockError`, `UnsupportedConversationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/bedrockconverse/codec.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/codec.go)
- [codec/bedrockconverse/decode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/decode.go)
- [codec/bedrockconverse/encode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/encode.go)
- [codec/bedrockconverse/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/errors.go)
- [codec/bedrockconverse/stream.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/stream.go)
- [codec/bedrockconverse/types.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/types.go)

Adjacent tests at the same commit:

- [codec/bedrockconverse/decode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/decode_test.go)
- [codec/bedrockconverse/encode_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/encode_test.go)
- [codec/bedrockconverse/stream_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/bedrockconverse/stream_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
