---
id: modules/credentials
title: Credentials
description: Build explicit credential sources from a secret-free catalog and injected dependencies.
audience: developer
section: modules
order: 3
publication: released
proofs:
  repository: release-github-com-looprig-credentials
  description: release-github-com-looprig-credentials
  dependencies: release-github-com-looprig-credentials
  dependents: release-github-com-looprig-credentials
  where-it-fits: release-github-com-looprig-credentials
---

# Credentials

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/credentials` |
| Version | `v0.2.1` |
| GitHub | [looprig/credentials](https://github.com/looprig/credentials) |

## Description

Build explicit credential sources from a secret-free catalog and injected dependencies.

## Where it fits

Credentials are useful on their own when an application needs explicit credential selection, acquisition, refresh, and invalidation without embedding secret values in configuration. Within Looprig, [Inference](/docs/modules/inference) and [LLM](/docs/modules/llm) use them to obtain provider authentication from [Secrets](/docs/modules/secrets). Credentials manage leases and refresh; provider clients decide how credentials are sent.

## Dependencies

- [Secrets](/docs/modules/secrets)

## Dependents

- [Inference](/docs/modules/inference)
- [LLM](/docs/modules/llm)
