---
id: reference/packages/llm/e2e
title: e2e package · e2e
description: Reference for the e2e package at github.com/looprig/llm/e2e, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 204
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

# e2e package · e2e

Import path: `github.com/looprig/llm/e2e`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This package seals and opens bounded encrypted frames for an end-to-end transport. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DeriveKey(shared, mlkemCT, info []byte) ([]byte, error)`
- `func Seal(plaintext, recipientPub, info []byte, gzipFirst bool) (mlkemCT, blob []byte, err error)`
- `func Open(shared, mlkemCT, blob, info []byte, gunzip bool) ([]byte, error)`
- `func OpenFrame(key, blob []byte) ([]byte, error)`
- `func SealFrame(key, plaintext []byte) ([]byte, error)`

### Methods {#methods}

- `func (e *Error) Error() string`
- `func (e *Error) Unwrap() error`

### Types {#types}

```go
type Error struct {
	Op  string
	Err error
}
```

### Constants {#constants}

`MLKEMCTSize`, `SaltSize`, `KeySize`, `NonceSize`, `TagSize`

### Variables {#variables}

`ErrShortBlob`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [e2e/envelope.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/e2e/envelope.go)
- [e2e/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/e2e/errors.go)

Adjacent tests at the same commit:

- [e2e/envelope_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/e2e/envelope_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
