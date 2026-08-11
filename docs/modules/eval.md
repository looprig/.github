---
id: modules/eval
title: Evaluation domain, targets, and redacted reports
description: Run scenarios through targets, score observations, and persist a safe report projection.
audience: developer
section: modules
order: 13
publication: released
examples:
  - stage-23-eval
proofs:
  domain:
    - release-github-com-looprig-eval
  evaluators-and-targets:
    - release-github-com-looprig-eval
  report-boundary:
    - release-github-com-looprig-eval
  runnable-proof:
    - release-github-com-looprig-eval
---

# Evaluation domain, targets, and redacted reports

Eval `v0.1.2` defines scenario, observation, evaluator, assessment, evidence, suite, and report contracts. Install `github.com/looprig/eval@v0.1.2` with its released Core and Inference dependencies.

## Domain {#domain}

`Scenario` supplies a stable identity, revision, labels, input messages, and expectations. A `Target` turns that scenario into an `Observation`; an observation carries the conversation, subject identity, trace, operations, and evidence. `Assessment`, `Measurement`, `Finding`, and `EvidenceRef` describe one evaluator's result without making a verdict a free-form string. `Suite` groups scenarios and target/evaluator identities, while bounded validation protects names, labels, messages, evidence, and report sizes.

The root Eval package is intentionally independent of the Inference module. It can run against any target implementation. `target/inference` is the explicit adapter that clones an inference request template, appends the scenario input, calls an `inference.Client`, and projects the assistant message into an observation. Invalid identities, empty responses, failed inference, and invalid projections are typed and content-free.

## Evaluators and targets {#evaluators-and-targets}

The `exact` package provides deterministic text, structured-output, tool, and operational checks. The `judge` package builds a rubric-backed evaluator for model-based scoring, with bounded prompt and schema data. `dataset` handles bounded JSON datasets. `evaltest` supplies assertions and rendering helpers for evaluator tests. Use exact evaluators for gates that must be reproducible offline; use a judge only when a model is itself an intentional part of the evaluation and its trust boundary is explicit.

## Report boundary {#report-boundary}

`reportjson.Encode` writes a canonical `report/v1` projection. It redacts raw conversation text, tool arguments and results, finding messages, and target error causes while retaining safe identities, statuses, finite measurements, finding codes and severities, redacted evidence, timings, usage, and provenance. `Decode` validates size, UTF-8, one JSON value, known version, domain fields, and report invariants before returning the redacted view. `reportjson.FileSink` writes one report atomically under a fixed directory and rejects unsafe report IDs. The wire form is intentionally not a lossless observation round trip.

## Runnable proof {#runnable-proof}

`stage-23-eval` runs an exact text evaluator against a scripted target, encodes and decodes the redacted Eval report, then runs a qualification card and round-trips its report. Run it with `node scripts/docs/run-examples.mjs`. Native examples under `eval/examples/exact`, `judge`, and `report` cover the evaluator and report paths without a live provider.
