---
id: agents/repositories/fsstore
title: Durable filesystem storage
description: Persist the storage interfaces in a local directory with locking and atomic records.
audience: agent
section: agents/repositories
order: 10
publication: released
proofs:
  module:
    - release-github-com-looprig-fsstore
---
# fsstore

`github.com/looprig/fsstore@v0.3.2` implements `storage.Ledger`, `Leaser`, `KV`, and `Blobs` over a filesystem root. Construct it with `fsstore.Open(fsstore.Options{Root: root})`; close the returned store. Use one root per ownership boundary and keep the root outside the process working tree when the store holds session data.

The implementation frames records, uses atomic writes, and applies file locks for concurrent access. It is a suitable durable local backend for `harness/pkg/sessionstore`, `flow/store`, or workspace metadata. Run the package conformance tests against it before substituting another backend.

Invalid roots, lock contention, malformed frames, missing records, lease expiry, revision conflicts, and close or context errors are expected failure classes. Proofs: [`fsstore.go`](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/fsstore.go), [`frame.go`](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/frame.go), [`conformance_test.go`](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/conformance_test.go), [`examples/durable/example_test.go`](https://github.com/looprig/fsstore/blob/b7b19f6ac9c9ea72b2d600e64e79133d865f901d/examples/durable/example_test.go).
