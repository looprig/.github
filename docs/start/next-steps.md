---
id: start/next-steps
title: Choose an interface and extend the agent
description: Keep the coding assistant runtime and choose a TUI, Web UI, ACP or MCP protocol boundary, Workflows, and evaluation according to the product you are building.
audience: developer
section: start
order: 10
publication: released
proofs:
  choose-an-interface: [release-github-com-looprig-tui, release-github-com-looprig-client]
  expose-a-protocol: [release-github-com-looprig-acp, release-github-com-looprig-mcp]
  add-durable-workflows: [module-workflows, release-github-com-looprig-flow]
  evaluate-the-agent: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
  runnable-checkpoint: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Choose an interface and extend the agent

The coding assistant runtime does not depend on the CLI. Keep the Loop, Rig, Session, tools, storage, and sandbox composition, then choose the interfaces and orchestration features your product needs.

## Choose an interface

| Interface | Use it when | Start here |
| --- | --- | --- |
| CLI | A small command or service owns input and output directly | The tutorial application |
| TUI | You want a ready terminal experience with session lists, input, events, and restore | [TUI Getting Started](/docs/guides/tui/getting-started/) |
| Web UI | You want React, Vue, Svelte, Solid, or vanilla DOM to consume the same Session contract | [Web UI Client SDK](/docs/guides/web-ui/client-sdk/) |

The Web UI client is framework-neutral. The optional Svelte adapter does not require applications to use Svelte.

## Expose a protocol

Use [ACP Serve and ACP Client](/docs/guides/protocols/acp/) when an editor or another ACP host should create and drive agent sessions. Use [MCP Serve and MCP Client](/docs/guides/protocols/mcp/) when the coding assistant publishes tools or adopts tools from another process.

```text
Session runtime → ACP Serve → editor or external ACP client
Tool catalog    → MCP Serve → external MCP client
External tools  → MCP Client → Harness tool definitions
```

Protocols adapt an existing runtime boundary. They do not replace Harness session ownership, tool policy, storage, or sandboxing.

## Add durable Workflows

Use [Flow](/docs/guides/workflows/flow/) for typed graph execution and interruption. Use [Workflows](/docs/guides/workflows/) when the product needs durable definitions, history, recovery, resume, cancellation, and workflow-facing tools. A workflow checkpoint is separate from a Harness journal and workspace snapshot.

## Evaluate the agent

Use [Evals](/docs/guides/evals/) to run repeatable cases against the coding assistant and collect typed results. Start with exact evaluators for deterministic behavior, then add judge-based evaluation only when the rubric needs model interpretation. Pluto adds capability and qualification suites when you need to compare model or provider candidates.

```sh
# Keep evaluation in an ordinary Go test or dedicated evaluation command.
go test ./...
```

## Runnable checkpoint

The [evaluation checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage23_eval/main.go) runs an exact suite, serializes its report, runs a Pluto capability pack, and evaluates a release profile. Related runnable checkpoints cover [HTTP serving](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage19_http_serve/main.go) and the [TUI adapter](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage21_tui/main.go).

For deeper API details, continue through [Inference](/docs/guides/inference/), [Harness](/docs/guides/harness/), [Tools](/docs/guides/tools/), and [Sandboxing](/docs/guides/sandboxing/).
