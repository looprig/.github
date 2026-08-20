---
id: guides/inference/codecs/thinking
title: Thinking translation
description: Preserve or omit provider reasoning according to model capabilities and dialect rules.
audience: developer
section: guides
order: 71
publication: released
proofs:
  mapping: [release-github-com-looprig-inference]
  replay: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Thinking Translation

`model.Effort` is intent, not a wire field. Each codec maps it only when the
model advertises `Caps.Thinking`.

## Mapping

| Dialect | Enabled request fields | `EffortMax` behavior | Response block |
| --- | --- | --- | --- |
| OpenAI Chat | `reasoning_effort` | `max` | `reasoning_content` to `ThinkingBlock` |
| OpenAI Responses | `reasoning.effort`, `summary: auto` | `max` | reasoning item summary |
| Anthropic | `thinking: {type: adaptive}`, `output_config.effort` | `max` | `thinking` block with signature |
| Gemini | `thinkingConfig.thinkingBudget`, `includeThoughts` | `UnsupportedEffortError` | `thought: true` part |
| Bedrock | reasoning content text | `UnsupportedEffortError` | `reasoningContent` |

When capability or effort is unset, request-side reasoning fields are omitted.
Anthropic also omits `temperature` and `top_p` while adaptive thinking is
enabled because its current request shape rejects those fields together.

## Replay

Responses encrypted reasoning and Gemini thought signatures are opaque provider
state. They are carried only for a same-dialect replay; the codecs do not
interpret or cross-replay them. Anthropic signatures remain on the neutral
`ThinkingBlock.Signature`.

```go
req.Model.Caps.Thinking = true
req.Override = &model.Sampling{Effort: model.EffortMedium}
body, err := openairesponses.EncodeRequest(req, false)
if err != nil {
	return err
}
_ = body // includes reasoning and encrypted-content inclusion only when supported.
```

## Source and proof

- [`model/effort.go`](https://github.com/looprig/inference/blob/v0.12.0/model/effort.go)
- [`model/capabilities.go`](https://github.com/looprig/inference/blob/v0.12.0/model/capabilities.go)
- [`anthropicapi/encode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/anthropicapi/encode.go)
- [`openairesponses/encode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openairesponses/encode.go)
- [`geminiapi/types.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/geminiapi/types.go)

Run `go test ./codec/...`.
