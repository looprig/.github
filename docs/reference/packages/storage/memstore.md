---
id: reference/packages/storage/memstore
title: memstore package · memstore
description: Reference for the memstore package at github.com/looprig/storage/memstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 31
publication: released
examples:
  - stage-10-workspace
proofs:
  package-role: release-github-com-looprig-storage
  exported-surface: release-github-com-looprig-storage
  functions: release-github-com-looprig-storage
  methods: release-github-com-looprig-storage
  types: release-github-com-looprig-storage
  constants: release-github-com-looprig-storage
  variables: release-github-com-looprig-storage
  ownership-and-errors: release-github-com-looprig-storage
  source-and-runnable-proof: release-github-com-looprig-storage
---

# memstore package · memstore

Import path: `github.com/looprig/storage/memstore`. The source is pinned to github.com/looprig/storage@v0.3.1.

## Package role {#package-role}

Package memstore is the in-memory reference backend for storage's four primitives.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New() *storage.Composite`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [memstore/blobs.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/blobs.go)
- [memstore/kv.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/kv.go)
- [memstore/lease.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/lease.go)
- [memstore/memstore.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/memstore.go)

Adjacent tests at the same commit:

- [memstore/blobs_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/blobs_test.go)
- [memstore/conformance_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/conformance_test.go)
- [memstore/kv_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/kv_test.go)
- [memstore/lease_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/lease_test.go)
- [memstore/ledger_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/ledger_test.go)
- [memstore/new_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/memstore/new_test.go)

Run `go test ./...` from a checkout of the `storage` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
