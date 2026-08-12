---
id: reference/packages/credentials/httpauth
title: httpauth package · httpauth
description: Reference for the httpauth package at github.com/looprig/credentials/httpauth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 22
publication: released
proofs:
  package-role: release-github-com-looprig-credentials
  exported-surface: release-github-com-looprig-credentials
  functions: release-github-com-looprig-credentials
  methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants: release-github-com-looprig-credentials
  variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# httpauth package · httpauth

Import path: `github.com/looprig/credentials/httpauth`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func None() Authorizer`
- `func Header(name string, value secrets.Secret) (Authorizer, error)`
- `func NewHeader(name string, value secrets.Secret) (Authorizer, error)`
- `func Bearer(value secrets.Secret) (Authorizer, error)`
- `func NewBearer(value secrets.Secret) (Authorizer, error)`

### Methods {#methods}

- `func (e *invalidHeaderNameError) LogValue() slog.Value`
- `func (e *invalidHeaderNameError) Error() string`
- `func (e *invalidHeaderNameError) Unwrap() error`
- `func (e *invalidHeaderNameError) Reason() string`
- `func (e *invalidHeaderNameError) Format(state fmt.State, _ rune)`
- `func (e *invalidHeaderNameError) GoString() string`
- `func (e *invalidHeaderValueError) Error() string`
- `func (e *invalidHeaderValueError) Unwrap() error`
- `func (e *invalidHeaderValueError) Reason() string`
- `func (e *invalidHeaderValueError) Format(state fmt.State, _ rune)`
- `func (e *invalidHeaderValueError) GoString() string`
- `func (e *invalidHeaderValueError) LogValue() slog.Value`
- `func (e *zeroSecretError) Error() string`
- `func (e *zeroSecretError) Unwrap() error`
- `func (e *zeroSecretError) Format(state fmt.State, _ rune)`
- `func (e *zeroSecretError) GoString() string`
- `func (e *zeroSecretError) LogValue() slog.Value`
- `func (e *nilRequestError) Error() string`
- `func (e *nilRequestError) Unwrap() error`
- `func (e *nilRequestError) Format(state fmt.State, _ rune)`
- `func (e *nilRequestError) GoString() string`
- `func (e *nilRequestError) LogValue() slog.Value`

### Types {#types}

```go
type InvalidHeaderNameError = invalidHeaderNameError
```

```go
type InvalidHeaderValueError = invalidHeaderValueError
```

```go
type ZeroSecretError = zeroSecretError
```

```go
type NilRequestError = nilRequestError
```

```go
type Authorizer interface {
	Authorize(context.Context, *http.Request) error
}
```

### Constants {#constants}

`MaxHeaderNameLength`

### Variables {#variables}

`ErrInvalidHeaderName`, `ErrInvalidHeaderValue`, `ErrZeroSecret`, `ErrNilRequest`, `ErrNilContext`, `ErrCanceled`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `InvalidHeaderNameError`, `InvalidHeaderValueError`, `NilRequestError`, `ZeroSecretError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [httpauth/httpauth.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/httpauth/httpauth.go)

Adjacent tests at the same commit:

- [httpauth/httpauth_internal_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/httpauth/httpauth_internal_test.go)
- [httpauth/httpauth_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/httpauth/httpauth_test.go)

Run `GOWORK=off go test ./...` from the `credentials` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
