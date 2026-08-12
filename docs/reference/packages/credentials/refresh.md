---
id: reference/packages/credentials/refresh
title: refresh package · refresh
description: Reference for the refresh package at github.com/looprig/credentials/refresh, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 24
publication: released
proofs:
  package-role: release-github-com-looprig-credentials
  exported-surface: release-github-com-looprig-credentials
  functions: release-github-com-looprig-credentials
  methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants: release-github-com-looprig-credentials
  variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# refresh package · refresh

Import path: `github.com/looprig/credentials/refresh`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

Package refresh contains provider-neutral renewable credential sources.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewProcessCoordinator() *ProcessCoordinator`
- `func NewInProcessCoordinator() *ProcessCoordinator`
- `func NewFileCoordinator(root string) (*FileCoordinator, error)`
- `func NewLocalCoordinator(root string) (*FileCoordinator, error)`
- `func NewCoordinator(args ...any) (credentials.RefreshCoordinator, error)`
- `func New(args ...any) (*Source, error)`
- `func NewSource(args ...any) (*Source, error)`
- `func NewRefreshableSource(args ...any) (*Source, error)`
- `func NewWithOptions(args ...any) (*Source, error)`
- `func NewState(generation credentials.Generation, value any) (State, error)`
- `func EncodeState(state State) (secrets.Secret, error)`
- `func MarshalState(state State) (secrets.Secret, error)`
- `func DecodeState(value secrets.Secret) (State, error)`
- `func UnmarshalState(value secrets.Secret) (State, error)`

### Methods {#methods}

- `func (c *ProcessCoordinator) Scope() credentials.SharingScope`
- `func (c *ProcessCoordinator) WithLock(ctx context.Context, ref credentials.Reference, fn func(context.Context) error) error`
- `func (c *ProcessCoordinator) Close() error`
- `func (c *FileCoordinator) Scope() credentials.SharingScope`
- `func (c *FileCoordinator) WithLock(ctx context.Context, ref credentials.Reference, fn func(context.Context) error) error`
- `func (c *FileCoordinator) Close() error`
- `func (l *Lease) Generation() credentials.Generation`
- `func (l *Lease) Descriptor() credentials.Descriptor`
- `func (l *Lease) ExpiresAt() time.Time`
- `func (l *Lease) Authorizer() httpauth.Authorizer`
- `func (l *Lease) String() string`
- `func (l *Lease) Format(state fmt.State, _ rune)`
- `func (l *Lease) GoString() string`
- `func (s *Source) CanRecover(failure credentials.Failure) bool`
- `func (s *Source) Reference() credentials.Reference`
- `func (s *Source) Descriptor() credentials.Descriptor`
- `func (s *Source) Acquire(ctx context.Context) (credentials.Lease, error)`
- `func (s *Source) Invalidate(ctx context.Context, generation credentials.Generation, failure credentials.Failure) error`
- `func (s *Source) Reauthenticate(ctx context.Context, value any) error`
- `func (s *Source) ReauthenticateLease(ctx context.Context, value any) (credentials.Lease, error)`
- `func (s *Source) Reauth(ctx context.Context, value any) error`
- `func (s *Source) Close() error`
- `func (e *ExchangeError) Error() string`
- `func (e *ExchangeError) Unwrap() error`
- `func (e *ExchangeError) Format(s fmt.State, _ rune)`
- `func (e *ExchangeError) GoString() string`
- `func (e *AmbiguousRotationError) Error() string`
- `func (e *AmbiguousRotationError) Unwrap() error`
- `func (e *AmbiguousRotationError) Format(s fmt.State, _ rune)`
- `func (e *AmbiguousRotationError) GoString() string`
- `func (s State) String() string`
- `func (s State) Format(state fmt.State, _ rune)`
- `func (s State) GoString() string`
- `func (s State) LogValue() slog.Value`
- `func (r TokenResponse) String() string`
- `func (r TokenResponse) Format(state fmt.State, _ rune)`
- `func (r TokenResponse) GoString() string`
- `func (r TokenResponse) LogValue() slog.Value`
- `func (s State) Validate() error`
- `func (s State) Clone() (State, error)`
- `func (r TokenResponse) Validate() error`
- `func (e *InvalidStateError) Error() string`
- `func (e *InvalidStateError) Unwrap() error`
- `func (e *InvalidStateError) Format(state fmt.State, _ rune)`
- `func (e *InvalidStateError) GoString() string`

### Types {#types}

```go
type RefreshCoordinator = credentials.RefreshCoordinator
```

```go
type Coordinator = credentials.RefreshCoordinator
```

```go
type ProcessCoordinator struct {
	// contains filtered or unexported fields
}
```

```go
type FileCoordinator struct {
	// contains filtered or unexported fields
}
```

```go
type Clock = credentials.Clock
```

```go
type ClockFunc = credentials.ClockFunc
```

```go
type Options struct {
	Reference  credentials.Reference
	Descriptor credentials.Descriptor
	State      secrets.Reference

	StateReference secrets.Reference

	Resolver      secrets.Resolver
	Store         secrets.Store
	Preconditions secrets.PreconditionCapabilities

	Coordinator        credentials.RefreshCoordinator
	RefreshCoordinator credentials.RefreshCoordinator
	StateSharing       credentials.SharingScope
	Sharing            credentials.SharingScope

	Clock Clock
	Now   func() time.Time

	ExpirySkew time.Duration

	Skew time.Duration

	RefreshTimeout       time.Duration
	SourceRefreshTimeout time.Duration

	Exchange  any
	Refresh   any
	Refresher any

	InitialState State

	PersistAccessToken bool

	Context context.Context
}
```

```go
type SourceOptions = Options
```

```go
type Config = Options
```

```go
type Source struct {
	// contains filtered or unexported fields
}
```

```go
type Lease struct {
	// contains filtered or unexported fields
}
```

```go
type ExchangeError struct{}
```

```go
type AmbiguousRotationError struct {
	Reference  credentials.Reference
	Generation credentials.Generation
}
```

```go
type State struct {
	Schema       uint32
	Generation   credentials.Generation
	RefreshToken secrets.Secret
	ProviderData []byte

	Continuity  []byte
	AccessToken secrets.Secret
	ExpiresAt   time.Time

	Expiry             time.Time
	PersistAccessToken bool
}
```

```go
type RefreshState = State
```

```go
type TokenResponse struct {
	AccessToken     secrets.Secret
	RefreshToken    secrets.Secret
	RefreshTokenSet bool
	Generation      credentials.Generation
	ExpiresAt       time.Time
	ExpiresIn       time.Duration

	ExpiresInSeconds   int64
	ProviderData       []byte
	Continuity         []byte
	PersistAccessToken bool
}
```

```go
type ExchangeResult = TokenResponse
```

```go
type Token = TokenResponse
```

```go
type RefreshResponse = TokenResponse
```

```go
type ExchangeFunc func(context.Context, State) (TokenResponse, error)
```

```go
type InvalidStateError struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`LockFilename`, `StateSchemaV1`, `SchemaV1`, `StateVersion1`, `MaxStateBytes`, `MaxProviderDataBytes`

### Variables {#variables}

`ErrInvalidState`, `ErrInvalidOptions`, `ErrExchange`, `ErrRefresh`, `ErrAmbiguousRotation`, `ErrAmbiguousRefresh`, `ErrRefreshAmbiguous`, `ErrAdoptionUnavailable`, `ErrCoordinator`, `ErrUnsupportedPlatform`, `ErrDurabilityUnknown`, `ErrClosed`, `ErrCanceled`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AmbiguousRotationError`, `ExchangeError`, `InvalidStateError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [refresh/coordinator.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/coordinator.go)
- [refresh/coordinator_other.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/coordinator_other.go)
- [refresh/coordinator_unix.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/coordinator_unix.go)
- [refresh/source.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/source.go)
- [refresh/state.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/state.go)

Adjacent tests at the same commit:

- [refresh/source_race_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/source_race_test.go)
- [refresh/source_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/source_test.go)
- [refresh/state_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/state_test.go)

Run `go test ./...` from a checkout of the `credentials` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
