---
id: reference/packages/harness/workspacestore
title: workspacestore package · workspacestore
description: Reference for Harness content-addressed workspace snapshots and materialization.
audience: developer
section: reference
order: 156
publication: released
examples:
  - stage-10-workspace
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# workspacestore package · workspacestore

Import path: `github.com/looprig/harness/pkg/workspacestore`. Workspacestore captures a working tree as an immutable content-addressed snapshot and materializes it later.

## Package role {#package-role}

`Store` opens over `storage.Blobs`; `Snapshot` records a tree, `Ref` names its content, and materialization restores into a caller-selected destination. Snapshot options bound bytes, entries, and spool space.

## Exported surface {#exported-surface}

The package exports `Store`, `Ref`, `Options`, `ArchiveLimit`, and errors for archive limits, invalid refs, non-directories, destinations, integrity, blobs, persistence paths, GC, snapshots, and materialization. Constructors include `Open`, `ParseRef`, `WithMaxBytes`, `WithMaxEntries`, and `WithSpoolDir`.

### Functions and methods {#functions-and-methods}

`Open` validates the blob backend and options; `ParseRef` validates the content-addressed reference. Store methods snapshot, materialize, inspect, and collect content while preserving integrity.

### Types {#types}

`ArchiveLimitError` identifies whether entries or bytes exceeded a bound. `IntegrityError` and `MaterializeError` carry phase and bounded path context rather than raw archive contents.

### Constants and variables {#constants-and-variables}

Archive limit and pointer source enums are durable labels. Limits have no unsafe unlimited default when the caller opts into a bounded store.

## Ownership and errors {#ownership-and-errors}

The session or Rig owns the store and its blob backend. Snapshot refs are immutable values; materialize into a caller-owned directory and never assume it is empty unless the API has checked it. Integrity failure stops restore.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned workspace store](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/workspacestore/). `stage-10-workspace` proves the released workspace snapshot path.
