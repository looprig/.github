---
id: build/09-evaluation
title: Build 09: evaluation
description: Define deterministic evaluation scenarios, run inference targets, and emit redacted reports with explicit scoring semantics.
audience: developer
section: build
order: 9
publication: released
examples:
  - stage-23-eval
proofs:
  boundary:
    - release-github-com-looprig-eval
    - release-github-com-looprig-inference
  composition:
    - release-github-com-looprig-eval
  domain-boundary:
    - release-github-com-looprig-eval
  targets-and-evaluators:
    - release-github-com-looprig-eval
    - release-github-com-looprig-inference
  reports-and-sinks:
    - release-github-com-looprig-eval
  lifecycle-and-errors:
    - release-github-com-looprig-eval
  lifecycle:
    - release-github-com-looprig-eval
  errors-and-limits:
    - release-github-com-looprig-eval
  runnable-proof:
    - release-github-com-looprig-eval
---

# Build 09: evaluation

Use Eval to make a model or loop measurable without hiding the target boundary. A scenario describes an input and expected observation, a target performs the operation under test, and an evaluator turns the observation into a result. Keep the target explicit so a report can distinguish application behavior from evaluator behavior.

## Domain boundary {#domain-boundary}

The root package defines scenarios, observations, targets, evaluators, runs, and reports. A `Target` is an interface boundary, not an implicit dependency on Inference. The `target/inference` adapter is the explicit bridge for invoking an `inference.Client`; another target can exercise a complete flow or a deterministic fixture.

## Targets and evaluators {#targets-and-evaluators}

Use `target/inference` when the evaluation question is about a model request and response. Use exact evaluation for deterministic equality or normalized content, and use judge evaluation only when model-based scoring is part of the experiment. Dataset helpers define repeatable cases, while `evaltest` provides test-oriented assertions and fixtures.

## Reports and sinks {#reports-and-sinks}

Run values capture observations, scores, failures, and metadata. The `reportjson` package encodes and decodes reports and provides a file sink. It redacts raw observations and error details at the report boundary, so reports can be retained or uploaded without becoming an accidental transcript store. Keep richer diagnostics in an access-controlled test system when they are necessary for debugging.

## Lifecycle and errors {#lifecycle-and-errors}

A run owns the target invocation and evaluator result for one scenario set. Make target setup and teardown part of the test harness lifecycle, and do not reuse mutable observations across runs. Distinguish target failures, evaluator failures, qualification failures, and report encoding failures; a score is not evidence that the target completed successfully when the run records an error.

## Runnable proof {#runnable-proof}

`stage-23-eval` runs the released Eval and Inference modules, emits the evaluation report, and asserts the qualification score. Run it with `node scripts/docs/run-examples.mjs`; implementation is pinned in the [Eval release tree](https://github.com/looprig/eval/tree/v0.1.2/) and [Inference release tree](https://github.com/looprig/inference/tree/v0.9.2/). Precise source and test proof IDs beyond the release records are pending Task15 evidence promotion.
