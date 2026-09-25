---
id: guides/web-ui/framework-adapters/svelte
title: Svelte 5
description: Use the Svelte 5 stores as lifecycle-aware reactive wrappers around the core journal join and transport surface.
audience: developer
section: guides
order: 10
publication: released
proofs:
  live-session-store: [release-github-com-looprig-client]
  start-and-stop-lifecycle: [release-github-com-looprig-client]
  browser-store-proof: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Svelte 5

## Live session store

`LiveSessionViewStore` republishes the core `joinSessionView` stream as Svelte 5 `$state`: `view`, `active`, `error`, and `lastFoldError`. Its constructor receives a narrow journal reader, a session id, a live frame source, and optional join options. A `LooprigTransport` already satisfies the journal reader shape.

```ts
import { LiveSessionViewStore } from "@looprig/svelte";
import { createBFFClient, createFetchLiveFrameSource } from "@looprig/client";

const transport = createBFFClient();
const live = new LiveSessionViewStore(
  transport,
  sessionId,
  createFetchLiveFrameSource(sessionId),
  { autoReconnect: true },
);

live.start();
```

The store defaults `autoReconnect` to `true`, clears stale errors at a new start, and resets the view to its initial state. Calling `start` while active is a no-op.

## Start and stop lifecycle

`stop` synchronously aborts the store controller and directly cancels the active live iterator. That direct cancellation matters when the join is waiting for a frame: calling only the async generator's `return` can sit behind a pending `next`. The store also uses a generation guard so an older pump cannot commit state after a newer start or stop.

```svelte
<script lang="ts">
  import { onDestroy } from "svelte";

  export let live: LiveSessionViewStore;
  live.start();
  onDestroy(() => live.stop());
</script>

{#if live.error}
  <p role="alert">{live.error.message}</p>
{:else}
  <output>{live.view.content.map((chunk) => chunk.chunkType === "text" ? chunk.text : "").join("")}</output>
{/if}
```

The package also provides cold read stores with `refresh` methods and last-started-wins guards. Keep protocol parsing and folding in `@looprig/client`; use the Svelte layer for reactivity and component ownership. The [Client SDK](/docs/guides/web-ui/client-sdk) remains the framework-neutral contract.

## Source

The live reactive wrapper, cancellation cascade, generation guard, and `$state` fields are in [`sdk/svelte/src/live-session.svelte.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/svelte/src/live-session.svelte.ts). Browser-level lifecycle cases are covered in [`sdk/svelte/test/live-session.test.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/svelte/test/live-session.test.ts).

## Proof

The tests cover idempotent start, updates, fold errors, reconnect behavior, and stop during an idle live wait. The wrapper deliberately delegates to the core client and leaves the transport, parser, and fold contracts unchanged.

