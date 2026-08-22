---
id: guides/inference/content-blocks/document
title: DocumentBlock
description: Carry binary or extracted-text documents through provider-neutral messages.
audience: developer
section: guides
order: 5
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# DocumentBlock

`DocumentBlock` carries a document as bytes or extracted text. It also keeps the MIME type and an optional display name so codecs can choose the provider's document representation.

## API surface

```go
type DocumentBlock struct {
	MediaType MediaType
	Name      string
	Data      []byte
	Text      string
}
```

| Field | Use |
| --- | --- |
| `MediaType` | `MediaTypeDocumentPDF`, `MediaTypeDocumentText`, `MediaTypeDocumentHTML`, `MediaTypeDocumentCSV`, `MediaTypeDocumentMarkdown`, `MediaTypeDocumentDOCX`, or `MediaTypeDocumentXLSX` |
| `Name` | Filename or user-facing label |
| `Data` | Binary document bytes |
| `Text` | Extracted text when the caller already decoded the document |

Either `Data` or `Text` may be populated depending on how the document arrived. Core does not impose a mutual-exclusion validator; the codec decides what its wire dialect supports.

## Example

```go
package main

import "github.com/looprig/core/content"

func main() {
	block := &content.DocumentBlock{
		MediaType: content.MediaTypeDocumentText,
		Name:      "report.txt",
		Text:      "Revenue increased.",
	}
	wire, err := content.MarshalBlock(block)
	if err != nil {
		panic(err)
	}
	decoded, err := content.UnmarshalBlock(wire)
	if err != nil {
		panic(err)
	}
	_ = decoded.(*content.DocumentBlock)
}
```

Nested document blocks inside a tool result are found by the same recursive block codec used for top-level blocks.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/main/content/block.go), [`core/content/media_type.go`](https://github.com/looprig/core/blob/main/content/media_type.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/main/content/block_json_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/main/examples/content/example_test.go)

Related: [Content blocks](/docs/guides/inference/content-blocks), [ToolResultBlock](/docs/guides/inference/content-blocks/tool-result).
