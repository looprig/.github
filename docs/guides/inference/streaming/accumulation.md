---
id: guides/inference/streaming/accumulation
title: Accumulate a response
description: Fold text, thinking, and tool-call chunks into complete blocks.
audience: developer
section: guides
order: 53
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Accumulate a response

Core's `content/streamaccumulator` package is a pure converter from chunks to complete blocks. It does not send events, validate tool permissions, or decide whether an inference turn failed.

## API surface

```go
type Text struct { /* internal builder */ }
func (a *Text) Add(*content.TextChunk)
func (a Text) Block() *content.TextBlock
func (a Text) Empty() bool

type Thinking struct { /* internal builder */ }
func (a *Thinking) Add(*content.ThinkingChunk)
func (a Thinking) Block() *content.ThinkingBlock
func (a Thinking) Empty() bool

type ToolUses struct { /* internal map */ }
func (a *ToolUses) Add(*content.ToolUseChunk)
func (a ToolUses) Blocks() []content.ToolUseBlock
func (a ToolUses) Empty() bool
```

```go
var text streamaccumulator.Text
var thinking streamaccumulator.Thinking
var tools streamaccumulator.ToolUses

for {
	chunk, err := reader.Next()
	if errors.Is(err, io.EOF) {
		break
	}
	if err != nil {
		return err
	}
	switch typed := chunk.(type) {
	case *content.TextChunk:
		text.Add(typed)
	case *content.ThinkingChunk:
		thinking.Add(typed)
	case *content.ToolUseChunk:
		tools.Add(typed)
	}
}
```

The zero value of each accumulator is ready to use. `Block` and `Blocks` return nil until a chunk was received; an empty-string chunk still counts as received. Tool blocks are returned in ascending provider index order.

## Proof

- Source: [`core/content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/main/content/streamaccumulator/streamaccumulator.go), [`core/content/chunk.go`](https://github.com/looprig/core/blob/main/content/chunk.go)
- Tests: [`core/content/streamaccumulator/streamaccumulator_test.go`](https://github.com/looprig/core/blob/main/content/streamaccumulator/streamaccumulator_test.go)
- Example: [`core/examples/streaming/example_test.go`](https://github.com/looprig/core/blob/main/examples/streaming/example_test.go)

Related: [Chunks](/docs/guides/inference/streaming/chunks), [Assistant messages](/docs/guides/inference/responses/assistant-message).
