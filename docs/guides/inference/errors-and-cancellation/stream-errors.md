---
id: guides/inference/errors-and-cancellation/stream-errors
title: Stream errors
description: Preserve stream framing, provider, and terminal-result failures through StreamReader.
audience: developer
section: guides
order: 103
publication: released
proofs:
  reader: [release-github-com-looprig-inference]
  provider: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Stream Errors

Streams have two failure phases: establishment, returned from `Client.Stream`,
and consumption, returned by `StreamReader.Next`.

## Reader

`StreamReader` returns `StreamReaderError` for a nil reader, missing `Next`, or
invalid framing adapter. A non-EOF error from the underlying reader moves it
to a failed terminal state; later `Next` calls return that same error. A
`StreamResultError` means terminal metadata could not be validated, so it is
not clean EOF and `Result` is unavailable.

```go
chunk, err := reader.Next()
if err != nil && !errors.Is(err, io.EOF) {
	var resultErr *stream.StreamResultError
	if errors.As(err, &resultErr) {
		// Terminal metadata was not authorized.
	}
	return err
}
_ = chunk
```

## Provider

After a successful HTTP status, a dialect may emit `StreamAPIError` from an
in-stream error event. It is terminal and is not converted into a clean result.
Malformed or unknown events are skipped only where that codec documents
tolerant event decoding; a missing terminal marker leaves `Result` unavailable.

## Source and proof

- [`stream/result.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/result.go)
- [`stream/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/stream.go)
- [`openairesponses/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openairesponses/errors.go)
- [`anthropicapi/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/stream.go)

Run `go test ./stream ./codec/...`.
