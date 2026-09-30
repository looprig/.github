---
id: guides/web-ui/client-sdk/live-previews
title: Live text and reasoning previews
description: Decode correlated TokenDelta and tool-call publications into bounded text, reasoning, and tool step previews, place them beside transcript rows, and drop them when the durable journal catches up.
audience: developer
section: guides
order: 4
publication: released
proofs:
  where-previews-come-from: [release-npm-looprig-client]
  decode-a-delta: [release-npm-looprig-client]
  limits-and-rejection: [release-npm-looprig-client]
  live-tool-steps: [release-npm-looprig-client, release-npm-looprig-react]
  place-previews-in-the-transcript: [release-npm-looprig-client]
  preview-lifetime-in-react: [release-npm-looprig-react]
  source: [release-npm-looprig-client, release-npm-looprig-react]
  proof: [release-npm-looprig-client, release-npm-looprig-react]
---

# Live text and reasoning previews

A model's answer is committed to the journal only when a step finishes. Previews let a UI show the words, and optionally the model's public reasoning and its tool calls, while the step is still running. They are display state only. A preview never advances a view's journal coverage, and the committed transcript replaces it. `@looprig/client` 0.3.0 decodes text, reasoning, and tool step previews, and `@looprig/react` 0.3.0 accumulates all three in its session view.

## Where previews come from

A Host with live text enabled forwards public `TokenDelta` previews as ephemeral publications, and Factory relays them to every viewer's [ClientLink subscription](/docs/guides/web-ui/client-sdk/clientlink). Reasoning previews exist only when the Host also enables reasoning publication, and they are then visible to every viewer of the session. Tool step previews exist only when the Host enables tool-step publication, `LiveTextOptions.IncludeToolSteps` in host v0.15.0, which is off by default. Enable previews only once Factory v0.12.1 or later is deployed. See [Host](/docs/modules/host) for the composition options. With none of them enabled, a session produces committed records only and the preview arrays stay empty.

The body of an `ephemeral_publication` is the Harness event itself:

```ts
// The shape decodeFactoryLiveDelta accepts. Anything else returns null.
type TokenDeltaBody = {
  v: 1;
  type: "TokenDelta";
  session_id: string; // must equal the public session you subscribed to
  loop_id: string; // UUID
  turn_id: string; // UUID
  chunk:
    | { chunk_type: "text"; text: string }
    | { chunk_type: "thinking"; thinking: string };
};
```

## Decode a delta

`decodeFactoryLiveDelta(body, publicSessionId)` returns `null` for anything that is not a correlated `TokenDelta` for that session, including other chunk types such as tool use. A text chunk decodes with `kind: "text"`, and a thinking chunk with `kind: "reasoning"`.

```ts
import {
  decodeFactoryLiveDelta,
  livePreviewKey,
  type FactoryLiveTextPreview,
  type FactoryPublication,
} from "@looprig/client";

const previews = new Map<string, FactoryLiveTextPreview>();
const suppressed = new Set<string>();

function onPublication(publication: FactoryPublication, sessionId: string): void {
  if (publication.type !== "ephemeral_publication") return;
  const delta = decodeFactoryLiveDelta(publication.body, sessionId);
  if (delta === null) return;
  const key = livePreviewKey({ kind: delta.kind, loopId: delta.loopId, turnId: delta.turnId, text: "" });
  if ("rejected" in delta) {
    // A malformed or oversized chunk: stop growing this preview. The text
    // already shown stays until the committed StepDone replaces it.
    suppressed.add(key);
    return;
  }
  if (suppressed.has(key)) return;
  const prior = previews.get(key);
  previews.set(key, { ...delta, text: (prior?.text ?? "") + delta.text });
}
```

`FactoryLiveTextPreview` is the text and reasoning shape. Before 0.3.0 it was named `FactoryLivePreview`, which is now the wider union described below under placement. `decodeFactoryLiveText` keeps the 0.1.0 text-only result for existing consumers: it returns `{ loopId, turnId, text }`, a rejection, or `null`, and it returns `null` for a reasoning delta.

## Limits and rejection

| Constant | Value | Applies to |
| --- | --- | --- |
| `MAX_FACTORY_LIVE_TEXT_CHUNK_BYTES` | 16,384 | The UTF-8 size of one delta's `text` or `thinking`. |
| `MAX_FACTORY_LIVE_TEXT_BODY_BYTES` | 102,400 | The JSON-encoded body, which allows for escaping. Tool-call bodies share this limit. |
| `MAX_FACTORY_LIVE_TOOL_SUMMARY_BYTES` | 4,096 | The UTF-8 size of a tool step's summary. |
| `MAX_FACTORY_LIVE_TOOL_RESULT_BYTES` | 16,384 | The UTF-8 size of a tool step's result preview. |

