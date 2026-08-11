---
id: reference/packages/harness/session
title: session package · session
description: Reference for live session contracts, restore decisions, gates, workspace recovery, and typed session failures.
audience: developer
section: reference
order: 153
publication: released
examples:
  - stage-07-session-events
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# session package · session

Import path: `github.com/looprig/harness/pkg/session`. Session exposes the live data-plane and control-plane contracts; `rig` owns construction and restoration.

## Package role {#package-role}

`Session` submits user input, exposes active loops, subscribes to events, answers gates, controls turns, and shuts down. `SessionController` and `GateHost` are narrower seams for serving and adapters. Restore deciders validate persisted identity, configuration fingerprints, runtime profiles, and workspace state before admitting a session.

## Exported surface {#exported-surface}

The package exports `Session`, `SessionController`, `GateHost`, `RestoreDecider`, `RestoreDecision`, `AcceptAllDecider`, `DefaultPolicyDecider`, restore discovery and runtime mismatch errors, `GateError`, `SessionError`, `TurnRejectedError`, and workspace recovery errors.

### Functions and methods {#functions-and-methods}

Interfaces expose session creation's result, event subscriptions, gate response, loop control, input submission, restore, and shutdown. Deciders return an explicit accept, reject, or policy decision.

### Types {#types}

`SessionErrorKind`, `GateErrorKind`, `RestoreErrorKind`, and discovery categories keep operational handling machine-readable. `ConfigMismatchError` and `AgentNameMismatchError` protect restore identity.

### Constants and variables {#constants-and-variables}

Restore tombstone and runtime-missing categories are stable strings. Limits and policy defaults remain owned by Rig and runtime packages.

## Ownership and errors {#ownership-and-errors}

The session owns live loops, gates, subscriptions, process resources, and external toolsets. A caller must answer or cancel a gate through the session that opened it. Restore rejection is safer than silently applying incompatible persisted state.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned session contracts](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/). `stage-07-session-events` and `stage-09-restore` cover live events and restoration.
