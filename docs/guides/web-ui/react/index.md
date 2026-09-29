---
id: guides/web-ui/react/index
title: React
description: Compose a React 19 application over one Factory client and one ClientLink with the @looprig/react providers and hooks.
audience: developer
section: guides
order: 9
publication: released
proofs:
  install: [release-npm-looprig-react]
  compose-the-application-plane: [release-npm-looprig-react]
  hook-map: [release-npm-looprig-react]
  lifetimes-and-strictmode: [release-npm-looprig-react]
  source: [release-npm-looprig-react]
  proof: [release-npm-looprig-react]
---

# React

`@looprig/react` turns the framework-neutral [Client SDK](/docs/guides/web-ui/client-sdk) into React 19 providers and hooks. You get a verified tenant, one shared realtime connection, durable session views with live previews, and retry-stable controls, without writing any wire parsing yourself. Every hook is a thin `useSyncExternalStore` shell over a store; decoding, folding, and ordering all stay in `@looprig/client`.

## Install

Install both packages at the same exact version. `@looprig/react` 0.2.0 depends on exactly `@looprig/client` 0.2.0, and it declares `react` and `react-dom` `^19.0.0` as peer dependencies.

```sh
npm install @looprig/client@0.2.0 @looprig/react@0.2.0 react@19 react-dom@19
```

## Compose the application plane

Mount one `FactoryIdentityProvider` above your router. It asks Factory who the browser caller is (`GET /v1/bootstrap`), then constructs the Factory client and its link and exposes the verified tenant. Routes below it read the client with `useFactoryClient` and the tenant with `useFactoryTenantId`.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FactoryIdentityProvider } from "@looprig/react";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* No baseUrl: same-origin /v1 REST and /v1/realtime, as when Factory serves the bundle. */}
    <FactoryIdentityProvider
      pending={<p role="status">Identifying...</p>}
      renderBootstrapError={(error, retry) => (
        <div role="alert">
          {error.message} <button onClick={retry}>Try again</button>
        </div>
      )}
    >
      <App />
    </FactoryIdentityProvider>
  </StrictMode>,
);
```

## Hook map

| Export | Purpose | Guide |
| --- | --- | --- |
| `FactoryIdentityProvider`, `useFactoryTenantId` | Verify the caller, expose its tenant | [Link and identity providers](/docs/guides/web-ui/react/link-and-identity) |
| `FactoryLinkProvider`, `useFactoryClient`, `useFactoryLink`, `useFactoryLinkStatus` | One client and one link for the app | [Link and identity providers](/docs/guides/web-ui/react/link-and-identity) |
| `useSessionBinding`, `useLinkRecovery`, `FactoryLinkStore` | Manual bindings, failed-link recovery | [Link and identity providers](/docs/guides/web-ui/react/link-and-identity) |
| `useFactorySessionList`, `useFactorySessionView` | Recent sessions, one session's durable view | [Session views and lists](/docs/guides/web-ui/react/session-view) |
| `useFoldedEvents`, `useGateBoard` | Fold events to rows, fold gates to a board | [Session views and lists](/docs/guides/web-ui/react/session-view) |
| `useFactoryComposer`, `useFactoryGate`, `useFactoryInterrupt`, `usePendingInput` | Send input, answer gates, interrupt | [Composer, gates, and interrupt](/docs/guides/web-ui/react/controls) |
| `useStore`, `useStoreSelector` | Subscribe to any `ReadableStore` | This page |

`useStore(store)` returns a store's snapshot and `useStoreSelector(store, select)` returns part of it. The selector must return a value that already lives in the snapshot; building a fresh object or array there makes React loop, so derive shapes in `useMemo` instead.

## Lifetimes and StrictMode

The provider builds its client in a ref on first render rather than in `useMemo`, so StrictMode's double mount still yields exactly one client and one WebSocket. The link opens from an effect and closes when the provider unmounts. Session views own only a binding and a cursor, never the connection, which is why one socket serves every open session. Command identities are retained per command plane and session, outside any component, so a remounted composer inherits an outstanding send rather than offering a duplicate.

## Source

The public barrel is [`packages/react/src/index.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/index.ts). Provider construction is in [`packages/react/src/use-connection.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-connection.ts), the store bindings in [`packages/react/src/use-store.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-store.ts), and the package manifest in [`packages/react/package.json`](https://github.com/looprig/client/blob/v0.2.0/packages/react/package.json).

## Proof

[`packages/react/src/index.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/index.test.ts) asserts the exact export list. [`packages/react/src/use-factory-link.strict.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-factory-link.strict.test.tsx) checks that session views share one client and one link and that a StrictMode mount, unmount, and remount opens one subscription per view. [`packages/react/src/use-store.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-store.test.tsx) checks that a store mounts with one render and no uncached-snapshot error. Next, read [Link and identity providers](/docs/guides/web-ui/react/link-and-identity).
