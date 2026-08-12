---
id: agents/repositories/client
title: TypeScript client SDKs
description: Use the framework-neutral client core, then add optional reactive bindings.
audience: agent
section: agents/repositories
order: 3
publication: released
proofs:
  module:
    - release-github-com-looprig-client
  packages:
    - source-client-sdk-core-package
    - source-client-sdk-svelte-package
---
# client

The Go module `github.com/looprig/client@v0.1.0` ships the web surface and two TypeScript workspaces. `sdk/core` is `@looprig/client`, a framework-neutral transport, DTO validator, typed errors, SSE parser, event fold, and live-session join. `sdk/svelte` is `@looprig/svelte`, a Svelte 5 wrapper over that core. A consumer does not need Svelte or any other UI framework.

Start with the core package: `createBFFClient()` for same-origin browser requests or `createClient(transport)` with a custom `LooprigTransport`. Use `ServeTransport` only in a trusted server-side caller that owns the bearer token. The core validates every response and turns non-2xx envelopes into typed errors. Use `join` and `live` for the SSE event plane; use the Svelte package only when its reactive wrappers fit the app.

The release is independently versioned; the TypeScript package manifests are the package boundaries. Proofs: [`sdk/core/src/index.ts`](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/core/src/index.ts), [`sdk/core/src/transport.ts`](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/core/src/transport.ts), [`sdk/core/test/contract.test.ts`](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/core/test/contract.test.ts), [`sdk/svelte/src/index.ts`](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/sdk/svelte/src/index.ts).
