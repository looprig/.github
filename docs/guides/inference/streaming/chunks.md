---
id: guides/inference/streaming/chunks
title: Chunks
description: Distinguish incremental content chunks from complete content blocks.
audience: developer
section: guides
order: 49
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Chunks

`content.Chunk` is the sealed in-memory vocabulary for incremental output. Chunks are not serialized by core and do not have a wire tag; a provider stream decoder creates them from frames.

## API surface

```go
type Chunk interface{ isChunk() }

type TextChunk struct{ Text string }

type ThinkingChunk struct {
	Thinking  string
	Signature string
}

type ToolUseChunk struct {
	Index     int
	ID        string
	Name      string
	InputJSON string
}
```

| Variant | Delta semantics |
| --- | --- |
| `TextChunk` | Append `Text` to the answer buffer |
| `ThinkingChunk` | Append `Thinking`; retain a non-empty terminal `Signature` |
| `ToolUseChunk` | Accumulate `InputJSON` by `Index`; ID and name may arrive later |

```go
switch typed := chunk.(type) {
case *content.TextChunk:
	answer.WriteString(typed.Text)
case *content.ThinkingChunk:
	reasoning.WriteString(typed.Thinking)
case *content.ToolUseChunk:
	toolParts.Add(typed)
}
```

Complete blocks have different ownership and fields. Use [streamaccumulator](/docs/guides/inference/streaming/accumulation) to fold chunks into `TextBlock`, `ThinkingBlock`, and `ToolUseBlock` values.

## Proof

- Source: [`core/content/chunk.go`](https://github.com/looprig/core/blob/v0.12.0/content/chunk.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/streamaccumulator/streamaccumulator_test.go), [`inference/stream/chunkstream_test.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/chunkstream_test.go)

Related: [Text deltas](/docs/guides/inference/streaming/text-deltas), [Thinking deltas](/docs/guides/inference/streaming/thinking-deltas), [Tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas).
