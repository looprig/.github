---
id: reference/packages/llm/providers/cloudflare-ai-gateway
title: cloudflaregateway package · providers/cloudflare-ai-gateway
description: Reference for the cloudflare-ai-gateway package at github.com/looprig/llm/providers/cloudflare-ai-gateway, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 269
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

# cloudflaregateway package · providers/cloudflare-ai-gateway

Import path: `github.com/looprig/llm/providers/cloudflare-ai-gateway`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithAccountID(account string) Option`
- `func WithGatewayID(gateway string) Option`
- `func WithHeader(name, value string) Option`
- `func WithMetadata(metadata map[string]string) Option`
- `func WithSkipCache(skip bool) Option`
- `func WithCacheTTL(seconds int) Option`
- `func WithCacheKey(key string) Option`
- `func WithCollectLog(collect bool) Option`
- `func WithReasoningEffort(value string) Option`
- `func WithThinkingBudget(budget int) Option`
- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`
- `func NewCounter(_ auth.APIKey) (contextcount.ContextCounter, error)`

### Methods {#methods}

- `func (e *ConfigurationError) Error() string`

### Types {#types}

`Option`, `ConfigurationReason`, `ConfigurationError`

### Constants {#constants}

`AccountMissing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigurationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/cloudflare-ai-gateway/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-ai-gateway/client.go)
- [providers/cloudflare-ai-gateway/counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-ai-gateway/counter.go)
- [providers/cloudflare-ai-gateway/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-ai-gateway/errors.go)

Adjacent tests at the same commit:

- [providers/cloudflare-ai-gateway/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-ai-gateway/client_test.go)
- [providers/cloudflare-ai-gateway/options_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/cloudflare-ai-gateway/options_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
