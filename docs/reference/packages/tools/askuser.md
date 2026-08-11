---
id: reference/packages/tools/askuser
title: askuser package · askuser
description: Reference for the user-question tool.
audience: developer
section: reference
order: 161
publication: released
examples:
  - stage-03-pure-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# askuser package · askuser

Import path: `github.com/looprig/tools/askuser`. Askuser is a pure Harness tool that requests a user answer through the session's user-input requester.

## Package role {#package-role}

`NewAskUser` returns a tool with no filesystem, process, or network authority. The runtime supplies the requester through loop context; the tool does not open a UI or call a model.

## Exported surface {#exported-surface}

The package exports `AskUser` and `NewAskUser`. The root module exposes it as `AskUserDefinition`.

### Functions and methods {#functions-and-methods}

`NewAskUser` constructs the tool. Invocation validates the question and choices before requesting input.

### Types {#types}

`AskUser` implements the Harness tool contracts and returns bounded textual results or a typed user-input failure.

### Constants and variables {#constants-and-variables}

No package-global answer store or mutable UI state is exposed.

## Ownership and errors {#ownership-and-errors}

The session owns the requester and cancellation. A user response is not a permission grant; callers still need a gate for effectful tools.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned askuser package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/askuser/). Use `node scripts/docs/run-examples.mjs` for the progressive tool path.
