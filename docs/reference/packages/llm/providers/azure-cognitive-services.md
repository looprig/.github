---
id: reference/packages/llm/providers/azure-cognitive-services
title: azurecognitive package · providers/azure-cognitive-services
description: Reference for the azure-cognitive-services package at github.com/looprig/llm/providers/azure-cognitive-services, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 264
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

# azurecognitive package · providers/azure-cognitive-services

Import path: `github.com/looprig/llm/providers/azure-cognitive-services`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package azurecognitive provides Azure Cognitive Services' documented OpenAI and Anthropic-compatible model endpoints.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithResourceName(resource string) Option`
- `func WithHeader(name, value string) Option`
- `func WithThinkingBudget(budget int) Option`
- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *ResourceConfigurationError) Error() string`

### Types {#types}

```go
type Option func(*config)
```

```go
type CounterSupportError = llm.CounterSupportError
```

```go
type ResourceConfigurationReason string
```

```go
type ResourceConfigurationError struct {
	Reason ResourceConfigurationReason
}
```

### Constants {#constants}

`ResourceMissing`, `ResourceInvalid`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ResourceConfigurationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/azure-cognitive-services/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/client.go)
- [providers/azure-cognitive-services/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/counter.go)
- [providers/azure-cognitive-services/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/errors.go)
- [providers/azure-cognitive-services/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/options.go)

Adjacent tests at the same commit:

- [providers/azure-cognitive-services/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/client_test.go)
- [providers/azure-cognitive-services/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/counter_test.go)
- [providers/azure-cognitive-services/default_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/azure-cognitive-services/default_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
