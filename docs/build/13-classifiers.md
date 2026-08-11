---
id: build/13-classifiers
title: Build 13: classifier evidence
description: Add deterministic command-safety review without allowing model recommendations or evidence to expand trusted authority.
audience: developer
section: build
order: 13
publication: released
examples:
  - stage-13-classifier
proofs:
  boundary:
    - release-github-com-looprig-classifiers
    - release-github-com-looprig-harness
  evidence:
    - release-github-com-looprig-classifiers
  reconciliation:
    - release-github-com-looprig-classifiers
    - release-github-com-looprig-harness
  errors-and-limits:
    - release-github-com-looprig-classifiers
  runnable-proof:
    - release-github-com-looprig-classifiers
---

# Build 13: classifier evidence

A permission classifier is a review component inside the gate boundary. It can inspect a prepared request and bounded evidence, classify risk, and recommend human review. It cannot mint a grant, rewrite the request, or turn a denied capability into an allowed one.

## Boundary {#boundary}

`commandsafety.Classifier` implements Harness's `gate.PermissionClassifier`. `New` binds an inference client, a structured-output-capable model, a policy revision, and an evidence-tool policy. `Applies` checks the typed `command.execute` requirement rather than a display name. `MarshalInput` creates the versioned model input; `ValidateResult` decodes and reconciles one result against the original `PermissionReviewSubject`.

The classifier package owns its prompt, wire codec, risk taxonomy, and read-only evidence catalog. The gate package still owns `PermissionReviewSubject`, classifier registration, and the final `ReviewDecision`.

## Evidence {#evidence}

`StandardEvidence` supplies bounded filesystem and Git observations. Filesystem tools are confined to the review workspace, and Git commands use fixed non-shell arguments. Evidence is observation, not authority. A consumer must explicitly allow the evidence requirement kinds through `rig.WithPermissionReviewEvidence`; the classifier does not bypass that configuration.

## Reconciliation {#reconciliation}

`DefaultPolicy` establishes risk floors and absolute-human categories. Reconciliation may tighten an allow recommendation to `needs_human`, but it never lowers risk, raises authorization, or changes a subject basis. Harness then evaluates the reconciled assessment with its own trusted policy and security ceiling. This two-step design keeps model output and evidence below the authority ceiling.

## Errors and limits {#errors-and-limits}

Construction rejects nil inference clients, invalid models, missing structured-output capabilities, empty policy revisions, incomplete absolute-human floors, and invalid evidence policies. Use `errors.As` for `ConstructionError`, `EvaluationError`, and the bounded case failure records. Deterministic evaluation uses supplied responders and does not call the classifier's bound inference client, so it is suitable for offline tests but is not a live model-quality measurement.

## Runnable proof {#runnable-proof}

`stage-13-classifier` builds an offline classifier, encodes a high-risk data-exfiltration assessment, validates it, and asserts that Harness marks it ineligible for local auto-approval. Run it with `node scripts/docs/run-examples.mjs`. Inspect the [pinned classifier](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/commandsafety.go), [evidence catalog](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/internal/evidence/catalog.go), and [reconciliation tests](https://github.com/looprig/classifiers/tree/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/).
