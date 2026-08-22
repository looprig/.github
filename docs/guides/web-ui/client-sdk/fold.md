---
id: guides/web-ui/client-sdk/fold
title: Folding session state
description: Fold durable history and live SSE frames into one immutable SessionView that a renderer can consume without source-specific branches.
audience: developer
section: guides
order: 5
publication: released
proofs:
  session-view-shape: [release-github-com-looprig-client]
  fold-history-and-live: [release-github-com-looprig-client]
  test-folding: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Folding session state

## Session view shape

`SessionView` is the renderer-facing state accumulated by `fold`. It contains `content`, `toolCalls`, `queuedInputs`, `compactions`, and `statusEvents`. The fold returns a new view rather than mutating the previous one, so a UI can replace one state snapshot in its framework store.

```ts
import {
  emptySessionView,
  fold,
  type FoldInput,
  type SessionView,
} from "@looprig/client";

let view: SessionView = emptySessionView();
const input: FoldInput = { segment: "history", event };
const result = fold(view, input);

if (result.ok) view = result.view;
```

Text, thinking, and streamed tool-use chunks are represented as tagged content entries. Tool execution starts and completions merge by `toolExecutionId`, including when completion arrives first. Durable envelopes become status markers with their `journalSeq`, making cold and live output structurally comparable.

## Fold history and live

Wrap a journal item as `{ segment: "history", event }` and a parsed live frame as `{ segment: "live", frame }`. The same `fold` function handles both. Heartbeats leave the view unchanged. A malformed SSE frame becomes a non-throwing `FoldError` result with reason `upstream_frame_error`; unknown delta shapes are also reported instead of silently disappearing.

```ts
for (const event of page.events) {
  const result = fold(view, { segment: "history", event });
  if (result.ok) view = result.view;
}

for await (const frame of parseSseStream(response.body)) {
  const result = fold(view, { segment: "live", frame });
  if (result.ok) view = result.view;
  else logFoldError(result.error);
}
```

The [Events and live streams](/docs/guides/web-ui/client-sdk/events) page covers frame parsing. [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect) explains how `joinSessionView` orders the two segments before folding them.

## Source

The immutable `SessionView` model, tagged content entries, tool-call merge rules, durable markers, and `fold` function are in [`sdk/core/src/fold.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/fold.ts). The fold behavior and error cases are covered in [`sdk/core/test/fold.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/test/fold.test.ts).

## Proof

The focused tests prove that history and live enduring frames produce the same marker shape, tool calls pair without duplicate cards, heartbeats do not change state, and bad inputs produce typed non-silent results. Use `SessionView` as the adapter boundary.

