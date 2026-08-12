---
id: reference/packages/llm/providers/bedrock
title: bedrock package · providers/bedrock
description: Reference for the bedrock package at github.com/looprig/llm/providers/bedrock, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 266
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions: release-github-com-looprig-llm
  methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants: release-github-com-looprig-llm
  variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# bedrock package · providers/bedrock

Import path: `github.com/looprig/llm/providers/bedrock`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(creds auth.SigV4Credentials, region string, options ...Option) (inference.Client, error)`
- `func NewCounter(creds auth.SigV4Credentials, region string, options ...Option) (contextcount.ContextCounter, error)`
- `func WithReasoning(options ReasoningOptions) Option`
- `func WithAdditionalModelRequestFields(fields json.RawMessage) Option`
- `func WithAdditionalModelResponseFieldPaths(paths ...string) Option`
- `func WithGuardrail(options GuardrailOptions) Option`
- `func WithPerformanceLatency(latency PerformanceLatency) Option`
- `func WithServiceTier(tier ServiceTier) Option`
- `func WithRequestMetadata(metadata map[string]string) Option`
- `func WithPromptCachePoint(options CachePointOptions) Option`

### Methods {#methods}

- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (c *Counter) CountContext(ctx context.Context, req inference.Request) (contextcount.ContextCount, error)`
- `func (c *Counter) CounterCapability() contextcount.CounterCapability`
- `func (e *UnsupportedAPIFormatError) Error() string`
- `func (e *RequestBuildError) Error() string`
- `func (e *RequestBuildError) Unwrap() error`
- `func (e *ConfigError) Error() string`
- `func (e *BodyTransformError) Error() string`
- `func (e *BodyTransformError) Unwrap() error`
- `func (*StreamingNotSupportedError) Error() string`
- `func (e *CounterStateError) Error() string`
- `func (e *CounterEndpointError) Error() string`
- `func (e *CounterRequestError) Error() string`
- `func (e *CounterRequestError) Unwrap() error`
- `func (e *CounterResponseError) Error() string`
- `func (e *CounterResponseError) Unwrap() error`
- `func (e *OptionError) Error() string`
- `func (e *OptionError) Unwrap() error`

### Types {#types}

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type Counter struct {
	// contains filtered or unexported fields
}
```

```go
type UnsupportedAPIFormatError struct {
	APIFormat model.APIFormat
}
```

```go
type RequestBuildError struct {
	Err error
}
```

```go
type ConfigError struct {
	Field  string
	Reason string
}
```

```go
type BodyTransformError struct {
	Err error
}
```

```go
type StreamingNotSupportedError struct{}
```

```go
type CounterStateReason string
```

```go
type CounterStateError struct {
	Reason CounterStateReason
}
```

```go
type CounterEndpointReason string
```

```go
type CounterEndpointError struct {
	Reason CounterEndpointReason
}
```

```go
type CounterRequestReason string
```

```go
type CounterRequestError struct {
	Reason CounterRequestReason
	Err    error
}
```

```go
type CounterResponseReason string
```

```go
type CounterResponseError struct {
	Reason CounterResponseReason
	Err    error
}
```

```go
type ReasoningOptions struct {
	Type         string
	BudgetTokens *int
}
```

```go
type ServiceTier string
```

```go
type PerformanceLatency string
```

```go
type GuardrailOptions struct {
	Identifier           string
	Version              string
	Trace                string
	StreamProcessingMode string
}
```

```go
type CachePointOptions struct {
	Type string
	TTL  string
}
```

```go
type Option func(*config)
```

```go
type OptionError struct {
	Reason string
	Err    error
}
```

### Constants {#constants}

`CounterStateNilReceiver`, `CounterStateNilContext`, `CounterStateMissingEndpoint`, `CounterStateMissingRegion`, `CounterStateMissingAuthenticator`, `CounterStateMissingHTTPDoer`, `CounterStateInvalidTimeout`, `CounterEndpointMalformed`, `CounterEndpointMissingHost`, `CounterEndpointCredentials`, `CounterEndpointUnsupportedScheme`, `CounterEndpointInsecureTransport`, `CounterEndpointNonASCIIHost`, `CounterEndpointInvalidHost`, `CounterEndpointUnexpectedComponent`, `CounterRequestBodyTooLarge`, `CounterRequestEnvelopeEncoding`, `CounterResponseMalformed`, `CounterResponseMissingCount`, `CounterResponseInvalidCount`, `CounterResponseDuplicateField`, `CounterResponseBodyTooLarge`, `ServiceTierDefault`, `ServiceTierPriority`, `ServiceTierFlex`, `ServiceTierReserved`, `PerformanceLatencyStandard`, `PerformanceLatencyOptimized`, `CachePointTTL5m`, `CachePointTTL1h`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BodyTransformError`, `ConfigError`, `CounterEndpointError`, `CounterRequestError`, `CounterResponseError`, `CounterStateError`, `OptionError`, `RequestBuildError`, `StreamingNotSupportedError`, `UnsupportedAPIFormatError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/bedrock/body.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/body.go)
- [providers/bedrock/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/client.go)
- [providers/bedrock/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/counter.go)
- [providers/bedrock/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/errors.go)
- [providers/bedrock/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/options.go)

Adjacent tests at the same commit:

- [providers/bedrock/body_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/body_test.go)
- [providers/bedrock/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/client_test.go)
- [providers/bedrock/converse_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/converse_test.go)
- [providers/bedrock/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/counter_test.go)
- [providers/bedrock/export_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/export_test.go)
- [providers/bedrock/options_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/options_test.go)
- [providers/bedrock/usage_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/usage_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
