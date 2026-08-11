---
id: reference/packages/foreignloops/driver/acp
title: driver/acp package · acp
description: Reference for adapting an ACP child to the foreign driver and Harness builder contracts.
audience: developer
section: reference
order: 202
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions-and-methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants-and-variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver/acp package · acp

Import path: `github.com/looprig/foreignloops/driver/acp`. This adapter translates ACP client sessions into the neutral foreign driver.

## Package role {#package-role}

`Driver` owns ACP client session setup, updates, prompts, cancellation, and history mapping for one foreign runtime. `Config` describes harness selection, executable, credentials, posture, workspace, and child MCP server definitions.

## Exported surface {#exported-surface}

The package exports `Driver`, `Config`, `Harness`, `New`, and live/restored builders with and without scoped services. Harness values include `HarnessClaudeCode` and `HarnessCodex`; builder functions are `BuildWith`, `BuildRestoredWith`, `BuildWithServices`, and `BuildRestoredWithServices`.

### Functions and methods {#functions-and-methods}

`New` validates config and constructs the driver; builders hand the driver to the backend and preserve the same profile for restore.

### Types {#types}

Config errors distinguish executable, harness, credential, posture, and workspace problems. The adapter does not expose ACP wire DTOs to Harness.

### Constants and variables {#constants-and-variables}

Harness selectors and posture labels are explicit configuration values. Child MCP servers are forwarded data, not parent adoption bindings.

## Ownership and errors {#ownership-and-errors}

The driver owns the ACP client and child session; foreign backend owns publication and restore; Harness owns gates and authority. Close the driver before removing the backend.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned ACP driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/). `stage-15-acp-foreign` registers its live and restored builders.
