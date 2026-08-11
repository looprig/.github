---
id: reference/packages/foreignloops/driver/codex
title: driver/codex package · codex
description: Reference for the Codex CLI foreign-agent driver and explicit sandbox/approval posture.
audience: developer
section: reference
order: 204
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

# driver/codex package · codex

Import path: `github.com/looprig/foreignloops/driver/codex`. Codex constructs a neutral foreign Agent around an explicitly configured Codex CLI.

## Package role {#package-role}

`NewAgent` validates executable, approval policy, sandbox mode, and environment configuration. Per-turn prompt, cwd, and session selection remain owned by `driver.Turn`.

## Exported surface {#exported-surface}

The API includes `Config`, `ApprovalPolicy`, `SandboxMode`, `NewAgent`, and platform, spawn, and config error types. Approval and sandbox enums are explicit provider settings.

### Functions and methods {#functions-and-methods}

`NewAgent` performs configuration validation; streams normalize Codex v1 updates and expose provider history status.

### Types {#types}

`ApprovalPolicy` and `SandboxMode` do not override Harness gates or Sandbox profiles. `PlatformError` and `SpawnConfigError` classify setup failure.

### Constants and variables {#constants-and-variables}

Approval and sandbox values are closed enums. Codex v1 authoritative history is explicitly unavailable through the neutral contract.

## Ownership and errors {#ownership-and-errors}

The Agent owns the child process; the caller supplies environment and config. Do not treat provider approval or sandbox labels as evidence that the Harness authority ceiling changed.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Codex driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/). The deterministic ACP/foreign proof validates the builder seam without invoking Codex.
