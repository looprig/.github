---
id: guides/inference/messages/codecs
title: Message codecs
description: Understand message JSON round trips and fields that need custom codecs.
audience: developer
section: guides
order: 18
publication: released
proofs:
  wire-shape: [release-github-com-looprig-core]
  round-trip-example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Message codecs

Message JSON is provider-neutral storage, not a provider wire format. `Message`, `UserMessage`, `AIMessage`, and `SystemMessage` use the embedded message codec; `AIMessage` and `ToolResultMessage` define explicit codecs so extra fields are not lost.

## Wire shape

```json
{
  "role": "assistant",
  "blocks": [
    {"Text": "answer", "type": "text"}
  ],
  "usage": {"InputTokens": 4, "OutputTokens": 2}
}
```

`blocks` is omitted when the slice is empty. `AIMessage.Usage` is omitted when nil but a present zero usage encodes as `{}`. `ToolResultMessage` always writes `tool_use_id`; `is_error` uses `omitempty`, so false is represented by absence and decodes back to false.

## Round-trip example

```go
package main

import (
	"encoding/json"
	"github.com/looprig/core/content"
)

func main() {
	original := content.ToolResultMessage{
		Message: content.Message{
			Role: content.RoleTool,
			Blocks: []content.Block{&content.TextBlock{Text: "done"}},
		},
		ToolUseID: "call-1",
		IsError:   true,
	}
	wire, err := json.Marshal(original)
	if err != nil {
		panic(err)
	}
	var restored content.ToolResultMessage
	if err := json.Unmarshal(wire, &restored); err != nil {
		panic(err)
	}
}
```

The codec uses `MarshalBlocks` and `UnmarshalBlocks`, so nested tool-result content remains tagged. AI usage is validated on both marshal and unmarshal, and stale blocks or usage are cleared before an `AIMessage` decode applies new data.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.12.0/content/message.go), [`core/content/block_json.go`](https://github.com/looprig/core/blob/v0.12.0/content/block_json.go)
- Tests: [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_json_test.go) covers fixed points, usage presence, nested blocks, and preservation of tool IDs.

Related: [Content blocks](/docs/guides/inference/content-blocks), [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message).
