---
id: reference/packages/llm/providers/sap-ai-core
title: sap package · providers/sap-ai-core
description: Reference for the sap-ai-core package at github.com/looprig/llm/providers/sap-ai-core, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 336
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

# sap package · providers/sap-ai-core

Import path: `github.com/looprig/llm/providers/sap-ai-core`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ParseServiceKey(raw []byte) (ServiceKey, error)`
- `func WithDeploymentURL(value string) Option`
- `func WithDeploymentID(value string) Option`
- `func WithResourceGroup(value string) Option`
- `func WithHeader(name, value string) Option`
- `func WithModelParams(params map[string]any) Option`
- `func WithModelParam(name string, value any) Option`
- `func New(selected model.Model, serviceKey ServiceKey, options ...Option) (inference.Client, error)`
- `func NewFromEnvironment(selected model.Model, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (c modelParamsCodec) EncodeRequest(req inference.Request, mode codec.RequestMode) (codec.EncodedRequest, error)`
- `func (c modelParamsCodec) DecodeResponse(body []byte) (*inference.Response, error)`
- `func (c modelParamsCodec) DecodeStream(resp *http.Response) (*stream.StreamReader[content.Chunk], error)`
- `func (r headerRoute) BuildRoute(baseURL string, _ inference.Request, _ codec.RequestMode) (route.Route, error)`
- `func (a *serviceKeyAuthenticator) Authorize(ctx context.Context, req *http.Request) error`
- `func (e *ConfigurationError) Error() string`
- `func (e *ConfigurationError) Unwrap() error`
- `func (e *AuthError) Error() string`
- `func (e *AuthError) Unwrap() error`
- `func (e *RequestError) Error() string`
- `func (e *RequestError) Unwrap() error`

### Types {#types}

`ServiceKey`, `Option`, `Client`, `ConfigurationReason`, `ConfigurationError`, `AuthError`, `RequestError`, `CounterSupportError`

### Constants {#constants}

`ServiceKeyMissing`, `InvalidServiceKey`, `InvalidModelParams`, `DeploymentMissing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigurationError`, `AuthError`, `RequestError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/sap-ai-core/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/sap-ai-core/client.go)
- [providers/sap-ai-core/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/sap-ai-core/counter.go)
- [providers/sap-ai-core/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/sap-ai-core/errors.go)

Adjacent tests at the same commit:

- [providers/sap-ai-core/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/sap-ai-core/client_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
