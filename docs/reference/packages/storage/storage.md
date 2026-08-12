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

Import path: `github.com/looprig/storage`. The source is pinned to github.com/looprig/storage@v0.3.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func AppendDefinite(ctx context.Context, l Ledger, name string, expected uint64, payload []byte) error`
- `func ValidateName(name string) error`
- `func NewComposite(l Ledger, le Leaser, kv KV, bl Blobs) (*Composite, error)`

### Methods {#methods}

- `func (e *AppendVerifyError) Error() string`
- `func (e *AppendVerifyError) Unwrap() error`
- `func (e *ConflictError) Error() string`
- `func (e *AmbiguousError) Error() string`
- `func (e *AmbiguousError) Unwrap() error`
- `func (e *RecordNotFoundError) Error() string`
- `func (e *KeyNotFoundError) Error() string`
- `func (e *BlobNotFoundError) Error() string`
- `func (e *BlobConflictError) Error() string`
- `func (e *LeaseHeldError) Error() string`
- `func (e *LeaseLostError) Error() string`
- `func (e *InvalidNameError) Error() string`
- `func (e *IncompleteCompositeError) Error() string`

### Types {#types}

`AppendVerifyError`, `ConflictError`, `AmbiguousError`, `RecordNotFoundError`, `KeyNotFoundError`, `BlobNotFoundError`, `BlobConflictError`, `LeaseHeldError`, `LeaseLostError`, `InvalidNameError`, `PathReporter`, `Ledger`, `Record`, `Cursor`, `Leaser`, `Lease`, `KV`, `Blobs`, `Composite`, `IncompleteCompositeError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AppendVerifyError`, `ConflictError`, `AmbiguousError`, `RecordNotFoundError`, `KeyNotFoundError`, `BlobNotFoundError`, `BlobConflictError`, `LeaseHeldError`, `LeaseLostError`, `InvalidNameError`, `IncompleteCompositeError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [appenddefinite.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/appenddefinite.go)
- [errors.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/errors.go)
- [names.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/names.go)
- [paths.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/paths.go)
- [storage.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storage.go)

Adjacent tests at the same commit:

- [appenddefinite_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/appenddefinite_test.go)
- [errors_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/errors_test.go)
- [names_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/names_test.go)
- [package_name_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/package_name_test.go)
- [paths_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/paths_test.go)
- [storage_test.go](https://github.com/looprig/storage/blob/e7cdd7ea32fd4b8dba87822cc97e3a55d65668fd/storage_test.go)

Run `GOWORK=off go test ./...` from the `storage` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
