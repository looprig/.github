---
id: reference/packages/harness/serve/catalogreader
title: serve/catalogreader package · catalogreader
description: Reference for the concrete session-store reader behind Harness serve's read interface.
audience: developer
section: reference
order: 152
publication: released
examples:
  - stage-19-http-serve
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# serve/catalogreader package · catalogreader

Import path: `github.com/looprig/harness/pkg/serve/catalogreader`. Catalogreader adapts a session-store catalog and event replayer to `serve.Reader`.

## Package role {#package-role}

`Reader` translates persisted `SessionMeta`, status projections, and public journal events into transport DTOs. Keeping this adapter in its own package lets `serve` retain dependency inversion and avoid importing `sessionstore`.

## Exported surface {#exported-surface}

The package exports `Reader`, `New`, and `PrivateEventError`. `New` accepts a `sessionstore.Catalog` and `sessionstore.Store` and returns the read-plane adapter.

### Functions and methods {#functions-and-methods}

`New` wires the catalog and store. Reader methods satisfy the `serve.Reader` list, status, and journal methods.

### Types {#types}

`PrivateEventError` identifies an event that cannot be exposed through a public reader. Store decoding and replay errors remain typed by the underlying package.

### Constants and variables {#constants-and-variables}

There are no mutable global defaults; paging and visibility come from serve requests and the persisted catalog.

## Ownership and errors {#ownership-and-errors}

The composition root owns the catalog and store and must keep them alive for the reader. Do not use this adapter as a write path or expose private events by filtering in application code.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned catalog reader](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/catalogreader/). The HTTP serve example uses a test reader directly, while production wiring uses this adapter.
