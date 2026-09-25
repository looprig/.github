---
id: guides/evals/cases-and-runs/runs-and-results
title: Runs and results
description: Execute suites with bounded trials, cancellation, and explicit result outcomes.
audience: developer
section: guides
order: 3
publication: released
proofs:
  the-result-pipeline: [release-github-com-looprig-eval]
  stage-errors-are-not-quality-failures: [release-github-com-looprig-eval]
  report-and-result-contracts: [release-github-com-looprig-eval]
  assessment-outcomes-and-gates: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Runs and results

`eval.Run` is the execution engine. It validates configuration, expands the
suite into sample units, observes each scenario, evaluates successful samples,
and returns a `Report` even when individual cases or evaluators fail. It is
non-fail-fast by design: a bad target call is recorded beside successful
siblings instead of erasing them.

```go
func runSuite(ctx context.Context, suite eval.Suite, target eval.Target) (eval.Report, error) {
	return eval.Run(ctx, eval.RunConfig{
		Trials:          3,
		Concurrency:     4,
		TargetTimeout:   2 * time.Second,
		EvaluatorTimeout: 500 * time.Millisecond,
	}, suite, target,
		exact.RequiredText("acknowledged"),
		exact.ForbiddenText("guaranteed"),
	)
}
```

The effective defaults are conservative:

| `RunConfig` field | Zero value | Validation |
| --- | --- | --- |
| `Trials` | One trial | Must be non-negative and no greater than `MaxTrials` (`1000`). |
| `Concurrency` | Sequential execution | Must be non-negative. Parallel work is opt-in. |
| `TargetTimeout` | No per-target timeout | Must not be negative. |
| `EvaluatorTimeout` | No per-evaluator timeout | Must not be negative. |

Preflight validates the config and suite, rejects a nil target, validates every
evaluator descriptor, and rejects duplicate evaluator names. An empty evaluator
list is allowed, but a successful sample with no assessments has not been
verified. The [testing gates](/docs/guides/evals/evaluators) treat that state as a failure.

## The result pipeline

For each scenario and trial, the runner follows this order:

1. Call `Target.Observe` with the scenario.
2. If observation or sample validation fails, store a typed `TargetErr` and skip
   evaluators for that sample.
3. Run evaluators in the order supplied to `Run`.
4. Check each descriptor's required evidence before calling its `Evaluate`.
5. Validate the returned assessment and verify its evaluator identity.
6. Store the resulting `SampleReport` in its predetermined slot.

Trials expand in scenario-major, trial-minor order. For example, two scenarios
with three trials produce `a#0`, `a#1`, `a#2`, `b#0`, `b#1`, `b#2`. The same
order is returned with `Concurrency: 1` and `Concurrency: 4`; workers write to
fixed slots and the runner compacts those slots after all started work joins.

## Stage errors are not quality failures

The runner keeps failure domains separate:

| Event | Stored result | Evaluators run? | Caller error |
| --- | --- | --- | --- |
| Target returns an error, times out, or returns an invalid observation | `SampleReport.TargetErr` | No | No, the run continues. |
| Evaluator returns an error | `Assessment{Status: StatusError}` with a safe finding | Siblings still run | No, the error is contained as data. |
| Evaluator returns an invalid assessment or wrong identity | Safe `StatusError` assessment under its descriptor | Siblings still run | No, the invalid verdict is discarded. |
| Context cancels before all units start | Completed samples remain in the report | Not-started units do not run | Yes, `context.Canceled` or `context.DeadlineExceeded`. |
| Preflight rejects config or inputs | Zero `Report` | No | Yes, a typed validation error. |

An evaluator failure is therefore not a `fail`. `fail` means the subject fell
short of a quality expectation. `error` means the evaluator could not reach a
verdict. `unverified` means required evidence was unavailable. This distinction
keeps infrastructure trouble from becoming a misleading quality score.

## Report and result contracts

```go
type SampleReport struct {
	ScenarioID  string
	TrialIndex  int
	Observation eval.Observation
	TargetErr   *eval.TargetError
	Assessments []eval.Assessment
}

type Summary struct {
	Samples      int
	TargetErrors int
	Assessments  map[eval.AssessmentStatus]int
}
```

`Report` adds an ID, suite and observed target revisions, timestamps, ordered
samples, `Summary`, and `Provenance`. Its derived ID is `suite-name@suite-revision`
unless a caller replaces it with a globally unique run ID. `Report.Validate`
checks sample identity, evaluator uniqueness, evaluator revision consistency,
summary counts, and provenance consistency before a report reaches a sink.

The summary is intentionally small. It counts samples, target-stage errors, and
assessment statuses. It is not a mean or a hidden pass rate. A downstream
consumer can compute a distribution from the retained measurements and trial
indices, or use the [Pluto scorecard](/docs/guides/evals/integration/pluto) when it needs dimension-level
rollups. Persist the resulting safe record with the [reporting guide](/docs/guides/evals/reporting).

## Assessment outcomes and gates

An assessment can be:

| Status | Interpretation | Measurement allowed? |
| --- | --- | --- |
| `pass` | The expectation was met. | Yes, finite values with declared units. |
| `fail` | The subject did not meet the expectation. | Yes. Findings explain the miss. |
| `unverified` (`StatusUnverified`) | No authoritative evidence was available. | No. Unknown cannot present a score. |
| `error` | The evaluator failed to decide. | No. Infrastructure failure is not quality. |
| `skipped` | The evaluator was intentionally not run. | No. |

`Finding` values carry a stable code, severity, bounded message, and evidence
references. `Measurement` values carry a unique name, finite number, and unit.
`Assessment.Validate` rejects duplicate names or codes, dangling evidence, a
serious finding on a pass, and measurements on `unverified`, `error`, or
`skipped` outcomes.

## Source

The runner and report contracts are in
[run.go](https://github.com/looprig/eval/blob/v0.2.2/run.go),
[suite.go](https://github.com/looprig/eval/blob/v0.2.2/suite.go), and
[report.go](https://github.com/looprig/eval/blob/v0.2.2/report.go). The report
assertions are exposed by
[evaltest/assert.go](https://github.com/looprig/eval/blob/v0.2.2/evaltest/assert.go).

## Proof

Execution, cancellation, timeouts, and fixed-slot ordering are implemented in
[run.go](https://github.com/looprig/eval/blob/v0.2.2/run.go) and covered by
[run_test.go](https://github.com/looprig/eval/blob/v0.2.2/run_test.go) and
[run_race_test.go](https://github.com/looprig/eval/blob/v0.2.2/run_race_test.go).
Report invariants live in
[report.go](https://github.com/looprig/eval/blob/v0.2.2/report.go) and
[report_test.go](https://github.com/looprig/eval/blob/v0.2.2/report_test.go);
status construction and consistency live in
[assessment.go](https://github.com/looprig/eval/blob/v0.2.2/assessment.go) and
[assessment_test.go](https://github.com/looprig/eval/blob/v0.2.2/assessment_test.go).
