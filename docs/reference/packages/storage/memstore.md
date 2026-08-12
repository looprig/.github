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

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New() *storage.Composite`

### Methods {#methods}

- `func (s *blobStore) Put(ctx context.Context, key string, r io.Reader) error`
- `func (s *blobStore) Get(ctx context.Context, key string) (io.ReadCloser, error)`
- `func (s *blobStore) Delete(ctx context.Context, key string) error`
- `func (s *blobStore) List(ctx context.Context, prefix string) ([]string, error)`
- `func (s *kvStore) Get(ctx context.Context, key string) ([]byte, uint64, error)`
- `func (s *kvStore) Put(ctx context.Context, key string, expectedRev uint64, val []byte) (uint64, error)`
- `func (s *kvStore) Keys(ctx context.Context, prefix string) ([]string, error)`
- `func (s *kvStore) Delete(ctx context.Context, key string) error`
- `func (s *leaserStore) Acquire(ctx context.Context, name string) (storage.Lease, error)`
- `func (l *memLease) Epoch() uint64`
- `func (l *memLease) Lost() <-chan struct{}`
- `func (l *memLease) Release(ctx context.Context) error`
- `func (s *ledgerStore) Append(ctx context.Context, name string, expected uint64, payload []byte) error`
- `func (s *ledgerStore) Read(ctx context.Context, name string, from uint64) (storage.Cursor, error)`
- `func (s *ledgerStore) Tip(ctx context.Context, name string) (uint64, error)`
- `func (s *ledgerStore) Delete(ctx context.Context, name string) error`
- `func (c *ledgerCursor) Next(ctx context.Context) (storage.Record, error)`
- `func (c *ledgerCursor) Close() error`

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

Run `GOWORK=off go test ./...` from the `storage` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
