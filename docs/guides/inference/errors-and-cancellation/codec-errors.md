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
`UnsupportedBlockError`; Anthropic exposes `UnsupportedBlockError` and
`StreamAPIError`. Use `errors.As` and retain the original error chain.

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
choice, Gemini candidate, or Bedrock `output.message` fails instead. Provider
error envelopes are converted to `failure.APIError` or a stream API error.

## Source and proof

- [`openaiapi/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openaiapi/errors.go)
- [`openairesponses/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/errors.go)
- [`anthropicapi/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/errors.go)
- [`bedrockconverse/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/errors.go)

Run `go test ./codec/...`.
