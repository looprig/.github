---
id: modules/fsstore
title: Durable local storage with fsstore
description: Put the neutral storage primitives under one owner-only local directory with crash-aware recovery.
audience: developer
section: modules
order: 5
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  opening:
    - release-github-com-looprig-fsstore
  recovery:
    - release-github-com-looprig-fsstore
  lifecycle:
    - release-github-com-looprig-fsstore
  runnable-proof:
    - release-github-com-looprig-fsstore
---

# Durable local storage with fsstore

Fsstore `v0.3.2` is the local filesystem backend for Storage. Install `github.com/looprig/fsstore@v0.3.2` with `github.com/looprig/storage@v0.3.1`.

## Opening {#opening}

`fsstore.Open` requires an explicit, non-empty root. It creates the root and the `streams`, `leases`, `kv`, and `blobs` directories with owner-only permissions, then returns a `Store` whose embedded `storage.Composite` exposes the four primitives. `Backend` returns the same bundle for consumers such as a session store. `StoragePaths` returns a defensive copy of the canonical root.

Fsstore is a local backend, not a distributed lock service. Cross-process advisory locks protect individual operations, while the neutral lease contract protects higher-level ownership. Choose a different backend when several hosts must share the same store.

## Recovery {#recovery}

Ledger frames carry a bounded length and checksum. A `FrameError` classified by `IsTorn` means the final write ended at a clean byte boundary; the ledger may truncate back to the last complete frame. `IsCorrupt` means all declared bytes are present but the frame is internally invalid, such as a checksum mismatch or oversized declaration. Corrupt data is never silently repaired. KV headers, lease epochs, and path mappings likewise fail closed when the persisted value cannot be trusted.

## Lifecycle {#lifecycle}

`Store.Close` is idempotent and drops the ledger's in-process cache. The backend does not keep one file descriptor per primitive between calls, but a lease grant owns its own handle until the caller releases it. Do not reuse a Store after Close; open a fresh Store on the same root. A failed `Open` returns a typed option or backend error and does not leave a live Store to close.

## Runnable proof {#runnable-proof}

`stage-08-session-store` opens fsstore, adapts it to a session store, and asserts the durable path. `stage-09-restore` uses the same released backend while restoring a session. Run both with `node scripts/docs/run-examples.mjs`. The native durable and contract examples in `fsstore/examples` exercise reopen, frame, KV, lease, ledger, and blob behavior.
