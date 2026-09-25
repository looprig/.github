---
id: guides/inference/streaming/terminal-results
title: Terminal stream results
description: Read authoritative usage, model, finish, and attempt metadata at clean EOF.
audience: developer
section: guides
order: 54
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  frame-adapters: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Terminal stream results

`StreamResult` is terminal metadata for one cleanly completed provider stream. It is not another chunk and is available only after `Next` observes clean `io.EOF`.

## API surface

```go
type StreamResult struct {
	Usage        *content.Usage
	Model        string
	FinishReason FinishReason
	Attempts     int
}

type StreamResultProducer func() (StreamResult, bool, error)
```

```go
for {
	_, err := reader.Next()
	if errors.Is(err, io.EOF) {
		break
	}
	if err != nil {
		return err
	}
}
result, ok := reader.Result()
if ok {
	// Result returns an independent Usage copy.
	fmt.Println(result.Model, result.FinishReason, result.Attempts)
}
```

The producer is called once at clean EOF. A false boolean means no authoritative metadata. Producer errors are wrapped in `*StreamResultError`; invalid usage also becomes a result error. A non-EOF stream failure clears any result, so partial metadata cannot be mistaken for a completed response.

## Frame adapters

`FramesToChunksWithResult` gives a semantic decoder its own producer. If that producer is absent, the adapter propagates the underlying frame reader's result. This keeps provider-specific accumulation out of the generic reader.

## Proof

- Source: [`inference/stream/result.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/result.go), [`inference/stream/stream.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/stream.go), [`inference/stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/chunkstream.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/stream_test.go), [`inference/stream/chunkstream_test.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/chunkstream_test.go)

Related: [Response usage](/docs/guides/inference/responses/usage), [Finish reasons](/docs/guides/inference/responses/finish-reasons).
