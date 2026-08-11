---
id: reference/packages/eval/eval
title: eval package · eval
description: Reference for the eval package at github.com/looprig/eval, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 400
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

# eval package · eval

Import path: `github.com/looprig/eval`. Package eval is an application-neutral framework for evaluating model-backed systems. It runs as ordinary Go code under `go test`, reusing the testing package for execution, comparison, failure reporting, parallelism, and CI while adding types for scenarios, targets, observations, evaluators, and reports.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CheckRequires`, `Error`, `Unwrap`, `Validate`

### Types {#types}

`ActionName`, `Assessment`, `AssessmentStatus`, `Attribute`, `ContentHash`, `ConversationExcerpt`, `Descriptor`, `DiagnosticEvidence`, `DuplicateEvaluatorNameError`, `DuplicateEvidenceError`, `DuplicateEvidenceKindError`, `DuplicateFindingError`, `DuplicateLabelError`, `DuplicateMeasurementError`, `DuplicateScenarioError`, `ErrorClass`, `Evaluator`, `EvaluatorRevision`, `Evidence`, `EvidenceID`, `EvidenceKind`, `EvidencePayloadError`, `EvidenceRef`, `Expectation`, `Fact`, `Finding`, `FindingCode`, `IndexRangeError`, `InvalidEnumError`, `Label`, `Measurement`, `MessageIndexRef`, `MessageRange`, `Method`, `Name`, `NilEvaluatorError`, `NilTargetError`, `Observation`, `Operation`, `OperationKind`, `OperationStatus`, `Provenance`, `RedactedExcerpt`, `ReferenceAnswer`, `Report`, `ReportValidationError`, `Revision`, `RunConfig`, `Sample`, `SampleReport`, `SampleSubjectMismatchError`, `Scenario`, `Scope`, `Severity`, `Sink`, `StatusConsistencyError`, `StructuredErrorReason`, `StructuredOutput`, `StructuredOutputError`, `StructuredOutputExpectation`, `Subject`, `SubjectKind`, `Suite`, `Summary`, `Target`, `TargetError`, `TimingEvidence`, `ToolCallExpectation`, `ToolOperationEvidence`, `Trace`, `Unit`, `UnknownEvidenceError`, `UsageEvidence`, `ValidationError`

### Constants and variables {#constants-and-variables}

`MaxActionNameBytes`, `MaxAssessmentEvidence`, `MaxAssessmentFindings`, `MaxAssessmentMeasurements`, `MaxAttributeValueBytes`, `MaxDescriptionBytes`, `MaxDescriptorRequires`, `MaxExcerptBytes`, `MaxExpectedToolCalls`, `MaxFactBytes`, `MaxFindingMessageBytes`, `MaxForbiddenActions`, `MaxHashBytes`, `MaxIDBytes`, `MaxLabelValueBytes`, `MaxNameBytes`, `MaxOperationAttributes`, `MaxReferenceAnswerBytes`, `MaxReferenceAnswers`, `MaxReportIDBytes`, `MaxRequiredFacts`, `MaxRevisionBytes`, `MaxScenarioInputMessages`, `MaxScenarioLabels`, `MaxTrials`

## Ownership and errors {#ownership-and-errors}

The eval package exposes `CheckRequires`, `Validate` as its main operations. Its exported typed failures include `DuplicateEvaluatorNameError`, `DuplicateEvidenceError`, `DuplicateEvidenceKindError`, `DuplicateFindingError`; classify them with errors.Is or errors.As. Report JSON redacts raw observations and target causes at its persistence boundary.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/eval/tree/v0.1.2/) and adjacent tests. The progressive entry `stage-23-eval` runs an exact evaluator, encodes and decodes a redacted report, then checks a qualification card; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-eval`.
