---
id: reference/packages/tools/grep
title: grep package · grep
description: Reference for bounded recursive text search with direct argv execution.
audience: developer
section: reference
order: 166
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# grep package · grep

Import path: `github.com/looprig/tools/grep`. Grep searches permitted files with a fixed argv runner, not a shell.

## Package role {#package-role}

`NewGrep` binds a root, read guard, and optional argv runner. `WithHostReads` changes the read boundary; `WithArgvRunner` injects a deterministic runner for tests or an approved rg binary.

## Exported surface {#exported-surface}

The API is `Grep`, `GrepOption`, `NewGrep`, `WithHostReads`, and `WithArgvRunner`. Root composition uses `tools.GrepDefinition`.

### Functions and methods {#functions-and-methods}

`NewGrep` constructs the tool. It normalizes pattern, path, and limit arguments before invoking direct argv.

### Types {#types}

`Grep` is read-only. Runner and parse errors remain separate from a valid search with zero matches.

### Constants and variables {#constants-and-variables}

No shell command string or inherited host-read mode is global.

## Ownership and errors {#ownership-and-errors}

The caller owns the read guard and runner. A failed or unavailable rg process is not permission to fall back to shell execution.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned grep package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/grep/). The package tests cover direct argv and read-boundary behavior.