Host sends at most 4 KiB of text per delta, so the client accepts four times that. A correlated delta whose text is not a non-empty string, exceeds either limit, or cannot be encoded returns `{ kind, rejected: true, loopId, turnId }` so the caller can suppress that one key. A chunk that is not an object cannot be classified and is rejected as text, matching 0.1.0. Host caps a tool summary at 1 KiB and harness caps a result preview at 2 KiB, so the tool limits also leave headroom. A tool body over any limit, or malformed in any way, decodes to `null` rather than a rejection: a tool step accumulates nothing, so there is no key to suppress.

## Live tool steps

A Host with tool-step publication relays harness's public `ToolCallStarted` and `ToolCallCompleted` events in the same `ephemeral_publication` frames. `decodeFactoryLiveToolStep(body, publicSessionId)` decodes either one into a `FactoryLiveToolStep` keyed by `toolExecutionId`, and returns `null` for anything else, including a `TokenDelta`. Try it before `decodeFactoryLiveDelta`, as the React view does.

| Field | Meaning |
| --- | --- |
| `phase` | `"started"` or `"completed"`. |
| `loopId`, `turnId`, `stepId` | The step's scope. `stepId` is `""` when the body names no step. |
| `toolExecutionId` | The live step's identity. |
| `toolUseId` | The model's `tool_use` block id, the key the committed `StepDone` carries. `""` from a runtime older than harness v0.42.0. |
| `toolName` | `""` on a Completed from a runtime older than harness v0.42.0. |
| `summary` | The tool's redacted audit summary. Only a Started carries it. |
| `isError` | An absent `is_error` means success; an explicit `null` or non-boolean makes the body invalid. |
| `resultPreview` | A bounded preview of the result. Only a Completed carries it. |
| `elapsedMs` | Optional execution time, absent when the call failed before running or the runtime is older. |

`liveToolRows(steps)` maps steps to the `ToolRow` a renderer already draws for committed tool calls, with `live: true`, no journal sequence, an ordinal of `-1`, and a status of `running`, `ok`, or `error`.

```ts
import {
  decodeFactoryLiveToolStep,
  liveToolRows,
  type FactoryLiveToolStep,
  type FactoryPublication,
  type ToolRow,
} from "@looprig/client";

const steps = new Map<string, FactoryLiveToolStep>();

function onToolPublication(publication: FactoryPublication, sessionId: string): ToolRow[] {
  if (publication.type === "ephemeral_publication") {
    const step = decodeFactoryLiveToolStep(publication.body, sessionId);
    if (step !== null) {
      // A Completed replaces its Started. Keep the summary, which only the Started carries.
      const prior = steps.get(step.toolExecutionId);
      steps.set(step.toolExecutionId, { ...step, summary: step.summary || (prior?.summary ?? "") });
    }
  }
  return liveToolRows([...steps.values()]);
}
```

A live step is a preview of a row the journal commits moments later. Drop it when a committed `StepDone` carries a `tool_use` block with the same `toolUseId`, or belongs to the same loop, turn, and step. The second rule covers older runtimes, which send no `toolUseId`. [`@looprig/react`](/docs/guides/web-ui/react/session-view) does this for you.

> **Privacy.** Every viewer of the session receives tool step previews: the tool's redacted audit summary, never its raw arguments, and a result preview of at most 2 KiB from Host. That is the same content the committed step shows moments later. Clients at 0.2.0 or older ignore these frames.

## Place previews in the transcript

Text and reasoning previews are identified by kind, loop, and turn, so text and reasoning for the same turn are separate previews. `placeLivePreviews` positions them against the visible rows of a [folded transcript](/docs/guides/web-ui/client-sdk/fold). Called with five arguments it returns only `FactoryLiveTextPreview` values, exactly as in 0.2.0.

