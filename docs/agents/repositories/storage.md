---
id: agents/repositories/storage
title: Neutral storage contracts
description: Compose Ledger, Leaser, KV, and Blobs behind one storage.Composite value.
audience: agent
section: agents/repositories
order: 21
publication: released
proofs:
  module:
    - release-github-com-looprig-storage
---
# storage

`github.com/looprig/storage@v0.3.1` defines four independent interfaces: append-only `Ledger`, fencing `Leaser`, versioned `KV`, and content-addressed `Blobs`. Because their method names overlap, use `storage.NewComposite(ledger, leaser, kv, blobs)` to bundle implementations. `storage/memstore.New()` provides an in-memory composite for tests.

Use `AppendDefinite` when the expected ledger revision is known. Pass the concrete primitive needed by a consumer rather than widening a dependency to the composite. Backends must satisfy the package conformance tests and preserve context, revision, lease, and blob semantics.

Nil primitives, revision conflicts, lease loss, missing keys, invalid names, blob size or digest errors, and canceled operations are boundary failures. Proofs: [`storage.go`](https://github.com/looprig/storage/blob/4535d1c0ab00914f6b0163c10a31397c07f71a07/storage.go), [`appenddefinite.go`](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd1/appenddefinite.go), [`memstore/memstore.go`](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd1/memstore/memstore.go), [`examples/composite/example_test.go`](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd1/examples/composite/example_test.go).
