---
id: reference/packages/inference/contextcount
title: contextcount package · contextcount
description: Reference for the contextcount package at github.com/looprig/inference/contextcount, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 109
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# contextcount package · contextcount

Import path: `github.com/looprig/inference/contextcount`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package contextcount provides deterministic complete-request context counting.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CompatibleCounter(inf InferenceCapability, counter CounterCapability) error`
- `func NewEstimator() *Estimator`

### Methods {#methods}

- `func (c ContextCounterFunc) CountContext(ctx context.Context, req inference.Request) (ContextCount, error)`
- `func (c ContextCounterFunc) CounterCapability() CounterCapability`
- `func (c CounterCapability) Validate() error`
- `func (c InferenceCapability) Validate() error`
- `func (e *ContextCountError) Error() string`
- `func (e *ContextCountError) Unwrap() error`
- `func (e *CapabilityValidationError) Error() string`
- `func (e *CounterCompatibilityError) Error() string`
- `func (e *CounterCompatibilityError) Unwrap() error`
- `func (e *EstimatorStateError) Error() string`
- `func (e *ModelIdentityError) Error() string`
- `func (e *ModelIdentityError) Unwrap() error`
- `func (e *UnsupportedAPIFormatError) Error() string`
- `func (e *RequestEncodingError) Error() string`
- `func (e *RequestEncodingError) Unwrap() error`
- `func (e *Estimator) CountContext(ctx context.Context, req inference.Request) (ContextCount, error)`
- `func (e *Estimator) CounterCapability() CounterCapability`

### Types {#types}

```go
type ProviderID string
```

```go
type TokenizerRevision string
```

```go
type SecurityIdentity [32]byte
```

```go
type CountQuality uint8
```

```go
type ContextCount struct {
	Model       model.ModelKey
	InputTokens content.TokenCount
	Quality     CountQuality
}
```

```go
type ContextCounter interface {
	CountContext(context.Context, inference.Request) (ContextCount, error)
	CounterCapability() CounterCapability
}
```

```go
type ContextCountFunc func(context.Context, inference.Request) (ContextCount, error)
```

```go
type ContextCounterFunc struct {
	Count      ContextCountFunc
	Capability CounterCapability
}
```

```go
type CounterTransport uint8
```

```go
type RetentionPosture uint8
```

```go
type CounterCapability struct {
	Provider         ProviderID
	Transport        CounterTransport
	SecurityIdentity SecurityIdentity
	Retention        RetentionPosture
	TokenizerRev     TokenizerRevision
	Quality          CountQuality
}
```

```go
type InferenceTransport uint8
```

```go
type InferenceCapability struct {
	Provider         ProviderID
	Transport        InferenceTransport
	SecurityIdentity SecurityIdentity
	Retention        RetentionPosture
}
```

```go
type ContextCountError struct {
	Model   model.ModelKey
	Quality CountQuality
	Cause   error
}
```

```go
type CapabilityKind string
```

```go
type CapabilityField string
```

```go
type CapabilityValidationReason string
```

```go
type CapabilityValidationError struct {
	Capability CapabilityKind
	Field      CapabilityField
	Reason     CapabilityValidationReason
}
```

```go
type CounterCompatibilityReason string
```

```go
type CounterCompatibilityError struct {
	Inference InferenceCapability
	Counter   CounterCapability
	Reason    CounterCompatibilityReason
	Cause     error
}
```

```go
type EstimatorStateReason string
```

```go
type EstimatorStateError struct {
	Reason EstimatorStateReason
}
```

```go
type ModelIdentityError struct {
	Model model.ModelKey
	Err   error
}
```

```go
type UnsupportedAPIFormatError struct {
	APIFormat model.APIFormat
}
```

```go
type RequestEncodingError struct {
	APIFormat model.APIFormat
	Err       error
}
```

```go
type Estimator struct{}
```

### Constants {#constants}

`CountQualityUnknown`, `CountQualityExactProvider`, `CountQualityExactLocal`, `CountQualityHeuristicEstimate`, `CounterTransportUnknown`, `CounterTransportLocal`, `CounterTransportSameEndpoint`, `CounterTransportSeparateEndpoint`, `RetentionUnknown`, `RetentionNone`, `RetentionEphemeral`, `RetentionLogged`, `InferenceTransportUnknown`, `InferenceTransportLocal`, `InferenceTransportTLS`, `InferenceTransportAttestedTLS`, `InferenceTransportEndToEndEncrypted`, `CapabilityKindCounter`, `CapabilityKindInference`, `CapabilityFieldProvider`, `CapabilityFieldTransport`, `CapabilityFieldSecurityIdentity`, `CapabilityFieldRetention`, `CapabilityFieldTokenizerRevision`, `CapabilityFieldQuality`, `CapabilityValidationReasonUnknown`, `CapabilityValidationReasonOutOfRange`, `CapabilityValidationReasonEmpty`, `CapabilityValidationReasonMustBeZero`, `CounterCompatibilityInvalidInference`, `CounterCompatibilityInvalidCounter`, `CounterCompatibilityProviderMismatch`, `CounterCompatibilityIdentityMismatch`, `CounterCompatibilityTransportDowngrade`, `CounterCompatibilityRetentionDowngrade`, `EstimatorStateNilReceiver`, `EstimatorStateNilContext`, `EstimatorRevision`

### Variables {#variables}

`ErrContextCountFunctionMissing`, `ErrContextCountQualityInvalid`, `ErrContextCountModelMismatch`, `ErrContextCountCapabilityQualityMismatch`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CapabilityValidationError`, `ContextCountError`, `CounterCompatibilityError`, `EstimatorStateError`, `ModelIdentityError`, `RequestEncodingError`, `UnsupportedAPIFormatError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [contextcount/contracts.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/contracts.go)
- [contextcount/contracts_errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/contracts_errors.go)
- [contextcount/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/errors.go)
- [contextcount/estimator.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/estimator.go)

Adjacent tests at the same commit:

- [contextcount/contracts_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/contracts_test.go)
- [contextcount/estimator_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/contextcount/estimator_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
