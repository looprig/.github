---
id: guides/inference/codecs/custom
title: Custom codecs
description: Implement a stateless typed codec for a non-bundled wire dialect.
audience: developer
section: guides
order: 73
publication: released
proofs:
  contract: [release-github-com-looprig-inference]
  ownership: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Custom Codecs

Custom codecs plug into the same request, response, and optional streaming
contracts as the bundled dialects. Keep wire DTOs private to the package and
return bounded typed errors at representation boundaries.

## Contract

```go
type Codec struct{}

var _ codec.Codec = Codec{}

func (Codec) EncodeRequest(
	req inference.Request,
	mode codec.RequestMode,
) (codec.EncodedRequest, error) {
	// Build a fresh, single-use body for this attempt.
	return codec.EncodedRequest{}, nil
}
```

Implement `DecodeResponse` for invoke. Add `DecodeStream` only when the native
API has a stream; the returned reader must own and close the response body.
Implement `ServerCodec` too when the gateway must accept the native request.

## Ownership

The custom codec owns JSON or other wire transformations, event names, finish
reason mapping, and dialect-specific typed errors. The route owns method, URL,
query, and route headers. The transport owns authorization, context, status,
body limits, and never replays the body. Add tests for malformed input,
unsupported blocks, body-close-on-error, terminal stream metadata, and usage
normalization before registering the codec.

## Source and proof

- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/contracts.go)
- [`codec/requestmode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/requestmode.go)
- [`route/contracts.go`](https://github.com/looprig/inference/blob/v0.12.0/route/contracts.go)
- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.12.0/transport/client.go)

Run the custom package's tests with `go test ./codec ./route ./transport`.
