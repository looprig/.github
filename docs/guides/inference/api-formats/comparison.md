---
id: guides/inference/api-formats/comparison
title: Format capability comparison
description: Compare request shape, streaming, caching evidence, and usage normalization by format.
audience: developer
section: guides
order: 75
publication: released
proofs:
  request-shape: [release-github-com-looprig-inference]
  caching-and-usage: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Format Capability Comparison

The codecs expose the same neutral client contract, but their wire contracts
are not interchangeable.

## Request shape

| Format | Conversation shape | Images | Tools | Structured output |
| --- | --- | --- | --- | --- |
| OpenAI Chat | `messages` | URL/data URL | function tools | `response_format.json_schema` |
| OpenAI Responses | `input` items | `input_image` | function items | `text.format.json_schema` |
| Anthropic | `messages` plus top-level `system` | URL/base64 | `input_schema` tools | `output_config.format` |
| Gemini | `contents` parts plus `systemInstruction` | inline/file data | grouped declarations | `responseJsonSchema` |
| Bedrock Converse | tagged content union | inline bytes | `toolConfig.toolSpec` | `outputConfig.textFormat` |

OpenAI and Anthropic put `stream` in JSON. Gemini and Bedrock do not; streaming
is a route or operation concern.

## Caching and usage

Only behavior implemented by these codecs is documented here:

| Format | Request-side cache hint | Response usage evidence |
| --- | --- | --- |
| OpenAI Chat | none emitted | `cached_tokens`, optional `cache_write_tokens` |
| OpenAI Responses | none emitted; `store` is always false | `input_tokens_details.cached_tokens`; no creation field |
| Anthropic | opt-in `PromptCaching` emits up to two `cache_control: ephemeral` breakpoints | separate read and creation counts |
| Gemini | no request cache hint | `cachedContentTokenCount` |
| Bedrock | no cache marker in the request DTO | `cacheReadInputTokens` and `cacheWriteInputTokens` |

An API may perform other server-side caching, but the codecs do not infer or
promise it beyond these fields and tests.

## Source and proof

- [`model/capabilities.go`](https://github.com/looprig/inference/blob/v0.9.2/model/capabilities.go)
- [`openaiapi/types.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openaiapi/types.go)
- [`openairesponses/types.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/types.go)
- [`anthropicapi/encode_cache_test.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/encode_cache_test.go)

Run `go test ./codec/...`.
