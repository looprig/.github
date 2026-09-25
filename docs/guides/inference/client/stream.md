---
id: guides/inference/client/stream
title: Streaming inference
description: Open a pull-based chunk stream and always close it on every exit path.
audience: developer
section: guides
order: 30
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Streaming inference

`Client.Stream` returns a `*stream.StreamReader[content.Chunk]`. The reader separates incremental content from the terminal result, so a caller can render text while retaining authoritative usage, model, finish reason, and attempt metadata at clean EOF.

## API surface

```go
Stream(ctx context.Context, req Request) (*stream.StreamReader[content.Chunk], error)
```

```go
reader, err := client.Stream(ctx, req)
if err != nil {
	return err
}
defer reader.Close()

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
		fmt.Print(typed.Text)
	case *content.ThinkingChunk:
		// Keep reasoning display policy separate from answer display policy.
	case *content.ToolUseChunk:
		// Buffer tool argument fragments until the call is complete.
	}
}
if result, ok := reader.Result(); ok {
	_ = result.FinishReason
}
```

`Next` serializes calls to the underlying reader. `io.EOF` is the only clean terminal signal; any other error permanently fails the reader and suppresses its result. `Close` is idempotent and should be deferred immediately after a successful `Stream` call.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go), [`inference/stream/stream.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream_test.go), [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.13.0/client_test.go)
- Example: [`inference/examples/stream/main.go`](https://github.com/looprig/inference/blob/v0.13.0/examples/stream/main.go)

Related: [StreamReader](/docs/guides/inference/streaming/stream-reader), [Terminal stream results](/docs/guides/inference/streaming/terminal-results), [Close streams](/docs/guides/inference/streaming/close).
