---
id: guides/inference/streaming/tool-call-deltas
title: Tool-call deltas
description: Accumulate fragmented tool calls safely by provider-supplied index.
audience: developer
section: guides
order: 52
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  tool-loop-boundary: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Tool-call deltas

`ToolUseChunk` is a partial tool call. Providers may split the ID, name, and JSON arguments over several chunks and may interleave several calls.

## API surface

```go
type ToolUseChunk struct {
	Index     int
	ID        string
	Name      string
	InputJSON string
}
```

Use `streamaccumulator.ToolUses` rather than indexing a slice with `Index`:

```go
var calls streamaccumulator.ToolUses
calls.Add(&content.ToolUseChunk{Index: 0, ID: "call-1", Name: "weather", InputJSON: `{"city":`})
calls.Add(&content.ToolUseChunk{Index: 0, InputJSON: `"Boston"}`})
for _, call := range calls.Blocks() {
	// Parse and validate call.Input only after the complete stream.
	fmt.Println(call.ID, call.Name, string(call.Input))
}
```

The accumulator uses a map keyed by `Index`, so negative or very large provider values cannot panic or allocate an unbounded slice. It preserves the last non-empty ID/name and emits complete blocks sorted in ascending index order. The raw concatenated JSON is not validated by core.

## Tool loop boundary

Render fragments if desired, but execute only after the stream's representation is complete and the caller has validated the tool name and argument schema. Then append a correlated [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message).

## Proof

- Source: [`core/content/chunk.go`](https://github.com/looprig/core/blob/main/content/chunk.go), [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/main/content/streamaccumulator/streamaccumulator.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/main/content/streamaccumulator/streamaccumulator_test.go) covers interleaving, late IDs, empty fragments, and hostile indexes.

Related: [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use), [Tool definitions](/docs/guides/inference/requests/tools).
