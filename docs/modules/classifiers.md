---
id: modules/classifiers
title: Permission classifiers and command safety
description: Use deterministic command-safety review as bounded evidence inside Harness gate policy.
audience: developer
section: modules
order: 16
publication: released
examples:
  - stage-13-classifier
proofs:
  boundary:
    - release-github-com-looprig-classifiers
    - release-github-com-looprig-harness
  composition:
    - release-github-com-looprig-classifiers
  lifecycle:
    - release-github-com-looprig-classifiers
  errors-and-limits:
    - release-github-com-looprig-classifiers
  runnable-proof:
    - release-github-com-looprig-classifiers
---

# Permission classifiers and command safety

Classifiers `v0.1.4` supplies `pkg/commandsafety`, a Harness permission classifier for prepared command execution. Install it with its released Core, Harness, and Inference dependencies. The package is an evidence and review layer, never an authority issuer.

## Boundary {#boundary}

`commandsafety.New` returns an immutable classifier after validating an inference client, a model with tool and structured-output capabilities, a policy revision, and an evidence policy. `Classifier.MarshalInput` and `ValidateResult` preserve the `PermissionReviewSubject` basis. `Classifier.Applies` uses the typed command capability. `pkg/catalog` is currently a scaffold with no exported construction API, so consumers must construct and register classifiers explicitly.

## Composition {#composition}

Register a classifier through Harness's `gate.PermissionClassifierSet`, configure the allowed evidence kinds and containment verifiers, then let Harness combine assessments with its trusted `PermissionReviewPolicy`. `StandardEvidence` supplies bounded read-only filesystem and Git observations. `DefaultPolicy` establishes deterministic category floors and absolute-human categories.

An assessment may explain why a request deserves review, but it cannot change the request's requirements, gate route, Sandbox profile, or security ceiling. Reconciliation only tightens. The trusted Harness decision remains the final authority.

## Lifecycle {#lifecycle}

Construct a classifier once per policy and model binding. Its Hustle definition is immutable, while each `PermissionReviewSubject` and result is per execution. Deterministic `Evaluate` runs caller-supplied responders and does not invoke the bound inference client, which keeps corpus evaluation offline and repeatable.

## Errors and limits {#errors-and-limits}

Handle `ConstructionError`, policy-floor failures, strict wire validation errors, and evaluation case failures with `errors.As`. Evidence output, model-facing rationale, subject bytes, category count, and review context are bounded. A caller-supplied policy may add absolute-human categories but cannot remove the classifier's safety floor.

## Runnable proof {#runnable-proof}

`stage-13-classifier` creates an offline model binding, supplies a data-exfiltration assessment, and proves the final decision is not locally eligible even when the model recommendation says allow. Run it with `node scripts/docs/run-examples.mjs`. Read the [pinned classifier source](https://github.com/looprig/classifiers/tree/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/) and [Harness gate evaluator](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evaluator.go).
