---
id: reference/packages/mcp/transport/streamablehttp
title: transport/streamablehttp package · streamablehttp
description: Reference for MCP Streamable HTTP with origin pinning, bounded streams, and safe resumption.
audience: developer
section: reference
order: 217
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

# transport/streamablehttp package · streamablehttp

Import path: `github.com/looprig/mcp/pkg/transport/streamablehttp`. Streamable HTTP consumes a remote MCP server over POST plus SSE response streams.

## Package role {#package-role}

`New` configures an SDK transport with a caller-owned HTTP client, auth RoundTripper, TLS, body, stream, timeout, redirect, and session controls. It leaves OAuthHandler replay disabled so a 401 cannot resend a tool call.

## Exported surface {#exported-surface}

The API is `Config`, `Timeouts`, and `New`. Configuration controls endpoint, credentials, HTTP client, body and frame limits, stream deadlines, and cancellation.

### Functions and methods {#functions-and-methods}

`New` validates URL and security options and returns a transport factory. The SDK handles session ID, protocol version, DELETE, and Last-Event-ID response resumption.

### Types {#types}

`Timeouts` bounds dial, request, response, and stream frames. Transport errors are surfaced through MCP client failure classes.

### Constants and variables {#constants-and-variables}

Dial and stream defaults are bounded. Cleartext is limited to loopback, and redirects or server-selected origins cannot leave the configured origin.

## Ownership and errors {#ownership-and-errors}

The caller owns the HTTP client and auth provider; the factory owns protocol sessions. A dropped stream may be resumed by Last-Event-ID, but the request that caused it is never replayed by this transport.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Streamable HTTP transport](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/). Select it explicitly for remote MCP servers.
