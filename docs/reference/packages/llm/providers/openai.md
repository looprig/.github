---
id: reference/packages/llm/providers/openai
title: openai package · providers/openai
description: Reference for the openai package at github.com/looprig/llm/providers/openai, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 328
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

# openai package · providers/openai

Import path: `github.com/looprig/llm/providers/openai`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package openai provides OpenAI Chat Completions and Responses API clients.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(key auth.APIKey) (contextcount.ContextCounter, error)`
- `func WithRoundTripper(rt http.RoundTripper) Option`
- `func WithTLSRootCAs(roots *x509.CertPool) Option`
- `func WithReasoning(options ReasoningOptions) Option`
- `func WithServiceTier(tier ServiceTier) Option`
- `func WithMetadata(metadata map[string]string) Option`
- `func WithPromptCacheKey(key string) Option`

### Methods {#methods}

- `func (c *Counter) CountContext(ctx context.Context, req inference.Request) (contextcount.ContextCount, error)`
- `func (c *Counter) CounterCapability() contextcount.CounterCapability`
- `func (e *CounterStateError) Error() string`
- `func (e *CounterRequestError) Error() string`
- `func (e *CounterRequestError) Unwrap() error`
- `func (e *CounterEndpointError) Error() string`
- `func (e *CounterResponseFieldError) Error() string`
- `func (e *CounterResponseError) Error() string`
- `func (e *CounterResponseError) Unwrap() error`

### Types {#types}

```go
type Counter struct {
	// contains filtered or unexported fields
}
```

```go
type CounterStateReason string
```

```go
type CounterStateError struct{ Reason CounterStateReason }
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
type CounterEndpointReason string
```

```go
type CounterEndpointError struct{ Reason CounterEndpointReason }
```

```go
type CounterResponseReason string
```

```go
type CounterResponseField string
```

```go
type CounterResponseFieldReason string
```

```go
type CounterResponseFieldError struct {
	Field  CounterResponseField
	Reason CounterResponseFieldReason
}
```

```go
type CounterResponseError struct {
	Reason CounterResponseReason
	Err    error
}
```

```go
type ReasoningOptions struct {
	Effort  string `json:"effort,omitempty"`
	Summary string `json:"summary,omitempty"`
}
```

```go
type ServiceTier string
```

```go
type Option func(*config)
```

### Constants {#constants}

`CounterStateNilReceiver`, `CounterStateNilContext`, `CounterStateMissingEndpoint`, `CounterStateMissingAuthenticator`, `CounterStateMissingHTTPDoer`, `CounterStateInvalidTimeout`, `CounterRequestEncodeFailed`, `CounterRequestMalformed`, `CounterEndpointMalformed`, `CounterEndpointMissingHost`, `CounterEndpointCredentials`, `CounterEndpointUnsupportedScheme`, `CounterEndpointInsecureTransport`, `CounterResponseMalformed`, `CounterResponseMissingCount`, `CounterResponseInvalidCount`, `CounterResponseDuplicateField`, `CounterResponseBodyTooLarge`, `CounterResponseFieldInputTokens`, `CounterResponseFieldDuplicate`, `ServiceTierAuto`, `ServiceTierDefault`, `ServiceTierFlex`, `ServiceTierScale`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CounterEndpointError`, `CounterRequestError`, `CounterResponseError`, `CounterResponseFieldError`, `CounterStateError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/openai/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/client.go)
- [providers/openai/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/counter.go)
- [providers/openai/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/errors.go)
- [providers/openai/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/options.go)

Adjacent tests at the same commit:

- [providers/openai/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/client_test.go)
- [providers/openai/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openai/counter_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
