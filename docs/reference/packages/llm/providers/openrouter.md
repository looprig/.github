---
id: reference/packages/llm/providers/openrouter
title: openrouter package · providers/openrouter
description: Reference for the openrouter package at github.com/looprig/llm/providers/openrouter, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 332
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

# openrouter package · providers/openrouter

Import path: `github.com/looprig/llm/providers/openrouter`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package openrouter provides the OpenRouter-specific construction and request options for the OpenAI-compatible Chat Completions API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithTLSRootCAs(roots *x509.CertPool) Option`
- `func WithHTTPReferer(value string) Option`
- `func WithTitle(value string) Option`
- `func WithUsage(include bool) Option`
- `func WithReasoning(options ReasoningOptions) Option`
- `func WithPromptCacheKey(value string) Option`
- `func WithProviderRouting(options ProviderRoutingOptions) Option`
- `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type ReasoningOptions struct {
	Effort    string `json:"effort,omitempty"`
	MaxTokens *int   `json:"max_tokens,omitempty"`
	Exclude   *bool  `json:"exclude,omitempty"`
	Enabled   *bool  `json:"enabled,omitempty"`
	Context   string `json:"context,omitempty"`
	Mode      string `json:"mode,omitempty"`
}
```

```go
type ProviderRoutingOptions struct {
	Order             []string `json:"order,omitempty"`
	AllowFallbacks    *bool    `json:"allow_fallbacks,omitempty"`
	RequireParameters *bool    `json:"require_parameters,omitempty"`
	DataCollection    string   `json:"data_collection,omitempty"`
	ZDR               *bool    `json:"zdr,omitempty"`
}
```

```go
type Option func(*config)
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/openrouter/openrouter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openrouter/openrouter.go)

Adjacent tests at the same commit:

- [providers/openrouter/openrouter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/openrouter/openrouter_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
