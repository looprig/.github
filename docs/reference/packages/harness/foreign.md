---
id: reference/packages/harness/foreign
title: foreign package · foreign
description: Reference for Harness foreign-loop builder and delivery seams.
audience: developer
section: reference
order: 142
publication: released
examples:
  - stage-15-acp-foreign
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

# foreign package · foreign

Import path: `github.com/looprig/harness/pkg/foreign`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package foreign defines the composition seams for foreign loop backends.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewBrokerDescriptor(endpoint string, capability []byte) BrokerDescriptor`
- `func NewServices(broker BrokerDescriptor, delivery DeliveryHook) Services`

### Methods {#methods}

- `func (*UnknownProfileError) Error() string`
- `func (r *BuilderRegistry) Register(profile loop.RuntimeProfileName, builder Builder, restored RestoredBuilder) error`
- `func (r *BuilderRegistry) RegisterServices(profile loop.RuntimeProfileName, builder ServicesBuilder, restored ServicesRestoredBuilder) error`
- `func (r *BuilderRegistry) Builder(profile loop.RuntimeProfileName) (Builder, RestoredBuilder, error)`
- `func (r *BuilderRegistry) ServicesBuilder(profile loop.RuntimeProfileName) (ServicesBuilder, ServicesRestoredBuilder, error)`
- `func (r *BuilderRegistry) HasServicesBuilder(profile loop.RuntimeProfileName) bool`
- `func (d BrokerDescriptor) Format(state fmt.State, verb rune)`
- `func (d BrokerDescriptor) Endpoint() string`
- `func (d BrokerDescriptor) Capability() []byte`
- `func (s Services) Format(state fmt.State, verb rune)`
- `func (s Services) Clone() Services`

### Types {#types}

```go
type EventPublisher interface {
	PublishEvent(context.Context, event.Event) error
	PublishEventChecked(context.Context, event.Event) error
}
```

```go
type Builder func(
	loopCtx context.Context,
	sessionID, loopID uuid.UUID,
	parent loop.Provenance,
	pub EventPublisher,
	cfg loop.BoundDefinition,
	idGen func() (uuid.UUID, error),
	fac *event.Factory,
) (loop.Backend, string, error)
```

```go
type ServicesBuilder func(
	loopCtx context.Context,
	sessionID, loopID uuid.UUID,
	parent loop.Provenance,
	pub EventPublisher,
	cfg loop.BoundDefinition,
	idGen func() (uuid.UUID, error),
	fac *event.Factory,
	services Services,
) (loop.Backend, string, error)
```

```go
type UnknownProfileError struct{}
```

```go
type BuilderRegistry struct {
	// contains filtered or unexported fields
}
```

```go
type RestoredForeign struct {
	ForeignSID string

	AgentSessionID string
	TurnIndex      event.TurnIndex
	Msgs           content.AgenticMessages
}
```

```go
type RestoredBuilder func(
	loopCtx context.Context,
	sessionID, loopID uuid.UUID,
	parent loop.Provenance,
	pub EventPublisher,
	cfg loop.BoundDefinition,
	idGen func() (uuid.UUID, error),
	fac *event.Factory,
	seed RestoredForeign,
) (loop.Backend, error)
```

```go
type ServicesRestoredBuilder func(
	loopCtx context.Context,
	sessionID, loopID uuid.UUID,
	parent loop.Provenance,
	pub EventPublisher,
	cfg loop.BoundDefinition,
	idGen func() (uuid.UUID, error),
	fac *event.Factory,
	seed RestoredForeign,
	services Services,
) (loop.Backend, error)
```

```go
type BrokerDescriptor struct {
	// contains filtered or unexported fields
}
```

```go
type DeliveryIntent struct {
	LoopID    uuid.UUID
	RequestID uuid.UUID
}
```

```go
type DeliveryReservation = DeliveryIntent
```

```go
type DeliveryFallback = DeliveryIntent
```

```go
type DeliveryResolutionState string
```

```go
type DeliveryResolution struct {
	LoopID    uuid.UUID
	RequestID uuid.UUID
	TurnID    uuid.UUID
	State     DeliveryResolutionState
}
```

```go
type DeliveryHook interface {
	CreateIntent(context.Context, DeliveryIntent) error
	Reserve(context.Context, DeliveryReservation) error
	QueueFallback(context.Context, DeliveryFallback) error
	Resolve(context.Context, DeliveryResolution) error
}
```

```go
type Services struct {
	Broker   BrokerDescriptor
	Delivery DeliveryHook
}
```

### Constants {#constants}

`DeliveryResolutionInjected`, `DeliveryResolutionUnknown`, `DeliveryResolutionUntrackable`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownProfileError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/foreign/builder.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/builder.go)
- [pkg/foreign/restored.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/restored.go)
- [pkg/foreign/services.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/services.go)

Adjacent tests at the same commit:

- [pkg/foreign/builder_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/builder_test.go)
- [pkg/foreign/deps_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/deps_test.go)
- [pkg/foreign/registry_internal_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/registry_internal_test.go)
- [pkg/foreign/registry_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/registry_test.go)
- [pkg/foreign/restored_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/foreign/restored_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
