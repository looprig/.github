---
id: reference/packages/secrets/secrets
title: secrets package
description: Reference for the secrets package at github.com/looprig/secrets, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 27
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

# secrets package

Import path: `github.com/looprig/secrets`. The source is pinned to github.com/looprig/secrets@v0.1.0.

## Package role {#package-role}

Package secrets defines the opaque value and reference contracts used by LoopRig's credential stores.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewVersion(value string) (Version, error)`
- `func NewDeleteResult(reference Reference, status DeleteStatus, version Version) (DeleteResult, error)`
- `func NewPageToken(token string) (PageToken, error)`
- `func NewPage[T any](items []T, next PageToken) (Page[T], error)`
- `func NewInvalidVersionError(reason string) *InvalidVersionError`
- `func NewInvalidPageTokenError(reason string) *InvalidPageTokenError`
- `func NewInvalidOptionsError(reason string) *InvalidOptionsError`
- `func NewNotFoundError(reference Reference) *NotFoundError`
- `func NewUnsupportedSchemeError() *UnsupportedSchemeError`
- `func NewUnsupportedCapabilityError() *UnsupportedCapabilityError`
- `func NewInsecurePathError(reason string) *InsecurePathError`
- `func NewCorruptRecordError(reference Reference) *CorruptRecordError`
- `func NewConflictError(reference Reference) *ConflictError`
- `func NewUnavailableError(operation string, reference Reference) *UnavailableError`
- `func NewCanceledError(operation string, cause error) *CanceledError`
- `func UnconditionalPut() PutOptions`
- `func CreateOnlyPut() PutOptions`
- `func CompareAndSwapPut(version Version) PutOptions`
- `func UnconditionalDelete() DeleteOptions`
- `func CompareAndSwapDelete(version Version) DeleteOptions`
- `func NewInvalidReferenceError(reason string) *InvalidReferenceError`
- `func NewInvalidNamespaceError(reason string) *InvalidNamespaceError`
- `func ParseReference(raw string) (Reference, error)`
- `func NewReference(scheme, path string) (Reference, error)`
- `func NewNamespace(scheme, prefix string) (Namespace, error)`
- `func ParseNamespace(raw string) (Namespace, error)`
- `func New(value []byte) (Secret, error)`
- `func IsVisibleCommit(err error) bool`

### Methods {#methods}

