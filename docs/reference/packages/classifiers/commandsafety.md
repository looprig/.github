---
id: reference/packages/classifiers/commandsafety
title: commandsafety package · commandsafety
description: Reference for command-safety classifier construction, evidence, reconciliation, and deterministic evaluation.
audience: developer
section: reference
order: 181
publication: released
examples:
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-classifiers
  exported-surface: release-github-com-looprig-classifiers
  functions-and-methods: release-github-com-looprig-classifiers
  types: release-github-com-looprig-classifiers
  constants-and-variables: release-github-com-looprig-classifiers
  ownership-and-errors: release-github-com-looprig-classifiers
  source-and-runnable-proof: release-github-com-looprig-classifiers
---

# commandsafety package · commandsafety

Import path: `github.com/looprig/classifiers/pkg/commandsafety`. Commandsafety reviews prepared command requests with bounded evidence and a structured model result.

## Package role {#package-role}

`New` validates the inference/model binding, policy revision, and evidence policy. The resulting `Classifier` implements Harness permission-classifier methods and preserves the subject basis through model input and output.

## Exported surface {#exported-surface}

Public values include `Classifier`, `Options`, `Policy`, `ReadEvidencePolicy`, `EvaluationCase`, `EvaluationOptions`, `ModelResponder`, `Report`, `ConfusionMatrix`, `CaseMismatch`, `CaseFailure`, and construction/evaluation error types. Functions include `DefaultPolicy`, `RequiredEvidenceKinds`, `StandardEvidence`, `EncodeAssessmentAsModelOutput`, `New`, and `Evaluate`. `Name`, `AbsoluteHumanCategoryFloor`, and `ErrPolicyMissingAbsoluteHumanFloor` are exported policy contracts.

### Functions and methods {#functions-and-methods}

`Applies`, `Name`, `Revision`, `Definition`, `MarshalInput`, and `ValidateResult` form the classifier contract. `Evaluate` runs deterministic caller-provided responders and records failures per case instead of aborting the whole corpus.

### Types {#types}

`ConstructionError` identifies an invalid field without echoing untrusted values. `Policy` carries risk floors, minimum authorization, and absolute-human categories. `Report` records false allows separately from false humans so dangerous regressions remain visible.

### Constants and variables {#constants-and-variables}

`Name` is `gate.command-safety`. The absolute-human floor always includes data exfiltration, prompt injection, authorization conflict, target ambiguity, and insufficient evidence; a caller can add categories but cannot remove these.

## Ownership and errors {#ownership-and-errors}

Classifier output is evidence. Reconciliation may tighten a recommendation to human review, never widen authority or alter the gate request. Evidence tools are read-only and workspace-confined; the caller must explicitly configure their requirement kinds.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned commandsafety package](https://github.com/looprig/classifiers/tree/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/). `stage-13-classifier` proves that an allow recommendation for data exfiltration is not locally eligible.
