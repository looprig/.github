---
id: reference/packages/flow-store/store
title: flowstore package · store
description: Reference for the store package at github.com/looprig/flow/store, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 70
publication: source-workspace
proofs:
  package-role: module-flow-store
  exported-surface: module-flow-store
  functions: module-flow-store
  methods: module-flow-store
  types: module-flow-store
  constants: module-flow-store
  variables: module-flow-store
  ownership-and-errors: module-flow-store
  source-and-runnable-proof: module-flow-store
---

# flowstore package · store

Import path: `github.com/looprig/flow/store`. This nested package is available from the coordinated local source workspace at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`.

## Package role {#package-role}

This is the nested `github.com/looprig/flow/store` module, distinct from released `github.com/looprig/flow`. It adapts a neutral `storage.Ledger` to Flow checkpoints and is available from the coordinated source workspace only. There is no immutable tag or supported public `go get` version.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(ledger storage.Ledger) flow.CheckpointStore`

### Methods {#methods}

- `func (s *checkpointStore) Append(ctx context.Context, cp *flow.Checkpoint) error`
- `func (s *checkpointStore) Latest(ctx context.Context, id flow.GraphRunID) (*flow.Checkpoint, error)`
- `func (s *checkpointStore) History(ctx context.Context, id flow.GraphRunID) ([]*flow.Checkpoint, error)`

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

`New` receives a caller-provided `storage.Ledger` and returns a `flow.CheckpointStore`. The linked source and tests define how that ledger is used; no additional ownership, lifecycle, or retry behavior is inferred here.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- local source `flow/store/codec.go` at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`
- local source `flow/store/errors.go` at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`
- local source `flow/store/store.go` at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`

Adjacent tests at the same commit:

- local test `flow/store/store_integration_test.go` at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`
- local test `flow/store/store_test.go` at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`

Run `GOWORK=off go test ./...` from the local `flow/store` directory after its source-workspace dependencies are available. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
