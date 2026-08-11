---
id: reference/packages/client/pkg/webui
title: Client webui package
description: Embedded SPA asset handler for serving the released client web UI with path containment and fallback behavior.
audience: [developer, operator]
section: reference
order: 230
publication: released
examples:
  - stage-20-web-client
proofs:
  package-role: release-github-com-looprig-client
  exported-surface: release-github-com-looprig-client
  lifecycle-and-errors: release-github-com-looprig-client
  source-proof: release-github-com-looprig-client
---

# `github.com/looprig/client/pkg/webui`

Go web asset package in [client v0.1.0](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/pkg/webui).

## Package role {#package-role}

`webui` serves the built browser application through `net/http`. It is the asset boundary only; transport, event folding, and framework bindings live in the private SDK source workspace.

## Exported surface {#exported-surface}

`FS` is the embedded asset filesystem. `Handler()` returns an `http.Handler` that serves files below the embedded `dist` directory and uses `dist/index.html` as the SPA fallback for non-file routes.

## Lifecycle and errors {#lifecycle-and-errors}

The handler constrains cleaned request paths under `dist` and rejects traversal. Existing assets are served with content metadata; route misses fall back to the embedded index. If the index is absent or unreadable, the handler returns 500 rather than a misleading empty document. The handler owns no external resources and needs no close operation.

## Source proof {#source-proof}

The [webui source and tests](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/pkg/webui) are pinned to the v0.1.0 release commit.
