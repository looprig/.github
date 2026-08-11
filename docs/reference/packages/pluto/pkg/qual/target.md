---
id: reference/packages/pluto/pkg/qual/target
title: Pluto scripted target package
description: Deterministic scripted observations for offline Pluto qualification tests.
audience: developer
section: reference
order: 263
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/qual/target`

Deterministic target fixture in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target).

## Package role {#package-role}

The package implements a scripted `qual.Target` for offline table and profile tests. It replaces a provider call with a declared observation script; it is not a production provider.

## Exported surface {#exported-surface}

`Script` carries reply, duration, tool calls, structured result/error, and error. `NewScripted`, `Scripted`, `Name`, and `Observe` build and run the fixture. `Structured`, `StructuredErr`, `ToolCall`, and `UnscriptedScenarioError` expose the scripted evidence and missing-case failure.

## Lifecycle and errors {#lifecycle-and-errors}

The fixture is immutable after construction and has no network or close operation. A scenario revision must match the scripted target's revision. An unscripted scenario returns `UnscriptedScenarioError`; it does not fabricate an empty observation.

## Source proof {#source-proof}

See the pinned [scripted target source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target).
