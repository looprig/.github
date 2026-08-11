---
id: concepts/flows-and-evaluation
title: Make durable work and evaluation explicit
description: Use Flow for resumable execution and Eval for reproducible evidence about its behavior.
audience: human
section: concepts
order: 5
publication: released
examples:
  - stage-17-flow
  - stage-23-eval
proofs:
  flow:
    - release-github-com-looprig-flow
  evaluation:
    - release-github-com-looprig-eval
  combined-proof:
    - release-github-com-looprig-flow
    - release-github-com-looprig-eval
---

# Make durable work and evaluation explicit

Flow describes what work may happen next and records checkpoints. Eval describes what an observation means and records a bounded assessment. They compose, but one is not a hidden test runner for the other.

## Flow {#flow}

Build a mutable graph, compile it into an immutable runner, and supply a checkpoint store. Interruptions become durable run state with a kind and optional resume payload. Resume loads the latest checkpoint and appends the continuation; it does not mutate an old checkpoint in place. The source-workspace `flow/store` adapter is a separate publication boundary.

## Evaluation {#evaluation}

An Eval Target observes one Scenario. Exact evaluators check deterministic properties such as required text, forbidden text, tools, structure, and operational timing. Judge evaluators use a rubric and a model intentionally. Reports retain safe identities, statuses, finite measurements, and redacted evidence, while `reportjson` drops raw conversation and causes.

## Combined proof {#combined-proof}

`stage-17-flow` proves interrupt and resume semantics. `stage-23-eval` proves exact scoring and redacted report round-trip against a scripted target. Use these as separate checkpoints when a system both executes durable work and evaluates its output.
