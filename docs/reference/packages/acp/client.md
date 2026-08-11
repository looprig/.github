---
id: reference/packages/acp/client
title: client package · client
description: Reference for driving ACP child sessions and handling their callbacks.
audience: developer
section: reference
order: 191
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

# client package · client

Import path: `github.com/looprig/acp/client`. Client drives an ACP child over a protocol connection and exposes one typed Session per ACP session ID.

## Package role {#package-role}

`New` creates a lazy client; `Dial` starts the supplied stdio command and shares one start attempt among concurrent callers. The client handles child-to-host session updates, permission requests, filesystem, and terminal operations when handlers are configured.

## Exported surface {#exported-surface}

Public values are `Client`, `Session`, `Options`, new/load/resume parameter values, `PromptResult`, `Update`, `UpdateMeta`, `InitializeMetadata`, handler interfaces, steering values, and typed closed, duplicate, load-timeout, not-dialed, set-model, and steering errors. `New`, `Dial`, and `DecodeUpdateMeta` are constructors and codecs.

### Functions and methods {#functions-and-methods}

Session methods cover `NewSession`, `LoadSession`, `ResumeSession`, `Prompt`, `Cancel`, `Updates`, and close. Prompt admission is one in flight per session; cancellation completes with a cancelled stop reason.

### Types {#types}

Update metadata supports deduplication in a bounded window. `SteerHandle`, `SteerParams`, and `SteerResult` keep steering admission and outcome explicit.

### Constants and variables {#constants-and-variables}

Update queues and deduplication windows are bounded; load has a 90-second timeout. These are safety limits, not a guarantee that a child will respond.

## Ownership and errors {#ownership-and-errors}

Client owns the connection and child lifecycle; injected handlers own host resources. Validate inbound session IDs and resource identifiers before callback invocation. Close sessions before the client and let the transport reap the child.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned ACP client](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/). `stage-15-acp-foreign` configures the client indirectly through the foreign ACP driver.
