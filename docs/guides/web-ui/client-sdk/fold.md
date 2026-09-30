---
id: guides/web-ui/client-sdk/fold
title: Folding session state
description: Turn Factory's public journal events into a transcript, loop tree, open gates, and command outcomes with the shared durable fold.
audience: developer
section: guides
order: 6
publication: released
proofs:
  what-the-fold-produces: [release-npm-looprig-client]
  fold-journal-events: [release-npm-looprig-client]
  render-rows-by-loop: [release-npm-looprig-client]
  tool-rows-and-captures: [release-npm-looprig-client]
  the-public-gate-board: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Folding session state

A session's history reaches the browser as public journal events: pages from `GET /v1/sessions/{sid}/journal` and live enduring publications on the session channel. The fold turns those events, in `journal_seq` order, into the state a UI renders. It is pure and framework-neutral: it performs no I/O, and the same function serves a cold page, a live stream, and a repaired gap. Live text and reasoning previews are deliberately outside it (see [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews)).

## What the fold produces

`emptySessionView()` returns a `SessionView` with five parts.

| Field | Contents |
|---|---|
| `rows` | `TranscriptRow[]` in append order; `kind` is `user`, `assistant`, `tool`, `notice`, or `tombstone` |
| `loops` | `Map<string, LoopInfo>`: parent loop, anchoring tool use, label, and whether `LoopStarted` was observed |
| `gates` | `Map<string, Gate>` of gates opened by `GateOpened` and not yet resolved |
| `commandOutcomes` | `Map<string, CommandOutcome>`: `started`, `rejected`, or `cancelled`, keyed by command id |
| `statusEvents` | a `StatusEventMarker` for every event, including kinds the fold does not project |

`nextOrdinal` allocates each row's `ordinal`, a monotonic render key that is never reused. A `user` row carries the user's own `blocks`, an optional presenter `frame`, and the Factory-stamped `principal` when present. `TurnRejected` and `TurnFailed` commit an error `notice`, `TurnInterrupted` commits a `tombstone`, and `InputCancelled` commits no row but records `cancelled`.

## Fold journal events

`fold(view, input)` takes one event and returns `{ ok: true, view }` or `{ ok: false, error }`. The input is `{ segment: "history", event: { journal_seq, event: body } }`, where `body` is the event's public body.

```ts
import { emptySessionView, fold, type EventEnvelope, type PublicJournalPage } from "@looprig/client";

let view = emptySessionView();
for (const event of page.events) {
  const next = fold(view, {
    segment: "history",
    event: { journal_seq: event.journal_seq, event: event.body as EventEnvelope },
  });
  if (next.ok) view = next.view; // skip one malformed event, keep the rest
}
```

Most applications use `createPublicEventFolder()` instead. It is stateful: given a list that extends the previous one, it folds only the new tail; given any other list (a repair, a reset, an earlier page) it refolds from scratch, so the result always equals folding the list itself. An unchanged list returns the identical `{ view, version }`.

Maps, row objects, and counters are copy-on-write, but `rows` and `statusEvents` are appended in place for linear replay cost. Use the view object or `version` as a memo key, and do not keep an older view's arrays as a snapshot.

## Render rows by loop

Subagents run inside their parent's turn, so a global `journal_seq` sort would splice a child's transcript into the parent. Partition first: `loopIdsInOrder(view)` lists loops in first-appearance order, `rowsForLoop(view, loopId)` orders one loop's rows, and `anchorOf(view, loopId)` returns the parent tool row the child block hangs from.

```ts
import { anchorOf, loopIdsInOrder, rowsForLoop } from "@looprig/client";

for (const loopId of loopIdsInOrder(view)) {
  const anchor = anchorOf(view, loopId); // undefined: render top-level
  const rows = rowsForLoop(view, loopId);
  // A row with orphanedLoop === true belongs to a loop whose LoopStarted
  // is not on the loaded page; render it top-level with a marker.
  renderBlock(loopId, anchor?.ordinal, rows);
}
```

A turn opener whose cause names a child loop is a subagent hand-back, not user input, so it records the command outcome but commits no user row.

## Tool rows and captures

A committed `StepDone` produces at most one `assistant` row (thinking, narration, refusal, and a `redactedThinking` flag) followed by one `tool` row per tool use, paired with its result by tool-use id. The row's `summary` is derived by `toolUseSummary(name, input)`, which redacts file contents, edit text, request bodies, and task text; an unknown tool yields `""`. When Harness retained a large result, `capture` is a `ToolResultCaptureSummary` decoded by `toolResultCaptures`: object id, captured and original byte counts, truncation, and encoding, never URLs or bytes. Reading the bytes is a separate authorized Factory read.

## The public gate board

`SessionView.gates` holds full gate envelopes from the journal, but an open event proves the gate was shown, not that anyone can answer it. The public gate board holds what Factory attests. `foldPublicGatePage(board, page, sessionId)` merges a `listGates` page, `foldPublicGateEvent(board, input)` applies a live `GateOpened` or `GateResolved`, and `publicGates(board)` returns entries in a stable `(sessionId, openedJournalSeq, gateId)` order. A page merge never removes an entry, and a page fetched before a resolve can bring the gate back. `foldGateBoard` and `advanceGateBoardCell` close that race by keeping tombstones for resolves the view observed and starting a new generation when the gate page is invalidated or coverage falls.

```ts
import { advanceGateBoardCell, publicGates, type GateBoardCell } from "@looprig/client";

let cell: GateBoardCell | undefined;
cell = advanceGateBoardCell(cell, sessionId, { gates: gatePage, events, coveredThrough });
const open = publicGates(cell.state.board); // pass to acceptsResidentResponse
```

## Source

The fold, `SessionView`, and the gate board are in [`packages/client/src/fold.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/fold.ts). Row types and loop helpers are in [`rows.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/rows.ts), event decoding in [`enduring.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/enduring.ts), summaries and capture metadata in [`toolsummary.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/toolsummary.ts), and the incremental folder and gate-board cell in [`factory-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-view.ts).

## Proof

[`fold.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/fold.test.ts), [`fold-immutability.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/fold-immutability.test.ts), and [`fold-gates.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/fold-gates.test.ts) cover the empty view, copy-on-write maps, concurrent gates, and the board. [`rows-loops.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/rows-loops.test.ts), [`rows-stepdone.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/rows-stepdone.test.ts), and [`rows-handback.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/rows-handback.test.ts) pin loop anchoring, step splitting, and hand-backs. [`factory-view.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-view.test.ts) checks that a repaired event set renders exactly the durable journal. The events themselves come from [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect).
