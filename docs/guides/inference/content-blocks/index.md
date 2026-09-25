---
id: guides/inference/content-blocks/index
title: Overview
description: The sealed content vocabulary used by messages, codecs, and streaming.
audience: developer
section: guides
order: 1
publication: released
proofs:
  the-block-vocabulary: [release-github-com-looprig-core]
  blocks-and-streaming-chunks: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Content blocks overview

Looprig represents model input and output as an ordered slice of sealed `content.Block` values. The concrete Go pointer is the in-memory discriminator; JSON adds a `type` tag at the boundary. This keeps provider codecs independent of ad-hoc maps while still allowing nested tool results.

## The block vocabulary

| Variant | Payload | Typical direction |
| --- | --- | --- |
| `TextBlock` | UTF-8 text | input or output |
| `ImageBlock` | MIME type plus URL or bytes | input |
| `AudioBlock` | MIME type plus bytes | input |
| `DocumentBlock` | MIME type, name, bytes, or extracted text | input |
| `ThinkingBlock` | reasoning text, signature, provider state | output and replay |
| `ToolUseBlock` | call ID, name, raw JSON arguments | output |
| `ToolResultBlock` | tool-call ID, nested blocks, error bit | input |

```go
package main

import (
	"encoding/json"
	"fmt"

	"github.com/looprig/core/content"
)

func main() {
	blocks := []content.Block{
		&content.TextBlock{Text: "Inspect this report."},
		&content.ToolUseBlock{
			ID: "call-1", Name: "search",
			Input: json.RawMessage(`{"query":"revenue"}`),
		},
	}
	wire, err := content.MarshalBlocks(blocks)
	if err != nil {
		panic(err)
	}
	decoded, err := content.UnmarshalBlocks(wire)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%T %T\n", decoded[0], decoded[1])
}
```

The block interface is sealed by an unexported `isBlock` method. A consumer should type-switch over the seven exported pointer variants and treat an unexpected or typed-nil value as invalid input.

## Blocks and streaming chunks

Complete blocks and incremental chunks are intentionally different types. A `TextChunk` contains a delta; a `TextBlock` contains the assembled value. Thinking signatures and tool-call argument fragments are the reason the distinction matters.

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f8fafc","primaryBorderColor":"#64748b","lineColor":"#94a3b8","secondaryColor":"#0f172a","tertiaryColor":"#172033","fontFamily":"Inter, ui-sans-serif, system-ui, sans-serif"}}}%%
flowchart LR
    wire[Provider stream] --> chunk[content.Chunk]
    chunk --> fold[streamaccumulator]
    fold --> block[content.Block]
    block --> message[AIMessage]
    classDef dark fill:#1f2937,stroke:#94a3b8,color:#f8fafc
    class wire,chunk,fold,block,message dark
```

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/v0.11.0/content/block.go), [`core/content/chunk.go`](https://github.com/looprig/core/blob/v0.11.0/content/chunk.go)
- Tests: [`core/content/block_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/block_test.go), [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/block_json_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/v0.11.0/examples/content/example_test.go)

Related: [Messages](/docs/guides/inference/messages), [Streaming](/docs/guides/inference/streaming), [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use).
