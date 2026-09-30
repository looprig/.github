---
id: guides/web-ui/index
title: Web UI
description: Build a browser interface for Factory sessions with the framework-neutral @looprig/client package or the React 19 hooks in @looprig/react.
audience: developer
section: guides
order: 0
publication: released
proofs:
  choose-a-package: [release-npm-looprig-client, release-npm-looprig-react]
  factory-is-the-server-contract: [release-npm-looprig-client]
  a-first-connection: [release-npm-looprig-client]
  retired-browser-packages: [release-npm-looprig-client, release-npm-looprig-react]
  guide-map: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client, release-npm-looprig-react]
  proof: [release-npm-looprig-client, release-npm-looprig-react]
---

# Web UI

These guides show how to build your own browser interface for agent sessions that a Factory serves: list sessions, open one, follow its journal and live output, send input, answer approval gates, and interrupt a turn. The public boundary is two npm packages at version 0.3.0, both Apache-2.0, and the Factory HTTP and WebSocket surface they talk to.

## Choose a package

| Package | Use it when | What it contains |
| --- | --- | --- |
| `@looprig/client` | Any framework, or none | Factory REST reads, the ClientLink WebSocket, retry-stable commands, Core wire validation, live text, reasoning, and tool step decoders, the transcript fold, and framework-neutral session controllers |
| `@looprig/react` | A React 19 application | Providers and hooks over `@looprig/client`: identity, one shared link, session lists and views, composer, gates, interrupt |

`@looprig/react` depends on exactly `@looprig/client` 0.3.0 and declares `react` and `react-dom` `^19.0.0` as peers. It parses no wire shapes of its own; a Vue, Svelte, or Solid author installs `@looprig/client` and writes the equivalent thin adapter. Import from the package root only, because neither package supports deep imports.

Release 0.3.0 adds three things over 0.2.0. `contractInfo` reports the package version and the Core contract it vendors. Live tool steps show a running or finished tool call before its step commits, when the Host publishes them. And the React session view pages earlier history backward from the oldest loaded record. The [Live previews](/docs/guides/web-ui/client-sdk/live-previews) and [Session view](/docs/guides/web-ui/react/session-view) pages cover the details, including the `"tool"` preview kind that exhaustive switches must now handle.

## Factory is the server contract

Every call these packages make is addressed to a Factory: `GET /v1/bootstrap`, `/v1/sessions`, and the per-session `status`, `journal`, and `gates` reads over REST, and commands and live publications over the ClientLink WebSocket at `/v1/realtime`. Factory authenticates the caller, applies its origin and CSRF guard, admits commands, and relays each watched session's output from the Host that runs it. The browser never talks to a Host or to Harness directly. See the [Factory module](/docs/modules/factory) for the server options and the [Harness guide](/docs/guides/harness) for the events the journal carries.

## A first connection

`createFactoryClient` builds one application-scoped client: a REST read plane, one ClientLink, and the command plane that sends over it. With no `baseUrl`, it uses same-origin relative paths, which is the deployed case when Factory serves your bundle.

```ts
import { createFactoryClient } from "@looprig/client";

// One client per application, not per route: it owns one WebSocket.
const client = createFactoryClient();

const { tenant_id } = await client.reads.readBootstrap();
const page = await client.reads.listRecentSessions({ limit: 20 });
console.log(tenant_id, page.sessions.length);
```

## Retired browser packages

The earlier Web UI stack is retired. It paired a Go module, `github.com/looprig/client`, with a Harness `pkg/serve` backend-for-frontend, an SSE session client, and a Svelte adapter, and it shipped a prebuilt React bundle as the Go module `github.com/looprig/wui` (archived at v0.5.1). None of those ship in the npm packages: there is no Harness `serve` transport, SSE parser, or legacy constructor in 0.3.0. The `client` repository now publishes only the two npm packages.

If you want a finished browser UI rather than your own, [Carbon](/docs/products/carbon) ships one. Carbon v0.32.2 builds its single-page app on `@looprig/react` 0.3.0 and embeds it in its own binary; that embedding package is internal to Carbon and not importable.

## Guide map

- [Client SDK](/docs/guides/web-ui/client-sdk) covers REST, ClientLink, live previews, commands, folding, validation, and authentication without a framework.
- [React](/docs/guides/web-ui/react) covers the providers and hooks.
- [Embedding](/docs/guides/web-ui/embedding) covers building a static bundle and serving it through Factory's UI seam.
- [Session lifecycle](/docs/guides/web-ui/sessions) covers binding, reconnecting with exact joins, and restoring a session.

## Source

The framework-neutral surface is the barrel [`packages/client/src/index.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/index.ts), and `createFactoryClient` is in [`packages/client/src/client.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/client.ts). The React surface is [`packages/react/src/index.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/index.ts). Package versions, the exact client pin, and the React peer range are in [`packages/react/package.json`](https://github.com/looprig/client/blob/v0.3.0/packages/react/package.json).

## Proof

[`packages/client/test/surface.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/surface.test.ts) checks the published export surface, including the absence of the retired serve and SSE APIs, and [`packages/react/src/index.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/react/src/index.test.ts) checks the React barrel. Continue with the [Client SDK](/docs/guides/web-ui/client-sdk) or [React](/docs/guides/web-ui/react).
