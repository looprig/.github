---
id: reference/packages/llm/auto
title: auto package · auto
description: Reference for the auto package at github.com/looprig/llm/auto, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 203
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

# auto package · auto

Import path: `github.com/looprig/llm/auto`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package auto is the composition root that selects and wires a concrete inference.Client for a validated Model.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithTLSRootCAs(roots *x509.CertPool) Option`
- `func WithOpenRouterOptions(opts ...openrouter.Option) Option`
- `func New(selected model.Model, key auth.APIKey, opts ...Option) (inference.Client, error)`
- `func NewWithAuth(selected model.Model, source credentials.Source, opts ...Option) (inference.Client, error)`
- `func NewCounter(model model.Model, key auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *SigV4NotConstructibleError) Error() string`
- `func (e *PolicyNotConstructibleError) Error() string`
- `func (e *CredentialNotConstructibleError) Error() string`

### Types {#types}

```go
type SigV4NotConstructibleError struct {
	Provider llm.Provider
	Use      string
}
```

```go
type PolicyNotConstructibleError struct {
	Provider llm.Provider
	Use      string
}
```

```go
type CredentialNotConstructibleError struct {
	Provider llm.Provider
	Kind     auth.AuthKind
	Use      string
}
```

```go
type Option func(*options)
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CredentialNotConstructibleError`, `PolicyNotConstructibleError`, `SigV4NotConstructibleError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [auto/auto.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/auto.go)
- [auto/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/counter.go)

Adjacent tests at the same commit:

- [auto/apiformat_e2e_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/apiformat_e2e_test.go)
- [auto/auto_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/auto_test.go)
- [auto/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/counter_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
