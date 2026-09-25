---
id: products/pluto
title: Pluto evaluation framework
description: Install Pluto and use capability packs, evaluation runs, profiles, pricing, reports, and CI qualification.
audience: [human, developer]
section: products
order: 3
publication: released
proofs:
  install: [release-github-com-looprig-pluto, release-github-com-looprig-pluto-cmd-pluto]
  run-pluto: release-github-com-looprig-pluto-cmd-pluto
  features: release-github-com-looprig-pluto
  capability-packs: release-github-com-looprig-pluto
  evaluation-runs: release-github-com-looprig-pluto
  qualification-profiles: release-github-com-looprig-pluto
  pricing-and-comparison: release-github-com-looprig-pluto
  reports: release-github-com-looprig-pluto
  ci-qualification: release-github-com-looprig-pluto
  repository: release-github-com-looprig-pluto
---

# Pluto evaluation framework

Pluto is an evaluation and qualification framework for models and agents. It runs repeatable capability checks, applies product requirements, compares candidates, and produces reports suitable for review or CI.

## Install

```sh
go install github.com/looprig/pluto/cmd/pluto@v0.2.1
```

## Run Pluto

Describe the target under test in a manifest and the product requirements in a profile, each a small YAML file, then run one or more pack directories against them. Provider credentials are resolved from the environment rather than copied into the manifest.

```sh
pluto run --manifest target.yaml --profile profile.yaml --packs packs/tool-use --out report.json
```

`pluto run` checks capabilities and prints a token and cost estimate before any paid call, then writes the report to `--out` (default `pluto-report.json`). It exits with status 3 unless the resulting disposition meets `--require`, which defaults to `qualified`.

## Features

### Capability packs

Versioned packs group checks for capabilities, operations, safety, structured output, and tool use. Teams can select the packs that match their product boundary.

### Evaluation runs

Pluto executes deterministic or model-backed scenarios with bounded concurrency. Partial and skipped results remain visible instead of being silently treated as passes.

### Qualification profiles

Profiles declare required capabilities and restrictions. Pluto evaluates a candidate against that policy and returns a disposition with the evidence for each decision.

### Pricing and comparison

Pricing preflight identifies unknown rates before paid evaluation begins. Comparison aligns candidate and incumbent scorecards without dropping unmatched tables.

### Reports

JSON reports use a versioned, bounded format that can be reviewed, stored, or passed to another system. Report errors are typed so automation can distinguish malformed, oversized, and unsupported data.

### CI qualification

Run Pluto in CI to prevent a model or agent change from shipping without the required capability and safety evidence. Treat the report as a release artifact, not as session history or model context.

## Repository

Read the framework, CLI, packs, and reports in the [`looprig/pluto` repository](https://github.com/looprig/pluto).
