---
id: start/next-steps
title: Choose an interface and extend the agent
description: Keep the coding assistant runtime and choose a TUI, Web UI, ACP or MCP protocol boundary, Workflows, and evaluation according to the product you are building.
audience: developer
section: start
order: 10
publication: released
proofs:
  choose-an-interface: [release-github-com-looprig-tui, release-npm-looprig-client]
  serve-many-users: [release-github-com-looprig-stack, release-github-com-looprig-factory, release-github-com-looprig-host]
  expose-a-protocol: [release-github-com-looprig-acp, release-github-com-looprig-mcp]
  add-durable-workflows: [release-github-com-looprig-workflows, release-github-com-looprig-flow]
  evaluate-the-agent: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
  runnable-checkpoint: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Choose an interface and extend the agent

The coding assistant runtime does not depend on the CLI. Keep the Loop, Rig, Session, tools, storage, and sandbox composition, then choose the interfaces and orchestration features your product needs.

## Choose an interface

| Interface | Use it when | Start here |
| --- | --- | --- |
| CLI | A small command or service owns input and output directly | The [tutorial program](/docs/start/run-cli) |
| TUI | You want a ready terminal experience with session lists, input, events, and restore | [TUI Getting Started](/docs/guides/tui/getting-started) |
| Web UI | You want a browser UI over Factory, with the framework-neutral `@looprig/client` npm package or the React 19 `@looprig/react` hooks | [Web UI Client SDK](/docs/guides/web-ui/client-sdk) |

`@looprig/client` is framework-neutral and speaks Factory's REST and ClientLink contract. `@looprig/react` is an optional adapter over it, so applications on another framework use the client package alone.

## Serve many users

The tutorial's program is one process for one person. To serve a multi-user product, keep the Loop and Rig composition and run it inside a Host, behind a Factory: Factory admits users' commands and places sessions, and Hosts run them. [Stack](/docs/modules/stack) composes both, with an in-process Host and one storage profile, from one `stack.Options` value; your Rig becomes an agent's `Define` function. For a running reference, copy the [browser-app starter](/docs/start/starters) with `gonew`: Stack, the agent and a React app in one `go run .`. [Architecture](/docs/overview/architecture) and [Which modules do I need?](/docs/overview/which-modules) explain the pieces, and the [Factory](/docs/modules/factory) and [Host](/docs/modules/host) module pages cover composing them yourself.

`harness/pkg/serve`, the older single-process HTTP and SSE server, is **deprecated and frozen**. Do not start new work on it; its progressive example remains only for existing users.

## Expose a protocol

Use the [ACP module](/docs/modules/acp) when an editor or another ACP host should create and drive agent sessions. Use the [MCP module](/docs/modules/mcp) when the coding assistant publishes tools or adopts tools from another process.

```text
Session runtime → ACP Serve → editor or external ACP client
Tool catalog    → MCP Serve → external MCP client
External tools  → MCP Client → Harness tool definitions
```

Protocols adapt an existing runtime boundary. They do not replace Harness session ownership, tool policy, storage, or sandboxing.

## Add durable Workflows

Use [Flow](/docs/guides/workflows/flow) for typed graph execution and interruption. Use [Workflows](/docs/guides/workflows) when the product needs durable definitions, history, recovery, resume, cancellation, and workflow-facing tools. A workflow checkpoint is separate from a Harness journal and workspace snapshot.

## Evaluate the agent

Use [Evals](/docs/guides/evals) to run repeatable cases against the coding assistant and collect typed results. Start with exact evaluators for deterministic behavior, then add judge-based evaluation only when the rubric needs model interpretation. Pluto adds capability and qualification suites when you need to compare model or provider candidates.

```sh
# Keep evaluation in an ordinary Go test or dedicated evaluation command.
go test ./...
```

## Runnable checkpoint

The [evaluation checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage23_eval/main.go) runs an exact suite, serializes its report, runs a Pluto capability pack, and evaluates a release profile. The [TUI adapter checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage21_tui/main.go) shows the same runtime behind the terminal UI. The other [progressive examples](https://github.com/looprig/.github/tree/main/examples/go/progressive) each add one capability at a time; the HTTP serving stage among them uses the deprecated `harness/pkg/serve`.

For a shorter path to a running agent, see the [Quickstart](/docs/start/quickstart). For deeper API details, continue through [Inference](/docs/guides/inference), [Harness](/docs/guides/harness), [Tools](/docs/guides/tools), and [Sandboxing](/docs/guides/sandboxing).
