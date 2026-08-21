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
model advertises `Caps.Thinking`, except OpenAI Chat Completions, which sends
`reasoning_effort` whenever an effort is set. The Anthropic codec additionally
requires a declared `Caps.ThinkingDialect` and fails closed with
`UndeclaredThinkingDialectError` without one.

## Mapping

| Dialect | Enabled request fields | `EffortMax` behavior | Response block |
| --- | --- | --- | --- |
| OpenAI Chat | `reasoning_effort` | `max` | `reasoning_content` to `ThinkingBlock` |
| OpenAI Responses | `reasoning.effort`, `summary: auto` | `max` | reasoning item summary |
| Anthropic | `thinking: {type: adaptive}` plus `output_config.effort` under the adaptive dialect; `thinking: {type: enabled, budget_tokens: N}` and no effort field under the budget dialect | `max` under the adaptive dialect; a token budget under the budget dialect | `thinking` block with signature |
| Gemini | `thinkingConfig.thinkingBudget`, `includeThoughts` | `UnsupportedEffortError` | `thought: true` part |
| Bedrock | none; any non-empty effort is rejected | `UnsupportedEffortError` | `reasoningContent` |

When capability or effort is unset, request-side reasoning fields are omitted,
except in OpenAI Chat Completions, which consults the effort alone.
Anthropic also omits `temperature` and `top_p` while thinking is enabled under
either dialect, because both request shapes reject those fields alongside
thinking.

## Replay

Responses encrypted reasoning and Gemini thought signatures are opaque provider
state. They are carried only for a same-dialect replay; the codecs do not
interpret or cross-replay them. Anthropic signatures remain on the neutral
`ThinkingBlock.Signature`, labelled `SignatureFormat: "anthropic"`. Replaying a
signature minted by another dialect — Bedrock Converse serves the same Claude
models — is a fatal `ForeignThinkingSignatureError`, not a dropped field.

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
