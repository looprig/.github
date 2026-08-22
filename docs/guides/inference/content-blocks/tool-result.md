---
id: guides/inference/content-blocks/tool-result
title: ToolResultBlock
description: Nest tool output blocks and preserve tool success or failure.
audience: developer
section: guides
order: 8
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# ToolResultBlock

`ToolResultBlock` carries the result of one tool call as nested content. Nesting lets a tool return text, documents, images, or another provider-neutral block without inventing a second message format.

## API surface

```go
type ToolResultBlock struct {
	ToolUseID string
	Content   []Block
	IsError   bool
}
```

| Field | Meaning |
| --- | --- |
| `ToolUseID` | The `ToolUseBlock.ID` being answered |
| `Content` | Ordered nested blocks; may include text or multimodal values |
| `IsError` | Whether the tool result is an error result |

The block implements custom JSON handling because `Content` is another sealed block slice. `MarshalBlocks` and `UnmarshalBlocks` recurse through this field and enforce the per-slice safety cap.

## Example

```go
package main

import (
	"fmt"
	"github.com/looprig/core/content"
)

func main() {
	result := &content.ToolResultBlock{
		ToolUseID: "call_42",
		Content: []content.Block{
			&content.TextBlock{Text: "72 degrees"},
		},
	}
	wire, err := content.MarshalBlock(result)
	if err != nil {
		panic(err)
	}
	decoded, err := content.UnmarshalBlock(wire)
	if err != nil {
		panic(err)
	}
	fmt.Println(decoded.(*content.ToolResultBlock).ToolUseID)
}
```

At the message level, [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message) repeats `ToolUseID` and `IsError` while carrying top-level blocks. Use one or the other according to the provider codec's message model; do not silently discard the correlation ID.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/main/content/block.go), [`core/content/block_json.go`](https://github.com/looprig/core/blob/main/content/block_json.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/main/content/block_json_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/main/examples/content/example_test.go)

Related: [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use), [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message).
