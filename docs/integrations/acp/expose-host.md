---
id: integrations/acp/expose-host
title: Expose a Harness host through ACP
description: Provide ACP host interfaces around Harness sessions with capability-derived advertisement and separate restore ownership.
audience: developer
section: integrations
order: 302
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  host-interfaces: release-github-com-looprig-acp
  capabilities: release-github-com-looprig-acp
  ownership: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# Expose a Harness host through ACP

`agent.New` validates `agent.Options` and registers handlers over a caller-created protocol connection. The agent facade translates ACP requests into supplied session, history, gate, filesystem, terminal, authentication, compaction, and runtime-configuration interfaces.

## Host interfaces {#host-interfaces}

Provide only the interfaces backed by real product resources. The host owns session creation, durable history, and callbacks. `LoadedSession` separates restore discovery from live session ownership, so a client cannot treat a restored description as an already-running session.

## Capabilities {#capabilities}

Advertise capabilities from the options actually supplied. Adding a field to an initialize response does not create the corresponding host behavior. A handler must validate IDs, paths, cursors, and mode or configuration options before asking a Harness resource to act.

## Ownership {#ownership}

The agent owns its live-session registry and bounded request lifecycle, while the host owns sessions and stores. Close drains prompts and pending gates before optional host shutdown and registry removal. Delete is distinct from close and rejects a live session.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned host agent](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/). The ACP package tests cover advertised capabilities and session lifecycle; the deterministic foreign builder example proves the related composition boundary.