```ts
import { placeLivePreviews, type TranscriptRow } from "@looprig/client";

type Preview = { loopId: string; turnId: string; text: string };

function layout(rows: readonly TranscriptRow[], liveText: readonly Preview[], liveReasoning: readonly Preview[]) {
  // start and end bound the rows currently rendered, for example a virtual list window.
  const { afterRow, unplaced } = placeLivePreviews(rows, 0, rows.length, liveText, liveReasoning);
  for (const [index, previews] of afterRow) {
    console.log(`after row ${index}`, previews.map((preview) => preview.kind));
  }
  // Turns with no visible row yet render at the tail, in first-seen order.
  return unplaced;
}
```

Each preview goes after the last visible row with the same loop and turn. When no such row is in the window, it is returned in `unplaced`, grouped by turn in first-seen order with reasoning before text.

Pass live tool rows as an optional sixth argument to place them too, after reasoning and text within a turn, in the order given. The six-argument form returns `PlacedLivePreviews<FactoryLivePreview>`, where `FactoryLivePreview` is now a union of `FactoryLiveTextPreview` and `{ kind: "tool", loopId, turnId, row }`. An exhaustive `switch (preview.kind)` over it needs a `"tool"` arm. `livePreviewKey` identifies a tool preview as `tool:<toolExecutionId>`.

```ts
import {
  livePreviewKey,
  liveToolRows,
  placeLivePreviews,
  type FactoryLivePreview,
  type FactoryLiveToolStep,
  type TranscriptRow,
} from "@looprig/client";

type TextPreview = { loopId: string; turnId: string; text: string };

function describe(preview: FactoryLivePreview): string {
  switch (preview.kind) {
    case "reasoning":
    case "text":
      return `${preview.kind}: ${preview.text}`;
    case "tool":
      return `${preview.row.toolName} (${preview.row.status}) ${preview.row.summary}`;
  }
}

function layoutAll(
  rows: readonly TranscriptRow[],
  liveText: readonly TextPreview[],
  liveReasoning: readonly TextPreview[],
  liveToolSteps: readonly FactoryLiveToolStep[],
) {
  const { afterRow, unplaced } = placeLivePreviews(
    rows, 0, rows.length, liveText, liveReasoning, liveToolRows(liveToolSteps),
  );
  for (const [index, previews] of afterRow) {
    for (const preview of previews) console.log(index, livePreviewKey(preview), describe(preview));
  }
  return unplaced;
}
```

## Preview lifetime in React

`useFactorySessionView` returns `liveText` and `liveReasoning` arrays of `{ loopId, turnId, text }`. `liveReasoning` has been a required member of `UseFactorySessionViewResult` since 0.2.0, and 0.3.0 adds a required `liveToolSteps` array of `FactoryLiveToolStep`, so code that builds that type, such as a test double, must supply `liveReasoning: []` and `liveToolSteps: []`. Text and reasoning each have their own 64 KiB byte budget and a cap of 16 concurrent keys. A delta past the byte budget, or a rejected delta, freezes its key at its last visible text until the turn commits, and a new key past the cap is not shown. Updates are batched to one animation frame. A loop's text and reasoning previews clear at its `StepDone`, a turn's at `TurnDone`, `TurnFailed`, or `TurnInterrupted`, and all of them at `SessionStopped`, a reset, a repair, a stop, an identity change, or access revocation. Tool steps follow the same turn and session rules, with two differences: a `StepDone` removes only the steps it commits, and the view keeps at most 64 steps. See [Session views and lists](/docs/guides/web-ui/react/session-view) for the full tool step rules.

## Source

The text and reasoning decoders and limits are in [`packages/client/src/factory-live-text.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-live-text.ts), and the tool step decoder and its limits in [`packages/client/src/factory-live-tool-step.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-live-tool-step.ts). `livePreviewKey`, `liveToolRows`, and `placeLivePreviews` are in [`packages/client/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-view.ts). The React accumulation, budgets, and clearing rules are in [`packages/react/src/use-session-view.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-session-view.ts).

## Proof

[`packages/client/test/factory-live-text.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-live-text.test.ts) covers text and thinking decoding, the unchanged text-only API, both size limits, a foreign session, unrelated chunk types, and the 0.1.0 non-object rule. [`packages/client/test/factory-view.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-view.test.ts) covers preview identity and placement, including tool rows. [`packages/client/test/factory-live-tool-step.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-live-tool-step.test.ts) covers tool step decoding for current and older runtimes, the size limits, and the `is_error` rules. [`packages/react/src/use-session-view.test.tsx`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-session-view.test.tsx) covers the React budgets, clearing, and tool step reconciliation. Continue with [Commands and gates](/docs/guides/web-ui/client-sdk/commands).
