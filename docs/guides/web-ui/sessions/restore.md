---
id: guides/web-ui/sessions/restore
title: Restore a session
description: Reattach a durable session to the live registry, then bind it through the same validated transport and exact-join path.
audience: developer
section: guides
order: 19
publication: released
proofs:
  restore-through-transport: [release-github-com-looprig-client]
  restore-conformance: [release-github-com-looprig-client]
  restore-and-ownership: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Restore a session

## Restore through transport

`restoreSession(sessionId)` sends `POST /v1/sessions/{sid}/restore` with no body. The server rebuilds the prior session from durable history and reattaches it to the target process's live registry. The validated `RestoreResponse` gives the caller the live session id and a required `restored` boolean without exposing untyped JSON.

| Field | Meaning |
| --- | --- |
| `session_id` | The id of the session now live in the target registry |
| `restored` | `true` when the server rebuilt the session from durable history; `false` when it reused an already-live session (attach) |

Both outcomes are `200`, so branch on `restored` rather than on the status when the UI wants to say whether history was replayed. The field is never omitted: since client v0.4.0 the SDK rejects a restore response without it, so the server must run Harness v0.30.0 or later (for example Carbon v0.29.0 or later).

```ts
const client = createBFFClient();
const restored = await client.restoreSession(sessionId);
if (!restored.restored) showNotice("Session was already live; attached without replay.");

const stop = new SessionClient(client, { liveSource }).connect(restored.session_id, {
  onView: render,
  onError: report,
});
```

Bind only after restore has resolved when the UI needs the target process to be live before opening events. If the session is already attached, the response carries `restored: false`; the client still validates that response and maps non-success envelopes to typed errors.

## Restore and ownership

Restore is a control-plane request, so a browser `BFFTransport` obtains its CSRF header lazily. `ServeTransport` sends the direct `/v1` request without BFF CSRF handling. Pass an `AbortSignal` when the route may disappear during restoration, and treat `RequestAbortedError` as cancellation rather than a server failure. See [Transport and ownership](/docs/guides/web-ui/client-sdk/ownership).

After restore, use the same [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect) path as a newly created session. The durable journal remains the source for catch-up, while the live source supplies new frames.

## Source

The no-body restore route, signal handling, response validation, and transport differences are implemented in [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/transport.ts). The exact method, path, response fixture, and error behavior are asserted in [`sdk/core/test/conformance.test.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/test/conformance.test.ts).

## Proof

The conformance suite checks that restore is a `POST` to the session restore route, sends no body, and returns the validated restore fixture (`restored: true`) for both `BFFTransport` and `ServeTransport`. The same ownership and exact-join contracts apply after the response.
