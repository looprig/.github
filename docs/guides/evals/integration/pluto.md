---
id: guides/evals/integration/pluto
title: Pluto qualification tooling
description: Roll Evals runs into capability-aware tables, scorecards, and profile dispositions with Pluto.
audience: developer
section: guides
order: 10
publication: released
proofs:
  pluto-adds-capability-aware-qualification: [release-github-com-looprig-pluto]
  plan-before-execution: [release-github-com-looprig-pluto]
  scorecard-keeps-coverage-visible: [release-github-com-looprig-pluto]
  profiles-derive-dispositions: [release-github-com-looprig-pluto]
  run-through-the-shared-execution-core: [release-github-com-looprig-pluto]
  persist-a-pluto-result: [release-github-com-looprig-pluto]
  source: [release-github-com-looprig-pluto]
  proof: [release-github-com-looprig-pluto]
---

# Pluto qualification tooling

Pluto is the code-backed evaluation tooling that composes Evals into a larger
qualification result. It does not replace `eval.Run`: each runnable table
expands to one `eval.Suite`, uses the table's evaluator set, and retains the raw
per-table `eval.Report` behind the rollup. The underlying lifecycle is the Evals
[run and result contract](/docs/guides/evals/cases-and-runs/runs-and-results/).

## Pluto adds capability-aware qualification

The core objects are:

| Object | Contract |
| --- | --- |
| `qual.Manifest` | Secret-free target identity, provider/model metadata, endpoint class, revision, and capabilities. |
| `qual.Table` | A named, versioned scenario family with one dimension, required capabilities, and evaluators. |
| `qual.Pack` | A versioned set of tables with unique table names and scenario IDs. |
| `qual.TablePlan` | Preflight output that either carries a runnable suite and evaluators or records missing capabilities. |
| `qual.Scorecard` | Manifest plus executed and skipped `TableResult` values. |

Manifest fingerprints are stable hashes over canonical manifest JSON. Credentials
are not part of the manifest. Endpoint class limits what a result can claim to
have observed: remote targets expose requests, responses, tools, usage, timing,
and errors, while process targets can add process-level behavior through their
own target adapter.

## Plan before execution

`qual.Plan(pack, manifest)` validates both inputs, checks each table's required
capabilities, and preserves a non-runnable plan with its missing capabilities.
It performs no target work. A capability skip is visible coverage, not a dropped
case.

```go
plans, err := qual.Plan(pack, manifest)
if err != nil {
	return err
}
for _, plan := range plans {
	if !plan.Runnable {
		log.Printf("skip %s: missing %v", plan.Table, plan.Missing)
		continue
	}
	// Table.Suite expands exactly this table into the eval.Run input.
	report, err := eval.Run(ctx, eval.RunConfig{}, plan.Suite, target, plan.Evaluators...)
	if err != nil {
		return err
	}
	_ = report
}
```

The shared `pkg/run.Execute` path performs this plan-to-run transition for both
offline fixture targets and live per-table targets. Its `Spec` requires exactly
one of a shared `Target` or a `TargetForTable` factory, so a caller cannot
accidentally provide both or neither.

## Scorecard keeps coverage visible

`Scorecard.Dimensions()` rolls results up by dimension in stable name order:

* `pass` contributes one verdict and one pass.
* `fail` contributes one verdict and no pass.
* `unverified` and `error` contribute to the assessment denominator but not to
  quality or verdict count.
* `skipped` table results increase `SkippedTables` and do not enter the
  assessment denominator.
* A dimension with no verdicts is `Undecided`, never a silent zero and never a
  silent pass.

The score is `100 * passes / verdicts`. Coverage is `verdicts / assessments`,
so a high score with weak evidence remains visible as low coverage. The raw
reports remain available for finding counts, severity counts, and case-level
inspection.

```go
dims, err := result.Scorecard.Dimensions()
if err != nil {
	return err
}
for _, dim := range dims {
	fmt.Printf("%s score=%.1f coverage=%.2f undecided=%t\n",
		dim.Dimension, dim.Score, dim.Coverage, dim.Undecided)
}
```

