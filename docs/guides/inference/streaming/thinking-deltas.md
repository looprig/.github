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

`ThinkingChunk` carries reasoning text or a signature delta. Providers may emit the signature separately from the reasoning text, so the accumulator must retain the last non-empty signature.

## API surface

```go
type ThinkingChunk struct {
	Thinking  string
	Signature string
}

var accumulated streamaccumulator.Thinking
accumulated.Add(&content.ThinkingChunk{Thinking: "check "})
accumulated.Add(&content.ThinkingChunk{Thinking: "facts", Signature: "signed"})
block := accumulated.Block()
```

`Block` returns nil before any chunk, then a `*content.ThinkingBlock`. An empty text delta still marks the accumulator non-empty. The `Signature` remains empty until a provider sends it, which is valid for an in-progress stream.

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

- Source: [`core/content/chunk.go`](https://github.com/looprig/core/blob/v0.12.0/content/chunk.go), [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/v0.12.0/content/streamaccumulator/streamaccumulator.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/streamaccumulator/streamaccumulator_test.go)
- Example: [`core/examples/streaming/example_test.go`](https://github.com/looprig/core/blob/v0.12.0/examples/streaming/example_test.go)

Related: [ThinkingBlock](/docs/guides/inference/content-blocks/thinking), [AIMessage](/docs/guides/inference/messages/message-types/ai-message).
