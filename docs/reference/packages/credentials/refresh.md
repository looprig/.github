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
  functions-and-methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants-and-variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# refresh package · refresh

Import path: `github.com/looprig/credentials/refresh`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

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
- `func (wallClock) Now() time.Time`
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

`RefreshCoordinator`, `Coordinator`, `ProcessCoordinator`, `FileCoordinator`, `Clock`, `ClockFunc`, `Options`, `SourceOptions`, `Config`, `Source`, `Lease`, `ExchangeError`, `AmbiguousRotationError`, `State`, `RefreshState`, `TokenResponse`, `ExchangeResult`, `Token`, `RefreshResponse`, `ExchangeFunc`, `InvalidStateError`

### Constants {#constants}

`LockFilename`, `StateSchemaV1`, `SchemaV1`, `StateVersion1`, `MaxStateBytes`, `MaxProviderDataBytes`

### Variables {#variables}

`ErrInvalidState`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ExchangeError`, `AmbiguousRotationError`, `InvalidStateError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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

Run `GOWORK=off go test ./...` from the `credentials` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
