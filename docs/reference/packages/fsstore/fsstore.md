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

Package fsstore exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Open(opts Options) (*Store, error)`

### Methods {#methods}

- `func (e *BlobRootError) Error() string`
- `func (e *BlobPathError) Error() string`
- `func (e *BlobIOError) Error() string`
- `func (e *BlobIOError) Unwrap() error`
- `func (e *FlockError) Error() string`
- `func (e *FlockError) Unwrap() error`
- `func (e *FrameError) IsTorn() bool`
- `func (e *FrameError) IsCorrupt() bool`
- `func (e *FrameError) Error() string`
- `func (e *OptionsError) Error() string`
- `func (e *OptionsError) Unwrap() error`
- `func (s *Store) Backend() *storage.Composite`
- `func (s *Store) StoragePaths() []string`
- `func (s *Store) Close() error`
- `func (e *KVRootError) Error() string`
- `func (e *KVPathError) Error() string`
- `func (e *KVIOError) Error() string`
- `func (e *KVIOError) Unwrap() error`
- `func (e *KVCorruptError) Error() string`
- `func (e *KVCorruptError) Unwrap() error`
- `func (e *LeaseRootError) Error() string`
- `func (e *LeasePathError) Error() string`
- `func (e *LeaseIOError) Error() string`
- `func (e *LeaseIOError) Unwrap() error`
- `func (e *LeaseCorruptError) Error() string`
- `func (e *LeaseCorruptError) Unwrap() error`
- `func (e *LedgerCorruptError) Error() string`
- `func (e *LedgerCorruptError) Unwrap() error`
- `func (e *LedgerPathError) Error() string`
- `func (e *LedgerRootError) Error() string`
- `func (e *LedgerIOError) Error() string`
- `func (e *LedgerIOError) Unwrap() error`

### Types {#types}

```go
type BlobRootError struct {
	Root   string
	Reason string
}
```

```go
type BlobPathError struct {
	Key  string
	Path string
}
```

```go
type BlobIOError struct {
	Op    string
	Path  string
	Cause error
}
```

```go
type FlockError struct {
	Op    string
	Path  string
	Cause error
}
```

```go
type FrameFault uint8
```

```go
type FrameError struct {
	Fault FrameFault

	Have int

	Need int

	Length uint64
}
```

```go
type Options struct {
	Root string
}
```

```go
type OptionsError struct {
	Field  string
	Reason string
	Cause  error
}
```

```go
type Store struct {
	*storage.Composite
	// contains filtered or unexported fields
}
```

```go
type KVRootError struct {
	Root   string
	Reason string
}
```

```go
type KVPathError struct {
	Key  string
	Path string
}
```

```go
type KVIOError struct {
	Op    string
	Path  string
	Cause error
}
```

```go
type KVCorruptError struct {
	Path  string
	Cause error
}
```

```go
type LeaseRootError struct {
	Root   string
	Reason string
}
```

```go
type LeasePathError struct {
	Name string
	Path string
}
```

```go
type LeaseIOError struct {
	Op    string
	Path  string
	Cause error
}
```

```go
type LeaseCorruptError struct {
	Path  string
	Cause error
}
```

```go
type LedgerCorruptError struct {
	Path  string
	Seq   uint64
	Cause error
}
```

```go
type LedgerPathError struct {
	Name string
	Path string
}
```

```go
type LedgerRootError struct {
	Root   string
	Reason string
}
```

```go
type LedgerIOError struct {
	Op    string
	Path  string
	Cause error
}
```

### Constants {#constants}

`MaxFramePayload`, `FaultShortHeader`, `FaultShortPayload`, `FaultOversize`, `FaultCRCMismatch`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BlobIOError`, `BlobPathError`, `BlobRootError`, `FlockError`, `FrameError`, `KVCorruptError`, `KVIOError`, `KVPathError`, `KVRootError`, `LeaseCorruptError`, `LeaseIOError`, `LeasePathError`, `LeaseRootError`, `LedgerCorruptError`, `LedgerIOError`, `LedgerPathError`, `LedgerRootError`, `OptionsError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `fsstore` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
