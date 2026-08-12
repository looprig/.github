---
id: reference/packages/inference/codec
title: codec package · codec
description: Reference for the codec package at github.com/looprig/inference/codec, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 102
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

# codec package · codec

Import path: `github.com/looprig/inference/codec`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package codec exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type EncodedRequest struct {
	Header http.Header
	Body   io.Reader
}
```

```go
type RequestEncoder interface {
	EncodeRequest(req inference.Request, mode RequestMode) (EncodedRequest, error)
}
```

```go
type ResponseDecoder interface {
	DecodeResponse(body []byte) (*inference.Response, error)
}
```

```go
type StreamFramer interface {
	DecodeStreamFrames(body io.ReadCloser) (*stream.StreamReader[stream.StreamFrame], error)
}
```

```go
type StreamDecoder interface {
	DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)
}
```

```go
type Codec interface {
	RequestEncoder
	ResponseDecoder
}
```

```go
type StreamingCodec interface {
	Codec
	StreamDecoder
}
```

```go
type DecodedRequest struct {
	Request        inference.Request
	RequestedModel string
	Streaming      bool
}
```

```go
type ServerCodec interface {
	// MatchRequest reports whether req's method and path belong to this codec's
	// dialect. It must not consume req.Body.
	MatchRequest(req *http.Request) bool

	// DecodeRequest decodes a matched request into a DecodedRequest. It owns
	// semantic validation of the native request shape, including rejecting an
	// unsupported Content-Type and malformed bodies, and must never panic on
	// malformed input.
	DecodeRequest(req *http.Request) (DecodedRequest, error)

	// WriteResponse encodes a complete non-streaming inference.Response as this
	// dialect's native successful HTTP response.
	WriteResponse(w http.ResponseWriter, resp *inference.Response) error

	// OpenStream begins this dialect's native streaming HTTP response and
	// returns a request-scoped StreamEncoder for the remainder of the stream.
	// Once called, the returned StreamEncoder owns w until Finish or Fail is
	// called.
	OpenStream(w http.ResponseWriter) (StreamEncoder, error)

	// WriteError encodes err as this dialect's native error envelope, including
	// its HTTP status code. It must not panic regardless of the concrete error
	// type.
	WriteError(w http.ResponseWriter, err error)
}
```

```go
type StreamEncoder interface {
	// WriteChunk encodes and flushes one content.Chunk as a native stream event.
	WriteChunk(chunk content.Chunk) error

	// Finish encodes the dialect's native stream-completion event(s) from
	// authoritative terminal metadata and closes the stream cleanly.
	Finish(result stream.StreamResult) error

	// Fail encodes a native in-stream error event, if the dialect distinguishes
	// one, and closes the stream.
	Fail(err error) error
}
```

```go
type RequestMode uint8
```

### Constants {#constants}

`RequestModeInvoke`, `RequestModeStream`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/contracts.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/contracts.go)
- [codec/requestmode.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/requestmode.go)

Adjacent tests at the same commit:

- [codec/contracts_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/codec/contracts_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
