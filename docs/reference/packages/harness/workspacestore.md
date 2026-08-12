---
id: reference/packages/harness/workspacestore
title: workspacestore package · workspacestore
description: Reference for Harness content-addressed workspace snapshots and materialization.
audience: developer
section: reference
order: 156
publication: released
examples:
  - stage-10-workspace
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# workspacestore package · workspacestore

Import path: `github.com/looprig/harness/pkg/workspacestore`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package workspacestore captures a session's working directory as immutable, content-addressed snapshots so an agent's files survive the compute they ran on: snapshot a tree to a Ref, record the Ref in the session journal, and later materialize it on any host to resume.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ParseRef(s string) (Ref, error)`
- `func WithSpoolDir(dir string) Option`
- `func WithMaxEntries(n int64) Option`
- `func WithMaxBytes(n int64) Option`
- `func Open(b storage.Blobs, opts ...Option) (*Store, error)`

### Methods {#methods}

- `func (s *Store) GC(ctx context.Context, live map[Ref]struct{}) (deleted []Ref, err error)`
- `func (s *Store) Materialize(ctx context.Context, ref Ref, dest string) error`
- `func (s *Store) Delete(ctx context.Context, ref Ref) error`
- `func (e *InvalidRefError) Error() string`
- `func (e *DestNotEmptyError) Error() string`
- `func (e *SnapshotError) Error() string`
- `func (e *SnapshotError) Unwrap() error`
- `func (e *MaterializeError) Error() string`
- `func (e *MaterializeError) Unwrap() error`
- `func (e *IntegrityError) Error() string`
- `func (e *ArchiveEntryError) Error() string`
- `func (e *ArchiveLimitError) Error() string`
- `func (e *GCError) Error() string`
- `func (e *GCError) Unwrap() error`
- `func (s *Store) Snapshot(ctx context.Context, root string) (Ref, error)`
- `func (e *NotDirError) Error() string`
- `func (s *Store) PersistencePaths() ([]string, error)`
- `func (e *PersistencePathError) Error() string`
- `func (e *PersistencePathError) Unwrap() error`
- `func (e *NilBlobsError) Error() string`

### Types {#types}

```go
type Ref string
```

```go
type InvalidRefError struct {
	Value  string
	Reason string
}
```

```go
type DestNotEmptyError struct {
	Dest      string
	Want      Ref
	GotDigest string
}
```

```go
type SnapshotError struct {
	Root  string
	Cause error
}
```

```go
type MaterializeError struct {
	Ref   Ref
	Dest  string
	Cause error
}
```

```go
type IntegrityError struct {
	Ref Ref
	Got string
}
```

```go
type ArchiveEntryError struct {
	Name   string
	Reason string
}
```

```go
type ArchiveLimit string
```

```go
type ArchiveLimitError struct {
	Limit    ArchiveLimit
	Cap      int64
	Observed int64
}
```

```go
type GCError struct {
	Op    string
	Ref   Ref
	Cause error
}
```

```go
type NotDirError struct {
	Path string
}
```

```go
type Store struct {
	// contains filtered or unexported fields
}
```

```go
type Options struct {
	SpoolDir string

	MaxEntries int64

	MaxBytes int64
}
```

```go
type Option func(*Options)
```

```go
type PersistencePathError struct {
	Path  string
	Cause error
}
```

```go
type NilBlobsError struct{}
```

### Constants {#constants}

`ArchiveLimitEntries`, `ArchiveLimitBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ArchiveEntryError`, `ArchiveLimitError`, `DestNotEmptyError`, `GCError`, `IntegrityError`, `InvalidRefError`, `MaterializeError`, `NilBlobsError`, `NotDirError`, `PersistencePathError`, `SnapshotError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/workspacestore/archive.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/archive.go)
- [pkg/workspacestore/extract.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/extract.go)
- [pkg/workspacestore/gc.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/gc.go)
- [pkg/workspacestore/materialize.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/materialize.go)
- [pkg/workspacestore/ref.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/ref.go)
- [pkg/workspacestore/snapshot.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/snapshot.go)
- [pkg/workspacestore/store.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/store.go)

Adjacent tests at the same commit:

- [pkg/workspacestore/archive_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/archive_test.go)
- [pkg/workspacestore/extract_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/extract_fuzz_test.go)
- [pkg/workspacestore/extract_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/extract_test.go)
- [pkg/workspacestore/gc_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/gc_test.go)
- [pkg/workspacestore/materialize_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/materialize_test.go)
- [pkg/workspacestore/ref_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/ref_test.go)
- [pkg/workspacestore/snapshot_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/snapshot_test.go)
- [pkg/workspacestore/store_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/workspacestore/store_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
