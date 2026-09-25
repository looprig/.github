---
id: guides/web-ui/framework-adapters/index
title: Framework adapters
description: Bind the framework-neutral session client to ordinary DOM nodes or Svelte 5 state without moving protocol logic into the UI layer.
audience: developer
section: guides
order: 8
publication: released
proofs:
  keep-the-core-boundary: [release-github-com-looprig-client]
  choose-an-adapter: [release-github-com-looprig-client]
  compare-lifecycle-ownership: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Framework adapters

## Keep the core boundary

Adapters should render `SessionView` and forward user intent. They should not parse SSE lines, validate DTOs, fold history, or invent a second reconnect algorithm. The framework-neutral [SessionClient](/docs/guides/web-ui/client-sdk/session-client) and its [Client SDK](/docs/guides/web-ui/client-sdk) remain the primary boundary.

```ts
type RenderAdapter = {
  mount(root: HTMLElement, sessionId: string): () => void;
};

function mountSession(adapter: RenderAdapter, root: HTMLElement, id: string) {
  const dispose = adapter.mount(root, id);
  return () => dispose();
}
```

Choose [Vanilla DOM](/docs/guides/web-ui/framework-adapters/vanilla) when a small page can use data attributes and a direct cleanup function. Choose [Svelte 5](/docs/guides/web-ui/framework-adapters/svelte) when `$state` fields and component lifecycle make the view easier to compose.

## Compare lifecycle ownership

The vanilla example owns event listeners and returns one teardown function. The Svelte wrapper owns a long-running `$state` subscription with `start()` and `stop()`. Both delegate to the same transport, `SseFrameParser`, `fold`, and `joinSessionView` contracts.

| Adapter | State boundary | Start | Stop |
| --- | --- | --- | --- |
| Vanilla DOM | `SessionView` callback | `SessionClient.connect` | returned disconnect function |
| Svelte 5 | `LiveSessionViewStore.view` | `store.start()` | `store.stop()` |

## Source

The ordinary DOM binding is shown in [`sdk/core/examples/vanilla-session.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/core/examples/vanilla-session.ts). The Svelte package barrel exposes its reactive wrappers from [`sdk/svelte/src/index.ts`](https://github.com/looprig/client/blob/v0.4.0/sdk/svelte/src/index.ts).

## Proof

The two exports demonstrate that adapters are thin lifecycle and rendering layers over the framework-neutral core. Continue to [Embedding](/docs/guides/web-ui/embedding) when the adapter is part of a static app served by Go.
