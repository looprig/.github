---
id: reference/packages/llm/providers/stackit
title: stackit package · providers/stackit
description: Reference for the stackit package at github.com/looprig/llm/providers/stackit, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 339
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions-and-methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants-and-variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# stackit package · providers/stackit

Import path: `github.com/looprig/llm/providers/stackit`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`
- `func WithHeader(name, value string) Option`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

`Option`, `CounterSupportError`

### Constants {#constants}

`DefaultBaseURL`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/stackit/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/client.go)
- [providers/stackit/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/counter.go)
- [providers/stackit/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/errors.go)
- [providers/stackit/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/options.go)

Adjacent tests at the same commit:

- [providers/stackit/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/client_test.go)
- [providers/stackit/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/stackit/counter_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
