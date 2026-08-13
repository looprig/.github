---
id: examples/index
title: Overview
description: Build complete, runnable agent applications from Looprig modules.
audience: developer
section: examples
order: 1
publication: released
proofs:
  start: [release-github-com-looprig-harness, release-github-com-looprig-tools]
  choose-an-application: [release-github-com-looprig-harness, release-github-com-looprig-tools]
---

# Examples

These examples are complete applications, not isolated API fragments. Each one has its own Go module, immutable released dependencies, deterministic tests, an embedded skill, domain tools, a Harness Session, and a documented path to hosted or local models.

## Choose an application

| Application | What it teaches | Result |
| --- | --- | --- |
| [Weather Assistant](/docs/examples/weather-assistant) | Skill loading, domain tools, streaming turns, events, and model replacement | A conversational weather recommendation |
| [Research Assistant](/docs/examples/research-assistant) | A primary Loop, a delegated researcher Loop, retrieval, citations, and workspace artifacts | A cited Markdown brief |

Both run without API credentials so you can inspect the runtime behavior first. The scripted inference clients implement the same `inference.Client` boundary as OpenAI, Anthropic, Google, Bedrock, or a local model adapter.
