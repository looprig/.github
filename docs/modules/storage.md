---
id: modules/storage
title: Neutral storage primitives
description: Compose append-only history, leases, revisioned metadata, and immutable blobs behind stable contracts.
audience: developer
section: modules
order: 4
publication: released
examples:
  - stage-10-workspace
proofs:
  repository: release-github-com-looprig-storage
  primitives:
    - release-github-com-looprig-storage
  composition:
    - release-github-com-looprig-storage
  definite-append:
    - release-github-com-looprig-storage
  runnable-proof:
    - release-github-com-looprig-storage
---

# Neutral storage primitives

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/storage` repository](https://github.com/looprig/storage).

Storage `v0.3.1` defines four deliberately separate interfaces. Install `github.com/looprig/storage@v0.3.1`; choose a backend such as `memstore`, `fsstore`, `natsstore`, or `rclonestore` at the composition root.

## Primitives {#primitives}

`Ledger` is an append-only, compare-and-sequence record log. An append names a stream, supplies the expected sequence, and returns a new revision. `Leaser` grants one writer an epoch that must be renewed or released. `KV` stores bounded values with revision compare-and-swap. `Blobs` stores content-addressed immutable bytes, where a repeated key with different bytes is a conflict. The method names intentionally overlap, so a backend is a `Composite` of four independent values rather than one type that tries to implement every interface directly.

Names are canonicalized by `ValidateName`; valid names cannot alias a backend location. Ledger payloads and KV values have a common 1 MiB contract bound. Larger data belongs in Blobs, with a key recorded in the ledger or KV value.

## Composition {#composition}

`storage.NewComposite` bundles non-nil implementations and exposes each primitive by field. `memstore.New` creates the reference composite used by contract tests and small deterministic examples. The backend is intentionally in-memory and process-local; it is a correctness oracle, not a persistence choice.

Use a `Leaser` to establish ownership before a single-writer operation, use the `Ledger` to preserve ordered history, and use `KV` for mutable metadata. A workspace or transcript store can use `Blobs` for immutable files and retain only a reference in the durable record. This keeps the storage contract neutral while higher layers decide naming and retention.

## Definite append {#definite-append}

`AppendDefinite` resolves the one hard case in append-only systems: an ambiguous result after the backend may have committed. It retries the identical append once. If a conflict follows, it reads the expected next record and byte-compares the payload. Equal bytes mean the original append committed; different bytes remain a conflict. Callers get a definite outcome without inventing a new revision or silently duplicating an effect.

## Runnable proof {#runnable-proof}

The progressive entry `stage-10-workspace` snapshots a directory into `memstore.Blobs`, materializes it into a new location, and asserts exact restored contents. Run it with `node scripts/docs/run-examples.mjs`. Native storage examples under `storage/examples/ledger`, `leases`, `kv`, `blobs`, `composite`, and `storetest` cover each primitive and the conformance contract.
