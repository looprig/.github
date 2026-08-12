---
id: reference/packages/llm/auth
title: auth package · auth
description: Reference for the auth package at github.com/looprig/llm/auth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 202
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

# auth package · auth

Import path: `github.com/looprig/llm/auth`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This support package is part of LLM model access and is intended to be composed by the root or provider packages. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func SigV4(creds SigV4Credentials, region, service string) inferauth.Authenticator`

### Methods {#methods}

- `func (e *MissingSigV4CredentialsError) Error() string`
- `func (e *BodyReadError) Error() string`
- `func (e *BodyReadError) Unwrap() error`
- `func (SigV4Credentials) String() string`
- `func (SigV4Credentials) LogValue() slog.Value`
- `func (SigV4Credentials) GoString() string`

### Types {#types}

```go
type SigV4Credentials struct {
	AccessKeyID     string
	SecretAccessKey string
	SessionToken    string
}
```

```go
type MissingSigV4CredentialsError struct {
	Region  string
	Service string
}
```

```go
type BodyReadError struct {
	Err error
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BodyReadError`, `MissingSigV4CredentialsError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [auth/sigv4.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auth/sigv4.go)

Adjacent tests at the same commit:

- [auth/sigv4_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auth/sigv4_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
