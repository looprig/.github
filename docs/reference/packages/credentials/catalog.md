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
  functions-and-methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants-and-variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# catalog package · catalog

Import path: `github.com/looprig/credentials/catalog`. Package catalog contains explicit credential catalog backends.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Close`, `Create`, `Delete`, `Get`, `List`, `Path`, `Root`, `Update`

### Types {#types}

`Hooks`, `Local`, `LocalCatalog`, `Options`

### Constants and variables {#constants-and-variables}

`CatalogSchemaV1`, `Filename`, `LockFilename`, `SchemaV1`

## Ownership and errors {#ownership-and-errors}

The catalog package exposes `Close`, `Create`, `Delete`, `Get` as its main operations. The principal handle or value is `LocalCatalog`; retain it according to its declaration before calling a terminal method. Use `Create` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Credential sources must redact tokens and cannot make provider authorization durable by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/credentials/tree/v0.1.0/catalog/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-credentials`.
