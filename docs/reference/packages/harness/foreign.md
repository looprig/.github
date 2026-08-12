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
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# foreign package · foreign

Import path: `github.com/looprig/harness/pkg/foreign`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

Builders receive the loop context, session and loop identity, parent provenance, and optional scoped services. A restored builder receives persisted foreign identity instead of assuming a live provider process. Delivery hooks reserve, publish, and resolve cross-boundary messages.

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

`EventPublisher`, `Builder`, `ServicesBuilder`, `UnknownProfileError`, `BuilderRegistry`, `RestoredForeign`, `RestoredBuilder`, `ServicesRestoredBuilder`, `BrokerDescriptor`, `DeliveryIntent`, `DeliveryReservation`, `DeliveryFallback`, `DeliveryResolutionState`, `DeliveryResolution`, `DeliveryHook`, `Services`

### Constants {#constants}

`DeliveryResolutionInjected`, `DeliveryResolutionUnknown`, `DeliveryResolutionUntrackable`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownProfileError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/foreign/builder.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/builder.go)
- [pkg/foreign/restored.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/restored.go)
- [pkg/foreign/services.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/services.go)

Adjacent tests at the same commit:

- [pkg/foreign/builder_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/builder_test.go)
- [pkg/foreign/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/deps_test.go)
- [pkg/foreign/registry_internal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/registry_internal_test.go)
- [pkg/foreign/registry_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/registry_test.go)
- [pkg/foreign/restored_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/restored_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
