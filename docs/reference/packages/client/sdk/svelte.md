---
id: reference/packages/client/sdk/svelte
title: Client Svelte SDK package
description: Optional private source-workspace Svelte 5 stores for session lists, history, live views, composers, and gate actions.
audience: developer
section: reference
order: 232
publication: source-workspace
examples:
  - stage-20-web-client
proofs:
  package-role: source-client-sdk-svelte-package
  exported-surface: [source-client-sdk-svelte-package, central-client-stage20-svelte-page-source]
  lifecycle-and-errors: [source-client-sdk-svelte-package, central-client-stage20-session-client-proof]
  source-proof: central-client-stage20-session-client-proof
---

# `@looprig/svelte`

Optional Svelte 5 adapter in the private [source-workspace package](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/svelte). It is not a released npm package in this corpus.

## Package role {#package-role}

The adapter maps core transport and `SessionView` values into Svelte stores. It does not own protocol schemas, durable history, or a new live transport. A component can consume the same core from another framework without adopting these stores.

## Exported surface {#exported-surface}

Exports are `SessionListStore`, `SessionStatusStore`, `SessionHistoryStore`, `LiveSessionViewStore`, `SessionComposerStore`, and `GateStore`. The stores use Svelte 5 state and accept a core transport; the live store additionally accepts a `LiveFrameSource`.

## Lifecycle and errors {#lifecycle-and-errors}

List/status/history refreshes are last-started-wins; failed refreshes preserve previous data and set `error`. `LiveSessionViewStore.start()` is idempotent, joins history and live with reconnect, and records `lastFoldError`; `stop()` is synchronous, calls the source iterator's `return()`, and prevents reconnect. Composer submission trims and ignores empty/already-submitting text. Gate polling self-schedules at a default 2-second interval, stops cleanly, and discards stale in-flight results after stop.

The stores expose errors as state for the component to render. Gate actions use the core `GATE_APPROVAL_ACTIONS`, mask an answered gate before confirmation, and never invent a success from a stale poll.

## Source proof {#source-proof}

The [Svelte package manifest](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/svelte/package.json) and [stage 20 page](https://github.com/looprig/client/blob/93c0381580e059e14b9f313d664ad90e886c3b4a/examples/docs/stage20_web_client/SessionPage.svelte) are pinned source-workspace evidence. The page starts and stops live/gate stores from one effect cleanup.
