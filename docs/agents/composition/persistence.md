---
id: agents/composition/persistence
title: Persist sessions and workspace state
description: Select storage primitives and wire memory, filesystem, or remote backends into Harness.
audience: agent
section: agents/composition
order: 4
publication: released
proofs:
  contracts:
    - release-github-com-looprig-storage
    - release-github-com-looprig-harness
  filesystem:
    - release-github-com-looprig-fsstore
---
# Persistence

`storage` defines four independent contracts: `Ledger` for append-only CAS records, `Leaser` for epoch ownership, `KV` for revision-CAS metadata, and `Blobs` for immutable bulk bytes. `storage.NewComposite(ledger, leaser, kv, blobs)` rejects nil primitives. `storage/memstore.New()` is the in-process conformance backend.

For local durable state, call `fsstore.Open(fsstore.Options{Root: path})`; it creates `streams`, `leases`, `kv`, and `blobs` under a 0700 root. Call `Close` once the owner stops using it. For a Harness session store, pass its composite to `sessionstore.Open(composite, options...)`. Harness journals events and records, offloads large payloads to Blobs, and uses leases to coordinate one owner.

Lifecycle: composition root opens backend, session store owns journal and replay, session owns active resources, root closes session then store. Ledger cursors are bounded snapshots. Callers retain ownership of input buffers; implementations copy payloads. Names and keys must pass canonical validation.

Invariants: ledger sequences are contiguous; append with the wrong expected tip is a definite conflict; network backends may return an ambiguous outcome; KV revisions increase; blob conflicts never overwrite existing bytes; deletes are idempotent. Handle `ConflictError`, `AmbiguousError`, lease loss, `OptionsError`, and `InvalidBackendError` explicitly.

Proofs: [`storage/storage.go`](https://github.com/looprig/storage/blob/4535d1c0ab00914f6b0163c10a31397c07f71a07/storage.go), [`fsstore/fsstore.go`](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/fsstore.go), [`harness/pkg/sessionstore/sessionstore.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/sessionstore.go).
