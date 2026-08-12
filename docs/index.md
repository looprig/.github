---
id: index
title: Overview
description: Start building model-powered applications with Looprig modules for inference, agent runtimes, tools, persistence, sandboxing, workflows, protocols, and interfaces.
audience: human
section: home
order: 1
publication: released
proofs:
  build-with-looprig: [release-github-com-looprig-core, release-github-com-looprig-inference, release-github-com-looprig-harness]
  start-with-an-outcome: [release-github-com-looprig-harness, release-github-com-looprig-tools]
  choose-only-what-you-need: [release-github-com-looprig-inference, release-github-com-looprig-harness, release-github-com-looprig-sandbox]
---

# Overview

Looprig is a collection of composable Go modules for building model-powered applications. Start with a provider-neutral model call, add Harness when you need an agent runtime, then select tools, storage, sandboxing, workflows, protocols, and interfaces according to the product you are building.

## Build with Looprig

| Goal | Begin with |
| --- | --- |
| Call OpenAI, Anthropic, Ollama, or another model through one contract | [Inference](/docs/guides/inference/) |
| Run stateful turns, tools, events, sessions, gates, and delegation | [Harness](/docs/guides/harness/) |
| Add file, search, process, interaction, and task capabilities | [Tools](/docs/guides/tools/) |
| Confine child processes and verify native guarantees | [Sandboxing](/docs/guides/sandboxing/) |
| Add durable graphs, interruption, recovery, and workflow tools | [Workflows](/docs/guides/workflows/) |
| Connect terminal or browser consumers | [TUI](/docs/guides/tui/) and [Web UI](/docs/guides/web-ui/) |

## Start with an outcome

The [Getting Started tutorial](/docs/start/choose-a-path/) builds a coding assistant from an empty Go module. It connects a model, creates a Loop and Rig, runs a Session, adds read-only tools, persists history, manages a workspace, confines process tools, and exposes a CLI.

Every implementation step links to a runnable checkpoint and the deeper guide for its module.

## Choose only what you need

The modules have narrow responsibilities and compose through explicit interfaces. An application can use Inference without Harness, Harness without a browser client, or the Web UI with any frontend framework. Add a module when the application needs the boundary it owns.

When you need API-level detail, use the module guides in the left navigation and follow their source and runnable-example links.
