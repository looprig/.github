---
id: guides/inference/context-counting/conservative-estimates
title: Conservative estimates
description: Use heuristic counts only when policy explicitly admits conservative quality.
audience: developer
section: guides
order: 87
publication: released
proofs:
  quality: [release-github-com-looprig-inference]
  estimate: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Conservative Estimates

`CountQualityHeuristicEstimate` is an explicit quality, not a synonym for an
exact tokenizer. Admission policy must decide whether that quality is safe for
the model's context limit.

## Quality

`CounterCapability.Quality` and `ContextCount.Quality` must agree. A counter
that returns a heuristic count while declaring exact quality is rejected by
`ContextCounterFunc`. A policy requiring exact quality must reject the result;
there is no automatic promotion or silent fallback.

| Quality | Meaning | Exact-only policy |
| --- | --- | --- |
| `CountQualityExactProvider` | endpoint-owned count | admitted |
| `CountQualityExactLocal` | local tokenizer count | admitted |
| `CountQualityHeuristicEstimate` | bounded estimate | rejected |
| `CountQualityUnknown` | no trust claim | invalid |

## Estimate

The bundled `Estimator` returns a heuristic estimate from the selected
dialect's complete encoded request. Its capability declares local transport,
no retention, a revision string, and heuristic quality. Consumers that admit
it should apply their own safety margin before comparing with a limit.

## Source and proof

- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.12.0/contextcount/contracts.go)
- [`contextcount/estimator.go`](https://github.com/looprig/inference/blob/v0.12.0/contextcount/estimator.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.12.0/contextcount/estimator_test.go)

Run `go test ./contextcount`.
