---
id: modules/flow-store
title: Flow Store
description: Adapt a neutral Ledger to Flow checkpoints through the separate nested flow/store module.
audience: developer
section: modules
order: 10
publication: source-workspace
proofs:
  repository: module-flow-store
  description: module-flow-store
  dependencies: module-flow-store
  dependents: module-flow-store
  where-it-fits: module-flow-store
---

# Flow Store

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/flow/store` |
| Version | `store/v0.1.0` |
| GitHub | [looprig/flow](https://github.com/looprig/flow) |

## Description

Adapt a neutral Ledger to Flow checkpoints through the separate nested flow/store module.

## Where it fits

Flow Store is useful on its own when a Flow application needs to persist checkpoints through Looprig's neutral storage contracts. Within Looprig, it joins [Flow](/docs/modules/flow) to [FSStore](/docs/modules/fsstore) and [Storage](/docs/modules/storage). It adapts checkpoint records; it does not execute graphs or choose the storage location.

## Dependencies

- [Core](/docs/modules/core)
- [Flow](/docs/modules/flow)
- [FSStore](/docs/modules/fsstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
