---
id: reference/packages/inference/transport
title: transport package · transport
description: Reference for the transport package at github.com/looprig/inference/transport, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 116
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions-and-methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants-and-variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# transport package · transport

Import path: `github.com/looprig/inference/transport`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithStreamDecoder(sd codec.StreamDecoder) Option`
- `func WithInvokeTimeout(d time.Duration) Option`
- `func WithRoundTripper(rt http.RoundTripper) Option`
- `func WithTLSRootCAs(roots *x509.CertPool) Option`
- `func New(ep Endpoint, router route.Router, cdc codec.Codec, authenticator auth.Authenticator, opts ...Option) *Client`
- `func NewWithAuth(ep Endpoint, router route.Router, cdc codec.Codec, args ...any) *Client`
- `func NewWithAuthorizer(ep Endpoint, router route.Router, cdc codec.Codec, authorizer httpauth.Authorizer, opts ...Option) *Client`

### Methods {#methods}

- `func (e *RequestBuildError) Error() string`
- `func (e *RequestBuildError) Unwrap() error`
- `func (e *UnsupportedStreamingError) Error() string`
- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) InvokeWithAuth(ctx context.Context, req inference.Request, authorizer httpauth.Authorizer) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (c *Client) StreamWithAuth(ctx context.Context, req inference.Request, authorizer httpauth.Authorizer) (*stream.StreamReader[content.Chunk], error)`
- `func (c *Client) InvokeWithAuthorizer(ctx context.Context, req inference.Request, authorizer httpauth.Authorizer) (*inference.Response, error)`
- `func (c *Client) StreamWithAuthorizer(ctx context.Context, req inference.Request, authorizer httpauth.Authorizer) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

`Client`, `RequestBuildError`, `UnsupportedStreamingError`, `Option`, `Endpoint`

### Constants {#constants}

`MaxResponseBodyBytes`, `MaxErrorResponseBodyBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `RequestBuildError`, `UnsupportedStreamingError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [transport/client.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/client.go)
- [transport/endpoint.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/endpoint.go)

Adjacent tests at the same commit:

- [transport/binding_internal_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/binding_internal_test.go)
- [transport/client_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/client_test.go)
- [transport/retry_after_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/retry_after_test.go)
- [transport/roundtripper_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/transport/roundtripper_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
