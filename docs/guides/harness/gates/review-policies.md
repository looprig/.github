---
id: guides/harness/gates/review-policies
title: Review policies
description: Set the local ceiling that governs automatic permission-review eligibility.
audience: developer
section: guides
order: 16
publication: released
proofs:
  policy-shape: [release-github-com-looprig-harness]
  assessment: [release-github-com-looprig-harness]
  decision: [release-github-com-looprig-harness]
  combine: [release-github-com-looprig-harness]
  configuration: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Review policies

The classifier recommends; the consumer-owned `gate.PermissionReviewPolicy` decides whether that recommendation is eligible for automatic one-shot approval. A policy is sealed by its constructor and is deliberately at least as restrictive as Harness's hard review ceiling.

## Policy shape

`PermissionReviewPolicy` has these exported fields:

| Field | Type | Contract |
| --- | --- | --- |
| `Revision` | `string` | Non-empty UTF-8 policy identity, at most `MaxPermissionReviewPolicyRevisionBytes` (128) bytes. |
| `MaximumAutoRisk` | `ReviewRisk` | `ReviewRiskLow`, `ReviewRiskMedium`, or `ReviewRiskHigh`; critical is never eligible. |
| `MinimumAuthorization` | `map[ReviewRisk]ReviewAuthorization` | Exactly low, medium, and high entries with monotonic authorization requirements. |
| `AbsoluteHuman` | `[]ReviewRiskCategory` | Categories that always require a human. |
| `MaterialTruncation` | `ReviewTruncationMask` | Context truncation bits that prevent automation. |

`NewPermissionReviewPolicy(revision, maximum, minimum, absoluteHuman, material)` validates and seals the value. `DefaultPermissionReviewPolicy(revision)` permits low and medium with unknown authorization and requires medium authorization for high, with `ReviewRiskHigh` as the maximum automatic risk. `Sealed()` reports whether a constructor seal is present; `rig.WithPermissionReviewPolicy` rejects an unsealed literal.

Risk constants are `ReviewRiskLow`, `ReviewRiskMedium`, `ReviewRiskHigh`, `ReviewRiskCritical`. Authorization constants are `ReviewAuthorizationUnknown`, `ReviewAuthorizationLow`, `ReviewAuthorizationMedium`, and `ReviewAuthorizationHigh`. Recommendation constants are `ReviewAllow` and `ReviewNeedsHuman`.

## Assessment

`PermissionAssessment` carries `Basis ReviewBasis`, `Risk ReviewRisk`, `Authorization ReviewAuthorization`, `Categories []ReviewRiskCategory`, `Recommendation ReviewRecommendation`, and `Rationale string`. Rationale is valid UTF-8, required for non-low risk, and bounded by `MaxPermissionReviewRationaleBytes = 2048`. Categories are validated by `ValidateReviewCategories`: only the 14 closed categories are accepted, with no duplicates and no more than `MaxReviewCategories = 14`.

`ReviewContext.Truncation.Material` and the policy's `MaterialTruncation` mask are both checked. A classifier cannot make material context loss disappear by recommending allow. The assessment basis must exactly equal the subject basis.

## Decision

`EvaluatePermissionAssessment(policy, subject, assessment)` returns `ReviewDecision{Eligible bool; Reason ReviewDecisionReason}`. It validates the subject digest, sealed policy, policy revision, basis, assessment, recommendation, truncation, risk ceiling, absolute-human categories, and authorization in that order. Reasons are closed: `ReviewDecisionEligible`, `ReviewDecisionInvalidPolicy`, `ReviewDecisionInvalidAssessment`, `ReviewDecisionBasisMismatch`, `ReviewDecisionRecommendation`, `ReviewDecisionRiskCeiling`, `ReviewDecisionAuthorization`, `ReviewDecisionAbsoluteHuman`, `ReviewDecisionMaterialTruncation`, `ReviewDecisionNoApplicableClassifier`, and `ReviewDecisionClassifierStatus`.

```go
package main

import "github.com/looprig/harness/pkg/gate"

func policy() (gate.PermissionReviewPolicy, error) {
    return gate.NewPermissionReviewPolicy(
        "permission-review/v1",
        gate.ReviewRiskHigh,
        map[gate.ReviewRisk]gate.ReviewAuthorization{
            gate.ReviewRiskLow: gate.ReviewAuthorizationUnknown,
            gate.ReviewRiskMedium: gate.ReviewAuthorizationUnknown,
            gate.ReviewRiskHigh: gate.ReviewAuthorizationMedium,
        },
        nil,
        0,
    )
}
```

An eligible decision is not a gate response. It is an input to the private session review path, which still rechecks observations and live basis before one-shot approval.

## Combine

`CombinePermissionAssessments(policy, classifiers, outcomes)` applies conjunctive semantics. Every ordered classifier contributes one outcome. Outcomes must carry the classifier's exact revision, a valid subject digest, the policy revision, and a unique common subject identity. An applicable non-allowed status returns `ReviewDecisionClassifierStatus`; an applicable allowed assessment is evaluated locally; a non-applicable outcome is neutral only with `ReviewStatusNotApplicable`; no applicable outcome returns `ReviewDecisionNoApplicableClassifier`.

This prevents one permissive classifier from overriding another applicable classifier's failure. It also prevents combining assessments produced for different tool executions, context revisions, security ceilings, or policy revisions.

## Configuration

The rig boundary wires this policy with `rig.WithPermissionReviewPolicy(policy)`. It must be paired with `rig.WithPermissionClassifiers(classifiers)`; either alone is an incomplete permission-review configuration. Evidence and security-ceiling options are required according to classifier definitions, while `rig.WithPermissionReviewObservations` is optional. `rig.Define` returns typed `*rig.DefinitionError` values for invalid, incomplete, missing, unused, or duplicate options.

Source: [`pkg/gate/review.go`](https://github.com/looprig/harness/blob/main/pkg/gate/review.go), [`pkg/gate/review_policy.go`](https://github.com/looprig/harness/blob/main/pkg/gate/review_policy.go), and option validation in [`pkg/rig/definition.go`](https://github.com/looprig/harness/blob/main/pkg/rig/definition.go). Policy and subject validation are covered by [`pkg/rig/hustle_fingerprint_test.go`](https://github.com/looprig/harness/blob/main/pkg/rig/hustle_fingerprint_test.go) and the permission-review option tests in [`pkg/rig`](https://github.com/looprig/harness/tree/main/pkg/rig).

## Source and proof

- [`PermissionReviewPolicy`](https://github.com/looprig/harness/blob/main/pkg/gate/review_policy.go)
- [`assessment combination`](https://github.com/looprig/harness/blob/main/pkg/gate/review.go)
- [`policy and fingerprint tests`](https://github.com/looprig/harness/blob/main/pkg/rig/hustle_fingerprint_test.go)
