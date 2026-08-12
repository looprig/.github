---
id: agents/composition/evals
title: Evaluate agent behavior
description: Run exact and judge evaluators, preserve evidence, compare reports, and write bounded JSON output.
audience: agent
section: agents/composition
order: 12
publication: released
proofs:
  eval:
    - release-github-com-looprig-eval
  pluto:
    - release-github-com-looprig-pluto
---
# Evaluation

Model behavior enters `eval` as a `Sample` or target observation. Compose a `Suite` of scenarios, a target such as `target/inference`, and evaluators, then call `eval.Run(ctx, config, suite, target, evaluators...)`. Exact evaluators include `exact.RequiredText`, `exact.ForbiddenText`, `exact.RequiredTool`, `exact.ForbiddenTool`, and `exact.SchemaResult`. `judge` evaluates a validated rubric with a model-backed or scripted judge. `evaltest.Run` and `RequirePass` fit Go tests.

Evidence is typed and bounded. An evaluator declares required evidence kinds; missing evidence yields an assessment rather than an unsafe pass. A `Report` preserves suite, target, evaluator revisions, samples, findings, and provenance. Call `Report.Validate` before storage. Use `reportjson.Encode` and `Decode`; `reportjson.NewFileSink(dir)` writes canonical redacted reports with bounded IDs and report bytes.

`pluto` is the pack, profile, scripted target, comparison, pricing, and CLI layer over evaluation. Use it when qualification needs packfiles and repeatable scripted scenarios, not as a replacement for `eval` domain contracts.

Lifecycle: validate suite and evaluator descriptors, run bounded target calls, collect evidence, build report, validate, then persist. Cancellation returns a report containing completed samples plus an error. Never average incompatible revisions or units. Match `ValidationError`, target errors, malformed report, and comparison errors with typed checks.

Proofs: [`eval/run.go`](https://github.com/looprig/eval/blob/1bcff49f926df4940db5f13e5b61915709f2227b/run.go), [`eval/exact/text.go`](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/exact/text.go), [`eval/reportjson/codec.go`](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/reportjson/codec.go), [`pluto/pkg/qual/target/scripted.go`](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted.go).
