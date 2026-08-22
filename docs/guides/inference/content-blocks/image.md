---
id: guides/inference/content-blocks/image
title: ImageBlock
description: Represent remote or inline image input with an explicit MIME type.
audience: developer
section: guides
order: 3
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# ImageBlock

`ImageBlock` carries an image source and its MIME type. The source sum type is represented by one `ImageSource` value with either a URL or inline bytes.

## API surface

```go
type ImageSource struct {
	URL  string
	Data []byte
}

type ImageBlock struct {
	MediaType MediaType
	Source    ImageSource
}
```

| Field | Meaning | Valid shape |
| --- | --- | --- |
| `MediaType` | MIME type such as `MediaTypeImagePNG` | Provider and caller agree on supported types |
| `Source.URL` | Remote image reference | Set for URL-backed input |
| `Source.Data` | Inline bytes | Set for inline input |

The source comment says to set exactly one of `URL` or `Data`. The core package does not add a validation method, so a provider codec must reject or normalize an invalid combination at its boundary. `Model.Caps.AcceptsImages` is the inference-layer admission check for any image nested in messages or tool-result content.

## Example

```go
package main

import "github.com/looprig/core/content"

func main() {
	remote := &content.ImageBlock{
		MediaType: content.MediaTypeImagePNG,
		Source:    content.ImageSource{URL: "https://example.test/chart.png"},
	}
	inline := &content.ImageBlock{
		MediaType: content.MediaTypeImageJPEG,
		Source:    content.ImageSource{Data: []byte{0xff, 0xd8}},
	}
	_ = []content.Block{remote, inline}
}
```

The inference request validator walks all four sealed message types and nested `ToolResultBlock.Content`; it returns `*inference.ImageInputUnsupportedError` when the model does not advertise image input.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/main/content/block.go), [`core/content/media_type.go`](https://github.com/looprig/core/blob/main/content/media_type.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/main/content/block_json_test.go), [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go)

Related: [Model capabilities](/docs/guides/inference/models/capabilities), [Conversation input](/docs/guides/inference/requests/messages).
