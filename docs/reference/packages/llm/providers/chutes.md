---
id: reference/packages/llm/providers/chutes
title: chutes package · providers/chutes
description: Reference for the chutes package at github.com/looprig/llm/providers/chutes, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 268
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

# chutes package · providers/chutes

Import path: `github.com/looprig/llm/providers/chutes`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package chutes is a Chutes end-to-end-encrypted, TEE-attested LLM client.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithHTTPClient(hc *http.Client) Option`
- `func WithLLMBase(base string) Option`
- `func WithNRAS(nrasURL, jwksURL string) Option`
- `func New(apiBase, apiKey string, opts ...Option) *Client`

### Methods {#methods}

- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`

### Types {#types}

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type Option func(*Client)
```

```go
type AttestReason string
```

### Constants {#constants}

`ReasonQuoteSignatureInvalid`, `ReasonRootCAUntrusted`, `ReasonBindingMismatch`, `ReasonEvidenceMalformed`, `ReasonNvidiaVerdictInvalid`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/chutes/attest.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/attest.go)
- [providers/chutes/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/client.go)
- [providers/chutes/decode.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/decode.go)
- [providers/chutes/discover.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/discover.go)
- [providers/chutes/encode.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/encode.go)
- [providers/chutes/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/errors.go)
- [providers/chutes/ssereader.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/ssereader.go)
- [providers/chutes/stream.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/stream.go)

Adjacent tests at the same commit:

- [providers/chutes/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/client_test.go)
- [providers/chutes/encode_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/encode_test.go)
- [providers/chutes/export_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/export_test.go)
- [providers/chutes/usage_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/usage_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
