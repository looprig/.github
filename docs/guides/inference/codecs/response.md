---
id: guides/inference/codecs/response
title: Response codecs
description: Normalize native response envelopes into Response and Usage values.
audience: developer
section: guides
order: 67
publication: released
proofs:
  normalization: [release-github-com-looprig-inference]
  terminal: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Response Codecs

Response decoders parse an already-drained successful body and return a
provider-neutral `*inference.Response`. The transport owns HTTP status and
body limits, so a decoder sees only the bytes for a successful response.

## Normalization

Every bundled decoder preserves ordered text, thinking, tool-use, and tool
result blocks where the dialect has a representation. Provider token fields
are normalized into `usage.Usage`, which is an alias for `content.Usage`:

| Neutral field | Meaning |
| --- | --- |
| `InputTokens` | uncached input tokens after subtracting cache-read and cache-creation subsets when the provider reports gross input |
| `OutputTokens` | generated tokens, including dialect-specific reasoning when the provider reports it as part of output |
| `CacheReadTokens` | input tokens served from a provider cache |
| `CacheCreationTokens` | input tokens written to a provider cache |
| `ReasoningTokens` | reasoning or thought tokens when reported |

Decoders validate nonnegative counts, subset relationships, overflow, and the
domain rule that reasoning cannot exceed output.

```go
response, err := (openaiapi.Codec{}).DecodeResponse(body)
if err != nil {
	return err
}
if response.Usage != nil {
	contextTokens, err := response.Usage.ContextTokens()
	if err != nil {
		return err
	}
	fmt.Println(contextTokens)
}
```

## Terminal

Finish reasons are mapped to the shared `stream.FinishReason` values
`stop`, `length`, `tool_use`, and `content_filter`; unknown provider values
become the zero `FinishReasonUnknown`. Empty output is valid for Anthropic and
Responses, while OpenAI Chat, Gemini, and malformed Bedrock envelopes return
typed/API errors when required response structure is absent.

## Source and proof

- [`openaiapi/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openaiapi/decode.go)
- [`openairesponses/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/decode.go)
- [`anthropicapi/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/decode.go)
- [`geminiapi/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/geminiapi/decode.go)
- [`bedrockconverse/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/decode.go)

Run `go test ./codec/...`.
