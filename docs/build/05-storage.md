---
id: build/05-storage
title: Build 05: storage
description: Choose a storage contract and backend for durable history, leases, key values, and blobs.
audience: developer
section: build
order: 5
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
  - stage-10-workspace
proofs:
  boundary:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
    - release-github-com-looprig-natsstore
    - release-github-com-looprig-rclonestore
  composition:
    - release-github-com-looprig-storage
  shared-contracts:
    - release-github-com-looprig-storage
  fsstore:
    - release-github-com-looprig-fsstore
  natsstore:
    - release-github-com-looprig-natsstore
  rclonestore:
    - release-github-com-looprig-rclonestore
  lifecycle:
    - release-github-com-looprig-fsstore
    - release-github-com-looprig-natsstore
    - release-github-com-looprig-rclonestore
  lifecycle-and-failure-handling:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
  errors-and-limits:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
    - release-github-com-looprig-rclonestore
  runnable-proof:
    - release-github-com-looprig-fsstore
---

# Build 05: storage

Start with the `storage` interfaces, then select a backend by durability and deployment shape. `fsstore` is the straightforward single-machine backend, `natsstore` maps the contracts to NATS JetStream, and `rclonestore` uses an external rclone remote for blob-oriented persistence. The application should depend on contracts, not on backend-specific handles.

## Shared contracts {#shared-contracts}

`Ledger` records ordered entries, `Leaser` coordinates ownership, `KV` stores named values, and `Blobs` stores larger payloads. `Composite` combines those capabilities when a backend needs different implementations for different data classes. `AppendDefinite` makes the append outcome explicit, which is important when a retry cannot tell whether a write was accepted.

Choose the smallest contract that expresses the state you need. A workspace snapshot may need a ledger and blobs; a short-lived coordination key may need only `KV` and `Leaser`. Validate names at the contract boundary so backend-specific path or subject rules do not leak into application code.

## Fsstore {#fsstore}

`fsstore.Open` owns an explicit root directory and creates the backend's ledger, lease, KV, and blob areas under it. It uses framed records and lock files, and reports whether a bad frame is torn or corrupt. Close the store before releasing or replacing its root. Stage 08 proves a durable session path and Stage 09 proves restore from it.

## Natsstore {#natsstore}

`natsstore.OpenEngine` configures an embedded or remote NATS engine, while `OpenLockedEngine` adds the lock/lease path. `DefaultEngineOptions` supplies the package defaults; `Engine.Conn` and `Engine.JetStream` expose the owned connection and stream context for the backend's own operations. Remote deployments must own server availability and stream configuration separately from the Go handle.

## Rclonestore {#rclonestore}

`rclonestore.New` validates the remote, prefix, binary, config path, timeout, and persistence paths before returning a `Store`. `Put`, `Get`, `List`, and `Delete` invoke the configured rclone binary, and `StoragePaths` describes the local paths used for configuration or state. The backend reports probe, binary, and command failures with redacting error types. It is a useful bridge to an existing remote, not an atomic multi-object transaction.

## Lifecycle and failure handling {#lifecycle-and-failure-handling}

A backend handle owns resources even when the shared contract does not expose every backend operation. Stop writers and readers before `Close`, and preserve the root or remote configuration until close completes. Treat definite append outcomes, lease conflicts, frame failures, unavailable servers, and command failures as distinct states. Retry only when the error type and operation semantics permit it.

## Runnable proof {#runnable-proof}

`stage-08-session-store` proves a released Fsstore path, `stage-09-restore` proves that the stored state can be restored, and `stage-10-workspace` proves a snapshot round trip using Storage. Run them with `node scripts/docs/run-examples.mjs`. The implementation trees are pinned for [Storage](https://github.com/looprig/storage/tree/v0.3.1/), [Fsstore](https://github.com/looprig/fsstore/tree/v0.3.2/), [Natsstore](https://github.com/looprig/natsstore/tree/v0.3.1/), and [Rclonestore](https://github.com/looprig/rclonestore/tree/v0.3.2/). Precise source/test proof IDs beyond these release records are pending Task15 evidence promotion.
