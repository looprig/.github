---
id: integrations/mcp/authentication
title: MCP authentication
description: Attach bearer or OAuth credentials to a canonical origin without leaking secrets into protocol state.
audience: developer
section: integrations
order: 325
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  credentials: release-github-com-looprig-mcp
  origin-and-status: release-github-com-looprig-mcp
  ownership: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# MCP authentication

The `auth` package separates bearer tokens, OAuth client credentials, header providers, browser opening, token stores, and non-secret status. Transports consume those seams; they do not own product credential policy.

## Credentials {#credentials}

Use an explicit `TokenStore`, `OAuthProvider`, or header provider for the selected server origin. Keep secret-bearing values behind named accessors and redact them from events, catalogs, fingerprints, and logs. A child stdio environment uses its transport allowlist rather than inheriting every parent variable.

## Origin and status {#origin-and-status}

Canonicalize and pin the origin before attaching a credential. `StatusOf` and auth failure classes expose state without returning token material. A 401 or refresh failure is an authentication result, not permission to resend an MCP call automatically.

## Ownership {#ownership}

The caller owns token stores, browser openers, and HTTP clients. The transport factory owns the protocol session after construction. Close or replace those resources deliberately when a binding is reconfigured.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned auth package](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/). Auth and transport tests cover origin, token, and redaction behavior; the deterministic adoption example uses a local stdio server.
