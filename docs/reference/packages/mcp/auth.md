---
id: reference/packages/mcp/auth
title: auth package · auth
description: Reference for MCP bearer and OAuth credential seams with secret-safe values.
audience: developer
section: reference
order: 210
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions-and-methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants-and-variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# auth package · auth

Import path: `github.com/looprig/mcp/pkg/auth`. Auth supplies token, OAuth, header, origin, and status seams without speaking HTTP itself.

## Package role {#package-role}

`TokenSet`, `Header`, `ClientCredentials`, and `Status` separate secret material from loggable metadata. `OAuthProvider` drives the configured browser, token store, and provider endpoints through explicit interfaces.

## Exported surface {#exported-surface}

Public values are `TokenStore`, `BrowserOpener`, `HeaderProvider`, `TokenSet`, `Header`, `Key`, `ClientCredentials`, `OAuthConfig`, `OAuthProvider`, `MemoryStore`, `Status`, `State`, `Class`, and `Error`. Constructors include `NewTokenSet`, `NewHeader`, `NewClientCredentials`, `NewMemoryStore`, `NewOAuthProvider`, `NewStatus`, `CanonicalOrigin`, and classification helpers.

### Functions and methods {#functions-and-methods}

Accessors deliberately expose secrets only by named calls. `StatusOf` derives a non-secret state from a token set; `ClassOf` classifies auth failures.

### Types {#types}

Secret-bearing types keep values unexported and refuse implicit JSON or gob marshaling. `Error` carries class, operation, and bounded diagnostic information.

### Constants and variables {#constants-and-variables}

Expiry skew, URL/message limits, redaction marker, and `ErrNoToken`/`ErrMarshalRefused` are stable safeguards.

## Ownership and errors {#ownership-and-errors}

The caller owns token stores and browser openers. Never put token strings into events, catalogs, fingerprints, or logs. Canonicalize and pin origin before attaching a credential.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned auth package](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/). Transport integration tests cover origin and credential handling.
