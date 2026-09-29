---
id: guides/web-ui/sessions/reconnect
title: Reconnect and exact joins
description: Join a session's durable journal and live channel without gaps or duplicates, resume from a persisted cursor, and repair after drops and resets.
audience: developer
section: guides
order: 18
publication: released
proofs:
  the-exact-join: [release-npm-looprig-client]
  run-a-join: [release-npm-looprig-client]
  join-options-and-bounds: [release-npm-looprig-client]
  repair-and-resets: [release-npm-looprig-client]
  persist-the-cursor: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Reconnect and exact joins

A session view must show every public journal event exactly once, even though history arrives over REST and new events arrive over the WebSocket, and the socket can drop at any moment. `joinFactorySessionView` solves this once for every framework. It yields a stream of updates carrying a durable cursor, `coveredThrough`, that an application persists so a reload or reconnect resumes where it left off. Factory keeps no replay for a connection, so all recovery comes from the journal.

## The exact join

Each attempt is a generation, and each generation runs the same steps.

1. Subscribe the session channel and wait until Factory authorizes it, buffering publications.
2. Read status and the first journal page together. With no committed cursor, this is a bounded tail read; with one, it is a forward read from `coveredThrough + 1`, so a long outage cannot leave a silent hole.
3. Follow that capture's `next_cursor` pages until coverage reaches the tip the first page captured. The tip must not move, coverage must strictly advance, and no cursor may repeat.
4. Merge the captured events with buffered publications by `journal_seq`, requiring one `event_id` per sequence, then yield them in order.
5. Apply later publications live. A duplicate is dropped, and anything inconsistent starts a new generation.

`covered_through` can move past private records that are never shown, so the cursor advances even when no public event arrives. A capture is committed whole or not at all, except that a forward capture which ran out of budget commits the contiguous prefix it proved.

## Run a join

The join takes any object with `readStatus` and `readJournal` (normally `client.reads`) and any object with `subscribe` (normally `client.link`).

```ts
import { createPublicEventFolder, joinFactorySessionView, type PublicJournalEvent } from "@looprig/client";

const controller = new AbortController(); // abort to stop the join
const events = new Map<number, PublicJournalEvent>(); // keyed by journal_seq
const foldEvents = createPublicEventFolder();
let cursor = loadCursor(sessionId); // 0 means start from the tail

for await (const update of joinFactorySessionView(client.reads, client.link, tenantId, sessionId, {
  initialCoveredThrough: cursor,
  signal: controller.signal,
})) {
  // A truncating reset lowers the cursor: forget events above it.
  if (update.coveredThrough < cursor) {
    for (const seq of events.keys()) if (seq > update.coveredThrough) events.delete(seq);
  }
  if (update.kind === "public") events.set(update.event.journal_seq, update.event);
  // "ephemeral" carries a live preview; "coverage" only advances the cursor.
  cursor = update.coveredThrough;
  saveCursor(sessionId, cursor);
  const { view } = foldEvents([...events.values()].sort((a, b) => a.journal_seq - b.journal_seq));
  render(view, update.status);
}
```

Every update carries `generation`, the validated `status`, and `coveredThrough`. The status's `journal_tip` is replaced by the tip of the page the capture was measured against (`withJournalTip`), because for a Host session Factory's status can report 0.

## Join options and bounds

| Option | Default | Bounds |
|---|---|---|
| `tailLimit` | 256 | events per page, sent as `limit` |
| `maxPrejoinPublications` | 256 | publications buffered before the capture completes |
| `maxTailPages` | 8 | journal reads per capture, including the first |
| `maxTailEvents` | 2048 | events across one capture |
| `maxTailBytes` | 1,048,576 | encoded UTF-8 event bytes across one capture |
| `maxRepairAttempts` | 32 | consecutive repairs without coverage progress before the join throws |
| `repairDelayMs` | 250 | backoff base; 0 for the first repair, then doubling up to 8 times the base |

Factory answers a read with no `cursor` or `from_seq` from the end of the journal and clamps `limit` to 100 events (64 when absent). A refused capture reports a `CapturedTailRefusal` such as `tip_moved`, `coverage_stalled`, `missing_cursor`, `cursor_repeated`, `event_conflict`, or one of the three budget reasons. `CapturedTail` and `repairBackoffMs` are exported for adapters that drive their own reads.

## Repair and resets

A transport drop, a re-subscribe, a validation failure, a publication for another session, a wire version other than 1, or a `session.reset` all end the generation. The next one starts from the committed cursor after the backoff; cursors from the old generation are never reused, so a cursor Factory no longer honours costs one repair. A `session.reset`'s `last_contiguous` describes delivery to this link, not the journal, so it lowers the cursor only when the reset's `journal_tip` is below what the view already committed, meaning the journal truly shrank. A reset that fails validation or names another session still repairs but never moves the cursor. Events at or below the committed cursor are not yielded again in a new generation, so keep the events you already hold rather than clearing the view on each `projection` update.

## Persist the cursor

`FactorySessionViewStore` owns one join's lifecycle for an application: `start()`, `stop()`, `subscribe(listener)`, `subscribeErrors(listener)`, and `snapshot()`. It calls `persistCoveredThrough` only when the cursor rises, and a stopped generation's late updates are ignored.

```ts
import { FactorySessionViewStore } from "@looprig/client";

const store = new FactorySessionViewStore({
  reads: client.reads,
  link: client.link,
  tenantId,
  sessionId,
  initialCoveredThrough: Number(localStorage.getItem(`cursor.${sessionId}`) ?? 0),
  // Must be atomic: the value may cover private records the view never saw.
  persistCoveredThrough: (seq) => localStorage.setItem(`cursor.${sessionId}`, String(seq)),
});
store.subscribe(() => apply(store.snapshot()));
store.start();
```

## Source

The join, `CapturedTail`, defaults, and reset handling are in [`packages/client/src/join.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/join.ts). The lifecycle store is in [`store.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/store.ts), and journal positioning (`tail`, `fromSeq`, `cursor`) in [`factory-rest.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-rest.ts).

## Proof

[`join.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/join.test.ts) covers authorization before REST, ordering buffered publications above the tip, deduplication by sequence and event id, repair of forged watermarks and conflicting ids, prejoin overflow, wire-version mismatch, abort, short coverage, and cursor lowering only on a truncating reset. [`store-lifecycle.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/store-lifecycle.test.ts) checks cursor persistence and inert retired generations. React views use the same join rules (see [Session views and lists](/docs/guides/web-ui/react/session-view)); to fold the events, see [Folding session state](/docs/guides/web-ui/client-sdk/fold).