## Profiles derive dispositions

`profile.Profile` contains mandatory requirements and optional restrictions.
`profile.Evaluate` is pure policy over a scorecard. Its precedence is explicit:

1. Any violated mandatory requirement yields `Rejected`.
2. Otherwise, any undecided mandatory requirement yields `Unverified`.
3. Otherwise, an unmet restriction yields `Restricted`.
4. Otherwise, the result is `Qualified`.

A minimum coverage requirement that cannot be met because evidence is missing is
undecided, not a demonstrated quality violation. A finding or severity count can
be a separate requirement with a maximum bound.

```go
minScore := 80.0
profile := profile.Profile{
	Name: "production-agent", Revision: "v1",
	Requirements: []profile.Requirement{{
		Dimension: "capability", MinScore: &minScore,
	}},
}
result, err := profile.Evaluate(card, profile)
if err != nil {
	return err
}
if result.Disposition != profile.Qualified {
	return fmt.Errorf("qualification disposition: %s", result.Disposition)
}
```

`Disposition.Rank` provides a separate worst-to-best ordering for callers that
need a minimum acceptable floor. It does not alter `Evaluate`'s derivation
precedence.

## Run through the shared execution core

Use `run.Execute` when you want Pluto to retain skipped plans, reports, and
partial results in one `Result`:

```go
result, err := run.Execute(ctx, run.Spec{
	Manifest: manifest,
	Packs:    []qual.Pack{pack},
	Target:   target, // A scripted target works for deterministic tests.
	Config:   eval.RunConfig{Trials: 2},
})
if err != nil {
	// A non-nil error means the overall execution did not complete, but result
	// may still carry reports for tables that already finished.
	return err
}
scorecard := result.Scorecard
```

For live tables, `run.BuildTarget` combines a caller-supplied inference client,
the table environment template, the manifest model, and the table revision into
the Evals [Inference target](/docs/guides/evals/integration/composition-and-testing/). For
Go tests, `plutotest.Run` wraps the same execution core and
`plutotest.RequireDisposition` gates an allowed set of profile outcomes.

## Persist a Pluto result

`pluto/pkg/reportjson` emits `pluto-report/v1`. It records the manifest and
fingerprint, dimension scores and coverage, status rollup, each table's
skipped/runnable state, optional profile result, and the embedded bytes from
Evals' own redacted `report/v1` codec. Decoding a table report therefore keeps
the same redaction behavior described in [Evals reporting](/docs/guides/evals/reporting/).

## Source

Planning and table expansion are implemented in
[pkg/qual/pack.go](https://github.com/looprig/pluto/blob/main/pkg/qual/pack.go).
Shared execution is in
[pkg/run/run.go](https://github.com/looprig/pluto/blob/main/pkg/run/run.go),
scorecard rollups are in
[pkg/qual/scorecard.go](https://github.com/looprig/pluto/blob/main/pkg/qual/scorecard.go),
and profile derivation is in
[pkg/profile/evaluate.go](https://github.com/looprig/pluto/blob/main/pkg/profile/evaluate.go).

## Proof

Planning, capability skips, and suite expansion are covered by
[pkg/qual/pack_test.go](https://github.com/looprig/pluto/blob/main/pkg/qual/pack_test.go).
Score and coverage semantics are covered by
[pkg/qual/scorecard_test.go](https://github.com/looprig/pluto/blob/main/pkg/qual/scorecard_test.go),
and disposition precedence by
[pkg/profile/evaluate_test.go](https://github.com/looprig/pluto/blob/main/pkg/profile/evaluate_test.go).
The shared run and Go test wrappers are
[pkg/run/run.go](https://github.com/looprig/pluto/blob/main/pkg/run/run.go) and
[pkg/plutotest/run.go](https://github.com/looprig/pluto/blob/main/pkg/plutotest/run.go).
