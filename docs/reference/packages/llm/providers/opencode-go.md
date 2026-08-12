---
id: reference/packages/llm/providers/opencode-go
title: opencode package · providers/opencode-go
description: Reference for the opencode-go package at github.com/looprig/llm/providers/opencode-go, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 331
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

# opencode package · providers/opencode-go

Import path: `github.com/looprig/llm/providers/opencode-go`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package opencode provides the OpenCode Go endpoint using the shared Chat, Responses, and Anthropic transport semantics.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`
- `func WithHeader(name, value string) Option`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Option = simple.Option
```

```go
type CounterSupportError = llm.CounterSupportError
```

### Constants {#constants}

`DefaultBaseURL`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/opencode-go/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/client.go)
- [providers/opencode-go/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/counter.go)
- [providers/opencode-go/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/errors.go)
- [providers/opencode-go/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/options.go)

Adjacent tests at the same commit:

- [providers/opencode-go/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/client_test.go)
- [providers/opencode-go/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/opencode-go/counter_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
