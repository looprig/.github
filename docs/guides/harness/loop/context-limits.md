---
id: guides/harness/loop/context-limits
title: Context Limits
description: Describe context limits and counting configuration for a loop definition.
audience: developer
section: guides
order: 13
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  resolve-a-limit: [release-github-com-looprig-harness]
  occupancy: [release-github-com-looprig-harness]
  typed-errors: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Context Limits

Harness resolves a hard input-token limit from model metadata and an explicit
output reservation plus safety margin. The [Inference context-counting guide](/docs/guides/inference/context-counting) explains the exact, provider-backed, and conservative counters that supply request token counts. The pure limit helper is:

```go
func ResolveContextLimits(
	model model.ModelKey,
	limits model.ContextLimits,
	reservedOutput, safetyMargin content.TokenCount,
) (ResolvedContextLimits, error)

type ResolvedContextLimits struct {
	ReservedOutput content.TokenCount
	RawInputLimit  content.TokenCount
	InputLimit     content.TokenCount
}
```

The algorithm validates the model key and limits first. It clamps
`reservedOutput` to `MaxOutputTokens` when that metadata is present, then uses
`WindowTokens - reserved` when a window is known. If `MaxInputTokens` is known,
it takes the smaller nonzero value. Finally it subtracts `safetyMargin`.
Unknown or nonpositive results are rejected rather than guessed.

## Resolve a limit

```go
resolved, err := loop.ResolveContextLimits(
	model.Key(),
	contextLimits, // model.ContextLimits obtained from the selected model metadata.
	policy.ReservedOutput,
	policy.SafetyMargin,
)
if err != nil {
	var unknown *loop.ContextLimitUnknownError
	if errors.As(err, &unknown) {
		// Do not send a request whose denominator is unknown.
	}
	return err
}
fmt.Printf("input=%d output=%d margin=%d\n",
	resolved.InputLimit, resolved.ReservedOutput,
	resolved.RawInputLimit-resolved.InputLimit)
```

`InputLimit` is the admission denominator. `RawInputLimit` is the limit before
the safety margin, and `ReservedOutput` records the effective reservation.
The loop's context policy supplies those values; it does not silently invent a
timeout, output reservation, or margin.

## Occupancy

`OccupancyBasisPoints(used, limit)` returns
`floor(used * 10_000 / limit)` as `event.BasisPoints`, clamps at the full-scale
value when `used >= limit`, and returns `*loop.OccupancyError` for a zero
denominator. The multiplication is checked with 128-bit arithmetic so a large
token count cannot overflow the display calculation.

## Typed errors

| Error | Meaning | Useful field |
| --- | --- | --- |
| `*ContextLimitUnknownError` | invalid model/limits or no safe nonzero input denominator | `Model`, `Cause` |
| `*ContextLimitError` | an authoritative candidate request reached/exceeded the hard limit | `Measurement` |
| `*OccupancyError` | occupancy was requested with limit zero | `Limit` |

Use `errors.As`; do not parse model names or error strings. A context-limit
failure is an admission refusal, not permission to truncate an arbitrary
conversation.

## Source and proof

- [Context limit resolution and occupancy arithmetic](https://github.com/looprig/harness/blob/main/pkg/loop/context.go)
- [Context limit and occupancy tests](https://github.com/looprig/harness/blob/main/pkg/loop/context_test.go)
- [Admission-error measurement proof](https://github.com/looprig/harness/blob/main/pkg/loop/context_observation_test.go)
