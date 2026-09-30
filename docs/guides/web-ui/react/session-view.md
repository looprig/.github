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
  live-tool-steps: [release-npm-looprig-react, release-npm-looprig-client]
  earlier-history: [release-npm-looprig-react]
  gate-freshness: [release-npm-looprig-react]
  source: [release-npm-looprig-react]
  proof: [release-npm-looprig-react]
---

# Session views and lists

A session screen needs a durable snapshot that renders even while realtime is unavailable, live updates once the link authorizes, and a transcript you can draw. `useFactorySessionList` and `useFactorySessionView` provide the durable reads and the join; `useFoldedEvents` and `placeLivePreviews` turn the result into rows. Opening a view is a read: it never sends a restore or places a session. Placement follows only from a command such as [restore](/docs/guides/web-ui/sessions/restore).

## List recent sessions

`useFactorySessionList(reads)` reads `GET /v1/sessions` in pages of 100 and returns `sessions`, `nextCursor`, `previousCursor`, `loading`, `loaded`, and `error`, plus `refresh`, `loadNext`, and `loadPrevious`. The store is keyed on the `reads` object, so pass the stable `client.reads` rather than an inline object. An `unauthenticated` or `not_authorized` answer clears the list instead of leaving another caller's rows on screen.

## Open a session view

```tsx
import { livePreviewKey, liveToolRows, placeLivePreviews, type FactoryLivePreview } from "@looprig/client";
import { useFactoryClient, useFactorySessionView, useFactoryTenantId, useFoldedEvents } from "@looprig/react";

function Preview({ preview }: { preview: FactoryLivePreview }) {
  switch (preview.kind) {
    case "reasoning":
    case "text":
      return <em>{preview.text}</em>;
    case "tool":
      // A live tool row: redacted summary while running, bounded result preview once completed.
      return <em>{`${preview.row.toolName} ${preview.row.status}: ${preview.row.summary || preview.row.result}`}</em>;
  }
}

export function SessionScreen({ sessionId }: { sessionId: string }) {
  const client = useFactoryClient();
  const tenantId = useFactoryTenantId();
  const view = useFactorySessionView(client.reads, { tenantId, sessionId });
  const { view: folded } = useFoldedEvents(view.events);
  const rows = folded.rows;
  // Previews are uncommitted; durable rows replace them when the step completes.
  const previews = placeLivePreviews(
    rows, 0, rows.length, view.liveText, view.liveReasoning, liveToolRows(view.liveToolSteps),
  );

  if (view.state === "joining" || view.state === "reading") return <p>Loading...</p>;
  if (view.state === "failed") return <p role="alert">{view.error?.message}</p>;
  return (
    <ol data-live={view.liveState}>
      {rows.map((row, index) => (
        <li key={row.ordinal}>
          {row.kind === "assistant" || row.kind === "notice" ? row.text : row.kind}
          {previews.afterRow.get(index)?.map((p) => <Preview key={livePreviewKey(p)} preview={p} />)}
        </li>
      ))}
      {previews.unplaced.map((p) => <li key={livePreviewKey(p)}><Preview preview={p} /></li>)}
    </ol>
  );
}
```

## View options

Every option except `tenantId` and `sessionId` is a construction input: it is read when the view is built, which happens when the tenant, session, or link changes. A bound that is not a positive safe integer throws `RangeError` before any I/O.

| Option | Default | Meaning |
| --- | --- | --- |
| `coveredThrough` | `0` | Greatest sequence the app has already applied |
| `tailLimit` | `256` | Size of the captured tail, of each continuation page, and of each earlier-history window |
| `maxTailPages`, `maxTailEvents`, `maxTailBytes` | `8`, `2048`, `1048576` | Bounds on one captured tail's walk; exceeding one refuses the whole capture. `maxTailPages` also bounds the reads of one `browseEarlier()` call |
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
| `liveText`, `liveReasoning` | Uncommitted previews, each `{ loopId, turnId, text }`; both arrays are required |
| `liveToolSteps` | Uncommitted tool calls as `FactoryLiveToolStep` values, in first-seen order; required since 0.3.0 |
| `coveredThrough`, `error` | Durable coverage and the last error |
| `earlierState`, `earlierFrom`, `browseEarlier` | The explicit, backward earlier-history walk |

A ready snapshot stays visible while realtime repairs or fails, so a network drop does not blank the screen. Code that constructs `UseFactorySessionViewResult` itself, such as a test double, must supply `liveReasoning: []` and, since 0.3.0, `liveToolSteps: []`. `earlierFrom` is optional in the type so a 0.2.0 double still compiles, but the hook always sets it.

## Render rows and previews

