---
id: guides/web-ui/client-sdk/session-client
title: SessionClient
description: Connect a session to a framework-neutral listener, render SessionView updates, and forward text, gate, and interrupt actions.
audience: developer
section: guides
order: 2
publication: released
proofs:
  construct-the-facade: [release-github-com-looprig-client]
  connect-and-clean-up: [release-github-com-looprig-client]
  send-actions-through-typed-methods: [release-github-com-looprig-client]
  test-the-facade: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# SessionClient

## Construct the facade

`SessionClient` is a small framework-neutral layer over a `LooprigClient`. With no injected client it creates a `BFFTransport` through `createBFFClient`. When a custom transport is injected, provide a `liveSource` as well so cold reads and live frames remain explicit dependencies.

```ts
import { createBFFClient, createFetchLiveFrameSource } from "@looprig/client";
import { SessionClient } from "./session-client.js";

const client = createBFFClient();
const session = new SessionClient(client, {
  liveSource: (sessionId) =>
    createFetchLiveFrameSource(sessionId),
});
```

The facade owns no framework state. It delegates protocol work to the SDK and reports typed view updates through `SessionListener`.

## Connect and clean up

`connect` creates an `AbortController`, opens the live source, and starts `joinSessionView` with `autoReconnect: true`. Each successful update calls `onView` with a `SessionView`; each fold or stream failure is surfaced through `onError`. The returned function aborts the controller, cancels the active iterator, and closes the async generator.

```ts
const stop = session.connect("session-id", {
  onView(view) {
    transcript.textContent = view.content
      .map((chunk) => chunk.chunkType === "text" ? chunk.text : "")
      .join("");
  },
  onError(error) {
    status.textContent = error.message;
  },
});

route.onLeave(stop);
```

The cleanup function is part of the contract. Call it when the page, component, or route no longer owns the session subscription.

## Send actions through typed methods

`submitText` trims empty input and sends a text block. `respondToGate` takes the opaque gate identifier and a `GateApprovalAction`; `approveGate` is the convenience form using `GATE_APPROVAL_ACTIONS.approve`. `interrupt` delegates to the transport control plane.

```ts
await session.submitText("session-id", composer.value);
await session.approveGate("session-id", gateId);
await session.interrupt("session-id");
```

For the lower-level request details, see [Commands and gates](/docs/guides/web-ui/client-sdk/commands). For the view fold and event ordering, continue to [Folding session state](/docs/guides/web-ui/client-sdk/fold).

## Source

The complete facade, listener contract, cleanup path, and action methods are in [`sdk/core/examples/session-client.ts`](https://github.com/looprig/client/blob/main/sdk/core/examples/session-client.ts). Its focused behavior tests are in [`sdk/core/examples/session-client.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/examples/session-client.test.ts).

## Proof

The example test exercises construction, live updates, listener errors, action delegation, and disconnect cleanup. The implementation links every UI action to the typed client surface and uses the same `SessionView` shape that the core fold produces.
