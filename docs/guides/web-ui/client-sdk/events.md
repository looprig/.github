---
id: guides/web-ui/client-sdk/events
title: Events and live streams
description: Parse the live SSE byte stream into validated enduring, ephemeral, heartbeat, and error frames without losing chunk boundaries.
audience: developer
section: guides
order: 3
publication: released
proofs:
  parse-frames-incrementally: [release-github-com-looprig-client]
  handle-frame-classes: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Events and live streams

## Parse frames incrementally

The core SDK uses `SseFrameParser`, not the browser `EventSource`, so callers can feed arbitrary `Uint8Array` chunks and test every boundary. `feed` decodes UTF-8 incrementally, accumulates lines until a blank line dispatches a frame, and validates each JSON payload before returning typed data. Call `finish` once the byte source closes.

```ts
import { SseFrameParser, type SseFrame } from "@looprig/client";

const parser = new SseFrameParser();
const frames: SseFrame[] = [];

for await (const chunk of response.body as ReadableStream<Uint8Array>) {
  frames.push(...parser.feed(chunk));
}
frames.push(...parser.finish());
```

For a real `ReadableStream`, `parseSseStream` owns this loop and yields the same `SseFrame` union as an async iterable. A chunk may split a line, JSON value, frame separator, or multi-byte character without changing the result.

## Handle frame classes

An `enduring` frame has an `id` containing the durable `journalSeq`; an `ephemeral` frame has no id and carries best-effort progress such as token deltas. A comment-only block becomes `{ type: "heartbeat" }`, which lets a UI reset an idle timeout without pretending that session state changed. Malformed JSON, an invalid envelope, a missing enduring id, or an unknown event name becomes `{ type: "error", error: SseFrameError }` and parsing continues at the next frame.

```ts
for (const frame of frames) {
  switch (frame.type) {
    case "enduring":
      applyDurable(frame.journalSeq, frame.data);
      break;
    case "ephemeral":
      applyProgress(frame.data);
      break;
    case "heartbeat":
      markConnectionAlive();
      break;
    case "error":
      reportFrameError(frame.error);
      break;
  }
}
```

The parser bounds an unterminated line at `MAX_BUFFERED_LINE_BYTES` and emits a typed error frame instead of allowing unbounded memory growth. The next frame starts with clean parser state.

## Source

Line framing, UTF-8 streaming, frame validation, heartbeat behavior, and the `SseFrameParser` API are implemented in [`sdk/core/src/sse.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/sse.ts). Boundary and malformed-frame cases are exercised in [`sdk/core/test/sse.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/test/sse.test.ts).

## Proof

The focused tests split input at arbitrary byte and line boundaries, check enduring and ephemeral dispatch, preserve heartbeats, and verify that malformed frames do not poison later frames. Use [Folding session state](/docs/guides/web-ui/client-sdk/fold) to turn these frames and journal events into one `SessionView`.

