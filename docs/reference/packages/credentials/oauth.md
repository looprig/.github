---
id: reference/packages/credentials/oauth
title: oauth package · oauth
description: Reference for the oauth package at github.com/looprig/credentials/oauth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 23
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

# oauth package · oauth

Import path: `github.com/looprig/credentials/oauth`. Package oauth contains provider-neutral OAuth acquisition mechanics. Provider packages provide a reviewed Definition: this package never chooses provider endpoints, client identities, scopes, or browser behavior for callers. It only validates and applies the d

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`BeginAuthorization`, `CallbackError`, `Client`, `Close`, `Code`, `Consume`, `Error`, `Exchange`, `ExchangeCode`, `Format`, `GenerateState`, `GenerateVerifier`, `GoString`, `HasError`, `Instructions`, `IsProviderError`, `LogValue`, `NewState`, `NewVerifier`, `ParseCallback`, `ParseExpiresIn`, `Poll`, `PollDevice`, `RefreshToken`, `RevokeToken`, `Rotate`, `S256`, `S256Challenge`, `ServeHTTP`, `SortOrigins`, `StartDeviceAuthorization`, `StartDeviceFlow`, `State`, `StatusCode`, `String`, `Unwrap`, `Valid`, `Validate`, `ValidateState`, `ValidateVerifier`, `Wait`

### Types {#types}

`AuthorizationFlow`, `CallbackInstructions`, `CallbackResult`, `ClientIdentity`, `ClientRegistration`, `Config`, `Definition`, `DeviceAuthorization`, `DeviceAuthorizationResponse`, `DeviceFlow`, `Grant`, `LoopbackListener`, `LoopbackRedirectPolicy`, `Option`, `PKCE`, `ProviderDefinition`, `ProviderError`, `ResponseParser`, `Revoker`, `StateGuard`, `Token`, `TokenResponse`

### Constants and variables {#constants-and-variables}

`CallbackIdleTimeout`, `CallbackReadHeaderTimeout`, `DefaultPollInterval`, `MaxCallbackValueLength`, `MaxExtraParams`, `MaxHeaderBytes`, `MaxPollAttempts`, `MaxPollInterval`, `MaxRequestBodyBytes`, `MaxRequestHeaders`, `MaxResponseBodyBytes`, `MaxResponseHeaders`, `MaxScopeLength`, `MaxScopes`, `MaxStateLength`, `MaxTokenLifetime`, `MaxTokenValueLength`, `MaxVerifierLength`, `MinVerifierLength`, `ErrCallbackClosed`, `ErrCallbackOrigin`, `ErrCallbackTimeout`, `ErrCanceled`, `ErrDeviceExpired`, `ErrInvalidClient`, `ErrInvalidDefinition`, `ErrInvalidEndpoint`, `ErrInvalidRequest`, `ErrInvalidResponse`, `ErrInvalidVerifier`, `ErrNetwork`, `ErrNilContext`, `ErrOriginMismatch`, `ErrPollLimit`, `ErrProvider`, `ErrRedirectRejected`, `ErrRequestHeadersTooLarge`, `ErrRequestTooLarge`, `ErrResponseHeadersTooLarge`, `ErrResponseTooLarge`, `ErrRevocationUnsupported`, `ErrStateMismatch`, `ErrStateUsed`, `ErrUnsupportedGrant`

## Ownership and errors {#ownership-and-errors}

The oauth package exposes `BeginAuthorization`, `CallbackError`, `Client`, `Close` as its main operations. The principal handle or value is `AuthorizationFlow`; retain it according to its declaration before calling a terminal method. Use `NewState` as the package construction entry point when creating that value. Its exported typed failures include `ProviderError`, `ErrCallbackClosed`, `ErrCallbackOrigin`, `ErrCallbackTimeout`; classify them with errors.Is or errors.As. Credential sources must redact tokens and cannot make provider authorization durable by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/credentials/tree/v0.1.0/oauth/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-credentials`.
