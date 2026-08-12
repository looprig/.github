---
id: modules/llm
title: LLM
description: Bind model descriptors to provider clients while keeping credentials outside model and request data.
audience: developer
section: modules
order: 12
publication: released
proofs:
  repository: release-github-com-looprig-llm
  description: release-github-com-looprig-llm
  dependencies: release-github-com-looprig-llm
  dependents: release-github-com-looprig-llm
  where-it-fits: release-github-com-looprig-llm
---

# LLM

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/llm` |
| Version | `v0.13.3` |
| GitHub | [looprig/llm](https://github.com/looprig/llm) |

## Description

Bind model descriptors to provider clients while keeping credentials outside model and request data.

## Where it fits

LLM is useful on its own when an application wants ready provider clients backed by explicit model descriptors and credentials. Within Looprig, it turns [Inference](/docs/modules/inference) contracts and [Credentials](/docs/modules/credentials) into clients that [Harness](/docs/modules/harness) applications can select. LLM owns provider construction; Inference retains the neutral request and response model.

## Dependencies

- [Core](/docs/modules/core)
- [Credentials](/docs/modules/credentials)
- [Inference](/docs/modules/inference)
- [Secrets](/docs/modules/secrets)

## Dependents

None.
