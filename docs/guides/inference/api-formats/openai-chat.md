---
id: guides/inference/api-formats/openai-chat
title: OpenAI Chat Completions
description: Encode and decode the OpenAI Chat Completions message dialect.
audience: developer
section: guides
order: 76
publication: released
proofs:
  request: [release-github-com-looprig-inference]
  response-and-cache: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# OpenAI Chat Completions

`codec/openaiapi` targets `POST /v1/chat/completions`. Its `Codec` satisfies
both the client `codec.Codec` and ingress `codec.ServerCodec` contracts.

## Request

`BuildChatRequest` maps the model name, effective sampling, system prompt,
messages, function tools, JSON-schema output, and tool choice, required or
named. Stream
mode adds `stream: true` and `stream_options.include_usage: true`; invoke mode
omits both. Text-only user content is a string; mixed text and images become
`[{type:"text"}, {type:"image_url"}]`. Inline image bytes become a data URI.

```go
body, err := openaiapi.EncodeRequest(req, true)
if err != nil {
	return err
}
var wire struct {
	Model  string `json:"model"`
	Stream bool   `json:"stream"`
}
if err := json.Unmarshal(body, &wire); err != nil {
	return err
}
fmt.Println(wire.Model, wire.Stream)
```

## Response and cache

The decoder reads `choices[0]`, preserves reasoning, text, and tool calls, and
maps finish reasons to the neutral stream values. Prompt usage is gross
`prompt_tokens`; the decoder subtracts `prompt_tokens_details.cached_tokens`
and `cache_write_tokens` into the neutral `InputTokens` field. The request
encoder emits no cache breakpoint or cache-control field. The cache counts are
accepted only because the response DTO and normalization code implement them.

## Source and proof

- [`openaiapi/codec.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openaiapi/codec.go)
- [`openaiapi/encode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openaiapi/encode.go)
- [`openaiapi/decode.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openaiapi/decode.go)
- [`openaiapi/stream_test.go`](https://github.com/looprig/inference/blob/v0.12.0/codec/openaiapi/stream_test.go)

Run `go test ./codec/openaiapi`.
