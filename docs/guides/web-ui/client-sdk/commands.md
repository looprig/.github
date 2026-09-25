---
id: guides/web-ui/client-sdk/commands
title: Commands and gates
description: Send session input, answer opaque gates, create or restore sessions, and interrupt active work through the typed control plane.
audience: developer
section: guides
order: 4
publication: released
proofs:
  send-control-requests: [release-github-com-looprig-client]
  keep-gate-ids-opaque: [release-github-com-looprig-client]
  conformance-contract: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Commands and gates

## Send control requests

`LooprigTransport` exposes five control methods. `createSession` posts optional initial blocks to `/v1/sessions`; `restoreSession` posts an empty body to `/v1/sessions/{sid}/restore`; `submit` posts a `CreateRequest` to `/input`; `respondGate` posts a gate action; and `interrupt` posts an empty body to `/interrupt`.

```ts
import {
  GATE_APPROVAL_ACTIONS,
  createBFFClient,
  generateIdempotencyKey,
  textBlock,
} from "@looprig/client";

const client = createBFFClient();
const key = generateIdempotencyKey();
const created = await client.createSession(
  { blocks: [textBlock("Start") ] },
  { idempotencyKey: key },
);

await client.submit(created.session_id, { blocks: [textBlock("Next") ] });
await client.respondGate(created.session_id, gateId, {
  action: GATE_APPROVAL_ACTIONS.approve,
});
await client.interrupt(created.session_id);
```

Reuse one idempotency key and a byte-identical body across retries of one create. The key is create-only. A different body with the same key is a conflict; restore, input, gate response, and interrupt do not use this header.

## Keep gate IDs opaque

The `gateId` is supplied by session state and is treated as an opaque string. The transport URL-encodes the whole value, but it never splits or interprets it. Use the exported `GATE_APPROVAL_ACTIONS` values for the action union and keep the UI decision separate from URL construction.

```ts
type GateChoice = "approve" | "deny";

async function answer(sessionId: string, gateId: string, choice: GateChoice) {
  const action = choice === "approve"
    ? GATE_APPROVAL_ACTIONS.approve
    : GATE_APPROVAL_ACTIONS.deny;
  return client.respondGate(sessionId, gateId, { action });
}
```

Every response goes through the matching validator and a non-success response becomes a typed error. See [Validation and errors](/docs/guides/web-ui/client-sdk/validation) and [Transport and ownership](/docs/guides/web-ui/client-sdk/ownership) before adding a retry policy.

## Source

Route construction, body handling, idempotency, gate opacity, and control headers are implemented in [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/transport.ts). The shared request and error behavior is covered by [`sdk/core/test/conformance.test.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/test/conformance.test.ts).

## Proof

The conformance suite asserts method, path, body, response DTO, and typed error behavior for both transport implementations. The source also shows that restore and interrupt send no request body and that only create accepts `Idempotency-Key`.

