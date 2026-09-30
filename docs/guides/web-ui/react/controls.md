---
id: guides/web-ui/react/controls
title: Composer, gates, and interrupt
description: Send input, answer approval gates, and interrupt a turn with retry-stable React controls that never duplicate a logical command.
audience: developer
section: guides
order: 12
publication: released
proofs:
  one-action-one-command: [release-npm-looprig-react]
  send-input: [release-npm-looprig-react]
  answer-gates: [release-npm-looprig-react, release-npm-looprig-client]
  interrupt-a-turn: [release-npm-looprig-react]
  survive-a-reload: [release-npm-looprig-react, release-npm-looprig-client]
  source: [release-npm-looprig-react]
  proof: [release-npm-looprig-react]
---

# Composer, gates, and interrupt

These hooks turn a user's click into exactly one Factory command, even across double clicks, lost replies, reconnects, and component remounts. They take a session id, reach the command plane through `useFactoryClient().commands`, and send nothing when they mount.

## One action, one command

Each control mints one `PendingCommand` per user action and keeps it until Core reports a durable outcome. A retry replays the same envelope and command id; it never mints a second one. Retained envelopes are scoped to the application's command plane and the session, not to a component, so a remounted composer inherits an outstanding send. Controls in different sessions, and the composer, interrupt, and each gate within one session, never block each other. Every action resolves to a `CommandResult` and never rejects.

| `outcome` | Meaning | Envelope |
| --- | --- | --- |
| `accepted` | Core admitted or applied the command | Released |
| `rejected` | A durable, typed rejection (`error` is a `CoreProtocolError`) | Released |
| `pending` | Core has not decided yet | Retained for `retry` |
| `unknown` | The reply was lost; admission may have committed | Retained for `retry` |
| `refused` | This control already holds an envelope; its `commandId` is returned | Unchanged |
| `cancelled` | Cancelled or superseded while in flight | Released |
| `none` | Nothing sent: an empty draft, no envelope to retry, or an unanswerable gate | None |

## Send input

`useFactoryComposer(sessionId)` returns `pending`, `text` (what a retry will replay), `error`, and `submit`, `retry`, `cancel`, and `clearError`. `submit` trims the draft and sends it as one text block; an empty draft returns `none`.

```tsx
import { useState } from "react";
import { useFactoryComposer, useFactoryInterrupt } from "@looprig/react";

export function Composer({ sessionId }: { sessionId: string }) {
  const composer = useFactoryComposer(sessionId);
  const stop = useFactoryInterrupt(sessionId);
  const [draft, setDraft] = useState("");

  async function send() {
    const result = await composer.submit(draft);
    if (result.outcome === "accepted") setDraft("");
    // "unknown" or "pending": keep the draft and offer composer.retry().
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void send(); }}>
      <textarea value={composer.pending ? composer.text : draft} onChange={(e) => setDraft(e.target.value)} />
      <button disabled={composer.pending?.sending}>Send</button>
      {composer.pending && !composer.pending.sending && <button type="button" onClick={() => void composer.retry()}>Retry</button>}
      <button type="button" onClick={() => void stop.interrupt()}>Stop</button>
      {composer.error && <p role="alert">{composer.error.message}</p>}
    </form>
  );
}
```

## Answer gates

`useFactoryGate(sessionId, board)` takes a `PublicGateBoard` rather than reading one, so the cards and the answer path share one list. Build the board with `useGateBoard(sessionId, view)` from a [session view](/docs/guides/web-ui/react/session-view). Each entry in `gates` adds `answerable`, `pending`, `responding`, and `error`. `answerable` is true only when Factory attests the gate as `resident`, meaning a live Host can apply the answer; any other state sends nothing and returns `none`.

```tsx
import { GATE_APPROVAL_ACTIONS, useFactoryGate, useGateBoard, type UseFactorySessionViewResult } from "@looprig/react";

export function Gates({ sessionId, view }: { sessionId: string; view: UseFactorySessionViewResult }) {
  const board = useGateBoard(sessionId, view);
  const { gates, respond } = useFactoryGate(sessionId, board);
  return gates.map((gate) => (
    <div key={gate.gateId}>
      {/* Send the action strings verbatim; Harness matches them exactly. */}
      <button disabled={!gate.answerable || gate.responding} onClick={() => void respond(gate, GATE_APPROVAL_ACTIONS.approve)}>Approve</button>
      <button disabled={!gate.answerable || gate.responding} onClick={() => void respond(gate, GATE_APPROVAL_ACTIONS.deny)}>Deny</button>
    </div>
  ));
}
```

The three actions are `"Approve"`, `"Approve always for this workspace"`, and `"Deny"`. A response names the gate's open event id, or its open journal sequence when only that is attested, so it cannot land on a different gate. Answers carry no form values in 0.3.0. `retry(gateId)` and `cancel(gateId)` act on one gate's slot.

## Interrupt a turn

`useFactoryInterrupt(sessionId)` returns `pending`, `error`, `interrupt`, `retry`, and `cancel`. An accepted result means Factory admitted the interrupt, not that a turn was running; read the journal events to see what stopped.

## Survive a reload

The controls above retain envelopes in memory. `usePendingInput(sessionId, client, handlers, { storage, namespace, resolver })` persists one composer input per session in a `Storage` such as `localStorage`, shared by every tab, and recovers it after a reload by reading `GET /v1/sessions/{sid}/commands/{cid}` through a `CommandResolver` from `createCommandResolver`. `handlers.onAccepted` and `handlers.onReturned` report admission or hand the text back.

## Source

The hooks are [`packages/react/src/use-composer.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-composer.ts), [`packages/react/src/use-gate.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-gate.ts), [`packages/react/src/use-interrupt.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-interrupt.ts), and [`packages/react/src/use-pending-input.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-pending-input.ts). Retention and `CommandResult` are in [`packages/react/src/stores/pending.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/pending.ts), gate identity in [`packages/react/src/stores/gate.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/gate.ts), and the action strings in [`packages/client/src/gate-actions.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/gate-actions.ts).

## Proof

[`packages/react/src/use-factory-controls.test.tsx`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/use-factory-controls.test.tsx) runs every control through repeat clicks, disconnect retries, lost responses, remounts, and typed rejections. [`packages/react/src/stores/composer.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/composer.test.ts) and [`packages/react/src/stores/gate.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/stores/gate.test.ts) pin durable outcomes and gate open identity. The framework-neutral contract is in [Commands and gates](/docs/guides/web-ui/client-sdk/commands).
