---
id: modules/secrets
title: Secrets
description: Store secret values without making ordinary formatting or references disclose them.
audience: developer
section: modules
order: 2
publication: released
proofs:
  repository: release-github-com-looprig-secrets
  description: release-github-com-looprig-secrets
  dependencies: release-github-com-looprig-secrets
  dependents: release-github-com-looprig-secrets
  where-it-fits: release-github-com-looprig-secrets
---

# Secrets

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/secrets` |
| Version | `v0.2.0` |
| GitHub | [looprig/secrets](https://github.com/looprig/secrets) |

## Description

Store secret values without making ordinary formatting or references disclose them.

## Where it fits

Secrets are useful on their own when an application needs opaque references, redaction-safe values, and a replaceable secret store. Within Looprig, [Credentials](/docs/modules/credentials), [Inference](/docs/modules/inference), and [LLM](/docs/modules/llm) pass references instead of copying secret material into model configuration. Secrets protect representation and lookup boundaries; callers still control authorization and rotation policy.

## Dependencies

None.

## Dependents

- [Credentials](/docs/modules/credentials)
- [Inference](/docs/modules/inference)
- [LLM](/docs/modules/llm)
