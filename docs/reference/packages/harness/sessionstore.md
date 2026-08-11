---
id: reference/packages/harness/sessionstore
title: sessionstore package · sessionstore
description: Reference for durable session catalogs, journal projection, blob offload, replay, and garbage collection.
audience: developer
section: reference
order: 154
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# sessionstore package · sessionstore

Import path: `github.com/looprig/harness/pkg/sessionstore`. Sessionstore projects a durable session ledger over Storage composites and optional blob backends.

## Package role {#package-role}

`Store` opens over a `storage.Composite`, owns catalog and journal projections, and exposes session metadata, status, replay, checkpoint, usage, and object-GC operations. `Catalog` can be configured with a clock, logger, and replay opener. Offload thresholds separate journal envelopes from large blobs.

## Exported surface {#exported-surface}

The surface includes `Store`, `Catalog`, `SessionMeta`, `SessionState`, `SessionStatus`, `ReplayRequest`, `CheckpointSummary`, `WorkspacePointer`, `ObjectGC`, `GCResult`, and catalog, blob, replay, persistence, and usage errors. `Open`, `WithOffloadThreshold`, `WithCatalogClock`, `WithCatalogLogger`, and `WithCatalogReplayer` are the main constructors and options.

### Functions and methods {#functions-and-methods}

`Open` validates the composite and options. Store methods append, replay, scan, project, checkpoint, and garbage-collect while preserving leases and idempotency.

### Types {#types}

Typed errors distinguish empty sessions, invalid backends, catalog conflicts and ordering, malformed envelopes, replay read/decode, blob integrity/unavailability, workspace scans, and lease-not-held GC.

### Constants and variables {#constants-and-variables}

Session state/status and workspace pointer source enums are durable values. Limits are configured per store rather than through globals.

## Ownership and errors {#ownership-and-errors}

The caller owns the Storage composite and closes the store before closing the backend. Never run GC without the required lease. A catalog conflict or integrity error must stop restore rather than produce partial session state.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned sessionstore package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/). `stage-08-session-store` and `stage-09-restore` exercise durable open and replay.
