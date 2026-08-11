---
id: reference/packages/mcp/transport/stdio
title: transport/stdio package · stdio
description: Reference for supervised MCP child processes over stdio.
audience: developer
section: reference
order: 216
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions-and-methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants-and-variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# transport/stdio package · stdio

Import path: `github.com/looprig/mcp/pkg/transport/stdio`. Stdio launches an MCP server child and carries protocol messages over stdin/stdout.

## Package role {#package-role}

`New` returns a transport factory that owns process grouping, environment allowlists, bounded stderr, graceful close, termination, and reaping. It intentionally does not use the SDK command transport because the caller needs a confinement seam.

## Exported surface {#exported-surface}

Public values are `Config`, `EnvAllowlist`, `Var`, `ProcessSpec`, `ProcessLauncher`, `Process`, `ExitStatus`, `New`, and the default stderr limit.

### Functions and methods {#functions-and-methods}

`New` validates command and environment configuration. Factory methods create and close one child process for a client connection.

### Types {#types}

`Process` abstracts start, signal, wait, and close; `ExitStatus` preserves a bounded child result. Config errors are separate from protocol errors.

### Constants and variables {#constants-and-variables}

`DefaultStderrLimit` bounds diagnostics. Environment variables are passed only through an allowlist.

## Ownership and errors {#ownership-and-errors}

The factory owns each child after startup. Close the MCP client before closing the process so in-flight calls drain. A child is untrusted; stdout is protocol data and exit status is not authorization evidence.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned stdio transport](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/). `stage-16-mcp-adoption` uses it to run the deterministic child.
