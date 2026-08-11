---
id: reference/packages/acp/protocol
title: protocol package · protocol
description: Reference for ACP JSON-RPC framing, typed methods, capabilities, sessions, tools, terminals, and faults.
audience: developer
section: reference
order: 193
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions-and-methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants-and-variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# protocol package · protocol

Import path: `github.com/looprig/acp/protocol`. Protocol is the pure ACP and JSON-RPC wire layer.

## Package role {#package-role}

`Conn` reads bounded newline-delimited frames, parses JSON-RPC envelopes, dispatches registered handlers, and serializes writes. `AgentConn` and `ClientConn` provide typed ACP calls over that connection. Generated types and methods encode the pinned schema vocabulary.

## Exported surface {#exported-surface}

The package includes `Conn`, `FrameReader`, `Writer`, `Envelope`, `Request`, `Response`, `Notification`, `Fault`, `Error`, ACP capability and session types, file and terminal request/response types, prompt and permission types, MCP server descriptors, content blocks, plans, modes, and `AgentConn`/`ClientConn`. Constructors include `NewConn`, `NewFrameReader`, `NewWriter`, `NewAgentConn`, `NewClientConn`, `ParseEnvelope`, `NewNumberID`, and `NewStringID`.

### Functions and methods {#functions-and-methods}

Typed connection methods call or notify ACP RPCs; fault helpers convert wire errors. Default capability constructors produce explicit advertised sets.

### Types {#types}

Protocol values use bounded IDs, methods, versions, capabilities, messages, content, terminals, sessions, permissions, config options, and MCP server transports. `ConnClosedError`, `FrameTooLargeError`, `InvalidFrameError`, `TruncatedFrameError`, and `ReceiveSequenceOverflowError` classify wire failures.

### Constants and variables {#constants-and-variables}

Message, nesting, handler, notification, and send queue limits are stable wire bounds. Current protocol version and method sets are generated compatibility values.

## Ownership and errors {#ownership-and-errors}

Protocol treats every byte and field as untrusted. Validate frame size and nesting before decoding, use one writer for concurrent sends, and close the connection to stop dispatch. The package does not authenticate or authorize a host by itself.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned protocol package](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/). `stage-15-acp-foreign` consumes the protocol through the driver boundary.
