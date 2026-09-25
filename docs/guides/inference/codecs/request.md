---
id: guides/inference/codecs/request
title: Request codecs
description: Encode the neutral Request with typed invoke and stream modes.
audience: developer
section: guides
order: 66
publication: released
proofs:
  mode: [release-github-com-looprig-inference]
  validation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Request Codecs

Request encoders translate the provider-neutral `inference.Request` after
feature validation. `RequestModeInvoke` and `RequestModeStream` are typed
values, not an unstructured boolean.

## Mode

```go
type RequestMode uint8

const (
	RequestModeInvoke RequestMode = iota
	RequestModeStream
)

func (Codec) EncodeRequest(
	req inference.Request,
	mode codec.RequestMode,
) (codec.EncodedRequest, error)
```

OpenAI Chat, OpenAI Responses, and Anthropic put streaming in the JSON body.
Gemini and Bedrock use the same JSON body in both modes; their route and
response framing select streaming. Every bundled encoder returns
`Content-Type: application/json` and a body reader.

## Validation

Encoders call `inference.ValidateRequestFeatures` before marshaling. That check
rejects a transient-message count outside the message slice, a named tool
choice whose name matches no declared tool, required tool choice without tools,
unsupported image input, invalid structured-output schemas, duplicate tool
names, and capabilities the model does not advertise. Dialect encoders then reject blocks they cannot represent,
returning a typed `UnsupportedBlockError` or equivalent rather than dropping
data.

```go
body, err := openaiapi.EncodeRequest(req, false)
if err != nil {
	var unsupported *openaiapi.UnsupportedBlockError
	if errors.As(err, &unsupported) {
		// Decide whether to remove the block or choose another model.
	}
	return err
}
_ = body // JSON bytes are consumed once by the transport.
```

## Source and proof

- [`codec/requestmode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/requestmode.go)
- [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)
- [`openaiapi/encode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openaiapi/encode.go)
- [`openaiapi/encode_test.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openaiapi/encode_test.go)

Run `go test ./codec/openaiapi ./codec/openairesponses ./codec/anthropicapi ./codec/geminiapi ./codec/bedrockconverse`.
