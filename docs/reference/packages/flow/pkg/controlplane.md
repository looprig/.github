---
id: reference/packages/flow/pkg/controlplane
title: controlplane package · pkg/controlplane
description: Reference for the controlplane package at github.com/looprig/flow/pkg/controlplane, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 50
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

# controlplane package · pkg/controlplane

Import path: `github.com/looprig/flow/pkg/controlplane`. The source is pinned to github.com/looprig/flow@v0.3.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithNackBackoff(d time.Duration) MemOption`
- `func Mem(opts ...MemOption) *MemControlPlane`

### Methods {#methods}

- `func (e *ClosedError) Error() string`
- `func (cp *MemControlPlane) Close()`
- `func (cp *MemControlPlane) Submit(ctx context.Context, w flow.Work) error`
- `func (cp *MemControlPlane) Consume(ctx context.Context, serves []flow.GraphVersionKey) (<-chan flow.Delivery, error)`

### Types {#types}

```go
type ClosedError struct{}
```

```go
type MemOption func(*MemControlPlane)
```

```go
type MemControlPlane struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`DefaultNackBackoff`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ClosedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/controlplane/doc.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/controlplane/doc.go)
- [pkg/controlplane/errors.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/controlplane/errors.go)
- [pkg/controlplane/mem.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/controlplane/mem.go)

Adjacent tests at the same commit:

- [pkg/controlplane/mem_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/controlplane/mem_test.go)

Run `GOWORK=off go test ./...` from the `flow` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
