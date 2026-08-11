---
id: integrations/mcp/support
title: MCP support posture
description: State what the reusable MCP module provides and what a product integration must own.
audience: developer
section: integrations
order: 329
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  module-scope: release-github-com-looprig-mcp
  product-ownership:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  limitations: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# MCP support posture

The released MCP module supplies typed client and server packages, auth seams, stdio, Streamable HTTP, legacy SSE, collaboration framing, and Harness adoption. It is a protocol and runtime library, not a promise that every remote server, OAuth provider, child agent, or product UI is supported.

## Module scope {#module-scope}

Support claims should name the selected package and transport. A local stdio server, an origin-pinned Streamable HTTP endpoint, and a legacy SSE endpoint have different lifecycle and retry behavior. ACP pass-through and parent adoption are separate integrations even when they carry the same server descriptor.

## Product ownership {#product-ownership}

The product owns endpoint configuration, credentials, model and user handlers, binding scope, gate rules, Sandbox profile, telemetry, and user-facing status. A Carbon integration can compose the released module, but Carbon must publish its own supported providers, defaults, and deployment policy rather than inheriting an unqualified support claim from MCP.

## Limitations {#limitations}

No transport authenticates a server merely because it connected. The module does not replay unsafe calls after a stream failure, does not convert classifier evidence into authority, and does not guarantee that an MCP schema's declared effect is harmless. Keep unsupported providers and untested endpoint modes visibly unsupported.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP release](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/). `stage-16-mcp-adoption` is the deterministic support proof for the local publish, consume, adoption, and disable path.
