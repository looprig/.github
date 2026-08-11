---
id: reference/packages/foreignloops/backend
title: backend package · backend
description: Reference for Harness foreign-loop backend construction and restoration.
audience: developer
section: reference
order: 200
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions-and-methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants-and-variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# backend package · backend

Import path: `github.com/looprig/foreignloops/backend`. Backend maps a neutral foreign driver to Harness's `loop.Backend` and restoration seams.

## Package role {#package-role}

`Loop` owns provider turn coordination, normalized publication, snapshots, locks, and delivery reservations for one foreign loop. `New` constructs a live backend; the builder functions install it into a Rig.

## Exported surface {#exported-surface}

The package exports `Loop`, `Config`, `SIDMode`, `SnapshotError`, `SnapshotErrorReason`, `ConfigError`, `ForeignProtocolError`, `ForeignPublicationError`, `ForeignResultError`, `ForeignSessionBusyError`, and `LockError`. Constructors are `New`, `BuildWith`, `BuildRestoredWith`, `BuildWithServices`, and `BuildRestoredWithServices`.

### Functions and methods {#functions-and-methods}

Builder functions return Harness live or restored builder types. `New` validates identities, profile, and driver services before allocating the loop.

### Types {#types}

Snapshot reasons distinguish provider loop exit, invalid state, and restore inability. Provider results and publication failures remain typed at the backend boundary.

### Constants and variables {#constants-and-variables}

`SIDMode` values identify whether a provider session ID is prebound or discovered. No provider process is global.

## Ownership and errors {#ownership-and-errors}

Harness owns the returned backend and calls its close path. Restore must use the matching profile and persisted identity; a busy or mismatched session is not safe to adopt.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned backend](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/). The progressive ACP/foreign example verifies live and restored builders.
