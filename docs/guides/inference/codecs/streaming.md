---
id: guides/inference/codecs/streaming
title: Streaming codecs
description: Frame native streams and emit provider-neutral chunks with terminal metadata.
audience: developer
section: guides
order: 68
publication: released
proofs:
  framing: [release-github-com-looprig-inference]
  accumulation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Streaming Codecs

Streaming codecs separate raw framing from semantic chunk decoding. The SSE
framer produces `stream.StreamFrame`; a dialect decoder maps each frame to
`content.Chunk` values, and the shared adapter accumulates tool arguments and
terminal usage.

## Framing

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f9fafb","primaryBorderColor":"#60a5fa","lineColor":"#94a3b8","secondaryColor":"#172033","tertiaryColor":"#0f172a","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TD
    B["HTTP response body"] --> F["wire/sse framer"]
    F --> E["dialect event decoder"]
    E --> C["TextChunk / ThinkingChunk / ToolUseChunk / RefusalChunk / ImageChunk"]
    C --> A["FramesToChunksWithResult"]
    A --> R["StreamReader.Result after EOF"]
```

OpenAI accepts either end-of-generation signal: the `[DONE]` terminal SSE data
payload or a reported finish reason. Anthropic authorizes a terminal result on
`message_stop`. Responses uses typed `response.completed`, and Gemini
authorizes on a candidate that reports a `finishReason`. Bedrock uses
event-stream frames and a metadata/message-stop sequence. A stream that ends
before its dialect's terminal marker is a typed `StreamDecodeError`, not a
clean end. Uninteresting or unknown-but-well-formed events are skipped, while a
frame whose JSON does not parse aborts the stream with a typed
`StreamEventDecodeError`; typed stream and provider errors still fail the
reader.

## Accumulation

`ToolUseChunk.Index` is the join key. OpenAI and Anthropic send argument
fragments, so the accumulator concatenates fragments by index. Gemini emits a
complete function call per part, and the stream-scoped collector rebases that
event's positional index onto a stream-wide sequence. `Codec.DecodeEvent` is
stateless; the rebasing state belongs to the stream collector.

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
	fmt.Printf("%T\n", chunk)
}
result, ok := reader.Result()
if ok {
	fmt.Println(result.FinishReason)
}
```

## Source and proof

- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/contracts.go)
- [`stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/chunkstream.go)
- [`openaiapi/stream.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/openaiapi/stream.go)
- [`anthropicapi/stream.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/anthropicapi/stream.go)

Run `go test ./codec/... ./stream/...`.
