---
id: reference/packages/fsstore/fsstore
title: fsstore package
description: Reference for the fsstore package at github.com/looprig/fsstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 25
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-fsstore
  exported-surface: release-github-com-looprig-fsstore
  functions: release-github-com-looprig-fsstore
  methods: release-github-com-looprig-fsstore
  types: release-github-com-looprig-fsstore
  constants: release-github-com-looprig-fsstore
  variables: release-github-com-looprig-fsstore
  ownership-and-errors: release-github-com-looprig-fsstore
  source-and-runnable-proof: release-github-com-looprig-fsstore
---

# fsstore package

Import path: `github.com/looprig/fsstore`. The source is pinned to github.com/looprig/fsstore@v0.3.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.2; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Open(opts Options) (*Store, error)`

### Methods {#methods}

- `func (e *BlobRootError) Error() string`
- `func (e *BlobPathError) Error() string`
- `func (e *BlobIOError) Error() string`
- `func (e *BlobIOError) Unwrap() error`
- `func (s *blobStore) Put(ctx context.Context, key string, r io.Reader) error`
- `func (s *blobStore) Get(ctx context.Context, key string) (io.ReadCloser, error)`
- `func (s *blobStore) Delete(ctx context.Context, key string) error`
- `func (s *blobStore) List(ctx context.Context, prefix string) ([]string, error)`
- `func (e *FlockError) Error() string`
- `func (e *FlockError) Unwrap() error`
- `func (e *FrameError) IsTorn() bool`
- `func (e *FrameError) IsCorrupt() bool`
- `func (e *FrameError) Error() string`
- `func (e *OptionsError) Error() string`
- `func (e *OptionsError) Unwrap() error`
- `func (s *Store) Backend() *storage.Composite`
- `func (s *Store) StoragePaths() []string`
- `func (s *ledgerStore) StoragePaths() []string`
- `func (s *leaserStore) StoragePaths() []string`
- `func (s *kvStore) StoragePaths() []string`
- `func (s *blobStore) StoragePaths() []string`
- `func (s *Store) Close() error`
- `func (e *KVRootError) Error() string`
- `func (e *KVPathError) Error() string`
- `func (e *KVIOError) Error() string`
- `func (e *KVIOError) Unwrap() error`
- `func (e *KVCorruptError) Error() string`
- `func (e *KVCorruptError) Unwrap() error`
- `func (s *kvStore) Get(ctx context.Context, key string) ([]byte, uint64, error)`
- `func (s *kvStore) Put(ctx context.Context, key string, expectedRev uint64, val []byte) (uint64, error)`
- `func (s *kvStore) Keys(ctx context.Context, prefix string) ([]string, error)`
- `func (s *kvStore) Delete(ctx context.Context, key string) error`
- `func (e *LeaseRootError) Error() string`
- `func (e *LeasePathError) Error() string`
- `func (e *LeaseIOError) Error() string`
- `func (e *LeaseIOError) Unwrap() error`
- `func (e *LeaseCorruptError) Error() string`
- `func (e *LeaseCorruptError) Unwrap() error`
- `func (s *leaserStore) Acquire(ctx context.Context, name string) (storage.Lease, error)`
- `func (l *fsLease) Epoch() uint64`
- `func (l *fsLease) Lost() <-chan struct{}`
- `func (l *fsLease) Release(ctx context.Context) error`
- `func (e *LedgerCorruptError) Error() string`
- `func (e *LedgerCorruptError) Unwrap() error`
- `func (e *LedgerPathError) Error() string`
- `func (e *LedgerRootError) Error() string`
- `func (e *LedgerIOError) Error() string`
- `func (e *LedgerIOError) Unwrap() error`
- `func (s *ledgerStore) Close() error`
- `func (s *ledgerStore) Append(ctx context.Context, name string, expected uint64, payload []byte) (err error)`
- `func (s *ledgerStore) Read(ctx context.Context, name string, from uint64) (storage.Cursor, error)`
- `func (s *ledgerStore) Tip(ctx context.Context, name string) (uint64, error)`
- `func (s *ledgerStore) Delete(ctx context.Context, name string) (err error)`
- `func (drainedCursor) Next(ctx context.Context) (storage.Record, error)`
- `func (drainedCursor) Close() error`
- `func (c *recordCursor) Next(ctx context.Context) (storage.Record, error)`
- `func (c *recordCursor) Close() error`

### Types {#types}

`BlobRootError`, `BlobPathError`, `BlobIOError`, `FlockError`, `FrameFault`, `FrameError`, `Options`, `OptionsError`, `Store`, `KVRootError`, `KVPathError`, `KVIOError`, `KVCorruptError`, `LeaseRootError`, `LeasePathError`, `LeaseIOError`, `LeaseCorruptError`, `LedgerCorruptError`, `LedgerPathError`, `LedgerRootError`, `LedgerIOError`

### Constants {#constants}

`MaxFramePayload`, `FaultShortHeader`, `FaultShortPayload`, `FaultOversize`, `FaultCRCMismatch`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BlobRootError`, `BlobPathError`, `BlobIOError`, `FlockError`, `FrameError`, `OptionsError`, `KVRootError`, `KVPathError`, `KVIOError`, `KVCorruptError`, `LeaseRootError`, `LeasePathError`, `LeaseIOError`, `LeaseCorruptError`, `LedgerCorruptError`, `LedgerPathError`, `LedgerRootError`, `LedgerIOError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [blobs.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/blobs.go)
- [flock.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/flock.go)
- [flock_unix.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/flock_unix.go)
- [flock_unsupported.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/flock_unsupported.go)
- [frame.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/frame.go)
- [fsstore.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/fsstore.go)
- [fswrite.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/fswrite.go)
- [kv.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/kv.go)
- [lease.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/lease.go)
- [ledger.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/ledger.go)

Adjacent tests at the same commit:

- [blobs_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/blobs_test.go)
- [conformance_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/conformance_test.go)
- [frame_fuzz_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/frame_fuzz_test.go)
- [frame_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/frame_test.go)
- [fsstore_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/fsstore_test.go)
- [kv_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/kv_test.go)
- [lease_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/lease_test.go)
- [ledger_test.go](https://github.com/looprig/fsstore/blob/52a1924c7ed97fd4789024a66da281e5465832fc/ledger_test.go)

Run `GOWORK=off go test ./...` from the `fsstore` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
