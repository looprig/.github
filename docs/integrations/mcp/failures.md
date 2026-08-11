---
id: integrations/mcp/failures
title: MCP failures and retry boundaries
description: Classify MCP configuration, auth, transport, discovery, schema, sampling, and invocation failures without unsafe replay.
audience: developer
section: integrations
order: 326
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  classes: release-github-com-looprig-mcp
  replay: release-github-com-looprig-mcp
  limits: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# MCP failures and retry boundaries

Use the typed failure class that identifies the failed boundary: invalid configuration, connection, protocol, authentication, discovery, schema, tool, sampling, cancellation, startup, or reconfiguration. Preserve server and binding identity in status without exposing credentials.

## Classes {#classes}

Client errors describe discovery and calls; transport errors describe endpoint or child state; Harness startup and binding failures describe adoption. A server handler error is distinct from a malformed request or an unknown tool. This distinction lets a product decide whether to disable a binding, ask for credentials, or report a failed tool result.

## Replay {#replay}

Do not retry a non-idempotent tool call because a connection or stream changed. Streamable HTTP can resume an already committed response with `Last-Event-ID`; it does not replay the request. Legacy SSE has no safe call replay and should be rebuilt deliberately.

## Limits {#limits}

Keep names, schemas, frames, bodies, stderr, queues, stream deadlines, and request time bounded. A limit error is a failed operation, not a reason to increase the bound based on untrusted input.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned client and transports](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/). `stage-16-mcp-adoption` covers a successful call and explicit disable path.
