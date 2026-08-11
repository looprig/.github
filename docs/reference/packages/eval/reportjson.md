---
id: reference/packages/eval/reportjson
title: reportjson package · reportjson
description: Reference for the reportjson package at github.com/looprig/eval/reportjson, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 406
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

# reportjson package · reportjson

Import path: `github.com/looprig/eval/reportjson`. Package reportjson is the versioned, redacted JSON codec for eval reports and a file sink that persists them. It is the report's untrusted deserialization boundary: a report is one report/v1 envelope carrying an explicit version discriminator and a payload. De

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Decode`, `Encode`, `Error`, `Unwrap`, `Validate`, `WriteReport`

### Types {#types}

`DecodedTargetError`, `DirectoryError`, `EncodeError`, `FileSink`, `InvalidReportError`, `InvalidReportIDError`, `MalformedReportError`, `NonFiniteValueError`, `PathEscapeError`, `ReportTooLargeError`, `TargetErrorClass`, `UnknownVersionError`, `WriteError`

### Constants and variables {#constants-and-variables}

`MaxReportBytes`

## Ownership and errors {#ownership-and-errors}

The reportjson package exposes `Decode`, `Encode`, `Validate`, `WriteReport` as its main operations. Its exported typed failures include `DecodedTargetError`, `DirectoryError`, `EncodeError`, `InvalidReportError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/reportjson/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
