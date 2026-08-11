---
id: reference/packages/harness/hook
title: hook package · hook
description: Reference for bounded Harness runtime hooks around calls, turns, tools, gates, inference, and persistence.
audience: developer
section: reference
order: 144
publication: released
examples:
  - stage-07-session-events
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# hook package · hook

Import path: `github.com/looprig/harness/pkg/hook`. Hook defines in-process interception for bounded runtime operations.

## Package role {#package-role}

Hooks surround an operation with a `BeginFunc` and `FinishFunc`, carrying typed call data rather than raw mutable runtime state. They are useful for tracing, policy observation, and deterministic instrumentation without making the hook package own execution.

## Exported surface {#exported-surface}

The package exports `Set`, `Runner`, `Around`, `Call`, `Result`, `Guard`, `GuardFunc`, `Denial`, and data values for inference, tools, turns, steps, compaction, gates, journal append, and configuration. `Compile` creates a runner; `Deny` creates a bounded denial error; clone and validation helpers preserve ownership.

### Functions and methods {#functions-and-methods}

`Compile`, `ValidateSet`, `ValidateCall`, `CloneCall`, `CloneResult`, `Deny`, and `AsDenial` are the primary operations.

### Types {#types}

Typed `CallError`, `CloneError`, `ConfigError`, `GuardError`, and denial values distinguish malformed hook configuration from a hook that deliberately rejected an operation.

### Constants and variables {#constants-and-variables}

Operation, record-family, step-index, and outcome enums are closed values. There is no implicit global hook set.

## Ownership and errors {#ownership-and-errors}

A hook may retain only the context and immutable copies returned by its begin function. Hooks run inside the caller's process and are not a Sandbox boundary. Treat panic-safe validation and hook errors as part of the surrounding operation's failure path.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned hook package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/). Hook behavior is covered by Harness's runtime tests; the progressive session examples show the surrounding event lifecycle.
