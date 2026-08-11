---
id: reference/packages/eval/dataset
title: dataset package · dataset
description: Reference for the dataset package at github.com/looprig/eval/dataset, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 402
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

# dataset package · dataset

Import path: `github.com/looprig/eval/dataset`. Package dataset is the versioned JSONL codec for eval scenarios. It is the eval framework's untrusted deserialization boundary: a dataset file is one dataset/v1 envelope per line, each carrying an explicit version discriminator and a scenario payload. The code

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`DecodeRecord`, `Encode`, `EncodeRecord`, `Error`, `Unwrap`

### Types {#types}

`Dataset`, `DirectoryError`, `DuplicateScenarioError`, `EncodeError`, `FileTooLargeError`, `InvalidScenarioError`, `MalformedRecordError`, `OpenError`, `PathEscapeError`, `ReadError`, `RecordTooLargeError`, `UnknownVersionError`, `WriteError`

### Constants and variables {#constants-and-variables}

`MaxFileBytes`, `MaxRecordBytes`

## Ownership and errors {#ownership-and-errors}

The dataset package exposes `DecodeRecord`, `Encode`, `EncodeRecord` as its main operations. Its exported typed failures include `DirectoryError`, `DuplicateScenarioError`, `EncodeError`, `FileTooLargeError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/dataset/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
