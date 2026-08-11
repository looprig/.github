---
id: reference/packages/storage/storage
title: storage package
description: Reference for the storage package at github.com/looprig/storage, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 30
publication: released
examples:
  - stage-10-workspace
proofs:
  package-role: release-github-com-looprig-storage
  exported-surface: release-github-com-looprig-storage
  functions-and-methods: release-github-com-looprig-storage
  types: release-github-com-looprig-storage
  constants-and-variables: release-github-com-looprig-storage
  ownership-and-errors: release-github-com-looprig-storage
  source-and-runnable-proof: release-github-com-looprig-storage
---

# storage package

Import path: `github.com/looprig/storage`. Package storage defines four neutral storage primitives - Ledger (an append-only, CAS-sequenced record log), Leaser (a single-writer epoch lease), KV (revision-CAS metadata), and Blobs (content-addressed immutable bytes) - plus a typed error taxonomy, Validate

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`AppendDefinite`, `Error`, `Unwrap`, `ValidateName`

### Types {#types}

`AmbiguousError`, `AppendVerifyError`, `BlobConflictError`, `BlobNotFoundError`, `Blobs`, `Composite`, `ConflictError`, `Cursor`, `IncompleteCompositeError`, `InvalidNameError`, `KV`, `KeyNotFoundError`, `Lease`, `LeaseHeldError`, `LeaseLostError`, `Leaser`, `Ledger`, `PathReporter`, `Record`, `RecordNotFoundError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The storage package exposes `AppendDefinite`, `ValidateName` as its main operations. Its exported typed failures include `AmbiguousError`, `AppendVerifyError`, `BlobConflictError`, `BlobNotFoundError`; classify them with errors.Is or errors.As. The contract leaves backend durability and retry semantics to the selected implementation.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/storage/tree/v0.3.1/) and adjacent tests. The progressive manifest entries `stage-10-workspace` exercise this area; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-storage`.
