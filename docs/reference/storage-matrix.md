---
id: reference/storage-matrix
title: Storage backend matrix
description: Compare the released storage contracts and backend adapters without conflating ledgers, KV metadata, leases, and immutable blobs.
audience: [developer, operator]
section: reference
order: 300
publication: released
proofs:
  primitives: release-github-com-looprig-storage
  filesystem: release-github-com-looprig-fsstore
  jetstream: release-github-com-looprig-natsstore
  remote-blobs: release-github-com-looprig-rclonestore
---

# Storage backend matrix

The released [storage v0.3.1](https://github.com/looprig/storage/tree/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd) module defines four primitives. Choose a backend by the primitive it implements and by its durability/lifecycle behavior; do not call every backend a session store.

## Primitives {#primitives}

| Primitive | Contract | What it represents | Main limits and errors |
| --- | --- | --- | --- |
| `Ledger` | Append, read, cursor, and path reporting | Ordered event history or journal records | Compare-and-append conflicts and ambiguous acknowledgements are distinct; callers must resolve ambiguous appends. |
| `KV` | Get, create/update/delete, list, CAS revisions | Small metadata such as a session catalog or run registry | Names are validated; `KeyNotFoundError` and `ConflictError` are expected outcomes. |
| `Leaser` | Acquire/release with epoch fencing | Exclusive session/workflow ownership | `LeaseHeldError` and `LeaseLostError` prevent stale writers. |
| `Blobs` | Immutable content-addressed Put/Get/Delete/List | Large inputs, artifacts, snapshots, or other byte payloads | Missing and different-content conflicts are typed; keys follow the storage name grammar. |

## Filesystem adapter {#filesystem}

[fsstore v0.3.2](https://github.com/looprig/fsstore/tree/52a1924c7ed97fd4789024a66da281e5465832fc) implements all four primitives under one 0700 root and exposes `Open`, `Backend`, `StoragePaths`, and idempotent `Close`. Ledger frames cap a single payload at 16 MiB; torn tails can be truncated to the last good frame, while CRC/oversize corruption fails closed. KV and lease files reject malformed persisted revisions and epochs rather than resetting them.

## JetStream adapter {#jetstream}

[natsstore v0.3.1](https://github.com/looprig/natsstore/tree/054dcab200c5a3d0ddde76208d3b117e76c521f2) implements all four primitives over remote NATS or an embedded in-process JetStream engine. `Open` requires exactly one of `URL` or absolute `EmbeddedDir`; embedded payload defaults to 8 MiB and must be at least the ledger message ceiling. `Close(ctx)` drains before shutting down and is idempotent. Embedded mode without `OpenLockedEngine` requires the caller to ensure one opener per directory.

## Remote immutable blobs {#remote-blobs}

[rclonestore v0.3.2](https://github.com/looprig/rclonestore/tree/994e14f9184726b57798df4049b7b731fde608f9) implements only `storage.Blobs` through context-bounded `rclone` subprocesses. It validates the remote/prefix, resolves the binary, and probes reachability in `New`. A missing object is normal for `Get`; identical re-Put is a no-op and different bytes return `BlobConflictError`. `Close` is a no-op because each operation is a short-lived process. Error values omit credential-bearing remote and config paths.
