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
tokens. A malformed or unrepresentable usage payload — a null where a count is
required, a fraction, a negative, an out-of-range value, or a subset larger
than its gross total — returns a typed normalization error instead of a partial
response.

## Normalization

OpenAI Chat subtracts cached and cache-write subsets from gross prompt tokens.
Responses subtracts both cached input tokens and cache-write tokens. Anthropic
and Bedrock report cache subsets as separate fields. Gemini subtracts cached
content, adds the separately reported tool-use prompt tokens, and adds candidate
and thought output counts; its reported total is validated as a well-formed
count but is deliberately not reconciled against those components. No decode
path gates on the reasoning-within-output convention: a provider that reports
more reasoning tokens than output tokens has an accounting bug, not an invalid
response, so both counts are carried as reported. Test the convention with
`content.Usage.ReasoningWithinOutput()`.

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

- [`client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)
- [`openaiapi/decode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openaiapi/decode.go)
- [`openairesponses/decode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openairesponses/decode.go)
- [`geminiapi/decode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/geminiapi/decode.go)

Run `go test ./codec/...`.
