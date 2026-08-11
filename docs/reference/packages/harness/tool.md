---
id: reference/packages/harness/tool
title: tool package · tool
description: Reference for Harness tool definitions, preparation, requirements, bindings, process resources, and results.
audience: developer
section: reference
order: 155
publication: released
examples:
  - stage-03-pure-tool
  - stage-04-prepared-tool
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

# tool package · tool

Import path: `github.com/looprig/harness/pkg/tool`. Tool is the dependency-free contract between concrete tools, gates, loop binding, and the runtime.

## Package role {#package-role}

`Definition` describes immutable metadata and builds session-bound `InvokableTool` values. `CallPreparer` is the preparation boundary: it decodes untrusted arguments, normalizes them, and returns a typed `Request` and optional artifact before gate evaluation. `Requirements` and `Requirement` describe capability needs; `Bindings` supplies only session-scoped capabilities.

## Exported surface {#exported-surface}

Key values are `BaseTool`, `InvokableTool`, `Definition`, `Factory`, `Bindings`, `ToolInfo`, `ToolResult`, `Request`, `Requirement`, `RuleCandidate`, `PreparedCall`, `PreparedProcess`, `Process`, `WorkspaceBinding`, `ProcessBinding`, `DelegateController`, evidence factories, and session resource interfaces. Constructors include `NewDefinition`, `NewBundleDefinition`, `NewEvidenceDefinition`, `NewWorkspaceAccess`, `NewWorkspaceObservations`, and `TextResult`.

### Functions and methods {#functions-and-methods}

`ValidateRequest` checks normalized requirements and grant invariants; `SchemaDigest` canonicalizes a JSON schema; `BoundModelFacingErrorDetail` and `ModelFacingErrorDetail` protect persisted or rendered detail; `NewSessionResourceServices` validates lifecycle collaborators.

### Types {#types}

Optional capability interfaces distinguish command, argv, async process, workspace observation, lifecycle publication, delegation, evidence, and audit behavior. Typed errors cover invalid definitions/bindings, missing bindings, schema and request validation, nil built tools, produced-name drift, process state, and lifecycle metadata.

### Constants and variables {#constants-and-variables}

Capability and grant class strings, requirement bits, process state values, delegate statuses, model-facing and process diagnostic caps are stable contracts. A concrete tool must not invent a new authority kind without a gate and enforcement owner.

## Ownership and errors {#ownership-and-errors}

Tools own preparation artifacts for one call; the runner owns execution IDs and invokes preparation once. Harness owns the gate decision and response routing; the Sandbox or resource owner enforces effects. A missing preparer on an effectful tool fails closed.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned tool contract](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/). `stage-03-pure-tool` and `stage-04-prepared-tool` exercise the preparation split.
