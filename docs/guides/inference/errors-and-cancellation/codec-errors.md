---
id: guides/inference/errors-and-cancellation/codec-errors
title: Codec errors
description: Handle malformed wire bodies and unsupported content with dialect-specific typed errors.
audience: developer
section: guides
order: 101
publication: released
proofs:
  encode: [release-github-com-looprig-inference]
  decode: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Codec Errors

Codec errors belong to the dialect because only the dialect knows whether a
block, union variant, or response field is valid.

## Encode

Encoders return typed unsupported-block or unsupported-conversation errors.
Bedrock additionally exposes `ToolSchemaError`, `ToolInputError`, and
`EncodeError`; OpenAI Responses exposes `ServerDecodeError` and
`UnsupportedBlockError`; Anthropic exposes a large typed set in its own
`errors.go`, including `UnsupportedBlockError`, `UnsupportedEffortError`,
`UnsupportedAudioError`, `UnsupportedRefusalError`,
`UndeclaredThinkingDialectError`, `ThinkingBudgetError`,
`UnsupportedConversationError`, `StreamEventDecodeError`, and `StreamAPIError`.
Read each dialect's `errors.go` for its full set rather than treating any list
here as exhaustive. Use `errors.As` and retain the original error chain.

```go
body, err := anthropicapi.EncodeRequest(req, false)
if err != nil {
	var unsupported *anthropicapi.UnsupportedConversationError
	if errors.As(err, &unsupported) {
		return fmt.Errorf("remove conversation %s: %w", unsupported.Conversation, err)
	}
	return err
}
_ = body
```

## Decode

Malformed JSON is returned by the decoder or wrapped in the dialect's decode
error. Unknown response block/item types are skipped where the package
documents tolerant decoding; required structure such as an absent OpenAI
choice or Bedrock `output.message` fails instead. A candidate-less Gemini body
becomes a `PromptBlockedError` carrying an allowlisted block reason, safety
ratings, and the charged usage when `promptFeedback` explains itself, and a bare
`failure.APIError` otherwise. Provider
error envelopes are converted to `failure.APIError` or a stream API error.

## Source and proof

- [`openaiapi/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/openaiapi/errors.go)
- [`openairesponses/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/openairesponses/errors.go)
- [`anthropicapi/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/anthropicapi/errors.go)
- [`bedrockconverse/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/bedrockconverse/errors.go)

Run `go test ./codec/...`.
