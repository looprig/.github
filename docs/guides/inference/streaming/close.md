---
id: guides/inference/streaming/close
title: Close streams
description: Release stream resources with idempotent Close on every exit path.
audience: developer
section: guides
order: 55
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Close streams

`StreamReader.Close` releases the underlying connection. It is safe to call more than once: the wrapped closer runs at most once and every call returns the first closer result.

## API surface

```go
func (r *StreamReader[T]) Close() error
```

```go
reader, err := client.Stream(ctx, request)
if err != nil {
	return err
}
defer func() {
	if err := reader.Close(); err != nil {
		log.Printf("close stream: %v", err)
	}
}()
```

Close immediately after a successful `Stream`, before the loop starts. It should also be called after `io.EOF`; EOF records semantic completion but does not replace resource cleanup. A nil closer is a no-op. A nil receiver returns `*StreamReaderError` with `Operation: StreamOperationClose`.

`Close` is not serialized behind a blocking `Next`, which permits cancellation of an underlying read. The next/closer pair supplied by a codec must tolerate that concurrency.

## Proof

- Source: [`inference/stream/stream.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream_test.go) covers nil closers, error closers, and repeated calls.

Related: [Streaming inference](/docs/guides/inference/client/stream), [Ownership and concurrency](/docs/guides/inference/client/ownership).
