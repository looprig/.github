---
id: reference/packages/flow/pkg/ingress
title: ingress package · pkg/ingress
description: Reference for the ingress package at github.com/looprig/flow/pkg/ingress, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 52
publication: released
examples:
  - stage-17-flow
proofs:
  package-role: release-github-com-looprig-flow
  exported-surface: release-github-com-looprig-flow
  functions: release-github-com-looprig-flow
  methods: release-github-com-looprig-flow
  types: release-github-com-looprig-flow
  constants: release-github-com-looprig-flow
  variables: release-github-com-looprig-flow
  ownership-and-errors: release-github-com-looprig-flow
  source-and-runnable-proof: release-github-com-looprig-flow
---

# ingress package · pkg/ingress

Import path: `github.com/looprig/flow/pkg/ingress`. The source is pinned to github.com/looprig/flow@v0.3.0.

## Package role {#package-role}

Package ingress accepts inbound flow requests.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithMaxBodyBytes(n int64) Option`
- `func WithAuth(authn func(*http.Request) error) Option`
- `func WithVerboseErrors() Option`
- `func New(reg *registry.Registry, cp flow.ControlPlane, store flow.CheckpointStore, opts ...Option) http.Handler`
- `func Server(addr string, h http.Handler, opts ...ServerOption) *http.Server`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Option func(*config)
```

```go
type ServerOption func(*http.Server)
```

### Constants {#constants}

`DefaultMaxBodyBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/ingress/doc.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/ingress/doc.go)
- [pkg/ingress/dto.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/ingress/dto.go)
- [pkg/ingress/ingress.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/ingress/ingress.go)

Adjacent tests at the same commit:

- [pkg/ingress/ingress_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/ingress/ingress_test.go)

Run `go test ./...` from a checkout of the `flow` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
