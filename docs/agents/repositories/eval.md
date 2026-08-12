---
id: agents/repositories/eval
title: Evaluation runs and reports
description: Execute suites against targets, apply exact or judge evaluators, and encode reports.
audience: agent
section: agents/repositories
order: 6
publication: released
proofs:
  module:
    - release-github-com-looprig-eval
---
# eval

`github.com/looprig/eval@v0.1.2` depends on `core` and `inference`. Build a `Suite` of scenarios, an `eval.Target`, and one or more `Evaluator` values, then call `eval.Run(ctx, RunConfig, suite, target, evaluators...)`. `target/inference.NewTarget` adapts an LLM client and request template.

Use `exact.Text`, `exact.Tool`, or forbidden-text evaluators for deterministic checks. Use `judge.New(rubric, client, template, options...)` when the evaluator itself is model-backed. `dataset.Load` and `dataset.Decode` read scenario data. `reportjson.Encode` and `Decode` provide the persisted report boundary; `reportjson.NewFileSink` writes run output.

A target error, evaluator error, invalid scenario, or report codec error ends the run with an error. Preserve the report and evaluator names so comparisons remain reproducible. Proofs: [`run.go`](https://github.com/looprig/eval/blob/1bcff49f926df4940db5f13e5b61915709f2227b/run.go), [`exact/text.go`](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/text.go), [`judge/judge.go`](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/judge/judge.go), [`reportjson/codec.go`](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/codec.go), [`examples/exact/example_test.go`](https://github.com/looprig/eval/blob/04df405b821f46f4a8ca0c9d19c4cbd6fa1e638e/examples/exact/example_test.go).
