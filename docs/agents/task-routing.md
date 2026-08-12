---
id: agents/task-routing
title: Agent task routing
description: Capability-to-module routing and a short selection procedure for building Looprig systems.
audience: agent
section: agents
order: 2
publication: released
proofs:
  routing:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
    - release-github-com-looprig-client
  source-status:
    - module-flow-store
    - module-workflows
    - source-client-sdk-core-package
  selection-procedure:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
    - module-flow-store
---
# Agent task routing

Use this page after `/llms.txt` and before opening repository summaries. Pick one composition page, then follow its exact source paths.

| Need | Read next | Primary modules |
| --- | --- | --- |
| one offline model turn or minimal Rig | `composition/minimal-harness.md` | `core`, `inference`, `harness` |
| define or bind a tool | `composition/tools.md` | `harness`, `tools` |
| command, file, network, or approval effects | `composition/gates-sandbox.md` | `harness/gate`, `sandbox`, `classifiers` |
| durable sessions, snapshots, or leases | `composition/persistence.md` | `storage`, `fsstore`, `harness/sessionstore` |
| bounded child Loops | `composition/delegation.md` | `harness/loop`, `harness/rig` |
| expose or drive a native agent over ACP | `composition/acp.md` | `acp`, `foreignloops` |
| publish or consume MCP tools | `composition/mcp.md` | `mcp`, `harness` |
| model JSON, providers, retries, or proxying | `composition/model-gateway.md` | `inference`, `llm`, `credentials` |
| durable graph execution and resume | `composition/flow.md` | `flow`, `flow/store`, `workflows` |
| terminal interaction | `composition/tui.md` | `tui`, `harness` |
| browser session views or actions | `composition/client-ui.md` | `client/sdk/core`, optional Svelte |
| exact, judge, or report evaluation | `composition/evals.md` | `eval`, `pluto` |

## Selection procedure

1. Resolve the module record and publication label in `modules.json`.
2. Read the composition page's import and lifecycle lines.
3. Open the linked source declaration and nearby tests at the pinned commit.
4. Copy the constructor shape, then wire dependencies at one composition root.
5. Run the listed deterministic example with `GOWORK=off` or the package test command.
6. Add the narrowest persistence, gate, interface, or evaluator needed by the use case.

Keep definitions immutable after construction. Put mutable state in the owner named by the composition page. Pass `context.Context` through every I/O path. Match typed errors with `errors.Is` or `errors.As`; never branch on diagnostic text. If a source-workspace page has no release tag, do not write a `go get @version` instruction.

For a browser surface, the data path is `sdk/core` transport -> validated history and SSE -> `fold` or `joinSessionView` -> framework view. A UI framework is a final rendering choice, not a client dependency.

Each repository page is a summary. When a symbol or invariant matters, follow its commit-pinned code or test link instead of expanding this page.
