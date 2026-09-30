---
id: modules/storage
title: Storage
description: Compose append-only history, leases, revisioned metadata, immutable blobs, and ordered indexes behind stable contracts with shared conformance suites.
audience: developer
section: modules
order: 5
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
| Version | `v0.9.0` |
| GitHub | [looprig/storage](https://github.com/looprig/storage) |

## Description

Compose append-only history, leases, revisioned metadata, immutable blobs, and ordered indexes behind stable contracts with shared conformance suites.

## Where it fits

Storage is useful on its own. Use it when a Go application needs stable interfaces for append-only ledgers, epoch leases, revisioned key-value data, immutable blobs, and ordered indexes without committing to a particular backend. The in-memory memstore and the storetest conformance suites let a new backend prove the same behavior before anyone depends on it.

Within Looprig, Storage provides the persistence contracts used by [SessionStore](/docs/modules/sessionstore), [Harness](/docs/modules/harness), [Workflows](/docs/modules/workflows), [Flow Store](/docs/modules/flow-store), [Factory](/docs/modules/factory), and [Host](/docs/modules/host). [FSStore](/docs/modules/fsstore) and [NATSStore](/docs/modules/natsstore) implement all five primitives. [PGStore](/docs/modules/pgstore) supplies the structured ones on PostgreSQL, while [S3Store](/docs/modules/s3store) and [RcloneStore](/docs/modules/rclonestore) supply Blobs. SessionStore also requires the optional bounded blob reader lifecycle, which NATSStore and S3Store implement and a local provider such as FSStore can opt in to with `WithBoundedBlobReaders`.

Since v0.7.0, a name and a name that extends it with "/" are distinct and must coexist in KV and Blobs, and the conformance suites check this. Storage defines durable operations; higher-level runtimes decide what to persist.

Since v0.8.0, every conformance suite also requires `a`, `a.<ext>` and `a.<ext>/b` to be distinct and coexist, so a backend that stores a name as `<path>.<ext>` must use a suffix no valid name can spell. The Blobs rows also check that a deleted key is not resurrected and that a different-content re-Put of a nested key returns `*BlobConflictError` for that key. Since v0.9.0, `(*storage.Composite).WithBoundedBlobReaders()` (and `storage.WithBoundedBlobReaders` for a single provider) is an explicit opt-in that gives a local Blobs provider such as FSStore the bounded reader lifecycle SessionStore requires, so a single-host deployment can keep sessions on local disk. A blocked provider `Read` is abandoned rather than cancelled, so distributed backends should implement the lifecycle natively.

## Dependencies

None.

## Dependents

- [Controller](/docs/modules/controller)
- [Factory](/docs/modules/factory)
- [Flow Store](/docs/modules/flow-store)
- [FSStore](/docs/modules/fsstore)
- [Harness](/docs/modules/harness)
- [Host](/docs/modules/host)
- [NATSStore](/docs/modules/natsstore)
- [PGStore](/docs/modules/pgstore)
- [RcloneStore](/docs/modules/rclonestore)
- [S3Store](/docs/modules/s3store)
- [SessionStore](/docs/modules/sessionstore)
- [Tools](/docs/modules/tools)
- [Workflows](/docs/modules/workflows)
