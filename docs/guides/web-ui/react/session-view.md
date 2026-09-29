---
id: guides/web-ui/react/session-view
title: Session views and lists
description: List recent sessions and open one session's durable, live view with useFactorySessionList, useFactorySessionView, and the fold hooks.
audience: developer
section: guides
order: 11
publication: released
proofs:
  list-recent-sessions: [release-npm-looprig-react]
  open-a-session-view: [release-npm-looprig-react]
  view-options: [release-npm-looprig-react, release-npm-looprig-client]
  what-the-view-returns: [release-npm-looprig-react]
  render-rows-and-previews: [release-npm-looprig-react, release-npm-looprig-client]
  earlier-history-and-gate-freshness: [release-npm-looprig-react]
  source: [release-npm-looprig-react]
  proof: [release-npm-looprig-react]
---

# Session views and lists

A session screen needs a durable snapshot that renders even while realtime is unavailable, live updates once the link authorizes, and a transcript you can draw. `useFactorySessionList` and `useFactorySessionView` provide the durable reads and the join; `useFoldedEvents` and `placeLivePreviews` turn the result into rows. Opening a view is a read: it never sends a restore or places a session. Placement follows only from a command such as [restore](/docs/guides/web-ui/sessions/restore).

## List recent sessions

`useFactorySessionList(reads)` reads `GET /v1/sessions` in pages of 100 and returns `sessions`, `nextCursor`, `previousCursor`, `loading`, `loaded`, and `error`, plus `refresh`, `loadNext`, and `loadPrevious`. The store is keyed on the `reads` object, so pass the stable `client.reads` rather than an inline object. An `unauthenticated` or `not_authorized` answer clears the list instead of leaving another caller's rows on screen.

## Open a session view

```tsx
import { placeLivePreviews } from "@looprig/client";
import { useFactoryClient, useFactorySessionView, useFactoryTenantId, useFoldedEvents } from "@looprig/react";

export function SessionScreen({ sessionId }: { sessionId: string }) {
  const client = useFactoryClient();
  const tenantId = useFactoryTenantId();
  const view = useFactorySessionView(client.reads, { tenantId, sessionId });
  const { view: folded } = useFoldedEvents(view.events);
  const rows = folded.rows;
  // Previews are uncommitted; durable rows replace them when the step completes.
  const previews = placeLivePreviews(rows, 0, rows.length, view.liveText, view.liveReasoning);

  if (view.state === "joining" || view.state === "reading") return <p>Loading...</p>;
  if (view.state === "failed") return <p role="alert">{view.error?.message}</p>;
  return (
    <ol data-live={view.liveState}>
      {rows.map((row, index) => (
        <li key={row.ordinal}>
          {row.kind === "assistant" || row.kind === "notice" ? row.text : row.kind}
          {previews.afterRow.get(index)?.map((p) => <em key={`${p.kind}:${p.loopId}:${p.turnId}`}>{p.text}</em>)}
        </li>
      ))}
      {previews.unplaced.map((p) => <li key={`${p.kind}:${p.loopId}:${p.turnId}`}>{p.text}</li>)}
    </ol>
  );
}
```

## View options

Every option except `tenantId` and `sessionId` is a construction input: it is read when the view is built, which happens when the tenant, session, or link changes. A bound that is not a positive safe integer throws `RangeError` before any I/O.

| Option | Default | Meaning |
| --- | --- | --- |
| `coveredThrough` | `0` | Greatest sequence the app has already applied |
| `tailLimit` | `256` | Size of the captured tail and of each continuation page |
| `maxTailPages`, `maxTailEvents`, `maxTailBytes` | `8`, `2048`, `1048576` | Bounds on one captured tail's walk; exceeding one refuses the whole capture |
| `maxRepairAttempts` | `32` | Consecutive repairs with no coverage progress before failing |
| `repairDelayMs` | `250` | Base delay for the second and later non-progressing repairs, doubling |
| `gateRefreshMs` | `1000` | Base delay for re-reading the gate page, doubling to 8 times |

## What the view returns

| Field | Meaning |
| --- | --- |
| `state` | `"reading"`, `"ready"`, or `"failed"` for the durable snapshot (`"joining"` only before effects run) |
| `liveState` | `"joining"`, `"repairing"`, `"live"`, or `"failed"`, independent of `state` |
| `status`, `gates` | The session status and public gate page, or `null` before the first read |
| `events` | Public journal events ascending by `journal_seq` |
| `liveText`, `liveReasoning` | Uncommitted previews, each `{ loopId, turnId, text }`; both arrays are required in 0.2.0 |
| `coveredThrough`, `error` | Durable coverage and the last error |
| `earlierState`, `browseEarlier` | The explicit earlier-history walk |

A ready snapshot stays visible while realtime repairs or fails, so a network drop does not blank the screen.

## Render rows and previews

`useFoldedEvents(events)` folds incrementally and returns `{ view, version }`, where `view.rows` are `TranscriptRow` values discriminated by `kind` (`user`, `assistant`, `tool`, `notice`, `tombstone`). Use `row.ordinal` as the React key. `placeLivePreviews` puts each preview after the last visible row of its loop and turn, or in `unplaced`. Text and reasoning each have a 64 KiB byte budget and a 16-key cap, and both clear on completion, reset, repair, stop, identity change, and access revocation. Hosts that do not publish reasoning leave `liveReasoning` empty. See [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews).

## Earlier history and gate freshness

The view reads only a bounded tail. `browseEarlier()` reads one more page per call, starting at the beginning of the journal, and is never called automatically. The gate page is re-read while any gate is `suspended`, `submitted`, or `unavailable`, or while the journal shows an open gate the page does not list, because answerability can change with no journal event. Fold the page and live gate events into a board with `useGateBoard(sessionId, view)`, as shown in [Composer, gates, and interrupt](/docs/guides/web-ui/react/controls).

## Source

The view and its join state machine are in [`packages/react/src/use-session-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-session-view.ts), the list in [`packages/react/src/use-factory-session-list.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-factory-session-list.ts), and the fold hooks in [`packages/react/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/factory-view.ts). Defaults come from [`packages/client/src/join.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/join.ts), and preview placement from [`packages/client/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-view.ts).

## Proof

[`packages/react/src/use-session-view.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-session-view.test.tsx) covers opening without a restore, cold rendering while realtime is unavailable, reset and repair, preview budgets and clearing, explicit earlier history, and invalid bounds failing before I/O. [`packages/react/src/use-factory-session-list.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-factory-session-list.test.tsx) covers paging and authorization loss. For reconnect semantics, read [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect).
