---
id: guides/web-ui/index
title: Web UI
description: Build session interfaces with the framework-neutral Looprig client, then add an adapter or embed the resulting app when needed.
audience: developer
section: guides
order: 0
publication: released
proofs:
  start-with-the-framework-neutral-client: [release-github-com-looprig-client]
  guide-map: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Web UI

## Start with the framework-neutral client

The browser-facing starting point is the framework-neutral TypeScript client. Create a `LooprigTransport` once, pass it to a small session facade, and render the resulting `SessionView` in whatever UI system already owns the page. `createBFFClient` is the default for a same-origin app: it calls the BFF and keeps the bearer credential on the server side.

```ts
import { createBFFClient, createFetchLiveFrameSource, type SessionView } from "@looprig/client";
import { SessionClient } from "./session-client.js";

const transport = createBFFClient();
const sessions = new SessionClient(transport, {
  liveSource: (sessionId) => createFetchLiveFrameSource(sessionId),
});

const stop = sessions.connect("session-id", {
  onView: (view: SessionView) => renderTranscript(view),
  onError: (error) => renderSessionError(error),
});

// Call stop when the route or component leaves the page.
button.addEventListener("click", stop, { once: true });
```

The facade owns subscription cleanup and forwards user intent to typed transport methods. A renderer only needs the stable view shape, rather than knowing whether an update came from the durable journal or the live SSE stream.

## Guide map

Use the [Client SDK guides](/docs/guides/web-ui/client-sdk) for the transport, events, folding, validation, and ownership contracts. Choose [Framework adapters](/docs/guides/web-ui/framework-adapters) when a DOM binding or Svelte 5 state wrapper is useful. Follow [Embedding](/docs/guides/web-ui/embedding) to package the app as a static bundle and serve it from Go. If you want a finished interface rather than your own app, the [Prebuilt wui bundle](/docs/guides/web-ui/embedding/wui) serves Looprig's React UI from a Factory with no front-end build. The [Session lifecycle guides](/docs/guides/web-ui/sessions) cover binding, exact reconnect joins, and restoring a durable session. The [Harness guide](/docs/guides/harness) is the adjacent server contract that the browser client calls.

The framework-neutral route is the primary API. A Svelte adapter is optional and should wrap this same client rather than replace its transport, event parser, or state fold.

## Source

The public barrel exports the transport, validation, SSE, fold, join, and action surfaces from [`sdk/core/src/index.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/src/index.ts). The end-to-end framework-neutral shape is shown in [`sdk/core/examples/session-client.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/examples/session-client.ts).

## Proof

The example composes `createBFFClient`, `SessionClient`, `SessionView`, and an explicit cleanup function. The source barrel proves these pieces are public exports, while the linked example proves the intended framework-neutral composition.
