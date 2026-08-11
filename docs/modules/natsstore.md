---
id: modules/natsstore
title: JetStream-backed storage
description: Use NATS JetStream for durable storage primitives, with an optional confined embedded engine.
audience: developer
section: modules
order: 6
publication: released
proofs:
  embedded-engine:
    - release-github-com-looprig-natsstore
  remote-mode:
    - release-github-com-looprig-natsstore
  ownership-and-failures:
    - release-github-com-looprig-natsstore
  runnable-proof:
    - release-github-com-looprig-natsstore
---

# JetStream-backed storage

Natsstore `v0.3.1` implements Storage over NATS JetStream. Install `github.com/looprig/natsstore@v0.3.1` with `github.com/looprig/storage@v0.3.1`.

## Embedded engine {#embedded-engine}

`OpenEngine` starts a JetStream server in-process, connects without opening a TCP listener, and persists its StoreDir on disk. `DefaultEngineOptions` chooses a confined application data location under the home or XDG data root. `EngineOptions` exposes the explicit data directory, sync interval, and connection payload ceiling. The engine owns the server, client connection, and bound JetStream context; `Engine.Close` drains and shuts it down.

`OpenLockedEngine` adds an exclusive process lock around one directory and places the embedded store under its `nats` child. Use it when two processes must not start independent servers against one StoreDir. The lock is acquired before a server starts and released by `LockedEngine.Close`.

## Remote mode {#remote-mode}

`Open` can connect to an operator-supplied NATS URL and build the Storage adapters over the remote JetStream context. URL diagnostics redact userinfo. Embedded mode and remote mode share the neutral Ledger, Leaser, KV, and Blobs contracts, but their persistence and operational ownership differ: the caller owns a remote server, while the embedded engine owns its local server process.

## Ownership and failures {#ownership-and-failures}

Close an embedded Engine or LockedEngine exactly once after dependent adapters stop using its connection. Lease and KV operations use compare-and-swap; ambiguous reads fail closed rather than grant ownership. `ConnectError`, `StreamOpError`, `KVOpError`, `LeaseOpError`, and `BlobOpError` retain safe operation labels and unwrap the underlying cause without exposing credential-bearing URLs or payloads. A locked directory, malformed JetStream state, or unavailable server is an operational failure, not an empty store.

## Runnable proof {#runnable-proof}

The native embedded example under `natsstore/examples/embedded` starts and closes the in-process server without a remote broker. The module's integration tests cover embedded persistence and remote seams; live external-server checks are opt-in. Run the deterministic module test command with `GOWORK=off go test ./...`.
