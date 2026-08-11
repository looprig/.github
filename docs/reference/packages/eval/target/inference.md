---
id: reference/packages/eval/target/inference
title: inference package · target/inference
description: Reference for the inference package at github.com/looprig/eval/target/inference, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 408
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

# inference package · target/inference

Import path: `github.com/looprig/eval/target/inference`. Package inference implements the active-inference eval.Target: it drives a scenario's input thread through an inference.Client and projects the model's reply into an eval.Observation. It is one of the two eval packages (with judge/) permitted to depend on gith

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `NewTarget`, `Unwrap`

### Types {#types}

`EmptyResponseError`, `EmptyResponseReason`, `IdentityError`, `InferenceError`, `ObservationInvalidError`, `Option`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The inference package exposes `NewTarget` as its main operations. Use `NewTarget` as the package construction entry point when creating that value. Its exported typed failures include `EmptyResponseError`, `IdentityError`, `InferenceError`, `ObservationInvalidError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/target/inference/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
