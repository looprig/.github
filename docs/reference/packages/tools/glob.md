---
id: reference/packages/tools/glob
title: glob package · glob
description: Reference for bounded workspace globbing.
audience: developer
section: reference
order: 165
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

# glob package · glob

Import path: `github.com/looprig/tools/glob`. Glob lists workspace paths through a read guard.

## Package role {#package-role}

`NewGlob` binds a root and `loop.ReadGuard`; it resolves patterns inside the permitted workspace and returns bounded matches. `WithHostReads` is explicit and expands the read target beyond the normal workspace contract.

## Exported surface {#exported-surface}

The API is `Glob`, `GlobOption`, `NewGlob`, and `WithHostReads`. Root composition uses `tools.GlobDefinition`.

### Functions and methods {#functions-and-methods}

`NewGlob` constructs the tool; `WithHostReads` changes the requested read scope. Calls normalize patterns and cap result count and path size.

### Types {#types}

`Glob` is read-only and returns tool results rather than mutating files.

### Constants and variables {#constants-and-variables}

Pattern and result bounds are implementation limits; no host-read permission is implicit.

## Ownership and errors {#ownership-and-errors}

The caller owns the guard and workspace root. Invalid patterns, escapes, unreadable entries, and result limits must be reported rather than silently broadening the root.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned glob package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/glob/). The preparation examples cover read-only path handling.
