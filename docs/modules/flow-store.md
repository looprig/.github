---
id: modules/flow-store
title: Flow Store
description: Adapt a neutral Ledger to Flow checkpoints through the nested flow/store module.
audience: developer
section: modules
order: 14
publication: released
proofs:
  repository: release-github-com-looprig-flow-store
  description: release-github-com-looprig-flow-store
  dependencies: release-github-com-looprig-flow-store
  dependents: release-github-com-looprig-flow-store
  where-it-fits: release-github-com-looprig-flow-store
---

# Flow Store

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/flow/store` |
| Version | `store/v0.1.2` |
| GitHub | [looprig/flow](https://github.com/looprig/flow) |

## Description

Adapt a neutral Ledger to Flow checkpoints through the nested flow/store module.

## Where it fits

Flow Store is useful on its own when a Flow application needs to persist checkpoints through Looprig's neutral storage contracts. Within Looprig, it adapts any [Storage](/docs/modules/storage) Ledger to [Flow](/docs/modules/flow)'s checkpoint store, and [Workflows](/docs/modules/workflows) uses it for durable runs. The caller supplies the backend, such as [FSStore](/docs/modules/fsstore) on one host or [NATSStore](/docs/modules/natsstore) or [PGStore](/docs/modules/pgstore) when several processes share state. It adapts checkpoint records; it does not execute graphs or choose the storage location.

## Dependencies

- [Core](/docs/modules/core)
- [Flow](/docs/modules/flow)
- [FSStore](/docs/modules/fsstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
