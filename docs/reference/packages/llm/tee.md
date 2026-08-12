---
id: reference/packages/llm/tee
title: tee package · tee
description: Reference for the tee package at github.com/looprig/llm/tee, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 205
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

# tee package · tee

Import path: `github.com/looprig/llm/tee`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This support package is part of LLM model access and is intended to be composed by the root or provider packages. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func VerifyTDXQuote(rawQuote []byte) ([]byte, error)`
- `func VerifyTDXQuoteWithOptions(rawQuote []byte, opts Options) ([]byte, error)`
- `func TDXQuoteRTMR3(rawQuote []byte) ([]byte, error)`
- `func VerifyGPUEvidence(ctx context.Context, hc *http.Client, nrasURL, jwksURL string, gpu []GPUEvidence) error`

### Methods {#methods}

- `func (e *Error) Error() string`
- `func (e *Error) Unwrap() error`

### Types {#types}

```go
type Reason string
```

```go
type Error struct {
	Reason Reason
	Err    error
}
```

```go
type Options struct {
	GetCollateral bool

	CheckRevocations bool

	Getter trust.HTTPSGetter

	Now func() time.Time
}
```

```go
type GPUEvidence struct {
	Certificate string `json:"certificate"`
	Evidence    string `json:"evidence"`
	Arch        string `json:"arch"`
}
```

### Constants {#constants}

`ReasonQuoteSignatureInvalid`, `ReasonRootCAUntrusted`, `ReasonEvidenceMalformed`, `ReasonNvidiaVerdictInvalid`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [tee/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/tee/errors.go)
- [tee/intel_quote.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/tee/intel_quote.go)
- [tee/nvidia_nras.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/tee/nvidia_nras.go)

Adjacent tests at the same commit:

- [tee/intel_quote_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/tee/intel_quote_test.go)
- [tee/tee_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/tee/tee_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
