---
id: modules/flow-store
title: Flow checkpoint storage in the source workspace
description: Adapt a neutral Ledger to Flow checkpoints through the separate nested flow/store module.
audience: developer
section: modules
order: 10
publication: source-workspace
proofs:
  repository: module-flow-store
  boundary:
    - module-flow-store
  adapter:
    - module-flow-store
  availability:
    - module-flow-store
  verification:
    - module-flow-store
---

# Flow checkpoint storage in the source workspace

## Repository

The nested `flow/store` module is developed separately inside the Flow workspace. Its surrounding project is available in the [Flow repository](https://github.com/looprig/flow).

`github.com/looprig/flow/store` is a distinct nested Go module, not a package released by `github.com/looprig/flow`. The current module file is source-workspace code with local replacements for Flow, Fsstore, and Storage. It has no immutable tag and no supported public `go get` version.

## Boundary {#boundary}

The module exports the `flowstore` package at `github.com/looprig/flow/store`. Its `New(ledger storage.Ledger) flow.CheckpointStore` constructor adapts one neutral append-only Ledger to Flow's checkpoint interface. It does not create a backend, choose a filesystem path, or own the Ledger. Supply a released backend such as Fsstore or a test Ledger from the composition root.

## Adapter {#adapter}

Flow writes checkpoints as an append-only sequence for a graph run. The adapter encodes and decodes the checkpoint representation and delegates ordering, compare-and-append, and latest-record behavior to the supplied Ledger. The runner remains responsible for graph semantics, interruption, resume payloads, and state transitions. A decode failure or revision conflict must remain visible; the adapter must not synthesize a latest checkpoint from an older record.

## Availability {#availability}

Use this module only from a coordinated source checkout where its local replacement paths resolve. Do not copy those `replace` directives into a published consumer module and do not describe `github.com/looprig/flow/store@...` as an installable release. The separate module boundary exists so checkpoint persistence can evolve without falsely changing the released Flow module's publication status.

## Verification {#verification}

Run `GOWORK=off go test ./...` from `flow/store` with its source-workspace dependencies present. The package page lists the single exported `New` function. Its unit and integration tests cover append, latest, encode/decode, and Fsstore-backed behavior; a future release must publish this nested module independently before an immutable install instruction can be added.
