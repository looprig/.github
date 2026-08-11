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
  functions-and-methods: module-flow-store
  types: module-flow-store
  constants-and-variables: module-flow-store
  ownership-and-errors: module-flow-store
  source-and-runnable-proof: module-flow-store
---

# flowstore package · store

Import path: `github.com/looprig/flow/store`. Flow checkpoint storage adapter over the neutral storage Ledger contract.

## Package role {#package-role}

This is the nested `github.com/looprig/flow/store` module, distinct from released `github.com/looprig/flow`. It adapts a neutral `storage.Ledger` to Flow checkpoints and is available from the coordinated source workspace only. There is no immutable tag or supported public `go get` version.

## Exported surface {#exported-surface}

The source package exports the following declarations.

### Functions and methods {#functions-and-methods}

`New`

### Types {#types}

None reported.

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

`New` receives one caller-owned `storage.Ledger` and returns a Flow checkpoint store. The adapter does not own the ledger backend or upgrade it into a release. Checkpoint append and latest-checkpoint semantics remain the runner and ledger contracts; classify conflicts and decode failures with the exported Flow or storage errors.

## Source and runnable proof {#source-and-runnable-proof}

Read the [nested module source](https://github.com/looprig/flow/tree/main/store) and its tests. Use source-workspace replacements only in a coordinated checkout, then run `GOWORK=off go test ./...` from `flow/store`. The module proof pins the source-workspace location only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `module-flow-store`.
