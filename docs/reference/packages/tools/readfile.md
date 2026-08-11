---
id: reference/packages/tools/readfile
title: readfile package · readfile
description: Reference for bounded workspace file reads.
audience: developer
section: reference
order: 169
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

# readfile package · readfile

Import path: `github.com/looprig/tools/readfile`. Readfile reads bounded text from a permitted workspace path.

## Package role {#package-role}

`NewReadFile` binds a root, `loop.ReadGuard`, workspace observations, and options. It resolves a contained path and returns safe text or bounded metadata; `WithHostReads` explicitly requests the host-read variant.

## Exported surface {#exported-surface}

The API is `ReadFile`, `ReadFileOption`, `NewReadFile`, and `WithHostReads`. Root composition uses `tools.ReadFileDefinition`.

### Functions and methods {#functions-and-methods}

`NewReadFile` constructs the tool. Calls validate path containment and output bounds before opening a file.

### Types {#types}

`ReadFile` is read-only and reports path, permission, irregular-file, and size failures separately.

### Constants and variables {#constants-and-variables}

No host-read option or unbounded output is enabled by default.

## Ownership and errors {#ownership-and-errors}

The caller owns the guard and root. A symlink or path escape is a rejection, not a reason to retry from the process or host filesystem.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned readfile package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/readfile/). The prepared tool example covers the boundary.
