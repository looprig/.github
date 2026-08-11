---
id: reference/packages/eval/judge
title: judge package · judge
description: Reference for the judge package at github.com/looprig/eval/judge, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 405
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

# judge package · judge

Import path: `github.com/looprig/eval/judge`. Package judge implements the structured-output model judge: an eval.Evaluator that scores a sample's conversation against a rubric by calling an inference.Client with strict structured output. It is the first eval package permitted to depend on github.com/loop

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `New`, `Unwrap`

### Types {#types}

`InferenceError`, `MalformedOutputError`, `MessageIndexError`, `Option`, `QuoteNotFoundError`, `QuotedEvidence`, `RequestInvalidError`, `RubricInvalidError`, `ScoreOutput`, `ScoreRangeError`, `UnsupportedStructuredOutputError`

### Constants and variables {#constants-and-variables}

`MaxEvidenceQuotes`, `MaxQuoteBytes`, `MaxReasonBytes`, `ScoreSchemaRevision`, `ScoreSchemaV1`

## Ownership and errors {#ownership-and-errors}

The judge package exposes `New` as its main operations. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `InferenceError`, `MalformedOutputError`, `MessageIndexError`, `QuoteNotFoundError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/judge/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
