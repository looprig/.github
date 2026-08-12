---
id: reference/packages/natsstore/natsstore
title: natsstore package
description: Reference for the natsstore package at github.com/looprig/natsstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 26
publication: released
proofs:
  package-role: release-github-com-looprig-natsstore
  exported-surface: release-github-com-looprig-natsstore
  functions: release-github-com-looprig-natsstore
  methods: release-github-com-looprig-natsstore
  types: release-github-com-looprig-natsstore
  constants: release-github-com-looprig-natsstore
  variables: release-github-com-looprig-natsstore
  ownership-and-errors: release-github-com-looprig-natsstore
  source-and-runnable-proof: release-github-com-looprig-natsstore
---

# natsstore package

Import path: `github.com/looprig/natsstore`. The source is pinned to github.com/looprig/natsstore@v0.3.1.

## Package role {#package-role}

Package natsstore implements storage's storage primitives over NATS JetStream and owns an embedded, in-process JetStream server (no TCP socket) over a persistent on-disk StoreDir, so a single process gets a durable JetStream backend with no external broker.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DefaultEngineOptions() (EngineOptions, error)`
- `func OpenEngine(opts EngineOptions) (*Engine, error)`
- `func OpenLockedEngine(dir string) (*LockedEngine, error)`
- `func Open(ctx context.Context, opts Options) (*Store, error)`

### Methods {#methods}

- `func (e *BlobOpError) Error() string`
- `func (e *BlobOpError) Unwrap() error`
- `func (e *StoreDirError) Error() string`
- `func (e *StoreDirError) Unwrap() error`
- `func (e *ServerStartError) Error() string`
- `func (e *ServerStartError) Unwrap() error`
- `func (e *Engine) JetStream() nats.JetStreamContext`
- `func (e *Engine) Conn() *nats.Conn`
- `func (e *Engine) Close() error`
- `func (e *KVOpError) Error() string`
- `func (e *KVOpError) Unwrap() error`
- `func (e *LeaseOpError) Error() string`
- `func (e *LeaseOpError) Unwrap() error`
- `func (e *LeaseEncodeError) Error() string`
- `func (e *LeaseEncodeError) Unwrap() error`
- `func (e *RecordReadError) Error() string`
- `func (e *RecordReadError) Unwrap() error`
- `func (e *LockedEngine) JetStream() nats.JetStreamContext`
- `func (e *LockedEngine) Close() error`
- `func (e *OptionsError) Error() string`
- `func (e *ConnectError) Error() string`
- `func (e *ConnectError) Unwrap() error`
- `func (e *WiringError) Error() string`
- `func (e *WiringError) Unwrap() error`
- `func (s *Store) StoragePaths() []string`
- `func (s *Store) Backend() *storage.Composite`
- `func (s *Store) Close(ctx context.Context) error`
- `func (e *StreamOpError) Error() string`
- `func (e *StreamOpError) Unwrap() error`
- `func (e *StoreLockedError) Error() string`
- `func (e *StoreLockError) Error() string`
- `func (e *StoreLockError) Unwrap() error`
- `func (e *NameEncodingError) Error() string`

### Types {#types}

```go
type BlobOpError struct {
	Key   string
	Op    string
	Cause error
}
```

```go
type StoreDirError struct {
	Path  string
	Cause error
}
```

```go
type ServerStartError struct{ Cause error }
```

```go
type EngineOptions struct {
	DataDir      string
	SyncInterval time.Duration

	MaxPayload int32
}
```

```go
type Engine struct {
	// contains filtered or unexported fields
}
```

```go
type KVOpError struct {
	Key   string
	Op    string
	Cause error
}
```

```go
type LeaseOpError struct {
	Name  string
	Op    string
	Cause error
}
```

```go
type LeaseEncodeError struct{ Cause error }
```

```go
type RecordReadError struct {
	Name  string
	Seq   uint64
	Cause error
}
```

```go
type LockedEngine struct {
	// contains filtered or unexported fields
}
```

```go
type OptionsError struct {
	Field  string
	Reason string
}
```

```go
type ConnectError struct {
	URL   string
	Cause error
}
```

```go
type WiringError struct {
	Component string
	Cause     error
}
```

```go
type Options struct {
	URL string

	EmbeddedDir string

	MaxPayload int32
}
```

```go
type Store struct {
	*storage.Composite
	// contains filtered or unexported fields
}
```

```go
type StreamOpError struct {
	Stream string
	Op     string
	Cause  error
}
```

```go
type StoreLockedError struct {
	Path string
}
```

```go
type StoreLockError struct {
	Path  string
	Cause error
}
```

```go
type NameEncodingError struct {
	Value  string
	Reason string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BlobOpError`, `ConnectError`, `KVOpError`, `LeaseEncodeError`, `LeaseOpError`, `NameEncodingError`, `OptionsError`, `RecordReadError`, `ServerStartError`, `StoreDirError`, `StoreLockError`, `StoreLockedError`, `StreamOpError`, `WiringError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [blobs.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/blobs.go)
- [embedded.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/embedded.go)
- [kv.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/kv.go)
- [lease.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/lease.go)
- [ledger.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/ledger.go)
- [lockedengine.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/lockedengine.go)
- [natsstore.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/natsstore.go)
- [paths.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/paths.go)
- [seam.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/seam.go)
- [storelock.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/storelock.go)
- [storelock_unix.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/storelock_unix.go)
- [storelock_unsupported.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/storelock_unsupported.go)
- [subject.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/subject.go)

Adjacent tests at the same commit:

- [blobs_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/blobs_test.go)
- [conformance_integration_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/conformance_integration_test.go)
- [embedded_integration_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/embedded_integration_test.go)
- [embedded_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/embedded_test.go)
- [kv_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/kv_test.go)
- [lease_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/lease_test.go)
- [ledger_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/ledger_test.go)
- [lockedengine_integration_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/lockedengine_integration_test.go)
- [lockedengine_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/lockedengine_test.go)
- [natsstore_integration_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/natsstore_integration_test.go)
- [natsstore_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/natsstore_test.go)
- [paths_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/paths_test.go)
- [subject_test.go](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/subject_test.go)

Run `go test ./...` from a checkout of the `natsstore` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
