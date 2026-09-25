---
id: guides/inference/content-blocks/tool-use
title: ToolUseBlock
description: Represent a model tool call with raw, provider-neutral arguments.
audience: developer
section: guides
order: 7
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# ToolUseBlock

`ToolUseBlock` is the assistant's request to execute a named tool. Its arguments stay as `json.RawMessage` so the inference layer can preserve provider JSON exactly and let the tool runner perform domain validation.

## API surface

```go
type ToolUseBlock struct {
	ID    string
	Name  string
	Input json.RawMessage
}
```

| Field | Meaning |
| --- | --- |
| `ID` | Provider/tool-call identifier used to correlate the result |
| `Name` | Tool name declared in the request |
| `Input` | Raw JSON argument object, including partial JSON while a stream is being accumulated |

Core does not parse or validate `Input`. Treat it as untrusted until the selected tool validates it against its own contract.

## Example

```go
package main

import (
	"encoding/json"
	"fmt"

	"github.com/looprig/core/content"
)

func main() {
	call := &content.ToolUseBlock{
		ID: "call_42", Name: "weather",
		Input: json.RawMessage(`{"city":"Boston"}`),
	}
	wire, err := content.MarshalBlock(call)
	if err != nil {
		panic(err)
	}
	decoded, err := content.UnmarshalBlock(wire)
	if err != nil {
		panic(err)
	}
	fmt.Println(decoded.(*content.ToolUseBlock).Name)
}
```

During streaming, `ToolUseChunk.InputJSON` fragments are concatenated by `streamaccumulator.ToolUses`; the resulting `ToolUseBlock.Input` is deliberately left for the caller to parse.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/v0.12.0/content/block.go), [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/v0.12.0/content/streamaccumulator/streamaccumulator.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/block_json_test.go), [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/streamaccumulator/streamaccumulator_test.go)

Related: [Tool definitions](/docs/guides/inference/requests/tools), [Tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas), [ToolResultBlock](/docs/guides/inference/content-blocks/tool-result).
