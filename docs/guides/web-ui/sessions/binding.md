---
id: guides/web-ui/sessions/binding
title: Binding a session
description: Attach one session id to a framework-neutral listener or Svelte store and keep cold reads, live views, and cleanup under one owner.
audience: developer
section: guides
order: 16
publication: released
proofs:
  framework-neutral-binding: [release-github-com-looprig-client]
  reactive-cold-stores: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Binding a session

## Framework-neutral binding

Use `SessionClient.connect` when the UI wants one callback for every folded `SessionView`. The connection starts the exact history/live join, forwards updates to `onView`, and returns a disposer that aborts and cancels the live source. Keep the session id in the route owner and call the disposer when that owner leaves.

```ts
const disconnect = sessionClient.connect(sessionId, {
  onView: (view) => transcript.render(view),
  onError: (error) => banner.show(error.message),
});

return () => disconnect();
```

The [Vanilla DOM](/docs/guides/web-ui/framework-adapters/vanilla) adapter uses this shape directly. A different framework can use the same listener without importing any Svelte code.

## Reactive cold stores

The Svelte package provides `SessionListStore`, `SessionStatusStore`, and `SessionHistoryStore` for one-shot reads. Each exposes `$state` fields, `loading`, and `error`, and each `refresh` uses a generation guard so only the last-started overlapping call commits. A failed refresh keeps the previous successful data in place.

```ts
const history = new SessionHistoryStore(transport, sessionId);
await history.refresh();

if (!history.done) {
  await history.refresh({ fromJournalSeq: history.nextJournalSeq });
}
```

Use `LiveSessionViewStore` for the ongoing subscription rather than trying to turn a cold history store into a live stream. The [Svelte 5](/docs/guides/web-ui/framework-adapters/svelte) guide covers its start and stop lifecycle.

## Source

The framework-neutral connect, listener, and cleanup behavior is in [`sdk/core/examples/session-client.ts`](https://github.com/looprig/client/blob/main/sdk/core/examples/session-client.ts). Cold reactive stores and their last-started-wins guards are in [`sdk/svelte/src/session.svelte.ts`](https://github.com/looprig/client/blob/main/sdk/svelte/src/session.svelte.ts).

## Proof

The two layers keep the same ownership rule: a caller starts a session read or subscription, renders typed state, and explicitly disposes or refreshes it. The live path is deliberately separate from one-shot page stores.

