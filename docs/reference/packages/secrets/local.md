---
id: reference/packages/secrets/local
title: local package · local
description: Reference for the local package at github.com/looprig/secrets/local, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 29
publication: released
proofs:
  package-role: release-github-com-looprig-secrets
  exported-surface: release-github-com-looprig-secrets
  functions: release-github-com-looprig-secrets
  methods: release-github-com-looprig-secrets
  types: release-github-com-looprig-secrets
  constants: release-github-com-looprig-secrets
  variables: release-github-com-looprig-secrets
  ownership-and-errors: release-github-com-looprig-secrets
  source-and-runnable-proof: release-github-com-looprig-secrets
---

# local package · local

Import path: `github.com/looprig/secrets/local`. The source is pinned to github.com/looprig/secrets@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(root string) (*Store, error)`
- `func NewStore(root string) (*Store, error)`
- `func Open(root string) (*Store, error)`
- `func NewWithOptions(root string, options Options) (*Store, error)`

### Methods {#methods}

- `func (e *PageTokenExpiredError) Error() string`
- `func (e *PageTokenExpiredError) Unwrap() error`
- `func (s *Store) Root() string`
- `func (s *Store) Filename(ref secrets.Reference) string`
- `func (s *Store) Close() error`
- `func (s *Store) SupportsCreateOnly() bool`
- `func (s *Store) SupportsCompareAndSwap() bool`
- `func (s *Store) Resolve(ctx context.Context, ref secrets.Reference) (secrets.Record, error)`
- `func (s *Store) Put(ctx context.Context, ref secrets.Reference, value secrets.Secret, options secrets.PutOptions) (secrets.Record, error)`
- `func (s *Store) Delete(ctx context.Context, ref secrets.Reference, options secrets.DeleteOptions) (secrets.DeleteResult, error)`
- `func (s *Store) List(ctx context.Context, namespace secrets.Namespace, token secrets.PageToken, limit int) (secrets.Page[secrets.Metadata], error)`
- `func (e *CommitVisibleDurabilityUnknownError) Error() string`
- `func (e *CommitVisibleDurabilityUnknownError) Unwrap() error`
- `func (e *CommitVisibleDurabilityUnknownError) Is(target error) bool`
- `func (e *CommitVisibleDurabilityUnknownError) Visible() bool`
- `func (e *CommitVisibleDurabilityUnknownError) Reference() secrets.Reference`
- `func (UnsupportedPlatformError) Error() string`
- `func (UnsupportedPlatformError) Unwrap() error`

### Types {#types}

```go
type PageTokenExpiredError struct {
	Reason string
}
```

```go
type Hooks struct {
	BeforeRead         func() error
	BeforeExistingRead func() error
	BeforeVersion      func() error
	BeforeTempWrite    func() error
	BeforeWrite        func() error
	BeforeRename       func() error
	AfterRename        func() error
	BeforeUnlink       func() error
	AfterUnlink        func() error
	SyncDir            func() error
	NewVersion         func() (secrets.Version, error)
}
```

```go
type Options struct {
	Hooks Hooks
}
```

```go
type Store struct {
	// contains filtered or unexported fields
}
```

```go
type DurabilityUnknownError = CommitVisibleDurabilityUnknownError
```

```go
type CommitVisibleDurabilityUnknownError struct {
	// contains filtered or unexported fields
}
```

```go
type UnsupportedPlatformError struct{}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

`ErrListTooLarge`, `ErrPageTokenExpired`, `ErrDurabilityUnknown`, `ErrCommitVisibleDurabilityUnknown`, `ErrUnsupportedPlatform`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CommitVisibleDurabilityUnknownError`, `PageTokenExpiredError`, `UnsupportedPlatformError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [local/store.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store.go)
- [local/store_other.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_other.go)
- [local/store_unix.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_unix.go)
- [local/store_windows.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_windows.go)

Adjacent tests at the same commit:

- [local/store_race_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_race_test.go)
- [local/store_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_test.go)
- [local/store_unix_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store_unix_test.go)

Run `GOWORK=off go test ./...` from the `secrets` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
