---
id: guides/inference/api-formats/openai-responses
title: OpenAI Responses
description: Encode and decode the item-based OpenAI Responses API dialect.
audience: developer
section: guides
order: 77
publication: released
proofs:
  items: [release-github-com-looprig-inference]
  usage-and-replay: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# OpenAI Responses

`codec/openairesponses` targets `POST /v1/responses`, which is an items API,
not a `messages` array. It implements both client and server codec contracts.

## Items

System text becomes top-level `instructions`. User turns become `message`
items with `input_text` and `input_image` parts. Assistant tool calls become
`function_call` items; tool results become `function_call_output`. Consecutive
assistant text blocks are grouped into one message item. `store` is always
explicitly `false`, and the neutral `Stop` sampling field is omitted because
this API does not model it.

```go
body, err := openairesponses.EncodeRequest(req, false)
if err != nil {
	return err
}
fmt.Println(string(body)) // inspect the typed items in a test, not in logs for secrets.
```

## Usage and replay

Responses reports gross `input_tokens` and a cached subset. The decoder
subtracts `input_tokens_details.cached_tokens` and leaves
`CacheCreationTokens` zero because the DTO has no creation field. Reasoning
items preserve summary text and an opaque `encrypted_content` value in
`ThinkingBlock.ProviderState`; only a state tagged for this dialect is replayed.
Streaming uses typed SSE events such as `response.output_text.delta` and
`response.completed`.

## Source and proof

- [`openairesponses/types.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/types.go)
- [`openairesponses/encode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/encode.go)
- [`openairesponses/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/decode.go)
- [`openairesponses/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/stream.go)

Run `go test ./codec/openairesponses`.
