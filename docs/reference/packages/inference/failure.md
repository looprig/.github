---
id: reference/packages/inference/failure
title: failure package · failure
description: Reference for the failure package at github.com/looprig/inference/failure, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 110
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

# failure package · failure

Import path: `github.com/looprig/inference/failure`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package failure owns provider-neutral inference failures shared by codecs, transports, and provider integrations.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAPIError(status int, code, requestID string, retryAfter time.Duration) *APIError`
- `func NewAPIErrorWithStatusText(status int, code, requestID string, retryAfter time.Duration, statusText string) *APIError`
- `func APIErrorFromResponse(status int, body []byte, headers http.Header, retryAfter time.Duration) *APIError`

### Methods {#methods}

- `func (e *NetworkError) Error() string`
- `func (e *NetworkError) Unwrap() error`
- `func (e *APIError) Error() string`
- `func (e APIError) Format(state fmt.State, _ rune)`
- `func (e APIError) GoString() string`
- `func (e APIError) LogValue() slog.Value`
- `func (e *ResponseBodyTooLargeError) Error() string`
- `func (e *ResponseBodyTooLargeError) Format(state fmt.State, _ rune)`
- `func (e *ResponseBodyTooLargeError) GoString() string`
- `func (e *ModelMismatchError) Error() string`

### Types {#types}

```go
type NetworkError struct {
	Err error
}
```

```go
type APIError struct {
	Status int

	Code string

	ProviderCode string

	RequestID string

	RetryAfter time.Duration
	// contains filtered or unexported fields
}
```

```go
type ResponseBodyTooLargeError struct{ Limit int }
```

```go
type ModelMismatchError struct {
	BoundProvider    model.ProviderName
	RequestProvider  model.ProviderName
	BoundEndpoint    string
	RequestEndpoint  string
	BoundAPIFormat   model.APIFormat
	RequestAPIFormat model.APIFormat
}
```

### Constants {#constants}

`MaxErrorBodyBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `APIError`, `ModelMismatchError`, `NetworkError`, `ResponseBodyTooLargeError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [failure/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/failure/errors.go)

Adjacent tests at the same commit:

- [failure/errors_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/failure/errors_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
