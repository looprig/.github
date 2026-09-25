---
id: guides/harness
title: Overview
description: Define Loops, assemble a Rig, run and restore Sessions, observe events, add gates and hooks, delegate work, and serve clients.
audience: developer
section: guides
order: 1
publication: released
proofs:
  start:
    - release-github-com-looprig-harness
  explore-the-harness-runtime:
    - release-github-com-looprig-harness
---

# Harness overview

Harness is the composition runtime. A Loop freezes one agent's model, instructions, tools, and limits. A Rig combines Loops with session storage, workspaces, gates, hooks, and delegation policy. A Session owns live turns, events, control commands, and shutdown.

```go
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
)
runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(sessions),
)
session, err := runtime.NewSession(ctx)
```

## Explore the Harness runtime

Follow the runtime from its public control surface into reusable configuration and live execution:

1. [Commands](/docs/guides/harness/commands) control a live Session, including submit, interrupt, approval, compaction, and shutdown.
2. [Events](/docs/guides/harness/events) expose the durable record emitted by those commands and by runtime execution.
3. [Step](/docs/guides/harness/step) is one model request followed by any tool calls and their results.
4. [Turn](/docs/guides/harness/turn) begins with one admitted user input and ends with a durable terminal event.
5. [Loop](/docs/guides/harness/loop) freezes one agent's model, instructions, tools, limits, and delegation choices.
6. [Rig](/docs/guides/harness/rig) assembles loops, storage, hooks, workspaces, gates, and Hustles.
7. [Session runtime](/docs/guides/harness/session-runtime) owns the live controllers, queues, subscriptions, resources, and shutdown boundary.
8. [Skills](/docs/guides/harness/skills) load reusable instructions on demand from curated embedded catalogs or gated project workspaces.
9. [Hustles](/docs/guides/harness/hustles) run bounded auxiliary inference for facilities such as compaction and permission review.
10. [Compaction](/docs/guides/harness/compaction) replaces an older transcript prefix with a validated summary and keeps a recent suffix verbatim.
11. [Session persistence](/docs/guides/harness/session-persistence) stores each Session's journal in the SessionStore format so it can be listed, replayed, and restored on another process.
12. [Tool-result capture](/docs/guides/harness/loop/tool-result-capture) keeps oversized tool results durable and lets the model page through them.

To serve Sessions to remote clients, run them on a [Host](/docs/modules/host) behind [Factory](/docs/modules/factory). The in-process [HTTP server](/docs/guides/harness/http-server) in `pkg/serve` is deprecated and kept only for existing deployments.

Start with [Build an agent with Harness](/docs/start/first-run), then build the [Weather Assistant](/docs/examples/weather-assistant) or [Research Assistant](/docs/examples/research-assistant). Use the [complete Harness module guide](/docs/modules/harness) for repository and dependency details.
