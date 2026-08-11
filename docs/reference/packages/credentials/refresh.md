---
id: reference/packages/credentials/refresh
title: refresh package · refresh
description: Reference for the refresh package at github.com/looprig/credentials/refresh, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 24
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

# refresh package · refresh

Import path: `github.com/looprig/credentials/refresh`. Package refresh contains provider-neutral renewable credential sources. A refresh State is an opaque, versioned payload. It deliberately keeps access authority out of its encoded form by default; a source may opt into access-token persistence only when its pro

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Acquire`, `Authorizer`, `CanRecover`, `Clone`, `Close`, `Descriptor`, `EncodeState`, `Error`, `ExpiresAt`, `Format`, `Generation`, `GoString`, `Invalidate`, `LogValue`, `MarshalState`, `NewCoordinator`, `Reauth`, `Reauthenticate`, `ReauthenticateLease`, `Reference`, `Scope`, `String`, `Unwrap`, `Validate`, `WithLock`

### Types {#types}

`AmbiguousRotationError`, `Clock`, `ClockFunc`, `Config`, `Coordinator`, `ExchangeError`, `ExchangeFunc`, `ExchangeResult`, `FileCoordinator`, `InvalidStateError`, `Lease`, `Options`, `ProcessCoordinator`, `RefreshCoordinator`, `RefreshResponse`, `RefreshState`, `Source`, `SourceOptions`, `State`, `Token`, `TokenResponse`

### Constants and variables {#constants-and-variables}

`LockFilename`, `MaxProviderDataBytes`, `MaxStateBytes`, `SchemaV1`, `StateSchemaV1`, `StateVersion1`, `ErrAdoptionUnavailable`, `ErrAmbiguousRefresh`, `ErrAmbiguousRotation`, `ErrCanceled`, `ErrClosed`, `ErrCoordinator`, `ErrDurabilityUnknown`, `ErrExchange`, `ErrInvalidOptions`, `ErrInvalidState`, `ErrRefresh`, `ErrRefreshAmbiguous`, `ErrUnsupportedPlatform`

## Ownership and errors {#ownership-and-errors}

The refresh package exposes `Acquire`, `Authorizer`, `CanRecover`, `Clone` as its main operations. Use `NewCoordinator` as the package construction entry point when creating that value. Its exported typed failures include `AmbiguousRotationError`, `ExchangeError`, `InvalidStateError`, `ErrAdoptionUnavailable`; classify them with errors.Is or errors.As. Credential sources must redact tokens and cannot make provider authorization durable by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/credentials/tree/v0.1.0/refresh/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-credentials`.
