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

Import path: `github.com/looprig/inference/codec`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

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
	MatchRequest(req *http.Request) bool

	DecodeRequest(req *http.Request) (DecodedRequest, error)

	WriteResponse(w http.ResponseWriter, resp *inference.Response) error

	OpenStream(w http.ResponseWriter) (StreamEncoder, error)

	WriteError(w http.ResponseWriter, err error)
}
```

```go
type StreamEncoder interface {
	WriteChunk(chunk content.Chunk) error

	Finish(result stream.StreamResult) error

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

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [codec/contracts.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/contracts.go)
- [codec/requestmode.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/requestmode.go)

Adjacent tests at the same commit:

- [codec/contracts_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/codec/contracts_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
