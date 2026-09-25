---
id: guides/evals/cases-and-runs/index
title: Cases and runs
description: Move from validated evaluation cases to bounded runs and durable results.
audience: developer
section: guides
order: 1
publication: released
proofs:
  choose-the-contract: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Cases and runs

The cases-and-runs section follows one evaluation from its durable definition
to its recorded result. Start with a `Scenario` and its optional expectation,
group scenarios into a revisioned `Suite`, then let `eval.Run` produce a report
of observations and assessments.

## Choose the contract

| Need | Continue with | What you will learn |
| --- | --- | --- |
| Define input, identity, revision, and expectations | [Cases and suites](/docs/guides/evals/cases-and-runs/cases-and-suites) | How validation keeps fixtures stable before a target runs. |
| Execute trials with cancellation and bounded workers | [Runs and results](/docs/guides/evals/cases-and-runs/runs-and-results) | How target errors, evaluator errors, and quality outcomes remain distinct. |
| Persist a safe canonical report | [Reporting](/docs/guides/evals/reporting) | How `report/v1` and `FileSink` preserve evidence without raw payloads. |

Keep the suite revision and target subject revision aligned. A mismatch is a
target-stage error, so a run cannot quietly evaluate evidence under the wrong
model or agent identity.

## Source

The case contract is defined in
[`scenario.go`](https://github.com/looprig/eval/blob/v0.2.2/scenario.go) and
[`suite.go`](https://github.com/looprig/eval/blob/v0.2.2/suite.go), and the
execution contract is in
[`run.go`](https://github.com/looprig/eval/blob/v0.2.2/run.go).

## Proof

Validation behavior is exercised by
[`scenario_test.go`](https://github.com/looprig/eval/blob/v0.2.2/scenario_test.go),
and run-stage behavior by
[`run_test.go`](https://github.com/looprig/eval/blob/v0.2.2/run_test.go).
