---
id: guides/web-ui/react/link-and-identity
title: Link and identity providers
description: Verify the browser caller, share one Factory client and ClientLink across routes, bind sessions by hand, and recover a failed link.
audience: developer
section: guides
order: 10
publication: released
proofs:
  verify-the-caller-first: [release-npm-looprig-react]
  credentials-stay-live: [release-npm-looprig-react]
  observe-the-link: [release-npm-looprig-react]
  bind-a-session-by-hand: [release-npm-looprig-react]
  recover-a-failed-link: [release-npm-looprig-react, release-npm-looprig-client]
  source: [release-npm-looprig-react]
  proof: [release-npm-looprig-react]
---

# Link and identity providers

A React app needs to know who the caller is before it renders any session, and it needs exactly one WebSocket however many sessions are on screen. `FactoryIdentityProvider` and `FactoryLinkProvider` own both concerns above your routes, so a route only asks for the client, the tenant, or a binding.

## Verify the caller first

`FactoryIdentityProvider` reads `GET /v1/bootstrap` before it constructs anything. Until Factory answers with a `tenant_id`, it renders `pending`; on failure it renders `renderBootstrapError(error, retry)`, where `retry` uses the current credentials. Only then does it mount a `FactoryLinkProvider` and make `useFactoryTenantId()` available. Outside a verified provider, `useFactoryTenantId` throws.

| Prop | Meaning |
| --- | --- |
| `credentials` | `FactoryCredentials`: optional `restHeaders`, `connectionToken`, `subscriptionToken`, `subscriptionData` |
| `options` | Everything `createFactoryClient` takes except credentials: `baseUrl`, `realtimeUrl`, `fetch`, `clock`, `idGenerator`, `clientLinkFactory`. Read once. |
| `authGeneration` | Change it at login or logout. The whole subtree is keyed on it, so the old client and every cached view are torn down before the new bootstrap. |
| `pending`, `renderBootstrapError` | What renders while verifying and after a failure |
| `create`, `readBootstrap` | Test seams for the client constructor and the bootstrap read |

Cookies change with no browser notification, which is why the provider cannot notice a new login by itself. Increment `authGeneration` at that transition.

## Credentials stay live

`options` and `create` are read on the first render only: one client per application. `credentials` is forwarded through a ref, so an inline object is fine and each REST request or token request calls whatever the provider was last rendered with. Which link hooks exist is fixed at mount, though. A token function absent at mount is never installed later, and one withdrawn after mount fails rather than minting a stale token.

```tsx
import type { ReactNode } from "react";
import { FactoryIdentityProvider } from "@looprig/react";

// Your identity layer; not part of @looprig/react.
declare const auth: { generation: number; accessToken(): string; realtimeToken(): Promise<string> };

// Only for a deployment that fronts Factory with a bearer-token identity provider.
// A same-origin cookie deployment passes no credentials at all.
export function Root({ children }: { children: ReactNode }) {
  return (
    <FactoryIdentityProvider
      authGeneration={auth.generation}
      credentials={{
        restHeaders: () => ({ Authorization: `Bearer ${auth.accessToken()}` }),
        connectionToken: () => auth.realtimeToken(),
      }}
    >
      {children}
    </FactoryIdentityProvider>
  );
}
```

## Observe the link

`useFactoryLinkStatus()` returns `{ state, connected, failure, bindingCount }`, where `state` is `"idle"`, `"connecting"`, `"connected"`, or `"failed"` and `failure` is non-null only when failed. `useFactoryClient()` returns the shared `FactoryClient` (`reads`, `link`, `commands`, `clock`, `idGenerator`), and `useFactoryLink()` returns the `FactoryLinkStore`. Every one of these throws a clear error outside a provider.

## Bind a session by hand

Most screens use [`useFactorySessionView`](/docs/guides/web-ui/react/session-view), which binds for you. For a custom view, `useSessionBinding` subscribes one session for as long as the component is mounted. It rebinds only when the tenant, session, or link changes, and it reads your callbacks through a ref, so inline arrows do not resubscribe.

```tsx
import type { FactoryPublication, SessionReset } from "@looprig/client";
import { useFactoryTenantId, useSessionBinding } from "@looprig/react";

// Application-owned handlers.
declare function apply(publication: FactoryPublication, advance: (sequence: number) => void): void;
declare function rewind(reset: SessionReset): void;
declare function repairFrom(cursor: number): void;

function Tail({ sessionId }: { sessionId: string }) {
  const tenantId = useFactoryTenantId();
  const binding = useSessionBinding({
    tenantId,
    sessionId,
    cursor: 0, // greatest journal sequence already applied durably
    onPublication: (publication) => apply(publication, (sequence) => binding.advance(sequence)),
    onReset: (reset) => rewind(reset),
    // The link cannot replay a gap: repair from REST reads on every rejoin.
    onRejoin: (cursor) => repairFrom(cursor),
  });
  return <span>covered through {binding.cursor}</span>;
}
```

`binding.advance(sequence)` records durable coverage and ignores a lower value. The cursor survives a reconnect; a rebind to another session starts again from the `cursor` option. `onJoin` fires once for the first authorization and `onRejoin` for every later one. The store coalesces a lost connection into one reconnect, rejoins each binding independently so one refused session fails alone, and cancels every binding exactly once. See [Binding a session](/docs/guides/web-ui/sessions/binding) for the protocol view.

## Recover a failed link

Call `useLinkRecovery()` once below the provider. When the link reports `"failed"`, it waits 2 seconds, doubling to at most 60, probes `readBootstrap` with a 5 second bound, then reopens the link; a connected link resets the backoff. The probe gives an authenticated fetch the chance to refresh credentials first, as described in [Authentication and recovery](/docs/guides/web-ui/client-sdk/auth).

## Source

The providers, `useSessionBinding`, and credential forwarding are in [`packages/react/src/use-connection.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-connection.ts). The shared link store is [`packages/react/src/stores/connection.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/stores/connection.ts). Recovery is [`packages/react/src/use-link-recovery.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-link-recovery.ts) over [`packages/client/src/link-recovery.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/link-recovery.ts).

## Proof

[`packages/react/src/use-factory-identity.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-factory-identity.test.tsx) proves the scope is hidden until bootstrap verifies the tenant and that a generation change removes the old scope. [`packages/react/src/use-factory-link.strict.test.tsx`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/use-factory-link.strict.test.tsx) covers live credentials, withdrawn capabilities, and cursor rejoin. [`packages/react/src/stores/connection.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/react/src/stores/connection.test.ts) covers coalesced reconnects, isolated failures, and exactly-once cancellation. Continue with [Session views and lists](/docs/guides/web-ui/react/session-view).
