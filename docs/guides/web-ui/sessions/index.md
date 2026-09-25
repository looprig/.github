---
id: guides/web-ui/sessions/index
title: Session lifecycle
description: Model a session from discovery and status reads through binding, exact live reconnects, and durable restoration.
audience: developer
section: guides
order: 16
publication: released
proofs:
  model-session-state: [release-github-com-looprig-client]
  use-the-transport-lifecycle: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Session lifecycle

## Model session state

The client separates cold session reads from ongoing live state. `SessionList` pages summaries with `skip`, `limit`, `next_skip`, and `done`. `SessionStatus` is the projected status for one id. `EventJournalPage` carries durable events and a `next_journal_seq` cursor. A UI can use these DTOs for loading and navigation, then hand the journal and live stream to `joinSessionView` for one `SessionView`.

```ts
import { createBFFClient } from "@looprig/client";

const transport = createBFFClient();
const list = await transport.listSessions({ limit: 25 });

for (const summary of list.sessions) {
  const status = await transport.readStatus(summary.session_id);
  renderSessionRow(summary, status);
}
```

## Use the transport lifecycle

Create with `createSession`, bind a live view, submit text or gate responses, and call `interrupt` when a user cancels active work. For an existing durable id, call `restoreSession` before binding when the target process must rebuild and reattach it. The [Binding a session](/docs/guides/web-ui/sessions/binding), [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect), and [Restore a session](/docs/guides/web-ui/sessions/restore) guides cover those transitions.

The durable cursor is the handoff point between cold reads and live events. Do not treat a status snapshot as a replacement for the event journal when a UI needs a complete transcript.

## Source

Wire DTOs for summaries, status, journal pages, and lifecycle responses are derived in [`sdk/core/src/types.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/types.ts). The read and control methods that operate on those DTOs are implemented in [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/transport.ts).

## Proof

The types establish the cursor-bearing session shapes and the transport maps each lifecycle operation to a validated method. Start with [Web UI](/docs/guides/web-ui) if you need to choose the adapter or embedding boundary first.

