---
id: modules/inference
title: Inference
description: Invoke and stream model requests through explicit descriptors, codecs, retries, and a local gateway, with an optional per-conversation session identity.
audience: developer
section: modules
order: 15
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
| Version | `v0.13.0` |
| GitHub | [looprig/inference](https://github.com/looprig/inference) |

## Description

Invoke and stream model requests through explicit descriptors, codecs, retries, and a local gateway, with an optional per-conversation session identity.

## Where it fits

Inference is useful on its own when a Go application needs provider-neutral model requests, streaming, codecs, retries, routing, or a local model gateway. Within Looprig, it supplies the model boundary for [Harness](/docs/modules/harness), [LLM](/docs/modules/llm), [Eval](/docs/modules/eval), [Classifiers](/docs/modules/classifiers), [TUI](/docs/modules/tui), and [Host](/docs/modules/host).

`Request.SessionID` carries a stable conversation identity for providers that document a per-conversation header. It is validated for every provider, so an unsendable value fails the request locally instead of being altered in transit, and other providers ignore it. Inference moves model data; it does not own agent sessions or provider credential catalogs.

## Dependencies

- [Core](/docs/modules/core)
- [Credentials](/docs/modules/credentials)
- [Secrets](/docs/modules/secrets)

## Dependents

- [Classifiers](/docs/modules/classifiers)
- [Eval](/docs/modules/eval)
- [Foreign Loops](/docs/modules/foreignloops)
- [Harness](/docs/modules/harness)
- [Host](/docs/modules/host)
- [LLM](/docs/modules/llm)
- [MCP](/docs/modules/mcp)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
