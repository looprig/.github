---
id: reference/packages/flow/pkg/registry
title: registry package · pkg/registry
description: Reference for the registry package at github.com/looprig/flow/pkg/registry, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 53
publication: released
examples:
  - stage-17-flow
proofs:
  package-role: release-github-com-looprig-flow
  exported-surface: release-github-com-looprig-flow
  functions-and-methods: release-github-com-looprig-flow
  types: release-github-com-looprig-flow
  constants-and-variables: release-github-com-looprig-flow
  ownership-and-errors: release-github-com-looprig-flow
  source-and-runnable-proof: release-github-com-looprig-flow
---

# registry package · pkg/registry

Import path: `github.com/looprig/flow/pkg/registry`. The source is pinned to github.com/looprig/flow@v0.3.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New() *Registry`

### Methods {#methods}

- `func (r *Registry) Add(h flow.RunnerHandle) error`
- `func (r *Registry) Resolve(id flow.GraphID, version string) (flow.RunnerHandle, bool)`
- `func (r *Registry) Manifest() []GraphManifest`
- `func (r *Registry) Keys() []flow.GraphVersionKey`
- `func (e *DuplicateRegistrationError) Error() string`

### Types {#types}

`Registry`, `GraphManifest`, `DuplicateRegistrationError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateRegistrationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/registry/doc.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/registry/doc.go)
- [pkg/registry/registry.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/registry/registry.go)

Adjacent tests at the same commit:

- [pkg/registry/registry_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/registry/registry_test.go)

Run `GOWORK=off go test ./...` from the `flow` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
