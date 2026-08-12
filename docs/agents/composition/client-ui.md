---
id: agents/composition/client-ui
title: Build a framework-independent client UI
description: Use the TypeScript core client, vanilla binding, and optional Svelte stores for session views and actions.
audience: agent
section: agents/composition
order: 11
publication: source-workspace
proofs:
  core:
    - source-client-sdk-core-package
    - central-client-stage20-session-client-source
  vanilla:
    - central-client-stage20-vanilla-session-source
  svelte:
    - source-client-sdk-svelte-package
    - central-client-stage20-svelte-page-source
---
# Client UI

Start with private source-workspace package `client/sdk/core` (`@looprig/client`). It exports `createBFFClient`, `createClient`, `LooprigTransport`, `BFFTransport`, `ServeTransport`, `createFetchLiveFrameSource`, `fold`, `joinSessionView`, typed wire models, gate actions, and typed errors. The core owns fetch, response validation, SSE parsing, history/live joining, and projection. Inject a custom `LooprigClient` only with a matching `liveSource` factory.

Build a UI around `SessionView` and action methods. A minimal browser binding uses `textBlock`, `client.submit`, `client.interrupt`, `client.respondGate`, and `joinSessionView`. The reviewed vanilla example uses DOM listeners and returns a disposer that aborts the controller, calls the live iterator's `return`, and removes listeners.

Svelte is optional source-workspace package `client/sdk/svelte` (`@looprig/svelte`). Its stores wrap core behavior: list, status, history, live view, composer, and gate polling. React, Vue, Solid, or another framework can use the core functions and types directly. No frontend framework is required and no framework-specific adapter should be assumed beyond the reviewed Svelte package.

Lifecycle: create transport, connect once per session, consume updates, stop synchronously, abort network work, and dispose listeners. Treat fold errors and typed transport errors separately from user content. Never render raw server payloads before validation.

Proofs: [`client/sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/sdk/core/src/transport.ts), [`client/sdk/core/src/join.ts`](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/sdk/core/src/join.ts), [`client/examples/docs/stage20_web_client/vanilla-session.ts`](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/vanilla-session.ts).
