---
id: guides/web-ui/sessions/restore
title: Restore a session
description: Bring a cold Factory session back onto a Host with an explicit restore command, follow its residency, and handle the outcome safely.
audience: developer
section: guides
order: 19
publication: released
proofs:
  when-to-restore: [release-npm-looprig-client]
  send-a-restore: [release-npm-looprig-client]
  what-happens-next: [release-npm-looprig-client, release-npm-looprig-react]
  failures-and-retries: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Restore a session

A session that no Host holds is cold, but it is not gone: its journal, gates, and status stay readable through Factory, and its view renders normally. Restoring asks Factory to make it resident again so the agent can continue. In `@looprig/client` this is one command, `commands.restore(sessionId)`, sent over the ClientLink with the same identity and retry rules as every other command.

## When to restore

Read residency from `readStatus`, not from whether the view rendered. Restore is only needed to bring a session back without sending a message: any command admitted for a session with no live owner, including ordinary input, is placed by Factory in the same way. Opening or reading a session never restores it, and Core's restore request says so directly: durable reads never imply a restore.

| `status.residency` | Meaning for a UI |
|---|---|
| `cold` | readable; offer restore or accept input that will place it |
| `attaching` | a Host is taking the session; wait |
| `resident` | a Host holds it; commands apply directly |
| `releasing` | the Host is letting go; it will become cold |

Any other value comes from a newer wire version. Treat it as a state the UI cannot control rather than as an error.

## Send a restore

The request carries only `version`, `command_id`, and `session_id`. It never carries metadata, and a principal on it is only ever stamped by Factory.

```ts
import { createFactoryClient } from "@looprig/client";

const client = createFactoryClient({ baseUrl: "https://factory.example" });

const status = await client.reads.readStatus(sessionId);
if (status.residency === "cold") {
  // Mint once per user action; retry this same object, never a new one.
  const restore = client.commands.restore(sessionId);
  const result = await restore.attempt();
  if (result.outcome === "unknown") {
    // The reply was lost; ask Factory what it recorded for this exact command.
    const settled = await restore.resolve();
    showCommand(settled.status);
  } else if (result.outcome === "resolved") {
    showCommand(result.status.status); // accepted, pending, applied, or rejected
  } else {
    showError(result.error.code);
  }
}
```

`client.commands.restore` sends the ClientLink method `session.restore`. Factory also serves `POST /v1/sessions/{sid}/restore` for callers that are not using a ClientLink; the browser client does not need it.

## What happens next

Factory admits the restore into the session's durable command inbox and places the session on a live, compatible Host. The Host relaunches the runtime under the session's existing binding and restores it from its journal rather than starting a fresh conversation, then settles the restore command. Its effect is residency, not a new turn, so no user row appears. Keep the view joined while this happens: status moves through `attaching` to `resident`, and new public events arrive on the channel you already bound. The React view treats a `SessionStarted` or `RestoreDone` event as the session running again (see [Session views and lists](/docs/guides/web-ui/react/session-view)).

## Failures and retries

A validated Core refusal is final for that command. `CoreSessionNotFoundError` means Factory has no such session for this caller, and `CoreRuntimeUnavailableError` means Factory could not accept commands right now; check `retryable` before offering another attempt. A transport failure is an unknown outcome: call `resolve()` or `retry()` on the same `PendingCommand` instead of creating a second restore. To make the retry survive a reload, persist it in a `PendingSlot`, which accepts `session.restore` like every other method (see [Commands and gates](/docs/guides/web-ui/client-sdk/commands)).

## Source

The restore builder and `PendingCommand` are in [`packages/client/src/commands.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/commands.ts), the restore request and status schemas in [`schema.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/schema.ts), error mapping in [`errors.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/errors.ts), and reload-durable slots in [`pending-store.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/pending-store.ts). The read-only React view is in [`packages/react/src/use-session-view.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-session-view.ts).

## Proof

[`commands.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/commands.test.ts) checks the exact restore envelope, identity reuse on retry, and the resolved, rejected, and unknown outcomes. [`contract.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/contract.test.ts) validates the restore request variants against Core's schema and fixtures. Placement and restore on the server side belong to the [Factory](/docs/modules/factory) and [Host](/docs/modules/host) modules; the lifecycle overview is [Session lifecycle](/docs/guides/web-ui/sessions).
