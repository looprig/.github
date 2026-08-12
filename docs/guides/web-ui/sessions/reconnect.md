---
id: guides/web-ui/sessions/reconnect
title: Reconnect and exact joins
description: Subscribe before paging durable history, filter by the journal cursor, and reconnect without losing or duplicating enduring events.
audience: developer
section: guides
order: 17
publication: released
proofs:
  exact-join-algorithm: [release-github-com-looprig-client]
  reconnect-options: [release-github-com-looprig-client]
  join-tests: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Reconnect and exact joins

## Exact-join algorithm

`joinSessionView` opens the live source first and buffers frames. It then pages `readHistory` from the current cursor until the final page reports `done: true`. That page's `next_journal_seq` is the tip. The join drains the buffered live frames and follows the same connection, dropping only enduring frames whose `journalSeq` is below the tip. This closes the race between a cold read and a new SSE connection.

```ts
const updates = joinSessionView(transport, sessionId, liveSource, {
  autoReconnect: true,
  reconnectDelayMs: 250,
});

for await (const update of updates) {
  if (update.ok) render(update.view);
  else reportFoldError(update.error);
}
```

Ephemeral frames, heartbeats, and error frames have no durable sequence and are not filtered by the tip. They are delivered once in the order the live source provides them. Enduring frames advance the cursor, which is reused after a reconnect.

## Reconnect options

`autoReconnect` defaults to `false` in `joinSessionView`: a clean source end completes the generator and an error propagates. When enabled, a clean end immediately opens a fresh source; an error-triggered retry waits the fixed `reconnectDelayMs` default of 250 milliseconds. The next history walk starts at the highest applied durable cursor, so a retry reads only the possible gap.

The framework-neutral `SessionClient` opts into `autoReconnect: true`, and `LiveSessionViewStore` does the same by default. Either can still pass an explicit false value when its owner wants to handle retries itself. See [Events and live streams](/docs/guides/web-ui/client-sdk/events/) for the frame union and [Folding session state](/docs/guides/web-ui/client-sdk/fold/) for the immutable view.

## Source

The subscribe-buffer-catch-up algorithm, tip filter, cursor resume, abort checks, and reconnect options are implemented in [`sdk/core/src/join.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/join.ts). Race, clean-end, error, and reconnect cases are covered in [`sdk/core/test/join.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/test/join.test.ts).

## Proof

The join tests force events into the join window, verify that a durable sequence is emitted once, and exercise both clean and error reconnects. The implementation applies the tip filter during both the initial drain and the continuing live loop.

