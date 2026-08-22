---
id: guides/inference/content-blocks/text
title: TextBlock
description: Construct and serialize plain text content blocks.
audience: developer
section: guides
order: 2
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  json-boundary: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# TextBlock

`TextBlock` is the smallest content value: one string wrapped in the sealed `content.Block` interface. It is used for prompts, assistant text, structured-output fragments, and accumulated text deltas.

## API surface

```go
type TextBlock struct {
	Text string
}
```

There is no constructor and no validation method. Use a non-nil pointer when placing the value in `[]content.Block`; the pointer is the concrete discriminator.

| Field | Meaning | Ownership |
| --- | --- | --- |
| `Text` | The complete text for this block | The block stores the string value; strings are immutable |

## JSON boundary

`MarshalBlock` adds the discriminator while preserving the exported field name:

```go
block := &content.TextBlock{Text: "hello"}
wire, err := content.MarshalBlock(block)
// wire is an object containing {"Text":"hello","type":"text"}.
restored, err := content.UnmarshalBlock(wire)
text := restored.(*content.TextBlock).Text
```

Do not add a `Type` field to the struct. The codec owns the wire tag and rejects an unknown tag with `*content.UnknownBlockTypeError`.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/main/content/block.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/main/content/block_json_test.go), [`core/content/block_test.go`](https://github.com/looprig/core/blob/main/content/block_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/main/examples/content/example_test.go)

Related: [Content blocks](/docs/guides/inference/content-blocks), [Text deltas](/docs/guides/inference/streaming/text-deltas).
