---
id: reference/packages/llm/providers/snowflake-cortex
title: snowflake package · providers/snowflake-cortex
description: Reference for the snowflake-cortex package at github.com/looprig/llm/providers/snowflake-cortex, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 338
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

# snowflake package · providers/snowflake-cortex

Import path: `github.com/looprig/llm/providers/snowflake-cortex`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithAccount(account string) Option`
- `func WithHeader(name, value string) Option`
- `func WithReasoningEnabled(enabled bool) Option`
- `func WithServiceTier(value string) Option`
- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *ConfigurationError) Error() string`

### Types {#types}

```go
type Option func(*config)
```

```go
type CounterSupportError = llm.CounterSupportError
```

```go
type ConfigurationReason string
```

```go
type ConfigurationError struct {
	Reason ConfigurationReason
}
```

### Constants {#constants}

`AccountMissing`, `AccountInvalid`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigurationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/snowflake-cortex/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/client.go)
- [providers/snowflake-cortex/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/counter.go)
- [providers/snowflake-cortex/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/errors.go)

Adjacent tests at the same commit:

- [providers/snowflake-cortex/client_error_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/client_error_test.go)
- [providers/snowflake-cortex/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/client_test.go)
- [providers/snowflake-cortex/normalize_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/normalize_test.go)
- [providers/snowflake-cortex/options_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/options_test.go)
- [providers/snowflake-cortex/validation_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/snowflake-cortex/validation_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