- `func (v Version) String() string`
- `func (v Version) IsZero() bool`
- `func (v Version) IsUnsupported() bool`
- `func (v Version) Valid() bool`
- `func (v Version) MarshalText() ([]byte, error)`
- `func (v *Version) UnmarshalText(text []byte) error`
- `func (r Record) Metadata() Metadata`
- `func (r Record) Validate() error`
- `func (m Metadata) Validate() error`
- `func (s DeleteStatus) String() string`
- `func (r DeleteResult) Validate() error`
- `func (p PageToken) String() string`
- `func (p PageToken) IsZero() bool`
- `func (p PageToken) Valid() bool`
- `func (p PageToken) MarshalText() ([]byte, error)`
- `func (p *PageToken) UnmarshalText(text []byte) error`
- `func (p Page[T]) Validate(limit int) error`
- `func (e *InvalidVersionError) Error() string`
- `func (e *InvalidVersionError) Unwrap() error`
- `func (e *InvalidVersionError) Reason() string`
- `func (e *InvalidVersionError) Format(state fmt.State, verb rune)`
- `func (e *InvalidVersionError) GoString() string`
- `func (e *InvalidVersionError) LogValue() slog.Value`
- `func (e *InvalidPageTokenError) Error() string`
- `func (e *InvalidPageTokenError) Unwrap() error`
- `func (e *InvalidPageTokenError) Reason() string`
- `func (e *InvalidPageTokenError) Format(state fmt.State, verb rune)`
- `func (e *InvalidPageTokenError) GoString() string`
- `func (e *InvalidPageTokenError) LogValue() slog.Value`
- `func (e *InvalidOptionsError) Error() string`
- `func (e *InvalidOptionsError) Unwrap() error`
- `func (e *InvalidOptionsError) Reason() string`
- `func (e *InvalidOptionsError) Format(state fmt.State, verb rune)`
- `func (e *InvalidOptionsError) GoString() string`
- `func (e *InvalidOptionsError) LogValue() slog.Value`
- `func (e *NotFoundError) Error() string`
- `func (e *NotFoundError) Unwrap() error`
- `func (e *NotFoundError) Reference() Reference`
- `func (e *NotFoundError) Format(state fmt.State, verb rune)`
- `func (e *NotFoundError) GoString() string`
- `func (e *NotFoundError) LogValue() slog.Value`
- `func (e *UnsupportedSchemeError) Error() string`
- `func (e *UnsupportedSchemeError) Unwrap() error`
- `func (e *UnsupportedSchemeError) Format(state fmt.State, verb rune)`
- `func (e *UnsupportedSchemeError) GoString() string`
- `func (e *UnsupportedSchemeError) LogValue() slog.Value`
- `func (e *UnsupportedCapabilityError) Error() string`
- `func (e *UnsupportedCapabilityError) Unwrap() error`
- `func (e *UnsupportedCapabilityError) Format(state fmt.State, verb rune)`
- `func (e *UnsupportedCapabilityError) GoString() string`
- `func (e *UnsupportedCapabilityError) LogValue() slog.Value`
- `func (e *InsecurePathError) Error() string`
- `func (e *InsecurePathError) Unwrap() error`
- `func (e *InsecurePathError) Reason() string`
- `func (e *InsecurePathError) Format(state fmt.State, verb rune)`
- `func (e *InsecurePathError) GoString() string`
- `func (e *InsecurePathError) LogValue() slog.Value`
- `func (e *CorruptRecordError) Error() string`
- `func (e *CorruptRecordError) Unwrap() error`
- `func (e *CorruptRecordError) Reference() Reference`
- `func (e *CorruptRecordError) Format(state fmt.State, verb rune)`
- `func (e *CorruptRecordError) GoString() string`
- `func (e *CorruptRecordError) LogValue() slog.Value`
- `func (e *ConflictError) Error() string`
- `func (e *ConflictError) Unwrap() error`
- `func (e *ConflictError) Reference() Reference`
- `func (e *ConflictError) Format(state fmt.State, verb rune)`
- `func (e *ConflictError) GoString() string`
- `func (e *ConflictError) LogValue() slog.Value`
- `func (e *UnavailableError) Error() string`
- `func (e *UnavailableError) Is(target error) bool`
- `func (e *UnavailableError) Reference() Reference`
- `func (e *UnavailableError) Format(state fmt.State, verb rune)`
- `func (e *UnavailableError) GoString() string`
- `func (e *UnavailableError) LogValue() slog.Value`
- `func (e *CanceledError) Error() string`
- `func (e *CanceledError) Is(target error) bool`
- `func (e *CanceledError) Format(state fmt.State, verb rune)`
- `func (e *CanceledError) GoString() string`
- `func (e *CanceledError) LogValue() slog.Value`
- `func (o PutOptions) Validate() error`
- `func (o DeleteOptions) Validate() error`
- `func (e *InvalidReferenceError) Error() string`
- `func (e *InvalidReferenceError) Unwrap() error`
- `func (e *InvalidReferenceError) Reason() string`
- `func (e *InvalidReferenceError) Format(state fmt.State, verb rune)`
- `func (e *InvalidReferenceError) GoString() string`
- `func (e *InvalidReferenceError) LogValue() slog.Value`
- `func (e *InvalidNamespaceError) Error() string`
- `func (e *InvalidNamespaceError) Unwrap() error`
- `func (e *InvalidNamespaceError) Reason() string`
- `func (e *InvalidNamespaceError) Format(state fmt.State, verb rune)`
- `func (e *InvalidNamespaceError) GoString() string`
- `func (e *InvalidNamespaceError) LogValue() slog.Value`
- `func (r Reference) Scheme() string`
- `func (r Reference) Path() string`
- `func (r Reference) String() string`
- `func (r Reference) Canonical() string`
- `func (r Reference) IsZero() bool`
- `func (r Reference) MarshalText() ([]byte, error)`
- `func (r *Reference) UnmarshalText(text []byte) error`
- `func (n Namespace) Scheme() string`
- `func (n Namespace) Path() string`
- `func (n Namespace) Prefix() string`
- `func (n Namespace) String() string`
- `func (n Namespace) Canonical() string`
- `func (n Namespace) IsZero() bool`
- `func (n Namespace) Contains(ref Reference) bool`
- `func (e *EmptySecretError) Error() string`
- `func (e *EmptySecretError) Unwrap() error`
- `func (e *EmptySecretError) Format(state fmt.State, verb rune)`
- `func (e *EmptySecretError) GoString() string`
- `func (e *EmptySecretError) LogValue() slog.Value`
- `func (e *SecretSizeError) Error() string`
- `func (e *SecretSizeError) Unwrap() error`
- `func (e *SecretSizeError) Format(state fmt.State, verb rune)`
- `func (e *SecretSizeError) GoString() string`
- `func (e *SecretSizeError) LogValue() slog.Value`
- `func (e *ZeroSecretError) Error() string`
- `func (e *ZeroSecretError) Unwrap() error`
- `func (e *ZeroSecretError) Format(state fmt.State, verb rune)`
- `func (e *ZeroSecretError) GoString() string`
- `func (e *ZeroSecretError) LogValue() slog.Value`
- `func (s Secret) Bytes() []byte`
- `func (s Secret) Valid() bool`
- `func (s Secret) IsZero() bool`
- `func (s Secret) Validate() error`
- `func (s Secret) String() string`
- `func (s Secret) Format(state fmt.State, verb rune)`
- `func (s Secret) GoString() string`
- `func (s Secret) LogValue() slog.Value`

