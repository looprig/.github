---
id: reference/packages/harness/identity
title: identity package · identity
description: Reference for Harness agent names, coordinates, provenance, and identity boundaries.
audience: developer
section: reference
order: 147
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# identity package · identity

Import path: `github.com/looprig/harness/pkg/identity`. Identity provides small, validated values used to correlate loops, turns, steps, sessions, and agents.

## Package role {#package-role}

`Coordinates` groups session, loop, turn, and step IDs. `AgentName` is the stable definition and delegate key. The package keeps provenance and human-readable names separate from mutable runtime state.

## Exported surface {#exported-surface}

The public types are `AgentName`, `Coordinates`, `Agency`, and `Cause`. Values are deliberately small and can be embedded in command, event, gate, and tool records.

### Functions and methods {#functions-and-methods}

Methods validate or format names and coordinate values; no constructor reaches into a session or store.

### Types {#types}

`Agency` identifies the actor class, `Cause` captures a bounded causal identity, and `Coordinates` preserves the exact runtime scope for an audit or error.

### Constants and variables {#constants-and-variables}

Agency values are closed enums. There is no global name registry; a Rig validates uniqueness when definitions are composed.

## Ownership and errors {#ownership-and-errors}

IDs are immutable values. A caller must not reuse a loop ID for a new child or substitute a display name for an identity coordinate. Invalid or empty names are rejected at the owning package boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned identity package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/identity/). The delegation example creates explicit planner and worker identities.
