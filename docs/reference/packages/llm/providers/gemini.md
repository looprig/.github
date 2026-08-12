---
id: reference/packages/llm/providers/gemini
title: gemini package · providers/gemini
description: Reference for the gemini package at github.com/looprig/llm/providers/gemini, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 277
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

# gemini package · providers/gemini

Import path: `github.com/looprig/llm/providers/gemini`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(key auth.APIKey) (inference.Client, error)`
- `func NewCounter(key auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (c *Counter) CountContext(ctx context.Context, req inference.Request) (contextcount.ContextCount, error)`
- `func (c *countScalar) UnmarshalJSON(data []byte) error`
- `func (c *Counter) CounterCapability() contextcount.CounterCapability`
- `func (e *CounterStateError) Error() string`
- `func (e *CounterRequestError) Error() string`
- `func (e *CounterRequestError) Unwrap() error`
- `func (e *CounterEndpointError) Error() string`
- `func (e *CounterResponseFieldError) Error() string`
- `func (e *CounterResponseError) Error() string`
- `func (e *CounterResponseError) Unwrap() error`
- `func (e *UnsupportedAPIFormatError) Error() string`
- `func (e *RequestBuildError) Error() string`
- `func (e *RequestBuildError) Unwrap() error`

### Types {#types}

`Client`, `Counter`, `CounterStateReason`, `CounterStateError`, `CounterRequestReason`, `CounterRequestError`, `CounterEndpointReason`, `CounterEndpointError`, `CounterResponseReason`, `CounterResponseField`, `CounterResponseFieldReason`, `CounterResponseFieldError`, `CounterResponseError`, `UnsupportedAPIFormatError`, `RequestBuildError`

### Constants {#constants}

`CounterStateNilReceiver`, `CounterStateNilContext`, `CounterStateMissingEndpoint`, `CounterStateMissingAuthenticator`, `CounterStateMissingHTTPDoer`, `CounterStateInvalidTimeout`, `CounterRequestGenerateBodyInvalid`, `CounterRequestModelEncodingFailed`, `CounterRequestModelCollision`, `CounterEndpointMalformed`, `CounterEndpointMissingHost`, `CounterEndpointCredentials`, `CounterEndpointUnsupportedScheme`, `CounterEndpointInsecureTransport`, `CounterEndpointNonASCIIHost`, `CounterEndpointInvalidHost`, `CounterEndpointAmbiguousPath`, `CounterResponseMalformed`, `CounterResponseMissingCount`, `CounterResponseInvalidCount`, `CounterResponseDuplicateField`, `CounterResponseBodyTooLarge`, `CounterResponseFieldTotalTokens`, `CounterResponseFieldDuplicate`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CounterStateError`, `CounterRequestError`, `CounterEndpointError`, `CounterResponseFieldError`, `CounterResponseError`, `UnsupportedAPIFormatError`, `RequestBuildError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/gemini/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/client.go)
- [providers/gemini/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/counter.go)
- [providers/gemini/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/errors.go)

Adjacent tests at the same commit:

- [providers/gemini/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/client_test.go)
- [providers/gemini/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/counter_test.go)
- [providers/gemini/export_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/export_test.go)
- [providers/gemini/usage_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gemini/usage_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
