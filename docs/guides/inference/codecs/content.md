---
id: guides/inference/codecs/content
title: Content translation
description: Map core content blocks and message roles into each dialect's vocabulary.
audience: developer
section: guides
order: 69
publication: released
proofs:
  blocks: [release-github-com-looprig-inference]
  unsupported: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Content Translation

`core/content` supplies the closed block vocabulary. A codec preserves block
order and returns typed errors for a block it cannot represent.

## Blocks

| Neutral block | OpenAI Chat | Responses | Anthropic | Gemini | Bedrock Converse |
| --- | --- | --- | --- | --- | --- |
| `TextBlock` | string or `text` part | `output_text` or `input_text` | `text` | text part | `text` |
| `ImageBlock` | `image_url` | `input_image` URL/data URI | `image` URL/base64 | `inlineData` or `fileData` | inline bytes only |
| `DocumentBlock` | `file` part with a base64 data URI | `input_file` part | `document` block with a title | `inlineData` part plus a text part | document bytes/text |
| `AudioBlock` | `input_audio` part | unsupported; the input union has no audio member | `UnsupportedAudioError` | `inlineData` part | Converse audio block |
| `RefusalBlock` | assistant `refusal` member | `refusal` part on the response direction; request replay is `UnsupportedBlockError` | `UnsupportedRefusalError` | unsupported | unsupported |
| `ThinkingBlock` | omitted on request | reasoning item | `thinking` | thought text part | `reasoningContent` text |
| `ToolUseBlock` | assistant `tool_calls` | `function_call` item | `tool_use` | `functionCall` | `toolUse` |
| `ToolResultBlock` | text-only tool message | text-only `function_call_output` | `tool_result` | `functionResponse` | `toolResult` |

Images sourced from bytes are base64 encoded by JSON dialects that require a
URL or base64 field. Bedrock rejects URL images and requires one of its
supported inline formats. Tool and result inputs are JSON objects; empty input
is normalized to `{}` where the native API requires an object.

## Unsupported

Unsupported content is not silently discarded. For example, an OpenAI Chat
tool result containing an image returns `*openaiapi.UnsupportedBlockError`,
while Bedrock returns `*bedrockconverse.UnsupportedBlockError` with a reason.
Use `errors.As` instead of matching error strings.

```go
var blockErr *anthropicapi.UnsupportedBlockError
if errors.As(err, &blockErr) {
	log.Printf("choose a representable block: %s", blockErr.Block)
}
```

Anthropic splits the representation boundary across several typed errors.
`UnsupportedBlockError` is the fallback for a block the dialect does not model
at all, while audio yields `UnsupportedAudioError`, a refusal
`UnsupportedRefusalError`, an unrepresentable document
`UnsupportedDocumentError`, and an out-of-enum image media type
`UnsupportedImageMediaTypeError`.

## Source and proof

- [`core/content/block.go`](https://github.com/looprig/core/blob/v0.11.0/content/block.go)
- [`openaiapi/encode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openaiapi/encode.go)
- [`anthropicapi/encode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/anthropicapi/encode.go)
- [`bedrockconverse/encode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/bedrockconverse/encode.go)

Run `go test ./codec/...`.
