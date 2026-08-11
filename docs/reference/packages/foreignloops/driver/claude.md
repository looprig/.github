---
id: reference/packages/foreignloops/driver/claude
title: driver/claude package · claude
description: Reference for the Claude CLI foreign-agent driver.
audience: developer
section: reference
order: 203
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

# driver/claude package · claude

Import path: `github.com/looprig/foreignloops/driver/claude`. Claude constructs a neutral `driver.Agent` around an explicitly configured CLI process.

## Package role {#package-role}

`NewAgent` resolves provider configuration and a parent environment. Per-turn cwd, prompt, posture, and session selection remain in `driver.Turn`; transcript paths stay private to the driver.

## Exported surface {#exported-surface}

Public values are `Config`, `CommandWrapper`, `NewAgent`, and path, platform, spawn, wrap, and config error types.

### Functions and methods {#functions-and-methods}

`NewAgent` validates command and environment configuration before any provider process starts. The returned Agent creates and closes streams per turn.

### Types {#types}

`PathError`, `PlatformError`, `SpawnConfigError`, and `WrapError` preserve provider setup and process failures without leaking raw command output.

### Constants and variables {#constants-and-variables}

No implicit environment inheritance or global Claude process is exposed.

## Ownership and errors {#ownership-and-errors}

The caller owns the parent environment and wrapper; the Agent owns child processes. Provider history is authoritative only when the driver can verify it.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Claude driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/). Use a scripted driver fixture for deterministic tests; the progressive proof uses the ACP adapter.
