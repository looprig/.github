---
id: reference/packages/harness/gate
title: gate package · gate
description: Reference for Harness access evaluation, permission review, approval, and gate payload contracts.
audience: developer
section: reference
order: 143
publication: released
examples:
  - stage-12-gate-rules
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

# gate package · gate

Import path: `github.com/looprig/harness/pkg/gate`. Gate owns the durable domain envelope for human and policy gates and the generic three-state access evaluator.

## Package role {#package-role}

The package evaluates normalized requirements against structural access sources, rules, and optional approvers. It combines unmet gated requirements into one approval and carries review context, classifier assessments, and audit data without importing Sandbox or a concrete tool module.

## Exported surface {#exported-surface}

Important values include `AccessBinding`, `AccessSource`, `Evaluator`, `Resolution`, `Gate`, `GateResponse`, `ApprovalAction`, `ApprovalPrompt`, `PermissionReviewSubject`, `PermissionReviewPolicy`, `PermissionAssessment`, `PermissionClassifier`, `PermissionClassifierSet`, review context and basis types, payload interfaces, form schemas, and audit types. `NewHeadlessEvaluator`, `NewInteractiveEvaluator`, `NewAccessBindings`, `NewPermissionReviewSubject`, `DefaultPermissionReviewPolicy`, `EvaluatePermissionAssessment`, and `CombinePermissionAssessments` are the main constructors and decisions.

### Functions and methods {#functions-and-methods}

Validation and codec functions cover requests, gates, payloads, approval actions, review contexts, categories, classifier names, forms, and response audits. `MarshalPayload` and `UnmarshalPayload` preserve the sealed payload union.

### Types {#types}

Typed errors classify access, gate validation, payload codec, evaluation, open URL, form, classifier panic, and review failures. `ReviewDecision` keeps eligibility separate from the model's recommendation.

### Constants and variables {#constants-and-variables}

Access versions, grant version, gate kinds, approval actions, review risk and authorization values, truncation masks, and bounded review limits are exported. These values are wire-compatible contracts.

## Ownership and errors {#ownership-and-errors}

Tools own request preparation; gate owns decision policy; the enforcing consumer owns grants and OS effects. Check deny-before-allow and preserve one gate identity through answer and audit. Use `errors.Is` and `errors.As`; do not branch on display text.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned gate evaluator](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/). `stage-12-gate-rules` proves deny precedence and `stage-13-classifier` proves a classifier recommendation cannot expand authority.
