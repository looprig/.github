---
id: modules/inference
title: Inference
description: Invoke and stream model requests through explicit descriptors, codecs, retries, and a local gateway.
audience: developer
section: modules
order: 11
publication: released
proofs:
  repository: release-github-com-looprig-inference
  description: release-github-com-looprig-inference
  dependencies: release-github-com-looprig-inference
  dependents: release-github-com-looprig-inference
  where-it-fits: release-github-com-looprig-inference
---

# Inference

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/inference` |
| Version | `v0.12.0` |
| GitHub | [looprig/inference](https://github.com/looprig/inference) |

## Description

Invoke and stream model requests through explicit descriptors, codecs, retries, and a local gateway.

## Where it fits

Inference is useful on its own when a Go application needs provider-neutral model requests, streaming, codecs, retries, routing, or a local model gateway. Within Looprig, it supplies the model boundary for [Harness](/docs/modules/harness), [Eval](/docs/modules/eval), [Tools](/docs/modules/tools), and [Workflows](/docs/modules/workflows). Inference moves model data; it does not own agent sessions or provider credential catalogs.

## Dependencies

- [Core](/docs/modules/core)
- [Credentials](/docs/modules/credentials)
- [Secrets](/docs/modules/secrets)

## Dependents

- [Classifiers](/docs/modules/classifiers)
- [Eval](/docs/modules/eval)
- [Foreign Loops](/docs/modules/foreignloops)
- [Harness](/docs/modules/harness)
- [LLM](/docs/modules/llm)
- [MCP](/docs/modules/mcp)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
