---
id: reference/packages/acp/agent
title: agent package · agent
description: Reference for the ACP host facade that exposes Harness-backed sessions.
audience: developer
section: reference
order: 190
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

# agent package · agent

Import path: `github.com/looprig/acp/agent`. Agent translates ACP client calls into host-owned session, gate, filesystem, terminal, authentication, compaction, and runtime-configuration interfaces.

## Package role {#package-role}

`New` validates `Options` and registers only the handlers and capabilities the host supplies. It does not construct a Harness session or persist history itself.

## Exported surface {#exported-surface}

The surface includes `Agent`, `Options`, `Setup`, `LiveSession`, `SessionCatalog`, `SessionHost`, `SessionCloser`, `SessionDeleter`, `EventReplayer`, `Authenticator`, `Compactor`, `RuntimeConfigCatalog`, `RuntimeConfigController`, `LoadedSession`, and typed cursor, cwd, authentication, session, prompt, config, and MCP errors. `NewSetup` and `ParseSessionID` are helper constructors.

### Functions and methods {#functions-and-methods}

Agent handlers implement initialize, authenticate, logout, session new/load/resume/close/delete, prompt, cancel, permission, filesystem, terminal, compaction, config option, and mode operations according to advertised capabilities.

### Types {#types}

`Agent` owns a live-session registry and bounded limits for sessions, prompts, and pages. `LoadedSession` separates restore discovery from live session ownership.

### Constants and variables {#constants-and-variables}

Max live sessions, page size, mode option identity, and lifecycle sentinels are stable limits. Capability advertisement is derived from options, not a global feature flag.

## Ownership and errors {#ownership-and-errors}

The host owns sessions and durable history. Close drains prompts and gates before optional shutdown and registry removal; delete is separate and rejects a live session. Validate client-supplied IDs, paths, and options before invoking a host callback.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned agent facade](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/). `stage-15-acp-foreign` covers the related foreign builder composition.
