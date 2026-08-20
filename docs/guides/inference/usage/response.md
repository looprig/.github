---
id: guides/inference/usage/response
title: Response usage
description: Read normalized usage from a complete inference response.
audience: developer
section: guides
order: 93
publication: released
proofs:
  shape: [release-github-com-looprig-inference]
  normalization: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Response Usage

`inference.Response` carries the same usage pointer both at the response level
and, when present, on its `content.AIMessage`. The bundled decoders clone the
normalized value for the message so callers do not share mutable pointer state.

## Shape

```go
type Response struct {
	Message      *content.AIMessage
	Usage        *content.Usage
	Model        string
	FinishReason stream.FinishReason
	Attempts     int
}
```

`Usage == nil` means the provider did not report usage. It does not mean zero
tokens. A malformed or inconsistent usage payload returns a typed normalization
error instead of a partial response.

## Normalization

OpenAI Chat subtracts cached and cache-write subsets from gross prompt tokens.
Responses subtracts cached input tokens and has no creation field. Anthropic
and Bedrock report cache subsets as separate fields. Gemini subtracts cached
content, adds candidate and thought output counts, and checks the reported
total. All paths call `usagenorm.ValidateUsage` and then the core usage
validation.

```go
if response.Usage == nil {
	// Provider did not report usage; retain nil in telemetry.
	return nil
}
contextTokens, err := response.Usage.ContextTokens()
if err != nil {
	return err
}
fmt.Println(contextTokens)
```

## Source and proof

- [`client.go`](https://github.com/looprig/inference/blob/v0.12.0/client.go)
- [`openaiapi/decode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openaiapi/decode.go)
- [`openairesponses/decode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openairesponses/decode.go)
- [`geminiapi/decode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/geminiapi/decode.go)

Run `go test ./codec/...`.
