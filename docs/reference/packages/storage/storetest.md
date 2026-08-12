---
id: reference/packages/storage/storetest
title: storetest package · storetest
description: Reference for the storetest package at github.com/looprig/storage/storetest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 32
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

# storetest package · storetest

Import path: `github.com/looprig/storage/storetest`. The source is pinned to github.com/looprig/storage@v0.3.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func TestBlobs(t *testing.T, newBackend func(t *testing.T) storage.Blobs)`
- `func TestKV(t *testing.T, newBackend func(t *testing.T) storage.KV)`
- `func TestLeaser(t *testing.T, newBackend func(t *testing.T) storage.Leaser)`
- `func TestLedger(t *testing.T, newBackend func(t *testing.T) storage.Ledger)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [storetest/blobs.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/blobs.go)
- [storetest/doc.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/doc.go)
- [storetest/kv.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/kv.go)
- [storetest/leaser.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/leaser.go)
- [storetest/ledger.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/ledger.go)
- [storetest/shared.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storetest/shared.go)

Adjacent tests at the same commit:

No `_test.go` file is present in this package directory at the pinned commit.

Run `GOWORK=off go test ./...` from the `storage` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
