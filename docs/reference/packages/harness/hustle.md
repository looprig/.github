---
id: reference/packages/harness/hustle
title: hustle package · hustle
description: Reference for Harness bounded inference-and-tool hustle definitions, outcomes, retries, and evidence bindings.
audience: developer
section: reference
order: 146
publication: released
examples:
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# hustle package · hustle

Import path: `github.com/looprig/harness/pkg/hustle`. Hustle defines a bounded model-and-tool run used by classifiers, evaluation, and runtime support.

## Package role {#package-role}

`hustle.Definition` is immutable configuration for inference, system prompt, output schema, evidence tools, limits, policy revision, timeout, and retry policy. `Define` validates the declaration; a bound definition resolves the per-call model and tool context.

## Exported surface {#exported-surface}

Core values are `Definition`, `BoundDefinition`, `Request`, `Result`, `Outcome`, `Limits`, `ToolLoopLimits`, `InferenceBinding`, `EvidenceBindings`, `BoundEvidenceTool`, `RetryPolicy`, `Participation`, `Stage`, `ReasonCode`, `TerminalStatus`, and `RunID`. Options include `WithNamedInference`, `WithCurrentLoopModel`, `WithEvidenceTools`, `WithOutputSchema`, `WithLimits`, `WithTimeout`, `WithRetryPolicy`, and `WithPolicyRevision`.

### Functions and methods {#functions-and-methods}

`Define` constructs a definition. `ReasonAllowed` validates terminal-stage reasons; recoverable terminal validation helpers classify safe retry boundaries.

### Types {#types}

`DefinitionError`, `BindError`, `ResolveError`, `RevisionError`, and recoverable terminal validation errors distinguish declaration, binding, runtime resolution, and result failures.

### Constants and variables {#constants-and-variables}

Stage, reason, participation, retry, model source, and terminal status enums form a closed vocabulary. No package-global inference client is selected.

## Ownership and errors {#ownership-and-errors}

Definitions own immutable configuration; each bound run owns its request, result, and evidence tool instances. A hustle may retry according to its policy, but it must not replay a non-replayable external effect. Keep model-facing output bounded before persistence.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned hustle package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/). `stage-13-classifier` uses an offline inference boundary and a synthetic assessment.
