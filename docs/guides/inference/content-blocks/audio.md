---
id: guides/inference/content-blocks/audio
title: AudioBlock
description: Represent audio input with a MIME type and owned bytes.
audience: developer
section: guides
order: 4
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example-and-ownership: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# AudioBlock

`AudioBlock` is the binary audio variant in the core content vocabulary. It keeps the provider-neutral shape small: a MIME type and the bytes to encode.

## API surface

```go
type AudioBlock struct {
	MediaType MediaType
	Data      []byte
}
```

Current named audio constants include `MediaTypeAudioMPEG`, `MediaTypeAudioWAV`, `MediaTypeAudioOGG`, `MediaTypeAudioFLAC`, `MediaTypeAudioAAC`, `MediaTypeAudioMP4`, and `MediaTypeAudioWebM`. `MediaType` is an open string type, so a future or provider-specific MIME value can be carried without changing the core package.

## Example and ownership

```go
package main

import "github.com/looprig/core/content"

func main() {
	pcm := []byte{0x52, 0x49, 0x46, 0x46}
	block := &content.AudioBlock{
		MediaType: content.MediaTypeAudioWAV,
		Data:      pcm,
	}
	_ = content.Block(block)
}
```

The struct literal stores the slice header supplied by the caller. If the bytes must remain stable across an asynchronous request, copy them before constructing the block. `MarshalBlock` encodes and `UnmarshalBlock` allocates a fresh `*AudioBlock`; malformed bytes return a typed `*content.BlockDecodeError`.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/v0.11.0/content/block.go), [`core/content/media_type.go`](https://github.com/looprig/core/blob/v0.11.0/content/media_type.go)
- Tests: [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/block_json_test.go)

Related: [ImageBlock](/docs/guides/inference/content-blocks/image), [DocumentBlock](/docs/guides/inference/content-blocks/document).
