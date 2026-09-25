---
id: guides/evals/integration/index
title: Integration
description: Connect Evals to Inference, Harness adapters, deterministic fixtures, and Pluto qualification tooling.
audience: developer
section: guides
order: 8
publication: released
proofs:
  connect-a-target: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Integration

Integration keeps Evals' contracts stable while an application supplies the
target, model client, process, or qualification rollup. Choose the narrowest
adapter that can produce a validated `Observation`, then reuse the same cases,
evaluators, gates, and report format.

## Connect a target

| Integration need | Continue with | Boundary |
| --- | --- | --- |
| Call an Inference client and project typed evidence | [Composition and testing](/docs/guides/evals/integration/composition-and-testing) | `target/inference.NewTarget` owns request projection and subject identity. |
| Add capability-aware tables and scorecards | [Pluto qualification tooling](/docs/guides/evals/integration/pluto) | Pluto plans tables, executes Evals runs, and derives dispositions. |
| Choose the model request first | [Inference model selection](/docs/guides/inference/requests/model-selection) | The caller owns provider and model identity before composing the target. |

Deterministic scripted targets and fake clients should carry the contract tests.
Credential-gated provider tests then verify the live adapter seam without making
the qualification suite depend on network timing.

## Source

The public target seam is declared in
[`target.go`](https://github.com/looprig/eval/blob/v0.2.2/target.go), with the
Inference adapter in
[`target/inference/target.go`](https://github.com/looprig/eval/blob/v0.2.2/target/inference/target.go).

## Proof

The live adapter boundary is covered by
[`target_integration_test.go`](https://github.com/looprig/eval/blob/v0.2.2/target/inference/target_integration_test.go),
and deterministic test presentation by
[`evaltest/run.go`](https://github.com/looprig/eval/blob/v0.2.2/evaltest/run.go).
