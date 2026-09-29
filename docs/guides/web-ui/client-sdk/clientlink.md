---
id: guides/web-ui/client-sdk/clientlink
title: ClientLink and live streams
description: Open Factory's ClientLink WebSocket, negotiate the wire version, subscribe to one session's channel, and handle publications, resets, and transport drops.
audience: developer
section: guides
order: 3
publication: released
proofs:
  connect-and-negotiate: [release-npm-looprig-client]
  subscribe-to-a-session: [release-npm-looprig-client]
  what-a-subscription-delivers: [release-npm-looprig-client]
  transport-drops-are-gaps: [release-npm-looprig-client]
  one-subscription-per-session: [release-npm-looprig-client]
  commands-over-the-link: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# ClientLink and live streams

ClientLink is Factory's browser WebSocket. One link per application carries live publications for every session the user is watching, plus the command RPCs described in [Commands and gates](/docs/guides/web-ui/client-sdk/commands). `@looprig/client` wraps it in the `ClientLink` interface, built on the `centrifuge` client, and validates every record that crosses it. The link delivers what happens from now on. History and gap repair come from the [Factory REST client](/docs/guides/web-ui/client-sdk/factory-rest).

## Connect and negotiate

`createFactoryClient` builds the link for you. `createClientLink` is also exported for an application that wants only the socket. Its default endpoint is `/v1/realtime`.

```ts
import { createClientLink, type ClientLink, type ClientLinkState } from "@looprig/client";

const link: ClientLink = createClientLink({ endpoint: "wss://factory.example/v1/realtime" });

// Concurrent calls share one pending connect. A second call after success
// resolves at once with the same negotiated version.
const negotiated = await link.connect();
const state: ClientLinkState = link.state; // "disconnected" | "connecting" | "connected"
console.log(negotiated.version, state);
```

The connect request carries both `protocol_version: "1"`, which Factory decides the handshake on, and Core's `supported_versions: [1]`. Factory answers `{ protocol_version, factory_version }`, and the client maps that reply to Core wire version 1. A reply naming another ClientLink protocol rejects `connect()` with a `RealtimeTransportError` and closes the socket instead of guessing. `disconnect()` closes the socket and rejects a connect that is still pending.

## Subscribe to a session

A subscription names a tenant and a public session ID. The tenant is the one `reads.readBootstrap()` returned. The client encodes both into the channel `session:{tenant}:{session}`, and Factory authorizes it before any record is delivered.

```ts
import type { ClientLink, FactoryPublication, SessionReset } from "@looprig/client";

async function watch(link: ClientLink, tenantId: string, sessionId: string) {
  const subscription = link.subscribe({
    tenantId,
    sessionId,
    onPublication(publication: FactoryPublication) {
      if (publication.type === "enduring_publication") {
        console.log("committed", publication.journal_seq, publication.body);
      } else if (publication.type === "journal_tip") {
        console.log("tip", publication.journal_tip);
      } else {
        console.log("preview", publication.body); // best effort, never durable
      }
    },
    onReset(reset: SessionReset) {
      // Factory lost contiguity for this link. Re-read from REST.
      console.log("reset", reset.journal_tip, reset.last_contiguous);
    },
    onError(error: Error) {
      console.warn("repair needed", error);
    },
  });
  // Resolves once Factory has authorized and opened the channel. Rejects when
  // authorization fails or the subscription ends before it opened.
  await subscription.ready;
  return subscription; // call subscription.unsubscribe() when the view unmounts
}
```

## What a subscription delivers

| Record | Callback | Meaning |
| --- | --- | --- |
| `enduring_publication` | `onPublication` | A committed public journal event with `journal_seq`, `event_id`, and `covered_through`. |
| `ephemeral_publication` | `onPublication` | A best-effort preview with no sequence, such as a token delta. See [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews). |
| `journal_tip` | `onPublication` | The session's current committed tip, with no event body. |
| `session.reset` | `onReset` | Delivery for this link restarted. `last_contiguous` is a per-link delivery position, not a journal truncation. |

Each record is validated before its callback runs. A record that fails validation, an unknown record type, or a callback that throws is reported through `onError` rather than delivered.

## Transport drops are gaps

A Centrifuge subscription survives a socket drop: the client moves it to `subscribing` and resubscribes by itself once the socket is back, with no replay of what was committed in between. The client therefore reports the drop through `onError` as a `RealtimeTransportError` once the subscription has been authorized, and reports a second `subscribed` event the same way in case the drop itself was missed. Each interruption is reported once. Treat it as a gap and repair from the last committed sequence. `joinFactorySessionView` does this for you, and [Reconnect and exact joins](/docs/guides/web-ui/sessions/reconnect) explains the repair loop.

## One subscription per session

A link holds at most one live subscription per session. Subscribing to the same tenant and session again before releasing the first throws. `unsubscribe()` ends the subscription and removes its channel from the link, so a remounted view can subscribe again. It is idempotent, and a stale handle never detaches a newer subscription that has taken the same channel.

## Commands over the link

`link.rpc(method, request)` sends one command and resolves with a validated `CommandStatus`. A Core error reply is thrown as the matching `CoreProtocolError` subclass, and a transport failure as `RealtimeTransportError`. Prefer `client.commands`, which fixes the command identity before the first send so a retry never mints a second command.

## Source

The link, subscription lifecycle, negotiation, and record routing are in [`packages/client/src/clientlink.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/clientlink.ts). The publication and reset types come from [`packages/client/src/types.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/types.ts), and `RealtimeTransportError` is in [`packages/client/src/errors.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/errors.ts).

## Proof

[`packages/client/test/clientlink.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/clientlink.test.ts) covers wire version negotiation, Factory's connect reply and refusal of another protocol, drop and resubscribe reporting, authorization failures before open, validation of publications and RPC results, and one subscription per session against the real Centrifuge client. Continue with [Live text and reasoning previews](/docs/guides/web-ui/client-sdk/live-previews), or see [Commands and gates](/docs/guides/web-ui/client-sdk/commands).
