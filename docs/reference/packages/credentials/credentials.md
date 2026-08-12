---
id: reference/packages/credentials/credentials
title: credentials package
description: Reference for the credentials package at github.com/looprig/credentials, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 20
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

# credentials package

Import path: `github.com/looprig/credentials`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DescriptorBindingOf(descriptor Descriptor) DescriptorBinding`
- `func NewProviderFactories(input map[DescriptorBinding]SourceFactory) ProviderFactories`
- `func StableBindings(factories ProviderFactories) []DescriptorBinding`
- `func ValidateRecord(record Record) error`
- `func CatalogTimeValid(value time.Time) bool`
- `func NewCatalogNotFoundError(ref Reference) error`
- `func NewCatalogConflictError(ref Reference) error`
- `func NewCatalogDurabilityUnknownError(ref Reference) error`
- `func NewCatalogCorruptError() error`
- `func NewCatalogUnavailableError() error`
- `func NewCatalogCanceledError(cause ...error) error`
- `func NewCatalogUnsupportedError() error`
- `func NewDescriptor(provider, transport string, scheme Scheme, usage UsageClass, issuer, audience, label string) (Descriptor, error)`
- `func NewInvalidReferenceError(value string) *InvalidReferenceError`
- `func NewInvalidDescriptorError(value string) *InvalidDescriptorError`
- `func NewInvalidGenerationError(value string) *InvalidGenerationError`
- `func NewInvalidFailureError(value string) *InvalidFailureError`
- `func NewInvalidRecordError(value string) *InvalidRecordError`
- `func NewCanceledError(cause error) *CanceledError`
- `func PublishState(ctx context.Context, publisher StatePublisher, record Record, value secrets.Secret) error`
- `func CreateCredentialState(ctx context.Context, catalog Catalog, store secrets.Store, namespace secrets.Namespace, record Record, value secrets.Secret) error`
- `func DeleteCredentialState(ctx context.Context, catalog Catalog, store secrets.Store, namespace secrets.Namespace, record Record) error`
- `func Reconcile(ctx context.Context, catalog Catalog, states secrets.Lister, namespace secrets.Namespace) ([]Finding, error)`
- `func ParseReference(raw string) (Reference, error)`
- `func NewReference(provider, name string) (Reference, error)`
- `func NewGeneration(value string) (Generation, error)`
- `func NewFailure(value Failure) (Failure, error)`
- `func NewRecord(reference Reference, descriptor Descriptor, state secrets.Reference, createdAt, updatedAt time.Time) (Record, error)`
- `func NewNoneSource(descriptor Descriptor) (*NoneSource, error)`

### Methods {#methods}

- `func (s SharingScope) Valid() bool`
- `func (s SharingScope) AtLeast(required SharingScope) bool`
- `func (s SharingScope) String() string`
- `func (f ClockFunc) Now() time.Time`
- `func (b DescriptorBinding) Valid() bool`
- `func (b DescriptorBinding) Canonical() string`
- `func (d Descriptor) Binding() DescriptorBinding`
- `func (d Descriptor) BindingCanonical() string`
- `func (p ProviderFactories) Lookup(binding DescriptorBinding) (SourceFactory, bool)`
- `func (p ProviderFactories) List() []DescriptorBinding`
- `func (p ProviderFactories) Snapshot() map[DescriptorBinding]SourceFactory`
- `func (b *Builder) Build(ctx context.Context, ref Reference) (Source, error)`
- `func (e *CatalogError) Error() string`
- `func (e *CatalogError) Unwrap() error`
- `func (e *CatalogError) Is(target error) bool`
- `func (e *CatalogError) Reference() Reference`
- `func (e *CatalogError) Visible() bool`
- `func (e *CatalogError) Format(state fmt.State, _ rune)`
- `func (e *CatalogError) GoString() string`
- `func (e *CatalogError) LogValue() slog.Value`
- `func (s Scheme) Valid() bool`
- `func (s Scheme) IsZero() bool`
- `func (s Scheme) String() string`
- `func (s Scheme) Format(state fmt.State, _ rune)`
- `func (s Scheme) GoString() string`
- `func (s Scheme) LogValue() slog.Value`
- `func (u UsageClass) Valid() bool`
- `func (u UsageClass) IsZero() bool`
- `func (u UsageClass) String() string`
- `func (u UsageClass) Format(state fmt.State, _ rune)`
- `func (u UsageClass) GoString() string`
- `func (u UsageClass) LogValue() slog.Value`
- `func (d Descriptor) Validate() error`
- `func (d Descriptor) Valid() bool`
- `func (d Descriptor) Canonical() string`
- `func (d Descriptor) String() string`
- `func (d Descriptor) Format(state fmt.State, _ rune)`
- `func (d Descriptor) GoString() string`
- `func (d Descriptor) LogValue() slog.Value`
- `func (e *InvalidReferenceError) Error() string`
- `func (e *InvalidReferenceError) Unwrap() error`
- `func (e *InvalidReferenceError) Reason() string`
- `func (e *InvalidReferenceError) Format(state fmt.State, _ rune)`
- `func (e *InvalidReferenceError) GoString() string`
- `func (e *InvalidReferenceError) LogValue() slog.Value`
- `func (e *InvalidDescriptorError) Error() string`
- `func (e *InvalidDescriptorError) Unwrap() []error`
- `func (e *InvalidDescriptorError) Reason() string`
- `func (e *InvalidDescriptorError) Format(state fmt.State, _ rune)`
- `func (e *InvalidDescriptorError) GoString() string`
- `func (e *InvalidDescriptorError) LogValue() slog.Value`
- `func (e *InvalidGenerationError) Error() string`
- `func (e *InvalidGenerationError) Unwrap() error`
- `func (e *InvalidGenerationError) Reason() string`
- `func (e *InvalidGenerationError) Format(state fmt.State, _ rune)`
- `func (e *InvalidGenerationError) GoString() string`
- `func (e *InvalidGenerationError) LogValue() slog.Value`
- `func (e *InvalidFailureError) Error() string`
- `func (e *InvalidFailureError) Unwrap() error`
- `func (e *InvalidFailureError) Reason() string`
- `func (e *InvalidFailureError) Format(state fmt.State, _ rune)`
- `func (e *InvalidFailureError) GoString() string`
- `func (e *InvalidFailureError) LogValue() slog.Value`
- `func (e *InvalidRecordError) Error() string`
- `func (e *InvalidRecordError) Unwrap() error`
- `func (e *InvalidRecordError) Reason() string`
- `func (e *InvalidRecordError) Format(state fmt.State, _ rune)`
- `func (e *InvalidRecordError) GoString() string`
- `func (e *InvalidRecordError) LogValue() slog.Value`
- `func (e *SourceClosedError) Error() string`
- `func (e *SourceClosedError) Unwrap() error`
- `func (e *SourceClosedError) Format(state fmt.State, _ rune)`
- `func (e *SourceClosedError) GoString() string`
- `func (e *SourceClosedError) LogValue() slog.Value`
- `func (e *CanceledError) Error() string`
- `func (e *CanceledError) Unwrap() error`
- `func (e *CanceledError) Is(target error) bool`
- `func (e *CanceledError) Format(state fmt.State, _ rune)`
- `func (e *CanceledError) GoString() string`
- `func (e *CanceledError) LogValue() slog.Value`
- `func (e *NilContextError) Error() string`
- `func (e *NilContextError) Unwrap() error`
- `func (e *NilContextError) Format(state fmt.State, _ rune)`
- `func (e *NilContextError) GoString() string`
- `func (e *NilContextError) LogValue() slog.Value`
- `func (o OrphanState) Valid() bool`
- `func (o OrphanState) Error() string`
- `func (o OrphanState) Unwrap() error`
- `func (o OrphanState) Format(state fmt.State, _ rune)`
- `func (o OrphanState) GoString() string`
- `func (o OrphanState) LogValue() slog.Value`
- `func (e *StatePublicationError) Error() string`
- `func (e *StatePublicationError) Unwrap() []error`
- `func (e *StatePublicationError) Orphaned() bool`
- `func (e *StatePublicationError) Format(state fmt.State, _ rune)`
- `func (e *StatePublicationError) GoString() string`
- `func (e *StatePublicationError) LogValue() slog.Value`
- `func (e *StateDeletionError) Error() string`
- `func (e *StateDeletionError) Unwrap() []error`
- `func (e *StateDeletionError) Format(state fmt.State, _ rune)`
- `func (e *StateDeletionError) GoString() string`
- `func (e *StateDeletionError) LogValue() slog.Value`
- `func (p StatePublisher) Create(ctx context.Context, record Record, value secrets.Secret) error`
- `func (p StatePublisher) Delete(ctx context.Context, supplied Record) error`
- `func (b *Builder) Create(ctx context.Context, record Record, value secrets.Secret) error`
- `func (b *Builder) Delete(ctx context.Context, record Record) error`
- `func (k FindingKind) String() string`
- `func (b *Builder) Reconcile(ctx context.Context) ([]Finding, error)`
- `func (r Reference) Provider() string`
- `func (r Reference) Name() string`
- `func (r Reference) Scheme() string`
- `func (r Reference) String() string`
- `func (r Reference) Canonical() string`
- `func (r Reference) IsZero() bool`
- `func (r Reference) Valid() bool`
- `func (r Reference) Validate() error`
- `func (r Reference) MarshalText() ([]byte, error)`
- `func (r *Reference) UnmarshalText(text []byte) error`
- `func (r Reference) Format(state fmt.State, _ rune)`
- `func (r Reference) GoString() string`
- `func (r Reference) LogValue() slog.Value`
- `func (g Generation) IsZero() bool`
- `func (g Generation) Valid() bool`
- `func (g Generation) String() string`
- `func (g Generation) Validate() error`
- `func (g Generation) MarshalText() ([]byte, error)`
- `func (g *Generation) UnmarshalText(text []byte) error`
- `func (g Generation) Format(state fmt.State, _ rune)`
- `func (g Generation) GoString() string`
- `func (g Generation) LogValue() slog.Value`
- `func (f Failure) IsZero() bool`
- `func (f Failure) Valid() bool`
- `func (f Failure) String() string`
- `func (f Failure) Validate() error`
- `func (f Failure) MarshalText() ([]byte, error)`
- `func (f *Failure) UnmarshalText(text []byte) error`
- `func (f Failure) Format(state fmt.State, _ rune)`
- `func (f Failure) GoString() string`
- `func (f Failure) LogValue() slog.Value`
- `func (r Record) Validate() error`
- `func (r Record) String() string`
- `func (r Record) Format(state fmt.State, _ rune)`
- `func (r Record) GoString() string`
- `func (r Record) LogValue() slog.Value`
- `func (s *NoneSource) Reference() Reference`
- `func (s *NoneSource) Descriptor() Descriptor`
- `func (s *NoneSource) Acquire(ctx context.Context) (Lease, error)`
- `func (s *NoneSource) Invalidate(ctx context.Context, generation Generation, failure Failure) error`
- `func (s *NoneSource) Close() error`
- `func (s *NoneSource) String() string`
- `func (s *NoneSource) Format(state fmt.State, _ rune)`
- `func (s *NoneSource) GoString() string`
- `func (s *NoneSource) LogValue() slog.Value`

### Types {#types}

```go
type SharingScope uint8
```

```go
type RefreshCoordinator interface {
	Scope() SharingScope
	WithLock(context.Context, Reference, func(context.Context) error) error
}
```

```go
type Clock interface{ Now() time.Time }
```

```go
type ClockFunc func() time.Time
```

```go
type CallbackListener interface{}
```

```go
type DescriptorBinding struct {
	Provider  string
	Transport string
	Scheme    Scheme
	Usage     UsageClass
	Issuer    string
	Audience  string
}
```

```go
type FactoryInput struct {
	Record             Record
	Reference          Reference
	Descriptor         Descriptor
	State              secrets.Reference
	Resolver           secrets.Resolver
	Store              secrets.Store
	Preconditions      secrets.PreconditionCapabilities
	StateIndex         secrets.Lister
	StateNamespace     secrets.Namespace
	RefreshCoordinator RefreshCoordinator
	StateSharing       SharingScope
	HTTPClient         *http.Client
	Clock              Clock
	Callback           CallbackListener
}
```

```go
type SourceFactory func(context.Context, FactoryInput) (Source, error)
```

```go
type ProviderFactories struct {
	// contains filtered or unexported fields
}
```

```go
type Builder struct {
	Catalog        Catalog
	Resolver       secrets.Resolver
	Store          secrets.Store
	Preconditions  secrets.PreconditionCapabilities
	StateIndex     secrets.Lister
	StateNamespace secrets.Namespace
	RefreshLocks   RefreshCoordinator
	StateSharing   SharingScope
	HTTPClient     *http.Client
	Clock          Clock
	Callback       CallbackListener
	Providers      ProviderFactories
}
```

```go
type Catalog interface {
	Get(context.Context, Reference) (Record, error)
	List(context.Context) ([]Record, error)
	Create(context.Context, Record) error
	Delete(context.Context, Reference) error
}
```

```go
type CatalogCAS interface {
	Catalog
	Update(context.Context, Record, Record) error
}
```

```go
type CatalogError struct {
	// contains filtered or unexported fields
}
```

```go
type CatalogDurabilityUnknownError = CatalogError
```

```go
type Scheme string
```

```go
type UsageClass string
```

```go
type Descriptor struct {
	Provider  string
	Transport string
	Scheme    Scheme
	Usage     UsageClass
	Issuer    string
	Audience  string
	Label     string
}
```

```go
type InvalidReferenceError struct{
	// contains filtered or unexported fields
}
```

```go
type InvalidDescriptorError struct{
	// contains filtered or unexported fields
}
```

```go
type InvalidGenerationError struct{
	// contains filtered or unexported fields
}
```

```go
type InvalidFailureError struct{
	// contains filtered or unexported fields
}
```

```go
type InvalidRecordError struct{
	// contains filtered or unexported fields
}
```

```go
type SourceClosedError struct{}
```

```go
type CanceledError struct{
	// contains filtered or unexported fields
}
```

```go
type NilContextError struct{}
```

```go
type OrphanState struct {
	Credential Reference
	State      secrets.Reference
	Version    secrets.Version
}
```

```go
type StatePublicationError struct {
	Orphan *OrphanState
	// contains filtered or unexported fields
}
```

```go
type StateDeletionError struct {
	Credential Reference
	State      secrets.Reference
	// contains filtered or unexported fields
}
```

```go
type StatePublisher struct {
	Catalog       Catalog
	Store         secrets.Store
	Preconditions secrets.PreconditionCapabilities
	Namespace     secrets.Namespace
}
```

```go
type FindingKind uint8
```

```go
type ReconcileFinding struct {
	Kind       FindingKind
	State      secrets.Reference
	Reference  secrets.Reference
	Credential Reference
}
```

```go
type Finding = ReconcileFinding
```

```go
type Reference struct {
	// contains filtered or unexported fields
}
```

```go
type Generation struct{
	// contains filtered or unexported fields
}
```

```go
type Failure string
```

```go
type FailureClass = Failure
```

```go
type Source interface {
	Reference() Reference
	Descriptor() Descriptor
	Acquire(context.Context) (Lease, error)
	Invalidate(context.Context, Generation, Failure) error
	Close() error
}
```

```go
type Lease interface {
	Generation() Generation
	Descriptor() Descriptor
	ExpiresAt() time.Time
	Authorizer() httpauth.Authorizer
}
```

```go
type Record struct {
	Schema     uint32
	Reference  Reference
	Descriptor Descriptor
	State      secrets.Reference
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
```

```go
type NoneSource struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`SharingProcess`, `SharingHost`, `SharingDistributed`, `ScopeProcess`, `ScopeHost`, `ScopeDistributed`, `SharingScopeProcess`, `SharingScopeHost`, `SharingScopeDistributed`, `SchemeNone`, `SchemeAPIKey`, `SchemeOAuth`, `SchemeSigV4`, `SchemeWorkloadIdentity`, `UsageLocal`, `UsageMeteredAPI`, `UsageSubscription`, `MaxDescriptorLength`, `MaxDescriptorFieldLength`, `MaxDescriptorIdentifierLength`, `FindingOrphanState`, `FindingMissingState`, `FindingOrphan`, `FindingMissing`, `MaxReferenceLength`, `MaxReferenceComponentLength`, `MaxGenerationLength`, `FailureAuthRejected`, `FailureAuthExpired`, `FailureAuthRevoked`, `FailureRejected`, `FailureExpired`, `FailureRevoked`, `RecordSchemaV1`

### Variables {#variables}

`ErrBuilderDependency`, `ErrFactoryUnsupported`, `ErrFactoryMismatch`, `ErrFactoryConstruction`, `ErrRefreshScope`, `ErrStateNamespace`, `ErrBuilderRecord`, `ErrCatalogCorrupt`, `ErrCatalogConflict`, `ErrCatalogNotFound`, `ErrCatalogUnavailable`, `ErrCatalogCanceled`, `ErrCatalogDurabilityUnknown`, `ErrCatalogUnsupported`, `ErrCatalogInvalidRecord`, `ErrCatalogInvalidDependency`, `ErrCatalogInsecurePath`, `ErrCatalogUnsupportedPlatform`, `ErrCatalogVisibleDurabilityUnknown`, `ErrCatalogUnknownSchema`, `ErrCatalogDuplicate`, `ErrInvalidReference`, `ErrInvalidDescriptor`, `ErrInvalidGeneration`, `ErrInvalidFailure`, `ErrInvalidRecord`, `ErrInvalidScheme`, `ErrInvalidUsage`, `ErrSourceClosed`, `ErrClosed`, `ErrNilContext`, `ErrCanceled`, `ErrOrphanState`, `ErrStateDeleteFailed`, `ErrStateUnavailable`, `ErrStateDurabilityUnknown`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CanceledError`, `CatalogError`, `InvalidDescriptorError`, `InvalidFailureError`, `InvalidGenerationError`, `InvalidRecordError`, `InvalidReferenceError`, `NilContextError`, `OrphanState`, `SourceClosedError`, `StateDeletionError`, `StatePublicationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [builder.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/builder.go)
- [catalog.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog.go)
- [descriptor.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/descriptor.go)
- [errors.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/errors.go)
- [lifecycle.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/lifecycle.go)
- [reconcile.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/reconcile.go)
- [reference.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/reference.go)
- [source.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/source.go)

Adjacent tests at the same commit:

- [builder_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/builder_test.go)
- [catalog_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog_test.go)
- [contracts_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/contracts_test.go)
- [lifecycle_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/lifecycle_test.go)

Run `GOWORK=off go test ./...` from the `credentials` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
