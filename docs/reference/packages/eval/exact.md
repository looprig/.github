---
id: reference/packages/eval/exact
title: exact package · exact
description: Reference for the exact package at github.com/looprig/eval/exact, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 404
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-eval
  exported-surface: release-github-com-looprig-eval
  functions-and-methods: release-github-com-looprig-eval
  types: release-github-com-looprig-eval
  constants-and-variables: release-github-com-looprig-eval
  ownership-and-errors: release-github-com-looprig-eval
  source-and-runnable-proof: release-github-com-looprig-eval
---

# exact package · exact

Import path: `github.com/looprig/eval/exact`. Package exact provides deterministic, programmatic evaluators over the typed core/content conversation and eval evidence. Every evaluator here satisfies eval.Evaluator, declares a stable Descriptor with Method eval.MethodProgrammatic, and reaches its verdict f

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`ForbiddenText`, `ForbiddenTool`, `MaxDuration`, `NoToolCall`, `RequiredText`, `RequiredTool`, `SchemaResult`, `ToolErrorRate`

### Types {#types}

`RateOption`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The exact package exposes `ForbiddenText`, `ForbiddenTool`, `MaxDuration`, `NoToolCall` as its main operations. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/exact/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
