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
  functions: release-github-com-looprig-storage
  methods: release-github-com-looprig-storage
  types: release-github-com-looprig-storage
  constants: release-github-com-looprig-storage
  variables: release-github-com-looprig-storage
  ownership-and-errors: release-github-com-looprig-storage
  source-and-runnable-proof: release-github-com-looprig-storage
---

# storage package

Import path: `github.com/looprig/storage`. The source is pinned to github.com/looprig/storage@v0.3.1.

## Package role {#package-role}

Package storage defines four neutral storage primitives, Ledger (an append-only, CAS-sequenced record log), Leaser (a single-writer epoch lease), KV (revision-CAS metadata), and Blobs (content-addressed immutable bytes), plus a typed error taxonomy, ValidateName, and the AppendDefinite ambiguity resolver.

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

```go
type AppendVerifyError struct {
	Name  string
	Seq   uint64
	Cause error
}
```

```go
type ConflictError struct {
	Name     string
	Expected uint64
}
```

```go
type AmbiguousError struct {
	Name     string
	Expected uint64
	Cause    error
}
```

```go
type RecordNotFoundError struct {
	Name string
	Seq  uint64
}
```

```go
type KeyNotFoundError struct {
	Key string
}
```

```go
type BlobNotFoundError struct {
	Key string
}
```

```go
type BlobConflictError struct {
	Key string
}
```

```go
type LeaseHeldError struct {
	Name        string
	HolderEpoch uint64
}
```

```go
type LeaseLostError struct {
	Name  string
	Epoch uint64
}
```

```go
type InvalidNameError struct {
	Name string
	Rule string
}
```

```go
type PathReporter interface {
	StoragePaths() []string
}
```

```go
type Ledger interface {
	Append(ctx context.Context, name string, expected uint64, payload []byte) error
	Read(ctx context.Context, name string, from uint64) (Cursor, error)
	Tip(ctx context.Context, name string) (uint64, error)
	Delete(ctx context.Context, name string) error
}
```

```go
type Record struct {
	Seq     uint64
	Payload []byte
}
```

```go
type Cursor interface {
	Next(ctx context.Context) (Record, error) // io.EOF when drained
	Close() error
}
```

```go
type Leaser interface {
	Acquire(ctx context.Context, name string) (Lease, error)
}
```

```go
type Lease interface {
	Epoch() uint64
	Lost() <-chan struct{}             // closed when ownership is lost (expiry, takeover)
	Release(ctx context.Context) error // releasing may cross the network; ctx bounds it
}
```

```go
type KV interface {
	Get(ctx context.Context, key string) (val []byte, rev uint64, err error)
	Put(ctx context.Context, key string, expectedRev uint64, val []byte) (rev uint64, err error)
	Keys(ctx context.Context, prefix string) ([]string, error)
	Delete(ctx context.Context, key string) error
}
```

```go
type Blobs interface {
	Put(ctx context.Context, key string, r io.Reader) error
	Get(ctx context.Context, key string) (io.ReadCloser, error)
	Delete(ctx context.Context, key string) error
	List(ctx context.Context, prefix string) ([]string, error)
}
```

```go
type Composite struct {
	Ledger
	Leaser
	KV
	Blobs
}
```

```go
type IncompleteCompositeError struct {
	Missing []string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AmbiguousError`, `AppendVerifyError`, `BlobConflictError`, `BlobNotFoundError`, `ConflictError`, `IncompleteCompositeError`, `InvalidNameError`, `KeyNotFoundError`, `LeaseHeldError`, `LeaseLostError`, `RecordNotFoundError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `storage` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
