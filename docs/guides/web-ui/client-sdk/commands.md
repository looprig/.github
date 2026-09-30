---
id: guides/web-ui/client-sdk/commands
title: Commands and gates
description: Send create, input, interrupt, restore, and gate responses to Factory with a fixed command identity, retry without duplicates, and settle lost acknowledgements.
audience: developer
section: guides
order: 5
publication: released
proofs:
  mint-a-command-once: [release-npm-looprig-client]
  send-retry-and-resolve: [release-npm-looprig-client]
  message-metadata: [release-npm-looprig-client]
  answer-a-resident-gate: [release-npm-looprig-client]
  survive-a-reload: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Commands and gates

A browser action such as sending a message must reach Factory exactly once, even when the WebSocket drops before the acknowledgement arrives. `@looprig/client` gets there by fixing each command's identity before anything is sent and by resending only the retained bytes. The public boundary is `FactoryClient.commands`, which sends over the application's ClientLink (see [ClientLink and live streams](/docs/guides/web-ui/client-sdk/clientlink)) and reads outcomes back from Factory's REST command-status route.

## Mint a command once

`createFactoryCommands` (or `createFactoryClient`, which calls it) returns five builders. Each returns a `PendingCommand` holding a fresh `CommandID` and a JSON snapshot of the exact Core V1 envelope. `create` also mints the new `SessionID` in the browser, so the session identity is known before Factory answers.

| Builder | ClientLink method | Envelope beyond `version`, `command_id`, `session_id` |
|---|---|---|
| `create({ agentId, blocks?, metadata? })` | `session.create` | `agent_id`, optional `blocks` and `metadata` |
| `input(sessionId, { blocks, metadata? })` | `session.input` | non-empty `blocks`, optional `metadata` |
| `interrupt(sessionId)` | `session.interrupt` | none |
| `restore(sessionId)` | `session.restore` | none |
| `respondResidentGate(sessionId, input)` | `gate.respond` | `gate_id`, `action`, `values`, one expected open identity |

```ts
import { createFactoryClient, textBlock } from "@looprig/client";

const client = createFactoryClient({ baseUrl: "https://factory.example" });

// One user action, one identity. Keep this object until the outcome is durable.
const pending = client.commands.input(sessionId, { blocks: [textBlock("Run the tests")] });
console.log(pending.commandId, pending.method); // "session.input"
```

Identities are opaque, non-empty UTF-8 strings of at most 256 bytes. A generator that returns anything else fails with `CommandIdentityError` before a request exists. `textBlock` produces the Harness wire shape `{ type: "text", Text }`; the capital `T` is required.

## Send retry and resolve

`submit()` sends the retained envelope once and throws on failure. `retry()` is the same call: it never mints a replacement identity, so Factory sees the same command again. `attempt()` turns the ambiguity into data, which is usually what a UI wants.

```ts
const result = await pending.attempt();
switch (result.outcome) {
  case "resolved":
    // CommandStatus: accepted, pending, applied, or rejected.
    show(result.status.status);
    break;
  case "rejected":
    // A validated Core error envelope: definitive, the command was refused.
    showError(result.error.code);
    break;
  case "unknown": {
    // Transport or malformed reply. Admission may already have committed.
    const status = await pending.resolve({ signal: AbortSignal.timeout(5_000) });
    show(status.status);
    break;
  }
}
```

`resolve()` reads `GET /v1/sessions/{sid}/commands/{cid}` for exactly this pair, with the same injected `fetch`, `baseUrl`, and `credentials.restHeaders()` as the REST reads. A reply for any other command id raises `CommandIdentityMismatchError`, on both the RPC and the REST path. `pending.request` returns a fresh copy of the snapshot, so inspecting or mutating it cannot change what a retry sends.

## Message metadata

`create` and `input` accept Core `MessageMetadata`: app-defined string fields that Factory records for audit and never places in the public journal. The client validates them before minting an identity and throws `MessageMetadataError` with a `code` of `too_many_fields`, `invalid_key`, `reserved_key`, `value_too_large`, `invalid_value`, or `too_large`.

| Limit | Value |
|---|---|
| `MAX_METADATA_FIELDS` | 16 |
| `MAX_METADATA_KEY_BYTES` | 64, matching `^[a-z][a-z0-9_]{0,63}$`, never starting with `looprig` |
| `MAX_METADATA_VALUE_BYTES` | 1024, no control characters other than tab and newline |
| `MAX_METADATA_BYTES` | 4096 for the canonical encoded object |

An empty object is omitted from the envelope. The browser never sends a principal; Factory stamps the verified sender itself.

## Answer a resident gate

A gate is a durable pause waiting for a person (see [Approval gates](/docs/guides/harness/gates/approval-gates)). Offer an answer only when Factory's gate page says a live Host owns it: `acceptsResidentResponse(gate)` is true for `answerability === "resident"` and nothing else, including `suspended`, an unknown value, and the empty value of a gate seen only through a `GateOpened` event. For a permission gate, submit one of the exact `GATE_APPROVAL_ACTIONS` strings; Harness rejects any other label.

```ts
import { acceptsResidentResponse, GATE_APPROVAL_ACTIONS, publicGates } from "@looprig/client";

for (const gate of publicGates(board)) {
  if (!acceptsResidentResponse(gate)) continue;
  const answer = client.commands.respondResidentGate(gate.sessionId, {
    gateId: gate.gateId,
    action: GATE_APPROVAL_ACTIONS.approve, // "Approve"
    values: {},
    // Exactly one optimistic identity for the open gate.
    expectedOpenEventId: gate.openedEventId,
  });
  await answer.attempt();
}
```

The builder throws unless exactly one of `expectedOpenEventId` or `expectedOpenJournalSeq` is present, `action` is non-blank, and `values` is an object. [Folding session state](/docs/guides/web-ui/client-sdk/fold) explains where `board` comes from.

## Survive a reload

A `PendingCommand` lives in memory. `PendingSlot` persists its bytes in `localStorage` before the first send, one slot per control (`pendingCreateKey(namespace)` or `pendingInputKey(sessionId, namespace)`), and removes it only on a durable outcome. Recovery reads the command back by identity: found means admitted and it is never resent; Factory's 404 `command_not_found` means it never was, so the same id and bytes are resent. `sendOrAdopt(slot, mint)` completes a retained command instead of minting a second one. A send in flight in another tab holds a `SEND_LEASE_MS` lease of 15 seconds, a never-admitted command older than `STALE_SLOT_MS` (10 minutes) is resent only after confirmation, and `sweepPendingSlots` drops slots older than seven days. `PendingController` wraps a slot for a composer, and `@looprig/react`'s `usePendingInput` binds it to a component (see [Composer, gates, and interrupt](/docs/guides/web-ui/react/controls)).

## Source

Command builders, identity checks, metadata validation, and `PendingCommand` are in [`packages/client/src/commands.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/commands.ts). Gate action strings and the resident check are in [`gate-actions.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/gate-actions.ts), the text block helper in [`content.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/content.ts), and reload-durable slots in [`pending-store.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/pending-store.ts).

## Proof

[`commands.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/commands.test.ts) checks exact V1 envelopes for all five builders, byte-stable retries that reuse both create identities, the resolved, rejected, and unknown outcomes, identity mismatch, and metadata limits. [`pending-store.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/pending-store.test.ts) covers lost acknowledgements across reloads, two tabs sharing one slot, and slot age. [`gate.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/gate.test.ts) pins the resident-only check. Continue with [Validation and errors](/docs/guides/web-ui/client-sdk/validation) for the error types these calls raise.
