---
id: guides/inference/api-formats/anthropic
title: Anthropic Messages
description: Encode Anthropic Messages content blocks, thinking, tools, and explicit cache breakpoints.
audience: developer
section: guides
order: 78
publication: released
proofs:
  messages: [release-github-com-looprig-inference]
  caching: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Anthropic Messages

`codec/anthropicapi` targets `POST /v1/messages`. Anthropic has no in-thread
system role, so request system text and system messages fold into top-level
`system`.

## Messages

The encoder requires `max_tokens`, defaulting to `4096` when effective sampling
does not provide a positive value. User and assistant blocks map to the native
tagged union. Tool results are a user message containing `tool_result`, and
`IsError` is preserved. Required tool choice becomes `tool_choice: {type:"any"}`.
Thinking is requested only for a model with `Caps.Thinking` and a non-empty
effort, and its shape comes from `Caps.ThinkingDialect`: `adaptive` emits
`thinking: {type:"adaptive"}` plus `output_config.effort`, and `budget` emits
`thinking: {type:"enabled", budget_tokens:N}`. An undeclared dialect is an
`UndeclaredThinkingDialectError`, never a guess. Whichever variant is emitted,
`temperature` and `top_p` are omitted.

```go
body, err := anthropicapi.EncodeRequest(req, false)
if err != nil {
	return err
}
fmt.Println(len(body))
```

## Caching

The request encoder emits cache markers only when `req.Model.Caps.PromptCaching`
is true. It then emits at most two `cache_control: {type:"ephemeral"}`
breakpoints: one on the system block, and one on the last non-thinking block of
the last message. With the capability off, system remains a plain string and
no marker is emitted. The response decoder normalizes separate
`cache_read_input_tokens` and `cache_creation_input_tokens` fields.

## Source and proof

- [`anthropicapi/types.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/anthropicapi/types.go)
- [`anthropicapi/encode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/anthropicapi/encode.go)
- [`anthropicapi/encode_cache_test.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/anthropicapi/encode_cache_test.go)
- [`anthropicapi/decode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/anthropicapi/decode.go)

Run `go test ./codec/anthropicapi`.
