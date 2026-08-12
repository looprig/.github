---
id: reference/packages/llm/providers/atomic-chat
title: atomicchat package · providers/atomic-chat
description: Reference for the atomic-chat package at github.com/looprig/llm/providers/atomic-chat, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 262
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

# atomicchat package · providers/atomic-chat

Import path: `github.com/looprig/llm/providers/atomic-chat`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package atomicchat provides the documented atomicchat OpenAI-compatible API.

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

- [providers/atomic-chat/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/client.go)
- [providers/atomic-chat/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/counter.go)
- [providers/atomic-chat/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/errors.go)
- [providers/atomic-chat/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/options.go)

Adjacent tests at the same commit:

- [providers/atomic-chat/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/client_test.go)
- [providers/atomic-chat/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/atomic-chat/counter_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
