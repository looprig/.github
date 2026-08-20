---
id: modules/eval
title: Eval
description: Run scenarios through targets, score observations, and persist a safe report projection.
audience: developer
section: modules
order: 13
publication: released
proofs:
  repository: release-github-com-looprig-eval
  description: release-github-com-looprig-eval
  dependencies: release-github-com-looprig-eval
  dependents: release-github-com-looprig-eval
  where-it-fits: release-github-com-looprig-eval
---

# Eval

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/eval` |
| Version | `v0.2.0` |
| GitHub | [looprig/eval](https://github.com/looprig/eval) |

## Description

Run scenarios through targets, score observations, and persist a safe report projection.

## Where it fits

Eval is useful on its own when an application needs to run cases against a target, score observations, and write redacted reports. Within Looprig, it evaluates [Inference](/docs/modules/inference) targets and can observe [Harness](/docs/modules/harness) behavior. Eval defines the evaluation domain; Pluto packages that domain into a complete qualification product.

## Dependencies

- [Core](/docs/modules/core)
- [Inference](/docs/modules/inference)

## Dependents

None.
