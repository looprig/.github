---
id: guides/harness/compaction/compaction-policy
title: Compaction Policy
description: Describe CompactionPolicy fields and validation.
audience: developer
section: guides
order: 15
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  exact-policy-api: [release-github-com-looprig-harness]
  field-requirements: [release-github-com-looprig-harness]
  counter-compatibility: [release-github-com-looprig-harness]
  request-identity: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Compaction Policy

`loop.CompactionPolicy` is the complete explicit policy attached to one Loop.
It supplies no timeout, threshold, output reservation, or summary budget
defaults.

## Exact policy API

```go
// package loop
type CompactionPolicy struct {
	Automatic        bool
	CounterPolicy    CounterPolicy
	CompactAt        event.BasisPoints
	RearmBelow       event.BasisPoints
	ReservedOutput   content.TokenCount
	SafetyMargin     content.TokenCount
	MaxSummaryTokens content.TokenCount
	CountTimeout     time.Duration
	Hustle           hustle.Name
}

func (p CompactionPolicy) Validate(contextcount.CounterCapability) error
func WithCompaction(CompactionPolicy) Option
```

`CounterPolicy` is `CounterPolicyUnknown`, `CounterPolicyRequireExact`, or
`CounterPolicyAllowConservative`.

Proof: [policy types and validation](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go) and [policy tests](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy_test.go).

## Field requirements

| Field | Requirement |
| --- | --- |
| `Automatic` | Enables threshold-triggered attempts when true. |
| `CounterPolicy` | Required for automatic mode; selects accepted count quality. |
| `CompactAt` | Automatic threshold, strictly below `event.FullScaleBasisPoints`. |
| `RearmBelow` | Automatic re-arm threshold, nonzero and strictly below `CompactAt`. |
| `ReservedOutput` | Positive output reservation used to resolve input limits. |
| `SafetyMargin` | Positive when the counter quality is heuristic. |
| `MaxSummaryTokens` | Positive summary output budget. |
| `CountTimeout` | Positive context count timeout. |
| `Hustle` | Valid named Hustle; Rig checks registration and compatibility. |

When `Automatic` is false, threshold and counter-policy checks are skipped, but
the common reservation, summary budget, timeout, Hustle, and heuristic margin
requirements remain.

Proof: [CompactionPolicy.Validate](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go) and [configuration tests](https://github.com/looprig/harness/blob/main/internal/loopruntime/context_config_test.go).

## Counter compatibility

| Policy | Accepted `contextcount.CountQuality` |
| --- | --- |
| `CounterPolicyRequireExact` | `CountQualityExactProvider`, `CountQualityExactLocal`. |
| `CounterPolicyAllowConservative` | Exact qualities plus `CountQualityHeuristicEstimate`. |
| `CounterPolicyUnknown` | None in automatic mode. |

`WithContextObservation` and `WithCompaction` are mutually exclusive. Both
install a context admission policy, and the Loop cannot select both.

Proof: [counter policy checks](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go) and [context option exclusivity tests](https://github.com/looprig/harness/blob/main/internal/loopruntime/context_config_test.go).

## Request identity

`loop.RequestFingerprintInput` contains `SystemRevision`,
`ToolPolicyRevision`, the full `model.Model`, `event.ContextBasis`,
`RuntimeContextRevision`, `CounterCapability`, and `InferenceCapability`.
`loop.RequestFingerprint` validates each field and returns a SHA-256 identity.
Changing any request-shape revision, model, basis, or capability invalidates a
previous compaction result.

Proof: [request fingerprint](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go) and [fingerprint tests](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy_test.go).

## Source and proof

- [Compaction policy source](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go)
- [Loop definition options](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Policy validation proof](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy_test.go)
