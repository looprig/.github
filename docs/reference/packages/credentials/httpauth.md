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
  functions-and-methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants-and-variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# httpauth package · httpauth

Import path: `github.com/looprig/credentials/httpauth`. Package httpauth contains call-scoped HTTP request authorizers. It depends only on secrets and deliberately does not import the credentials root, keeping the protocol boundary usable by sources and transports alike.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

None reported.

### Types {#types}

`Authorizer`, `InvalidHeaderNameError`, `InvalidHeaderValueError`, `NilRequestError`, `ZeroSecretError`

### Constants and variables {#constants-and-variables}

`MaxHeaderNameLength`, `ErrCanceled`, `ErrInvalidHeaderName`, `ErrInvalidHeaderValue`, `ErrNilContext`, `ErrNilRequest`, `ErrZeroSecret`

## Ownership and errors {#ownership-and-errors}

The httpauth package exposes value declarations for its boundary. Its exported typed failures include `InvalidHeaderNameError`, `InvalidHeaderValueError`, `NilRequestError`, `ZeroSecretError`; classify them with errors.Is or errors.As. Credential sources must redact tokens and cannot make provider authorization durable by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/credentials/tree/v0.1.0/httpauth/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-credentials`.
