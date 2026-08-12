---
id: reference/packages/inference/auth
title: auth package · auth
description: Reference for the auth package at github.com/looprig/inference/auth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 101
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# auth package · auth

Import path: `github.com/looprig/inference/auth`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package auth provides the legacy inference authorization facade.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Key(k APIKey) Authenticator`
- `func Header(k APIKey, name string) Authenticator`
- `func None() Authenticator`

### Methods {#methods}

- `func (e *MissingCredentialsError) Error() string`
- `func (e *MissingCredentialsError) Format(state fmt.State, _ rune)`
- `func (e *MissingCredentialsError) GoString() string`
- `func (e *MissingCredentialsError) LogValue() slog.Value`

### Types {#types}

```go
type APIKey string
```

```go
type Authorizer = httpauth.Authorizer
```

```go
type Authenticator = httpauth.Authorizer
```

```go
type AuthKind string
```

```go
type MissingCredentialsError struct {
	Credential string
}
```

### Constants {#constants}

`AuthNone`, `AuthAPIKey`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `MissingCredentialsError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [auth/auth.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/auth/auth.go)
- [auth/contracts.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/auth/contracts.go)
- [auth/errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/auth/errors.go)

Adjacent tests at the same commit:

- [auth/auth_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/auth/auth_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
