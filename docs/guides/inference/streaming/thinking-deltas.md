---
id: guides/inference/streaming/thinking-deltas
title: Thinking deltas
description: Accumulate reasoning text and retain a terminal thinking signature.
audience: developer
section: guides
order: 51
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Thinking deltas

`ThinkingChunk` carries reasoning text or a signature delta for one reasoning block. Providers may emit the signature separately from the reasoning text, so the accumulator retains the last non-empty signature for each block. A response can contain several reasoning blocks; `Index` says which one a delta belongs to.

## API surface

```go
type ThinkingChunk struct {
	Index               int // reasoning block's position in the response
	Thinking            string
	Signature           string
	SignatureFormat     string
	ProviderState       json.RawMessage
	ProviderStateFormat string
}

var accumulated streamaccumulator.Thinking
accumulated.Add(&content.ThinkingChunk{Index: 0, Thinking: "check "})
accumulated.Add(&content.ThinkingChunk{Index: 1, Thinking: "compare sources"})
accumulated.Add(&content.ThinkingChunk{Index: 0, Thinking: "facts", Signature: "signed", SignatureFormat: "anthropic"})
blocks := accumulated.Blocks() // two blocks, index 0 then index 1
```

`Blocks` returns nil before any chunk, then one `content.ThinkingBlock` per index that received a delta, in ascending index order; gaps in the index sequence produce no filler blocks. A single-block producer leaves `Index` at zero. An empty text delta still marks the accumulator non-empty. The `Signature` remains empty until a provider sends it, which is valid for an in-progress stream, and a signature is kept together with the `SignatureFormat` from the same delta.

`Block()` is deprecated: it returns only the first block, so it silently drops later reasoning blocks from a multi-block response. Use `Blocks()`.

```go
if chunk, ok := value.(*content.ThinkingChunk); ok {
	if chunk.Thinking != "" {
		reasoningDisplay.WriteString(chunk.Thinking)
	}
	thinking.Add(chunk)
}
```

Provider-opaque replay state is a separate `ThinkingBlock` concern. Do not manufacture a signature or replay state from display text.

## Proof

- Source: [`core/content/chunk.go`](https://github.com/looprig/core/blob/v0.13.2/content/chunk.go), [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/v0.13.2/content/streamaccumulator/streamaccumulator.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/v0.13.2/content/streamaccumulator/streamaccumulator_test.go)
- Example: [`core/examples/streaming/example_test.go`](https://github.com/looprig/core/blob/v0.13.2/examples/streaming/example_test.go)

Related: [ThinkingBlock](/docs/guides/inference/content-blocks/thinking), [AIMessage](/docs/guides/inference/messages/message-types/ai-message).
