---
id: modules/storage
title: Storage
description: Compose append-only history, leases, revisioned metadata, and immutable blobs behind stable contracts.
audience: developer
section: modules
order: 4
publication: released
proofs:
  repository: release-github-com-looprig-storage
  description: release-github-com-looprig-storage
  dependencies: release-github-com-looprig-storage
  dependents: release-github-com-looprig-storage
  where-it-fits: release-github-com-looprig-storage
---

# Storage

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/storage` |
| Version | `v0.3.1` |
| GitHub | [looprig/storage](https://github.com/looprig/storage) |

## Description

Compose append-only history, leases, revisioned metadata, and immutable blobs behind stable contracts.

## Where it fits

Storage is useful on its own. Use it when a Go application needs stable interfaces for append-only records, leases, revisioned key-value data, and immutable blobs without committing to a particular backend.

Within Looprig, Storage provides the persistence contracts used by [Harness](/docs/modules/harness), [Workflows](/docs/modules/workflows), [Client](/docs/modules/client), and [Flow Store](/docs/modules/flow-store). Backend modules such as [FSStore](/docs/modules/fsstore), [NATSStore](/docs/modules/natsstore), and [RcloneStore](/docs/modules/rclonestore) implement selected parts of those contracts. Storage defines durable operations; higher-level runtimes decide what to persist.

## Dependencies

None.

## Dependents

- [Client](/docs/modules/client)
- [Flow Store](/docs/modules/flow-store)
- [FSStore](/docs/modules/fsstore)
- [Harness](/docs/modules/harness)
- [NATSStore](/docs/modules/natsstore)
- [RcloneStore](/docs/modules/rclonestore)
- [Workflows](/docs/modules/workflows)
