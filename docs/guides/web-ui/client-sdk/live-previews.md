---
id: guides/web-ui/client-sdk/live-previews
title: Live text and reasoning previews
description: Decode correlated TokenDelta publications into bounded text and reasoning previews, place them beside transcript rows, and drop them when the durable journal catches up.
audience: developer
section: guides
order: 4
publication: released
proofs:
  where-previews-come-from: [release-npm-looprig-client]
  decode-a-delta: [release-npm-looprig-client]
  limits-and-rejection: [release-npm-looprig-client]
  place-previews-in-the-transcript: [release-npm-looprig-client]
  preview-lifetime-in-react: [release-npm-looprig-react]
  source: [release-npm-looprig-client, release-npm-looprig-react]
  proof: [release-npm-looprig-client, release-npm-looprig-react]
---

# Live text and reasoning previews

A model's answer is committed to the journal only when a step finishes. Previews let a UI show the words, and optionally the model's public reasoning, while they are still being written. They are display state only. A preview never advances a view's journal coverage, and the committed transcript replaces it. `@looprig/client` 0.2.0 decodes both kinds, and `@looprig/react` 0.2.0 accumulates them in its session view.

## Where previews come from

A Host with live text enabled forwards public `TokenDelta` previews as ephemeral publications, and Factory relays them to every viewer's [ClientLink subscription](/docs/guides/web-ui/client-sdk/clientlink). Reasoning previews exist only when the Host also enables reasoning publication, and they are then visible to every viewer of the session. See [Host](/docs/modules/host) for the composition options. With neither enabled, a session produces committed records only and the preview arrays stay empty.

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
  type FactoryLivePreview,
  type FactoryPublication,
} from "@looprig/client";

const previews = new Map<string, FactoryLivePreview>();
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

`decodeFactoryLiveText` keeps the 0.1.0 text-only result for existing consumers: it returns `{ loopId, turnId, text }`, a rejection, or `null`, and it returns `null` for a reasoning delta.

## Limits and rejection

| Constant | Value | Applies to |
| --- | --- | --- |
| `MAX_FACTORY_LIVE_TEXT_CHUNK_BYTES` | 16,384 | The UTF-8 size of one delta's `text` or `thinking`. |
| `MAX_FACTORY_LIVE_TEXT_BODY_BYTES` | 102,400 | The JSON-encoded body, which allows for escaping. |

Host sends at most 4 KiB of text per delta, so the client accepts four times that. A correlated delta whose text is not a non-empty string, exceeds either limit, or cannot be encoded returns `{ kind, rejected: true, loopId, turnId }` so the caller can suppress that one key. A chunk that is not an object cannot be classified and is rejected as text, matching 0.1.0.

## Place previews in the transcript

A preview's identity is its kind, loop, and turn, so text and reasoning for the same turn are separate previews. `placeLivePreviews` positions them against the visible rows of a [folded transcript](/docs/guides/web-ui/client-sdk/fold).

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

## Preview lifetime in React

`useFactorySessionView` returns `liveText` and `liveReasoning` arrays of `{ loopId, turnId, text }`. `liveReasoning` is a required member of `UseFactorySessionViewResult` in 0.2.0, so code that builds that type, such as a test double, must supply `liveReasoning: []`. Each kind has its own 64 KiB byte budget and a cap of 16 concurrent keys, A delta past the byte budget, or a rejected delta, freezes its key at its last visible text until the turn commits, and a new key past the cap is not shown. Updates are batched to one animation frame. A loop's previews clear at its `StepDone`, a turn's at `TurnDone`, `TurnFailed`, or `TurnInterrupted`, and all of them at `SessionStopped`, a reset, a repair, a stop, an identity change, or access revocation. See [Session views and lists](/docs/guides/web-ui/react/session-view).

## Source

The decoders and limits are in [`packages/client/src/factory-live-text.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-live-text.ts). `livePreviewKey` and `placeLivePreviews` are in [`packages/client/src/factory-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-view.ts). The React accumulation, budgets, and clearing rules are in [`packages/react/src/use-session-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-session-view.ts).

## Proof

[`packages/client/test/factory-live-text.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/factory-live-text.test.ts) covers text and thinking decoding, the unchanged text-only API, both size limits, a foreign session, unrelated chunk types, and the 0.1.0 non-object rule. [`packages/client/test/factory-view.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/factory-view.test.ts) covers preview identity and placement. [`packages/react/src/use-session-view.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-session-view.test.tsx) covers the React budgets and clearing. Continue with [Commands and gates](/docs/guides/web-ui/client-sdk/commands).
