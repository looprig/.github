---
id: guides/inference/streaming/text-deltas
title: Text deltas
description: Render TextChunk values incrementally and fold them into a TextBlock.
audience: developer
section: guides
order: 50
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Text deltas

`TextChunk` carries one provider-emitted text fragment. The fragment may be empty and still counts as a received chunk; the core accumulator preserves that distinction through `Empty`.

## API surface

```go
type TextChunk struct{ Text string }

var accumulated streamaccumulator.Text
accumulated.Add(&content.TextChunk{Text: "Hello, "})
accumulated.Add(&content.TextChunk{Text: "world!"})
block := accumulated.Block()
```

`block` is nil until at least one chunk is added. Afterwards it is a `*content.TextBlock` whose `Text` is the concatenation in arrival order.

```go
for {
	chunk, err := reader.Next()
	if errors.Is(err, io.EOF) {
		break
	}
	if err != nil {
		return err
	}
	if text, ok := chunk.(*content.TextChunk); ok {
		fmt.Print(text.Text) // live display
		accumulated.Add(text) // final block
	}
}
```

The accumulator does not send events, validate output, or decide whether the turn failed. Those policies stay in the caller or loop.

## Proof

- Source: [`core/content/chunk.go`](https://github.com/looprig/core/blob/v0.11.0/content/chunk.go), [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/v0.11.0/content/streamaccumulator/streamaccumulator.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/streamaccumulator/streamaccumulator_test.go)
- Example: [`core/examples/streaming/example_test.go`](https://github.com/looprig/core/blob/v0.11.0/examples/streaming/example_test.go)

Related: [TextBlock](/docs/guides/inference/content-blocks/text), [Accumulate a response](/docs/guides/inference/streaming/accumulation).
