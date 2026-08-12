---
id: reference/packages/llm/providers/gmicloud
title: gmicloud package · providers/gmicloud
description: Reference for the gmicloud package at github.com/looprig/llm/providers/gmicloud, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 280
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

# gmicloud package · providers/gmicloud

Import path: `github.com/looprig/llm/providers/gmicloud`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`
- `func WithHeader(name, value string) Option`
- `func WithOrganizationID(id string) Option`
- `func WithTopK(value int) Option`

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

- [providers/gmicloud/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/client.go)
- [providers/gmicloud/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/counter.go)
- [providers/gmicloud/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/errors.go)
- [providers/gmicloud/options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/options.go)

Adjacent tests at the same commit:

- [providers/gmicloud/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/client_test.go)
- [providers/gmicloud/counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gmicloud/counter_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
