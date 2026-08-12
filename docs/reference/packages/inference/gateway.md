---
id: reference/packages/inference/gateway
title: gateway package · gateway
description: Reference for the gateway package at github.com/looprig/inference/gateway, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 111
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

# gateway package · gateway

Import path: `github.com/looprig/inference/gateway`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package gateway provides a local HTTP compatibility layer that lets coding-harness clients speaking different model-API dialects (Anthropic Messages, OpenAI Responses, OpenAI Chat Completions, Gemini) reach any injected inference.Client/model.Model target.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func StaticToken(token string) Authenticator`
- `func New(config Config) (*Handler, error)`
- `func NewMux(cfg Mux) (*Mux, error)`
- `func Strict(inner Resolver) Resolver`
- `func Fixed(client inference.Client, m model.Model) (*FixedResolver, error)`
- `func FixedFor(client inference.Client, m model.Model, ingress model.APIFormat, alias string) (*FixedResolver, error)`
- `func NewServer(config ServerConfig) (*Server, error)`

### Methods {#methods}

- `func (e *AuthenticationError) Error() string`
- `func (e *ConfigError) Error() string`
- `func (e *ConfigError) Unwrap() error`
- `func (e *RouteNotFoundError) Error() string`
- `func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request)`
- `func (e *MethodNotAllowedError) Error() string`
- `func (e *UnsupportedContentTypeError) Error() string`
- `func (e *RequestTooLargeError) Error() string`
- `func (e *NoMatchingCodecError) Error() string`
- `func (e *AmbiguousCodecMatchError) Error() string`
- `func (e *ConcurrencyLimitExceededError) Error() string`
- `func (e *CountTokensUnavailableError) Error() string`
- `func (e *UpstreamInvocationError) Error() string`
- `func (e *UpstreamInvocationError) Unwrap() error`
- `func (e *ResponseEncodeError) Error() string`
- `func (e *ResponseEncodeError) Unwrap() error`
- `func (m *Mux) Resolve(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)`
- `func (m *Mux) ResolveExact(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)`
- `func (e *UnknownRouteError) Error() string`
- `func (e *UnknownRouteError) Is(target error) bool`
- `func (f *FixedResolver) Resolve(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)`
- `func (f *FixedResolver) ResolveExact(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)`
- `func (e *ServerStateError) Error() string`
- `func (e *ShutdownTimeoutError) Error() string`
- `func (s *Server) Start(ctx context.Context) error`
- `func (s *Server) Binding() (baseURL, token string, ready bool)`
- `func (s *Server) Close(ctx context.Context) error`

### Types {#types}

```go
type Authenticator interface {
	// Authenticate reports whether req carries a valid credential. It must
	// not consume req.Body. A non-nil error is always an
	// *AuthenticationError: this interface deliberately has exactly one
	// failure mode so a caller never needs to distinguish "why" auth failed.
	Authenticate(req *http.Request) error
}
```

```go
type AuthenticationError struct{}
```

```go
type Config struct {
	Resolver Resolver

	Codecs map[model.APIFormat]codec.ServerCodec

	Authenticate Authenticator

	ContextCounter contextcount.ContextCounter

	MaxRequestBody int64

	MaxConcurrent int
}
```

```go
type ConfigError struct {
	Location string
	Reason   string
	Err      error
}
```

```go
type RouteNotFoundError struct {
	Ingress model.APIFormat
	Model   string
}
```

```go
type Handler struct {
	// contains filtered or unexported fields
}
```

```go
type MethodNotAllowedError struct{ Method string }
```

```go
type UnsupportedContentTypeError struct{ ContentType string }
```

```go
type RequestTooLargeError struct{ Limit int64 }
```

```go
type NoMatchingCodecError struct {
	Method string
	Path   string
}
```

```go
type AmbiguousCodecMatchError struct {
	Method string
	Path   string
	Count  int
}
```

```go
type ConcurrencyLimitExceededError struct{}
```

```go
type CountTokensUnavailableError struct{}
```

```go
type UpstreamInvocationError struct {
	Err              error
	DeadlineExceeded bool
}
```

```go
type ResponseEncodeError struct{ Err error }
```

```go
type RouteKey struct {
	Ingress model.APIFormat
	Model   string
}
```

```go
type Mux struct {
	Routes         map[RouteKey]Target
	FormatDefaults map[model.APIFormat]Target
	Default        *Target
}
```

```go
type UnknownRouteError struct {
	Ingress model.APIFormat
	Alias   string
}
```

```go
type FixedResolver struct {
	// contains filtered or unexported fields
}
```

```go
type Resolver interface {
	Resolve(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)
}
```

```go
type ExactResolver interface {
	ResolveExact(ctx context.Context, ingress model.APIFormat, requestedModel string) (Target, error)
}
```

```go
type ServerConfig struct {
	Handler http.Handler

	ShutdownTimeout time.Duration
}
```

```go
type Binding struct {
	BaseURL string
	Token   string
}
```

```go
type ServerStateError struct {
	Op    string
	State string
}
```

```go
type ShutdownTimeoutError struct {
	Timeout time.Duration
}
```

```go
type Server struct {
	// contains filtered or unexported fields
}
```

```go
type Target struct {
	ID     string
	Client inference.Client
	Model  model.Model

	AuthoritativeEffort bool
}
```

### Constants {#constants}

`DefaultMaxRequestBody`, `DefaultMaxConcurrent`, `DefaultShutdownTimeout`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AmbiguousCodecMatchError`, `AuthenticationError`, `ConcurrencyLimitExceededError`, `ConfigError`, `CountTokensUnavailableError`, `MethodNotAllowedError`, `NoMatchingCodecError`, `RequestTooLargeError`, `ResponseEncodeError`, `RouteNotFoundError`, `ServerStateError`, `ShutdownTimeoutError`, `UnknownRouteError`, `UnsupportedContentTypeError`, `UpstreamInvocationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [gateway/auth.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/auth.go)
- [gateway/config.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/config.go)
- [gateway/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/errors.go)
- [gateway/handler.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/handler.go)
- [gateway/http_errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/http_errors.go)
- [gateway/mux.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/mux.go)
- [gateway/resolver.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/resolver.go)
- [gateway/server.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/server.go)
- [gateway/stream.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/stream.go)
- [gateway/target.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/target.go)

Adjacent tests at the same commit:

- [gateway/auth_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/auth_test.go)
- [gateway/cancel_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/cancel_test.go)
- [gateway/concurrency_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/concurrency_test.go)
- [gateway/errors_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/errors_test.go)
- [gateway/handler_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/handler_test.go)
- [gateway/limits_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/limits_test.go)
- [gateway/matrix_fixtures_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/matrix_fixtures_test.go)
- [gateway/matrix_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/matrix_test.go)
- [gateway/mux_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/mux_test.go)
- [gateway/server_race_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/server_race_test.go)
- [gateway/server_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/server_test.go)
- [gateway/stream_leak_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/stream_leak_test.go)
- [gateway/stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/stream_test.go)
- [gateway/target_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/gateway/target_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
