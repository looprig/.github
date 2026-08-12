---
id: reference/packages/secrets/contracttest
title: contracttest package · contracttest
description: Reference for the contracttest package at github.com/looprig/secrets/contracttest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 28
publication: released
proofs:
  package-role: release-github-com-looprig-secrets
  exported-surface: release-github-com-looprig-secrets
  functions-and-methods: release-github-com-looprig-secrets
  types: release-github-com-looprig-secrets
  constants-and-variables: release-github-com-looprig-secrets
  ownership-and-errors: release-github-com-looprig-secrets
  source-and-runnable-proof: release-github-com-looprig-secrets
---

# contracttest package · contracttest

Import path: `github.com/looprig/secrets/contracttest`. The source is pinned to github.com/looprig/secrets@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func RunStore(t *testing.T, factory StoreFactory, options ...StoreContractOptions)`
- `func RunList(t *testing.T, lister secrets.Lister, config StoreContractOptions)`
- `func AssertListMetadata(t *testing.T, lister secrets.Lister, namespace secrets.Namespace)`
- `func ErrorText(err error) string`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

`StoreFactory`, `StoreContractOptions`, `StoreContractConfig`, `ContractOptions`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [contracttest/store.go](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/contracttest/store.go)

Adjacent tests at the same commit:

No `_test.go` file is present in this package directory at the pinned commit.

Run `GOWORK=off go test ./...` from the `secrets` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