`useFoldedEvents(events)` folds incrementally and returns `{ view, version }`, where `view.rows` are `TranscriptRow` values discriminated by `kind` (`user`, `assistant`, `tool`, `notice`, `tombstone`). Use `row.ordinal` as the React key. `placeLivePreviews` puts each preview after the last visible row of its loop and turn, or in `unplaced`. Text and reasoning each have a 64 KiB byte budget and a 16-key cap, and both clear on completion, reset, repair, stop, identity change, and access revocation. Hosts that do not publish reasoning leave `liveReasoning` empty. Pass `liveToolRows(view.liveToolSteps)` as the sixth argument to place tool steps too; the result is then the `FactoryLivePreview` union, so a `switch` on `kind` needs a `"tool"` arm. See [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews).

## Live tool steps

`liveToolSteps` holds tool calls that have started or finished but are not yet committed. It stays empty unless the Host publishes tool steps (host v0.15.0 with `LiveTextOptions.IncludeToolSteps`, off by default) behind Factory v0.12.1 or later. Every viewer of the session sees them: the redacted audit summary, never raw arguments, and a result preview of at most 2 KiB from Host, the same content the committed step shows moments later.

The view keeps a step until the journal commits it, so a call never renders twice:

- A `ToolCallCompleted` updates its step, or creates it when the `ToolCallStarted` was lost.
- A committed `StepDone` removes the steps whose `toolUseId` it commits, then those in its own loop, turn, and step, in the same snapshot that adds the folded row.
- A late step that a loaded `StepDone` already commits is ignored, whether that record came from the live stream, the REST catch-up, or an earlier-history page, and across reconnects.
- A turn's `TurnDone`, `TurnFailed`, or `TurnInterrupted` removes its steps, and a late step for an ended turn or a stopped session is ignored.
- A reset, repair, reconnect, stop, identity change, or access revocation clears every step.
- At most 64 steps are kept. The oldest completed step is evicted first, then the oldest running one.

Steps share the text frame batching and never change journal coverage.

## Earlier history

The view reads only a bounded tail. `browseEarlier()` loads older history on demand and is never called automatically. Each call pages backward from the oldest loaded record: it reads windows of at most `tailLimit` records until one holds a public event or sequence 1 is reached, and prepends what it found. Factory has no backward page, so each window is read with forward `from_seq` reads, several if Factory clamps the limit, each required to advance coverage. One call makes at most `maxTailPages` reads under a 1 MiB byte budget, and a window is shown whole or not at all. No journal cursor is sent. Records already loaded are not duplicated, and live records arriving meanwhile are kept.

| `earlierState` | Meaning |
| --- | --- |
| `"idle"` | No earlier window has been requested since the view opened or was reset |
| `"loading"` | A call is reading windows |
| `"available"` | More earlier history can be requested |
| `"complete"` | The view holds the journal from sequence 1 |
| `"failed"` | The last call failed; `error` says why, and windows covered before the failure are kept |

`earlierFrom` is the lowest sequence from which the view holds every public event contiguously, or `null` before a window lands and after a reset. Repeated calls accumulate history. A call stopped by its page bound keeps the floor it reached, so the next call continues from there. A call before the first durable snapshot does nothing. Loaded windows stay until a lowered reset, access revocation, or identity change. Release 0.2.0 walked forward from the start of the journal with one replaceable page instead.

```tsx
import type { UseFactorySessionViewResult } from "@looprig/react";

// Pass the view from the screen that opened it; do not open a second view.
export function EarlierHistoryButton({ view }: { view: UseFactorySessionViewResult }) {
  if (view.earlierState === "complete") return <p>Start of session</p>;
  return (
    <button disabled={view.status === null || view.earlierState === "loading"} onClick={() => void view.browseEarlier()}>
      {view.earlierState === "failed" ? "Retry earlier history" : "Show earlier"}
    </button>
  );
}
```

## Gate freshness

The gate page is re-read while any gate is `suspended`, `submitted`, or `unavailable`, or while the journal shows an open gate the page does not list, because answerability can change with no journal event. Fold the page and live gate events into a board with `useGateBoard(sessionId, view)`, as shown in [Composer, gates, and interrupt](/docs/guides/web-ui/react/controls).

## Source

The view and its join state machine are in [`packages/react/src/use-session-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-session-view.ts), the list in [`packages/react/src/use-factory-session-list.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-factory-session-list.ts), and the fold hooks in [`packages/react/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/factory-view.ts). Defaults come from [`packages/client/src/join.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/join.ts), and preview placement from [`packages/client/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-view.ts).

## Proof

[`packages/react/src/use-session-view.test.tsx`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-session-view.test.tsx) covers opening without a restore, cold rendering while realtime is unavailable, reset and repair, preview budgets and clearing, live tool step reconciliation, clearing, and the 64-step cap, backward earlier-history windows and their bounds, and invalid bounds failing before I/O. [`packages/react/src/use-factory-session-list.test.tsx`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-factory-session-list.test.tsx) covers paging and authorization loss. For reconnect semantics, read [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect).
