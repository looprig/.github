---
id: reference/packages/eval/evaltest
title: evaltest package · evaltest
description: Reference for the evaltest package at github.com/looprig/eval/evaltest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 403
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

# evaltest package · evaltest

Import path: `github.com/looprig/eval/evaltest`. Package evaltest integrates eval reports with Go's testing package. It presents a report through a *testing.T as subtests and provides report-level assertions (RequirePass, RequireVerified) for use in ordinary Go tests. All orchestration stays in github.com/lo

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`RequirePass`, `RequireVerified`, `Run`, `RunScenario`

### Types {#types}

`TB`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The evaltest package exposes `RequirePass`, `RequireVerified`, `Run`, `RunScenario` as its main operations. Use `Run` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/evaltest/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
