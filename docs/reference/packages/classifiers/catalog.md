---
id: reference/packages/classifiers/catalog
title: catalog package · catalog
description: Reference for the optional classifier catalog scaffold.
audience: developer
section: reference
order: 180
publication: released
examples:
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-classifiers
  exported-surface: release-github-com-looprig-classifiers
  functions: release-github-com-looprig-classifiers
  methods: release-github-com-looprig-classifiers
  types: release-github-com-looprig-classifiers
  constants: release-github-com-looprig-classifiers
  variables: release-github-com-looprig-classifiers
  ownership-and-errors: release-github-com-looprig-classifiers
  source-and-runnable-proof: release-github-com-looprig-classifiers
---

# catalog package · catalog

Import path: `github.com/looprig/classifiers/pkg/catalog`. The source is pinned to github.com/looprig/classifiers@v0.1.4.

## Package role {#package-role}

Package catalog exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/catalog/doc.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/catalog/doc.go)

Adjacent tests at the same commit:

No `_test.go` file is present in this package directory at the pinned commit.

Run `go test ./...` from a checkout of the `classifiers` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
