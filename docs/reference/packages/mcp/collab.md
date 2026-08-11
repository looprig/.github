---
id: reference/packages/mcp/collab
title: collab package · collab
description: Reference for the bounded collaboration framing used by injected agent tools.
audience: developer
section: reference
order: 212
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions-and-methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants-and-variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# collab package · collab

Import path: `github.com/looprig/mcp/pkg/collab`. Collab defines capability-token and framed DTOs for the collaboration process without importing Harness or ACP domain types.

## Package role {#package-role}

The package owns handshake and frame encoding, capability-token validation, message-agent requests, and delegate results. It is intentionally a narrow broker wire boundary rather than a general-purpose RPC system.

## Exported surface {#exported-surface}

Public values include `Client`, `ClientConfig`, `ConfigFromEnv`, `DialFunc`, `MessageAgentRequest`, `PreparedMessageAgent`, `DelegateResult`, and constructors `New`, `NewClient`, `NewClientWithDialer`. Framing helpers include `ReadFrame`, `WriteFrame`, `ReadHandshake`, `WriteHandshake`, `EncodeCapabilityToken`, and `DecodeCapabilityToken`.

### Functions and methods {#functions-and-methods}

Decode and validate functions reject malformed or oversized requests before a dial or delegate operation.

### Types {#types}

Errors classify invalid requests, frames, capability tokens, and transport closure. DTOs carry bounded message content and an explicit target identity.

### Constants and variables {#constants-and-variables}

Endpoint environment names, frame sizes, and capability-token formats are stable process-boundary values.

## Ownership and errors {#ownership-and-errors}

The broker process owns its socket and capability token. Collab does not authorize a Harness tool or ACP child; the caller still routes the decoded request through its own gate and lifecycle policy.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned collaboration package](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/). Delegation and collaboration integration tests cover framing and validation.
