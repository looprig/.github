---
id: reference/packages/eval/rubric
title: rubric package · rubric
description: Reference for the rubric package at github.com/looprig/eval/rubric, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 407
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

# rubric package · rubric

Import path: `github.com/looprig/eval/rubric`. Package rubric declares evaluation rubrics: the trusted definition of what "good" means for a model judge. A rubric names the quality being judged, the prose definition of it, the criteria a judge weighs, and the labeled anchor points that give the numeric sca

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `PassThreshold`, `ScoreRange`, `Validate`

### Types {#types}

`Anchor`, `Criterion`, `DuplicateCriterionError`, `Rubric`, `ValidationError`

### Constants and variables {#constants-and-variables}

`MaxAnchorDescriptionBytes`, `MaxAnchors`, `MaxCriteria`, `MaxCriterionDescriptionBytes`, `MaxDefinitionBytes`, `AnswerRelevanceV1`, `GoalAdherenceV1`, `GroundednessV1`, `InstructionAdherenceV1`, `InternetUseAppropriatenessV1`, `ToxicityV1`, `VulgarityV1`

## Ownership and errors {#ownership-and-errors}

The rubric package exposes `PassThreshold`, `ScoreRange`, `Validate` as its main operations. Its exported typed failures include `DuplicateCriterionError`, `ValidationError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/rubric/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
