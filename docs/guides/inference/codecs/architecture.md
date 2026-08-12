---
id: guides/inference/codecs/architecture
title: Codec architecture
description: Understand request, response, server, and stream codec ownership.
audience: developer
section: guides
order: 65
publication: released
proofs:
  ownership: [release-github-com-looprig-inference]
  stream-lifetime: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Codec Architecture

The codec boundary is a typed composition of request encoding, response
decoding, and optional stream handling. It owns wire semantics only. The
transport owns HTTP status mapping, body limits, authorization, and the
request context.

## Ownership

```go
type EncodedRequest struct {
	Header http.Header
	Body   io.Reader // consumed exactly once
}

type RequestEncoder interface {
	EncodeRequest(inference.Request, RequestMode) (EncodedRequest, error)
}

type ResponseDecoder interface {
	DecodeResponse([]byte) (*inference.Response, error)
}

type StreamDecoder interface {
	DecodeStream(*http.Response) (*stream.StreamReader[content.Chunk], error)
}

type Codec interface {
	RequestEncoder
	ResponseDecoder
}
```

`Codec` intentionally does not embed `StreamDecoder`, so a non-streaming API
can satisfy the one-shot contract without a fake stream implementation.
`StreamingCodec` adds the optional decoder. `EncodedRequest.Body` is single-use;
the transport clears `http.Request.GetBody` and never retries it itself.

## Stream lifetime

`DecodeStream` takes ownership of `resp.Body`. A successful return transfers
close responsibility to the returned reader. If framing or decoder setup fails
before a reader is returned, the decoder must close the body. The reader exposes
chunks through `Next`, publishes terminal metadata only after clean `io.EOF`,
and requires callers to call `Close` even after EOF.

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f9fafb","primaryBorderColor":"#60a5fa","lineColor":"#94a3b8","secondaryColor":"#172033","tertiaryColor":"#0f172a","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
sequenceDiagram
    participant H as HTTP response
    participant C as Codec
    participant R as StreamReader
    H->>C: DecodeStream(resp)
    C->>R: frame and map body
    C-->>R: return reader
    R-->>C: Next() chunks
    R->>H: Close() owns body
```

## Source and proof

- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/contracts.go)
- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.9.2/transport/client.go)
- [`stream/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/stream.go)
- [`stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/chunkstream.go)

Run `go test ./codec/... ./stream/... ./transport/...`.
