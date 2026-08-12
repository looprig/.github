---
id: reference/packages/llm/providers/anthropic
title: anthropic package · providers/anthropic
description: Reference for the anthropic package at github.com/looprig/llm/providers/anthropic, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 260
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions-and-methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants-and-variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# anthropic package · providers/anthropic

Import path: `github.com/looprig/llm/providers/anthropic`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(key auth.APIKey) (contextcount.ContextCounter, error)`
- `func WithThinking(options ThinkingOptions) Option`
- `func WithBetaHeaders(values ...string) Option`
- `func WithMetadataUserID(userID string) Option`
- `func WithPromptCacheControl(options CacheControlOptions) Option`

### Methods {#methods}

- `func (r messagesRouter) BuildRoute(baseURL string, req inference.Request, mode codec.RequestMode) (route.Route, error)`
- `func (c requestCodec) EncodeRequest(req inference.Request, mode codec.RequestMode) (codec.EncodedRequest, error)`
- `func (requestCodec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (requestCodec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`
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

### Types {#types}

`Counter`, `CounterStateReason`, `CounterStateError`, `CounterRequestReason`, `CounterRequestError`, `CounterEndpointReason`, `CounterEndpointError`, `CounterResponseReason`, `CounterResponseField`, `CounterResponseFieldReason`, `CounterResponseFieldError`, `CounterResponseError`, `ThinkingOptions`, `CacheControlOptions`, `Option`

### Constants {#constants}

`CounterStateNilReceiver`, `CounterStateNilContext`, `CounterStateMissingEndpoint`, `CounterStateMissingAuthenticator`, `CounterStateMissingHTTPDoer`, `CounterStateInvalidTimeout`, `CounterRequestEncodeFailed`, `CounterRequestMalformed`, `CounterEndpointMalformed`, `CounterEndpointMissingHost`, `CounterEndpointCredentials`, `CounterEndpointUnsupportedScheme`, `CounterEndpointInsecureTransport`, `CounterResponseMalformed`, `CounterResponseMissingCount`, `CounterResponseInvalidCount`, `CounterResponseDuplicateField`, `CounterResponseBodyTooLarge`, `CounterResponseFieldInputTokens`, `CounterResponseFieldDuplicate`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CounterStateError`, `CounterRequestError`, `CounterEndpointError`, `CounterResponseFieldError`, `CounterResponseError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/anthropic/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/client.go)
- [providers/anthropic/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/counter.go)
- [providers/anthropic/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/errors.go)
- [providers/anthropic/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/options.go)

Adjacent tests at the same commit:

- [providers/anthropic/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/client_test.go)
- [providers/anthropic/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/counter_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
