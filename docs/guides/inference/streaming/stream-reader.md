---
id: guides/inference/streaming/stream-reader
title: StreamReader
description: Pull values safely, observe EOF and failures, and release the underlying body.
audience: developer
section: guides
order: 48
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  state-rules: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# StreamReader

`stream.StreamReader[T]` is a generic pull iterator. It serializes `Next` calls, records a permanent terminal state, optionally authorizes a terminal `StreamResult`, and makes `Close` idempotent.

## API surface

```go
type StreamReader[T any] struct { /* internal state */ }

func NewStreamReader[T any](next func() (T, error), closer func() error) *StreamReader[T]
func NewStreamReaderWithResult[T any](next func() (T, error), closer func() error, producer StreamResultProducer) *StreamReader[T]
func (r *StreamReader[T]) Next() (T, error)
func (r *StreamReader[T]) Result() (StreamResult, bool)
func (r *StreamReader[T]) Close() error
```

```go
items := []string{"one", "two"}
index := 0
reader := stream.NewStreamReader(func() (string, error) {
	if index == len(items) {
		return "", io.EOF
	}
	value := items[index]
	index++
	return value, nil
}, nil)
defer reader.Close()

for {
	value, err := reader.Next()
	if errors.Is(err, io.EOF) {
		break
	}
	if err != nil {
		panic(err)
	}
	fmt.Println(value)
}
```

`next` must return `(zero, io.EOF)` when exhausted. A nil reader returns `*StreamReaderError` for `Next` or `Close`. A missing next function permanently fails with `StreamReaderFailureMissingNext`.

## State rules

| State | `Next` | `Result` |
| --- | --- | --- |
| Active | Reads next value | false |
| Clean EOF | Repeated calls return `io.EOF` | terminal result if present |
| Failed | Repeated calls return the same terminal error | false |

## Proof

- Source: [`inference/stream/stream.go`](https://github.com/looprig/inference/blob/main/stream/stream.go), [`inference/stream/result.go`](https://github.com/looprig/inference/blob/main/stream/result.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/main/stream/stream_test.go)

Related: [Close streams](/docs/guides/inference/streaming/close/), [Streaming errors](/docs/guides/inference/streaming/errors/), [Terminal stream results](/docs/guides/inference/streaming/terminal-results/).
