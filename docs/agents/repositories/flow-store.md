---
id: agents/repositories/flow-store
title: Flow checkpoint adapter
description: Store Flow checkpoints in any storage.Ledger implementation.
audience: agent
section: agents/repositories
order: 8
publication: source-workspace
proofs:
  module:
    - module-flow-store
---
# flow/store

`flow/store` is a nested source module, not a separately released tag. Its package name is `flowstore`. Import it with `github.com/looprig/flow/store` from the checked-out source and verify its `go.mod` before publishing a dependent module.

Call `flowstore.New(ledger)` to obtain a `flow.CheckpointStore`. The adapter maps each graph run to the `flow/runs/` ledger namespace, encodes checkpoints as bounded JSON envelopes, and checks run ID, sequence, revision, schema version, and JSON depth during reads. Supply a `storage.Ledger` from `fsstore`, `natsstore`, `rclonestore`, or another implementation.

Nil ledgers, missing history, revision conflicts, malformed envelopes, size or depth limits, and canceled contexts return Flow or storage errors. Proofs: [`store.go`](https://github.com/looprig/flow/tree/main/store/store.go), [`codec.go`](https://github.com/looprig/flow/tree/main/store/codec.go), [`store_integration_test.go`](https://github.com/looprig/flow/tree/main/store/store_integration_test.go).
