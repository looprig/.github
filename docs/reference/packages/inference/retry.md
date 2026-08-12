---
id: reference/packages/inference/retry
title: retry package · retry
description: Reference for the retry package at github.com/looprig/inference/retry, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 113
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

# retry package · retry

Import path: `github.com/looprig/inference/retry`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package retry decorates an inference.Client with bounded, classified retry and exponential backoff.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Retryable(err error) bool`
- `func New(inner inference.Client, policy Policy) (*Client, error)`

### Methods {#methods}

- `func (*InvalidResponseError) Error() string`
- `func (e *ExhaustedError) Error() string`
- `func (e *ExhaustedError) Unwrap() error`
- `func (p Policy) Validate() error`
- `func (e *ConfigError) Error() string`
- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

```go
type InvalidResponseError struct{}
```

```go
type ExhaustedError struct {
	Attempts int
	Cause    error
}
```

```go
type Policy struct {
	StableRetries int
	StableDelay   time.Duration
	MaxAttempts   int
	MaxDelay      time.Duration
}
```

```go
type ConfigError struct {
	Field  string
	Reason string
}
```

```go
type Client struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`, `ExhaustedError`, `InvalidResponseError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [retry/classify.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/classify.go)
- [retry/delay.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/delay.go)
- [retry/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/errors.go)
- [retry/exhausted.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/exhausted.go)
- [retry/retry.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/retry.go)

Adjacent tests at the same commit:

- [retry/classify_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/classify_test.go)
- [retry/delay_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/delay_test.go)
- [retry/invoke_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/invoke_test.go)
- [retry/retry_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/retry_test.go)
- [retry/stream_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/retry/stream_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
