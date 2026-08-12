---
id: reference/packages/llm/providers/gitlab
title: gitlab package · providers/gitlab
description: Reference for the gitlab package at github.com/looprig/llm/providers/gitlab, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 279
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

# gitlab package · providers/gitlab

Import path: `github.com/looprig/llm/providers/gitlab`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package gitlab provides GitLab Duo's documented AI Gateway proxy endpoints.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithHeader(name, value string) Option`
- `func WithAIGatewayURL(baseURL string) Option`
- `func WithInstanceURL(baseURL string) Option`
- `func WithFeatureFlag(name string, enabled bool) Option`
- `func WithUpstreamModelID(id string, apiFormat model.APIFormat) Option`
- `func WithAIGatewayHeader(name, value string) Option`
- `func WithReasoningEffort(value string) Option`
- `func WithThinkingBudget(budget int) Option`
- `func New(selected model.Model, key auth.APIKey, providerOptions ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *ModelMappingError) Error() string`
- `func (e *DirectAccessError) Error() string`
- `func (e *DirectAccessError) Unwrap() error`

### Types {#types}

```go
type Option func(*options)
```

```go
type CounterSupportError = llm.CounterSupportError
```

```go
type ModelMappingError struct {
	Alias  string
	Format model.APIFormat
	Reason string
}
```

```go
type DirectAccessError struct {
	Status int
	Reason string
	Err    error
}
```

### Constants {#constants}

`DefaultOpenAIBaseURL`, `DefaultAnthropicBaseURL`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DirectAccessError`, `ModelMappingError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/gitlab/auth.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/auth.go)
- [providers/gitlab/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/client.go)
- [providers/gitlab/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/counter.go)
- [providers/gitlab/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/errors.go)
- [providers/gitlab/model_mapping.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/model_mapping.go)

Adjacent tests at the same commit:

- [providers/gitlab/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/client_test.go)
- [providers/gitlab/model_mapping_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/model_mapping_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
