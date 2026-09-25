---
id: guides/inference/streaming/errors
title: Streaming errors
description: Classify reader, frame, and terminal-result failures without losing state semantics.
audience: developer
section: guides
order: 56
publication: released
proofs:
  typed-errors: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Streaming errors

The stream package distinguishes clean `io.EOF` from every other failure. Once a non-EOF error occurs, the reader is permanently failed and `Result` returns false.

## Typed errors

```go
type StreamReaderError struct {
	Operation StreamOperation
	Failure   StreamReaderFailure
}

type StreamResultError struct {
	Cause error
}
```

`StreamReaderFailure` values include `nil receiver`, `missing next function`, and `missing frame mapper`. `StreamResultError.Unwrap` exposes ordinary causes but suppresses an `io.EOF` cause so metadata failure cannot masquerade as clean exhaustion.

```go
value, err := reader.Next()
if err != nil && !errors.Is(err, io.EOF) {
	var boundary *stream.StreamReaderError
	if errors.As(err, &boundary) {
		log.Printf("stream boundary %s: %s", boundary.Operation, boundary.Failure)
	}
	_ = value
	return err
}
```

`FramesToChunks` skips `(nil, nil)` frame mappings, buffers multiple chunks returned for one frame, drains chunks returned alongside an `io.EOF` sentinel, and discards chunks returned with a non-EOF mapping error.

## Proof

- Source: [`inference/stream/result.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/result.go), [`inference/stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/chunkstream.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream_test.go), [`inference/stream/chunkstream_test.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/chunkstream_test.go)

Related: [StreamReader](/docs/guides/inference/streaming/stream-reader), [Terminal stream results](/docs/guides/inference/streaming/terminal-results).
