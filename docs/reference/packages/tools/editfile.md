---
id: reference/packages/tools/editfile
title: editfile package · editfile
description: Reference for freshness-checked file edits.
audience: developer
section: reference
order: 163
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions: release-github-com-looprig-tools
  methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants: release-github-com-looprig-tools
  variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# editfile package · editfile

Import path: `github.com/looprig/tools/editfile`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package editfile exposes the standard workspace file editor.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(root string, observations tool.WorkspaceObservations, options ...Option) *Tool`
- `func WithMutationCoordinator(coordinator tool.WorkspaceCoordinator) Option`
- `func WithHostWrites() Option`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Tool = filemutation.EditFile
```

```go
type Option = filemutation.FileMutatorOption
```

```go
type LeaseUnhealthyError = filemutation.LeaseUnhealthyError
```

```go
type StaleFileError = filemutation.StaleFileError
```

```go
type IrregularFileError = filemutation.IrregularFileError
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [editfile/editfile.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/editfile/editfile.go)

Adjacent tests at the same commit:

No `_test.go` file is present in this package directory at the pinned commit.

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
