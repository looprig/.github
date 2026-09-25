---
id: guides/inference/codecs/tools
title: Tool translation
description: Translate tool definitions, calls, arguments, and results without losing JSON shape.
audience: developer
section: guides
order: 70
publication: released
proofs:
  definitions: [release-github-com-looprig-inference]
  calls-and-results: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Tool Translation

Tools are provider-neutral `inference.Tool` values with a name, description,
and JSON object schema. Each dialect wraps that definition differently and
normalizes a tool call back to `content.ToolUseBlock`.

## Definitions

```go
type Tool struct {
	Name        string
	Description string
	Schema      json.RawMessage
}
```

OpenAI uses one `{type:"function", function:{...}}` entry per tool. Responses
uses a `function` item with `parameters`. Anthropic uses `input_schema`.
Gemini groups `functionDeclarations` inside one tool. Bedrock nests each
definition under `toolSpec.inputSchema.json`. Empty schemas become
`{"type":"object"}` only in dialects whose encoder documents that fallback.

## Calls and results

OpenAI Chat and Responses carry function arguments as a JSON-encoded string on
the wire; their decoders expose raw JSON in `ToolUseBlock.Input`. Anthropic and
Bedrock carry a JSON object. OpenAI and Responses flatten result blocks to
text, so non-text results fail closed. Anthropic preserves `IsError`; Bedrock
maps it to `status: "error"`; OpenAI and Responses have no corresponding wire
field and intentionally omit the flag.

```go
message := &content.AIMessage{Message: content.Message{Blocks: []content.Block{
	&content.ToolUseBlock{ID: "call-1", Name: "lookup", Input: json.RawMessage(`{"q":"go"}`)},
}}}
_ = message // replay this block in the next Request to preserve the call.
```

## Source and proof

- [`client.go`](https://github.com/looprig/inference/blob/v0.14.0/client.go)
- [`openaiapi/encode.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/openaiapi/encode.go)
- [`openairesponses/encode.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/openairesponses/encode.go)
- [`geminiapi/encode.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/geminiapi/encode.go)
- [`bedrockconverse/encode.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/bedrockconverse/encode.go)

Run `go test ./codec/openaiapi ./codec/openairesponses ./codec/anthropicapi ./codec/geminiapi ./codec/bedrockconverse`.
