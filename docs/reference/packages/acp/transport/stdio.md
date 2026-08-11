---
id: reference/packages/acp/transport/stdio
title: transport/stdio package · stdio
description: Reference for supervised ACP child processes over stdin and stdout.
audience: developer
section: reference
order: 194
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

# transport/stdio package · stdio

Import path: `github.com/looprig/acp/transport/stdio`. Stdio carries a protocol connection over a child process's standard streams.

## Package role {#package-role}

`Spawn` starts a validated `Command`, connects stdin/stdout to ACP, groups the child for teardown, and reaps it exactly once. `Serve` wires an agent process's own streams to a caller-created protocol connection.

## Exported surface {#exported-surface}

The package exports `Command`, `Proc`, `Spawn`, `Serve`, and typed command, platform, and child exit errors.

### Functions and methods {#functions-and-methods}

`Spawn` owns child startup and process-group shutdown; `Serve` blocks until the context, stream, or protocol connection ends.

### Types {#types}

`Proc` exposes close and wait behavior while preserving exit status. `CommandError`, `PlatformError`, and `ExitError` distinguish preflight, unsupported host, and child termination.

### Constants and variables {#constants-and-variables}

Process supervision is platform-specific and does not silently fall back on unsupported hosts.

## Ownership and errors {#ownership-and-errors}

The transport owns the child process after a successful spawn. Callers own command configuration and must close the Proc after client sessions drain. Child stdout is protocol data; stderr and exit status are bounded diagnostics.

## Source and runnable proof {#source-and-runnable-proof}

@@
Read the [pinned stdio transport](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/). The ACP and foreign runtime tests cover process lifecycle behavior.
