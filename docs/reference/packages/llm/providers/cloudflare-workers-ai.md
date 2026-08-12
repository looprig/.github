---
id: reference/packages/llm/providers/cloudflare-workers-ai
title: cloudflareworkers package · providers/cloudflare-workers-ai
description: Reference for the cloudflare-workers-ai package at github.com/looprig/llm/providers/cloudflare-workers-ai, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 270
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

# cloudflareworkers package · providers/cloudflare-workers-ai

Import path: `github.com/looprig/llm/providers/cloudflare-workers-ai`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package cloudflareworkers provides Cloudflare Workers AI's documented OpenAI-compatible AI Gateway route.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithAccountID(account string) Option`
- `func WithGatewayID(gateway string) Option`
- `func WithHeader(name, value string) Option`
- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *ConfigurationError) Error() string`

### Types {#types}

```go
type Option func(*config)
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

`AccountMissing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigurationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/cloudflare-workers-ai/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-workers-ai/client.go)
- [providers/cloudflare-workers-ai/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-workers-ai/counter.go)
- [providers/cloudflare-workers-ai/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-workers-ai/errors.go)

Adjacent tests at the same commit:

- [providers/cloudflare-workers-ai/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-workers-ai/client_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