### Types {#types}

```go
type Version struct {
	// contains filtered or unexported fields
}
```

```go
type Record struct {
	Reference Reference
	Value     Secret
	Version   Version
	UpdatedAt time.Time
}
```

```go
type Metadata struct {
	Reference Reference
	Version   Version
	UpdatedAt time.Time
}
```

```go
type DeleteStatus uint8
```

```go
type DeleteResult struct {
	Reference Reference
	Version   Version
	Status    DeleteStatus
}
```

```go
type PageToken struct {
	// contains filtered or unexported fields
}
```

```go
type Page[T any] struct {
	Items     []T
	NextToken PageToken
}
```

```go
type InvalidVersionError struct {
	// contains filtered or unexported fields
}
```

```go
type InvalidPageTokenError struct {
	// contains filtered or unexported fields
}
```

```go
type InvalidOptionsError struct {
	// contains filtered or unexported fields
}
```

```go
type NotFoundError struct {
	// contains filtered or unexported fields
}
```

```go
type UnsupportedSchemeError struct{}
```

```go
type UnsupportedCapabilityError struct{}
```

```go
type InsecurePathError struct {
	// contains filtered or unexported fields
}
```

```go
type CorruptRecordError struct {
	// contains filtered or unexported fields
}
```

```go
type ConflictError struct {
	// contains filtered or unexported fields
}
```

```go
type VersionMismatchError = ConflictError
```

```go
type UnavailableError struct {
	// contains filtered or unexported fields
}
```

```go
type CanceledError struct {
	// contains filtered or unexported fields
}
```

```go
type Precondition uint8
```

```go
type PutOptions struct {
	Precondition    Precondition
	ExpectedVersion Version
}
```

```go
type DeleteOptions struct {
	Precondition    Precondition
	ExpectedVersion Version
}
```

```go
type Reference struct {
	// contains filtered or unexported fields
}
```

```go
type InvalidReferenceError struct {
	// contains filtered or unexported fields
}
```

```go
type InvalidNamespaceError struct {
	// contains filtered or unexported fields
}
```

```go
type Namespace struct {
	// contains filtered or unexported fields
}
```

```go
type Secret struct {
	// contains filtered or unexported fields
}
```

```go
type EmptySecretError struct{}
```

```go
type SecretSizeError struct {
	Limit int
	Got   int
}
```

```go
type ZeroSecretError struct{}
```

```go
type Resolver interface {
	Resolve(context.Context, Reference) (Record, error)
}
```

```go
type Store interface {
	Resolver
	Put(context.Context, Reference, Secret, PutOptions) (Record, error)
	Delete(context.Context, Reference, DeleteOptions) (DeleteResult, error)
}
```

```go
type Lister interface {
	List(context.Context, Namespace, PageToken, int) (Page[Metadata], error)
}
```

```go
type PreconditionCapabilities interface {
	SupportsCreateOnly() bool
	SupportsCompareAndSwap() bool
}
```

```go
type VisibleCommitError interface {
	error
	Visible() bool
}
```

### Constants {#constants}

`MaxVersionLength`, `MaxPageTokenLength`, `MaxPageItems`, `DeleteStatusAbsent`, `DeleteStatusDeleted`, `PreconditionUnconditional`, `PreconditionCreateOnly`, `PreconditionCompareAndSwap`, `MaxReferenceLength`, `MaxReferencePathLength`, `MaxReferenceSchemeLen`, `MaxSecretSize`

### Variables {#variables}

`VersionUnsupported`, `ErrInvalidVersion`, `ErrInvalidOptions`, `ErrInvalidPageToken`, `ErrNotFound`, `ErrUnsupportedScheme`, `ErrUnsupportedCapability`, `ErrInsecurePath`, `ErrCorruptRecord`, `ErrConflict`, `ErrUnavailable`, `ErrCanceled`, `ErrInvalidReference`, `ErrInvalidNamespace`, `ErrEmptySecret`, `ErrSecretTooLarge`, `ErrZeroSecret`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CanceledError`, `ConflictError`, `CorruptRecordError`, `EmptySecretError`, `InsecurePathError`, `InvalidNamespaceError`, `InvalidOptionsError`, `InvalidPageTokenError`, `InvalidReferenceError`, `InvalidVersionError`, `NotFoundError`, `SecretSizeError`, `UnavailableError`, `UnsupportedCapabilityError`, `UnsupportedSchemeError`, `ZeroSecretError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [domain.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/domain.go)
- [errors.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/errors.go)
- [options.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/options.go)
- [reference.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/reference.go)
- [secret.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/secret.go)
- [store.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/store.go)

Adjacent tests at the same commit:

- [reference_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/reference_test.go)
- [secret_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/secret_test.go)
- [store_test.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/store_test.go)

Run `go test ./...` from a checkout of the `secrets` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
