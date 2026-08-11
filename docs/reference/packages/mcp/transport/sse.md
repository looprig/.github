---
id: reference/packages/mcp/transport/sse
title: transport/sse package · sse
description: Reference for explicitly selected legacy MCP HTTP plus SSE transport.
audience: developer
section: reference
order: 215
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

# transport/sse package · sse

Import path: `github.com/looprig/mcp/pkg/transport/sse`. SSE supports legacy MCP HTTP plus SSE endpoints that cannot yet move to Streamable HTTP.

## Package role {#package-role}

`New` returns a client transport factory only when the caller explicitly chooses this package. It shares TLS, origin, credential, body, frame, timeout, cancellation, and no-replay safeguards with the modern HTTP path.

## Exported surface {#exported-surface}

The package exports `Config`, `Timeouts`, and `New`. Configuration identifies the endpoint, auth seam, and bounded HTTP behavior.

### Functions and methods {#functions-and-methods}

`New` validates the endpoint and returns a factory. The server's endpoint event is origin-pinned before a POST or credential is sent.

### Types {#types}

`Config` and `Timeouts` keep legacy compatibility explicit; transport failures flow into MCP client failure classes.

### Constants and variables {#constants-and-variables}

Dial, stream, frame, and body defaults are bounded. No fallback from Streamable HTTP selects SSE.

## Ownership and errors {#ownership-and-errors}

The client owns the factory and HTTP session. A dropped SSE stream is not resumed because the legacy protocol has no safe Last-Event-ID call replay; the caller may rebuild the session deliberately.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned SSE transport](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/sse/). Use it only for an endpoint with a tested legacy contract.
