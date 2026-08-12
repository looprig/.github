---
id: reference/packages/credentials/catalog
title: catalog package · catalog
description: Reference for the catalog package at github.com/looprig/credentials/catalog, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 21
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

# catalog package · catalog

Import path: `github.com/looprig/credentials/catalog`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(root string) (*Local, error)`
- `func NewLocal(root string) (*Local, error)`
- `func NewCatalog(root string) (*Local, error)`
- `func NewLocalCatalog(root string) (*Local, error)`
- `func Open(root string) (*Local, error)`
- `func NewWithOptions(root string, options Options) (*Local, error)`

### Methods {#methods}

- `func (l *Local) Root() string`
- `func (l *Local) Path() string`
- `func (l *Local) Close() error`
- `func (l *Local) Get(ctx context.Context, ref credentials.Reference) (credentials.Record, error)`
- `func (l *Local) List(ctx context.Context) ([]credentials.Record, error)`
- `func (l *Local) Create(ctx context.Context, record credentials.Record) error`
- `func (l *Local) Delete(ctx context.Context, ref credentials.Reference) error`
- `func (l *Local) Update(ctx context.Context, expected, next credentials.Record) error`
- `func (errorUnsupported) Error() string`

### Types {#types}

`Hooks`, `Options`, `Local`, `LocalCatalog`

### Constants {#constants}

`Filename`, `LockFilename`, `SchemaV1`, `CatalogSchemaV1`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [catalog/local.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local.go)
- [catalog/local_other.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local_other.go)
- [catalog/local_unix.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local_unix.go)
- [catalog/local_windows.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local_windows.go)
- [catalog/platform.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/platform.go)

Adjacent tests at the same commit:

- [catalog/local_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local_test.go)
- [catalog/local_unix_regression_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local_unix_regression_test.go)

Run `GOWORK=off go test ./...` from the `credentials` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
