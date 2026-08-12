---
id: guides/web-ui/framework-adapters/vanilla
title: Vanilla DOM
description: Mount a framework-neutral SessionClient on semantic DOM elements, render SessionView content, and remove every listener on teardown.
audience: developer
section: guides
order: 9
publication: released
proofs:
  bind-dom-elements: [release-github-com-looprig-client]
  cleanup-event-listeners: [release-github-com-looprig-client]
  test-session-binding: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Vanilla DOM

## Bind DOM elements

`bindVanillaSession` expects a root element containing `[data-session-output]`, `[data-session-form]`, `[data-session-input]`, and `[data-session-interrupt]`. It constructs a `SessionClient`, maps `SessionView.content` to text, connects the live session, and returns a disposer.

```html
<section id="session">
  <output data-session-output aria-live="polite"></output>
  <form data-session-form>
    <input data-session-input autocomplete="off" />
    <button type="submit">Send</button>
  </form>
  <button type="button" data-session-interrupt>Interrupt</button>
</section>
```

```ts
import { bindVanillaSession } from "./vanilla-session.js";

const root = document.querySelector<HTMLElement>("#session");
if (root === null) throw new Error("session root is required");

const dispose = bindVanillaSession(root, sessionId);
window.addEventListener("pagehide", dispose, { once: true });
```

The helper throws a clear error if a required element is missing. Its submit handler prevents a native navigation, sends trimmed text through `submitText`, and clears the input after success. The interrupt button delegates to the typed control method.

## Cleanup event listeners

The disposer calls the `SessionClient` disconnect function and removes both event listeners. Call it when the root leaves the document. This keeps the `AbortController`, live iterator, and DOM callbacks owned by the same page lifecycle.

```ts
const stop = bindVanillaSession(root, sessionId);

function unmount() {
  stop();
  root.remove();
}

navigation.onChange(unmount);
```

For richer rendering, keep the same callback shape and render `toolCalls`, `queuedInputs`, and `statusEvents` from `SessionView` instead of parsing wire frames in event handlers.

## Source

The complete data-attribute binding, rendering callback, submit and interrupt handlers, and disposer are in [`sdk/core/examples/vanilla-session.ts`](https://github.com/looprig/client/blob/main/sdk/core/examples/vanilla-session.ts). The facade lifecycle it uses is exercised in [`sdk/core/examples/session-client.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/examples/session-client.test.ts).

## Proof

The binding source shows one connection, two DOM listeners, and one symmetric cleanup path. The session client tests cover listener delivery and disconnect behavior. For a reactive wrapper, see [Svelte 5](/docs/guides/web-ui/framework-adapters/svelte/).

