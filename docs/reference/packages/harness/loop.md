---
id: reference/packages/harness/loop
title: loop package · loop
description: Reference for immutable loop definitions, runtime catalogs, tool bindings, provenance, and live control.
audience: developer
section: reference
order: 149
publication: released
examples:
  - stage-05-loop
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

# loop package · loop

Import path: `github.com/looprig/harness/pkg/loop`. Loop separates immutable definition from live controller and backend behavior.

## Package role {#package-role}

`Definition` is built with `Define` and options for name, model, modes, tools, delegates, compaction, context transport, and limits. `BoundDefinition` carries session bindings without changing the source definition. `Controller`, `Handle`, and `Backend` are runtime seams.

## Exported surface {#exported-surface}

The public surface includes `Definition`, `BoundDefinition`, `Mode`, `ModeName`, `AgentHarnessName`, `RuntimeCatalog`, `RuntimeCatalogEntry`, `RuntimeProfileName`, `RuntimeSourceName`, `RuntimeSelectionKind`, `Provenance`, `ExternalToolset`, `Controller`, `Backend`, `Handle`, `Change`, `Delegation`, context and compaction policies, and `ToolLimits`. Options include `WithInference`, `WithTools`, `WithDelegates`, `WithModes`, `WithAccessGate`, `WithRuntimeCatalog`, and `WithPolicyRevision`.

### Functions and methods {#functions-and-methods}

`Define` freezes a declaration; `SelectBoundMode` and runtime/access override helpers create new bound values. Context, fingerprint, prepared-call, user-input, and provenance helpers attach scoped values to a context without mutating a definition.

### Types {#types}

Typed errors cover definition, bind, change, context limits, runtime catalog, compaction, summary, and input rejection. `Provenance` is the parent identity passed to delegated and foreign loops.

### Constants and variables {#constants-and-variables}

`ManagedInputQueueCapacity` and reserved tool-name rules are runtime limits. Runtime source and selection values are explicit strings used in fingerprints.

## Ownership and errors {#ownership-and-errors}

Definitions are safe to share; bindings and controllers are session-owned. Do not mutate an `ExternalToolset` in place while a turn is building. A runtime override is an attenuation or replacement selected by the owning session, never a model-facing authority expansion.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned loop package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/). `stage-05-loop` covers definition composition and `stage-14-delegation` covers provenance and quota.
