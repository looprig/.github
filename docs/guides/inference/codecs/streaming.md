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
    E --> C["TextChunk / ThinkingChunk / ToolUseChunk"]
    C --> A["FramesToChunksWithResult"]
    A --> R["StreamReader.Result after EOF"]
```

OpenAI uses `[DONE]` as the terminal SSE data payload. Anthropic authorizes a
terminal result on `message_stop`. Responses uses typed `response.completed`,
and Gemini receives a final SSE chunk. Bedrock uses event-stream frames and a
metadata/message-stop sequence. Malformed or uninteresting events are skipped
by the tolerant per-event decoders; typed stream/provider errors still fail the
reader.

## Accumulation

`ToolUseChunk.Index` is the join key. OpenAI and Anthropic send argument
fragments, so the accumulator concatenates fragments by index. Gemini emits a
complete function call per part and uses that event's positional function-call
index. The decoder itself is stateless and must not retain cross-event input.

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

- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/contracts.go)
- [`stream/chunkstream.go`](https://github.com/looprig/inference/blob/v0.9.2/stream/chunkstream.go)
- [`openaiapi/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/openaiapi/stream.go)
- [`anthropicapi/stream.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/anthropicapi/stream.go)

Run `go test ./codec/... ./stream/...`.
