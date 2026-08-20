---
id: build/25-evaluation
title: Evaluation and qualification
description: Run deterministic or inference-backed evaluations, preserve redacted reports, compare revisions, and qualify model capabilities with Pluto.
audience: developer
section: build
order: 25
publication: released
examples:
  - stage-23-eval
proofs:
  evaluation-model: release-github-com-looprig-eval
  targets-and-reports: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
  qualification: release-github-com-looprig-pluto
  runnable-proof: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Evaluation and qualification

This stage pins [eval module v0.1.2](https://github.com/looprig/eval/tree/ba758feb51fc22f009acf67dadfa692750e3cdd1) defines scenarios, targets, evaluators, assessments, and reports. This stage pins [Pluto module v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4) turns those measurements into capability scorecards and profile dispositions. Evaluation output is an artifact of a run; it is not session state, a checkpoint, or model context.

## Evaluation model {#evaluation-model}

An `eval.Suite` contains bounded scenarios and an `eval.Evaluator` has versioned `Descriptor` metadata. A target produces an observation; evaluators produce `Assessment` values with pass, fail, skipped, unverified, or error status. `eval.Run` is non-fail-fast: one evaluator or scenario can fail while the report retains safe diagnostics. `evaltest.Run`, `RequirePass`, and `RequireVerified` are deterministic test helpers with intentionally different acceptance rules.

The exact evaluators cover required/forbidden text and tools, schema results, duration, and tool error rate. `judge.New` adds a rubric-backed structured-output evaluator, with typed errors for inference, malformed output, invalid requests, quote lookup, and score range. Required evidence is explicit: an evaluator returns unverified when its descriptor's `Requires` are absent rather than guessing.

## Targets and reports {#targets-and-reports}

`target/inference.NewTarget` appends the scenario input to a provider-neutral `llm.Request` template and records model identity, timing, messages, tool calls, structured output, and safe error classification. `target/Scripted` is the offline fixture target; its scenario revision must match and an unscripted case is an error.

`reportjson.Encode` and `Decode` use a strict, redacted `eval-report/v1` document. The 64 MiB report bound, valid UTF-8 check, one-JSON-value check, version check, and domain validation happen before the decoded report is trusted. `reportjson.FileSink` writes reports under a fixed directory with path containment checks. A report is an immutable evaluation artifact; model context remains inside the target trace and is redacted before persistence.

## Qualification {#qualification}

Pluto's `qual.Manifest` records target identity, role, provider, model, API format, endpoint class, effort, revision, and capabilities. A `qual.Pack` names tables; `run.Execute` runs them with explicit target selection and bounded table concurrency, preserving skipped capability tables. `profile.Evaluate` applies requirements and restrictions to a scorecard and returns Qualified, Restricted, Rejected, or Unverified. `compare.Compare` aligns baseline and candidate tables by pack and table, retaining unmatched and skipped cases instead of dropping them.

The packfile loader is a strict, size-capped YAML boundary. `gen.Generate` validates the requested table and scenario count before making one structured-output call, and returns accepted scenarios plus typed rejections. Pricing snapshots are capped at 8 MiB; `pricing.Preflight` surfaces incomplete rates and unknowns before paid evaluation. `ratelimit.New` retries only bounded 429, 5xx, and network failures with exponential full jitter.

## Runnable proof {#runnable-proof}

The reviewed evaluation fixture prints a passing exact evaluation report and a Qualified Pluto capability report. The [eval release source](https://github.com/looprig/eval/tree/ba758feb51fc22f009acf67dadfa692750e3cdd1) and [Pluto release source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4) are the pinned declarations behind this page; the nested `cmd/pluto` module is separately released at [cmd/pluto/v0.1.2](https://github.com/looprig/pluto/tree/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto).
