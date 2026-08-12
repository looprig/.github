---
id: guides/inference/usage/streaming
title: Streaming usage
description: Observe authoritative stream usage only after the provider stream terminates cleanly.
audience: developer
section: guides
order: 94
publication: released
proofs:
  terminal: [release-github-com-looprig-inference]
  ownership: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Streaming Usage

Streaming usage is terminal metadata, not a chunk. A stream decoder accumulates
provider usage while chunks are read and publishes a `stream.StreamResult` only
after `Next` observes clean `io.EOF`.

## Terminal

```go
for {
	_, err := reader.Next()
	if errors.Is(err, io.EOF) {
		break
	}
	if err != nil {
		return err // usage is not authoritative after a failed stream
	}
}
result, ok := reader.Result()
if ok && result.Usage != nil {
	fmt.Println(result.Usage.OutputTokens)
}
```

`Result` is false before EOF, after any non-EOF failure, or when the provider
did not report terminal metadata. Anthropic requires `message_stop`; OpenAI
uses its terminal usage event and `[DONE]`; Responses uses completed events;
Gemini and Bedrock collect their final usage events. Missing terminal markers
do not become fabricated usage.

## Ownership

`StreamReader.Result` returns a fresh copy of `Usage` on every call. `Close` is
idempotent and must still be called after EOF to release the response body.
The retry decorator stamps establishment attempts into `StreamResult.Attempts`
without changing mid-stream failure semantics.

## Source and proof

- [`stream/result.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/result.go)
- [`stream/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/stream.go)
- [`stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/chunkstream.go)
- [`anthropicapi/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/stream.go)

Run `go test ./stream ./codec/...`.
