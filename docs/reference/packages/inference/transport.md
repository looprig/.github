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
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# transport package · transport

Import path: `github.com/looprig/inference/transport`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package transport is a generic, connection-bound HTTP client for the inference seam.

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

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type RequestBuildError struct {
	Err error
}
```

```go
type UnsupportedStreamingError struct {
	APIFormat model.APIFormat
}
```

```go
type Option func(*Client)
```

```go
type Endpoint struct {
	BaseURL   string
	Provider  model.ProviderName
	APIFormat model.APIFormat
}
```

### Constants {#constants}

`MaxResponseBodyBytes`, `MaxErrorResponseBodyBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `RequestBuildError`, `UnsupportedStreamingError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [transport/client.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/client.go)
- [transport/endpoint.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/endpoint.go)

Adjacent tests at the same commit:

- [transport/binding_internal_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/binding_internal_test.go)
- [transport/client_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/client_test.go)
- [transport/retry_after_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/retry_after_test.go)
- [transport/roundtripper_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/transport/roundtripper_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
