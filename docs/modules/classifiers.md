---
id: modules/classifiers
title: Classifiers
description: Use deterministic command-safety review as bounded evidence inside Harness gate policy.
audience: developer
section: modules
order: 16
publication: released
proofs:
  repository: release-github-com-looprig-classifiers
  description: release-github-com-looprig-classifiers
  dependencies: release-github-com-looprig-classifiers
  dependents: release-github-com-looprig-classifiers
  where-it-fits: release-github-com-looprig-classifiers
---

# Classifiers

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/classifiers` |
| Version | `v0.2.0` |
| GitHub | [looprig/classifiers](https://github.com/looprig/classifiers) |

## Description

Use deterministic command-safety review as bounded evidence inside Harness gate policy.

## Where it fits

Classifiers are useful on their own when an application needs deterministic command-safety evidence. Within Looprig, they support permission decisions around [Harness](/docs/modules/harness) and prepared [Tools](/docs/modules/tools). A classifier reports bounded evidence; it does not grant authority or replace the gate that makes the final decision.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
