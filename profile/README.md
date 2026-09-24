## What is looprig?

looprig is an agent harness ecosystem for anyone who wants to build useful agents
they can truly call their own. It is a set of Go modules for creating agents that
are durable across crashes, confined by the OS, gated by humans, and transparent
to the people who run them.

You can use looprig to build a personal agent for your own work, a specialized
agent shaped around a workflow, or a production system for a team or an
organization. The same harness supports all three.

Start with the [documentation](https://looprig.com/docs) to build one agent,
then add the models, tools, storage, interfaces, and deployment choices your
system needs.

The name carries two ideas. A **rig** is the structure and equipment assembled to
harness power and make it useful. A sailing rig harnesses wind, a drilling rig
puts mechanical power to work, and a test rig makes complex systems controlled
and repeatable. A **loop** is the agent loop. So a *looprig* is **the rig that
runs the loop**: the harness, plumbing, confinement, storage, and presentation
layer that turns model intelligence into a useful agent.

We build looprig as a set of small, independently versioned Go modules. Each
repository is its own module with its own tags; a module depends only on the
lower layers it needs.

## Build an agent that is yours

looprig is not a finished agent that asks you to adapt to it. It gives you the
rig to build an agent around the way you work and the things you want to create.

You choose its purpose, models, tools, instructions, permissions, memory,
storage, interface, and where it runs. You can inspect every layer, customize its
behavior, and change the parts that do not work the way you want. The agent, its
history, and the work it produces remain under your control.

Start with one useful task on your own machine. Add tools and knowledge as your
needs grow. Turn it into a product, share it with a team, or keep it entirely for
yourself. looprig provides the parts without deciding what your agent must become.

Production-grade does not mean enterprise-only. It means an agent you rely on
should not forget its work after a crash, touch things outside its boundaries,
act without approval when consequences matter, or hide what it did. Those
properties matter whether one person runs one agent on a laptop or an
organization runs thousands.

## The heart: harness

[harness](https://github.com/looprig/harness) is the agent runtime SDK. It turns
an `inference.Client` and a set of tools into a durable, observable,
permissioned agent loop, and owns composition (`rig`), sessions, loops, turns,
events, commands, gates, the journal, and restore.

It is a library, not a binary. Leaf capabilities — model providers, storage
backends, tool implementations, OS confinement, foreign agents, and user
interfaces — live in sibling modules and are wired at the consumer's
composition root. Harness never imports `llm`, `tools`, or `sandbox`.

## Modules

Every module is published at `github.com/looprig/<name>` and installed with
`go get`. Each repository's tags are its releases.

### Foundations

- **[core](https://github.com/looprig/core)** - Shared vocabulary: the closed content model (messages, blocks, streaming chunks), UUIDs, injected logging, and the transport-neutral session wire contract (`sessionwire/v1`). No Looprig dependencies.
- **[storage](https://github.com/looprig/storage)** - Neutral, stdlib-only storage contracts: `Ledger`, `Leaser`, `KV`, `Blobs`, and `OrderedIndex`, with typed errors, an in-memory reference implementation, and conformance suites every backend runs.
- **[secrets](https://github.com/looprig/secrets)** - Opaque secret values and references that ordinary formatting cannot disclose.
- **[credentials](https://github.com/looprig/credentials)** - Outbound provider credentials: a secret-free catalog plus acquisition, refresh, and invalidation of time-bounded authority.
- **[sandbox](https://github.com/looprig/sandbox)** - Explicit access profiles enforced around spawned commands: Seatbelt on macOS; namespaces, Landlock, seccomp, nftables, and cgroups on Linux. Imports no Looprig module.
- **[drain](https://github.com/looprig/drain)** - Graceful termination for long-lived Go workloads: counted holds on in-flight work and a drain that decides when it is safe to exit. Standard library only.

### Storage backends

- **[fsstore](https://github.com/looprig/fsstore)** - All storage primitives over one owner-only local directory; the single-host default.
- **[natsstore](https://github.com/looprig/natsstore)** - All storage primitives over NATS JetStream, remote or embedded.
- **[pgstore](https://github.com/looprig/pgstore)** - PostgreSQL provider for `Ledger`, `Leaser`, `KV`, and `OrderedIndex`.
- **[s3store](https://github.com/looprig/s3store)** - S3-compatible provider for `Blobs`, including bounded reader lifecycle.
- **[rclonestore](https://github.com/looprig/rclonestore)** - `Blobs` over any rclone remote, driving the `rclone` binary as a bounded subprocess.
- **[sessionstore](https://github.com/looprig/sessionstore)** - The durable session aggregate over the storage contracts: catalog, journal, command admission and settlement, gates, and residency.

### Models

- **[inference](https://github.com/looprig/inference)** - The provider-neutral model-call contract: requests, responses, streaming, tools, usage, codecs, retries, and a local gateway. Carries no provider policy.
- **[llm](https://github.com/looprig/llm)** - Provider policy on top of `inference`: the known-provider registry, auth requirements, fail-closed model validation, and concrete provider clients.

### Runtime and capabilities

- **[harness](https://github.com/looprig/harness)** - The agent runtime SDK described above.
- **[tools](https://github.com/looprig/tools)** - Optional standard tools (file read/write/edit, glob, grep, shell and processes, web fetch and search, tasks, skills, ask-user, permission, and tool-result reading), each selected individually.
- **[mcp](https://github.com/looprig/mcp)** - Model Context Protocol client: consume MCP servers' tools from a Harness agent.
- **[acp](https://github.com/looprig/acp)** - Agent Client Protocol: drive ACP agents as children, or expose a Harness host over ACP.
- **[foreignloops](https://github.com/looprig/foreignloops)** - Run ACP, Claude, and Codex processes as Harness loops through neutral driver contracts.
- **[classifiers](https://github.com/looprig/classifiers)** - Classifiers for Harness's permission auto-review, used as bounded evidence inside gate policy.
- **[eval](https://github.com/looprig/eval)** - Application-neutral evaluation framework for agentic systems, run under `go test`.

### Workflows

- **[flow](https://github.com/looprig/flow)** - Durable, replayable workflow engine with Pregel-style super-step execution and append-only checkpoints. The nested module `github.com/looprig/flow/store` adapts a storage `Ledger` to Flow checkpoints.
- **[workflows](https://github.com/looprig/workflows)** - The bridge between Flow and Harness: typed workflows, durable run records, supervision inside sessions, and workflow tools.

### Interfaces

- **[tui](https://github.com/looprig/tui)** - Reusable terminal user interface (Bubble Tea v2) for Harness sessions.
- **[wui](https://github.com/looprig/wui)** - Reusable web user interface: a React SPA embedded as a static bundle, served by a Go handler.
- **[client](https://github.com/looprig/client)** - A Go backend-for-frontend and a framework-neutral TypeScript session SDK, with a reference Svelte app.

### Orchestration

- **[factory](https://github.com/looprig/factory)** - The public-facing orchestration service: HTTP and WebSocket API, authorization seams, command admission, and placement of sessions onto Hosts. Ships no UI; products mount their own.
- **[host](https://github.com/looprig/host)** - The runtime host process that keeps sessions resident, applies commands, serves the HostLink surface, and drains on release.
- **[controller](https://github.com/looprig/controller)** - Optional Kubernetes controller for dedicated Host placement.

### Products

- **[carbon](https://github.com/looprig/carbon)** - Carbon, the coding agent: an interactive TUI and headless CLI, plus a browser mode composed from Factory, a local Host, and `wui`.
- **[pluto](https://github.com/looprig/pluto)** - Pluto, the model profiler: qualifies a new model or configuration under representative load, faults, and hostile inputs. The CLI is the nested module `github.com/looprig/pluto/cmd/pluto`.

### Integration

- **[tests](https://github.com/looprig/tests)** - Cross-module integration suite that wires the published modules together the way a real consumer would, pinned to released versions.

## Layering

Modules release from the bottom up; a module depends only on layers below it.

| Layer | Modules |
| --- | --- |
| Foundations | `core`, `storage`, `secrets`, `sandbox`, `drain` |
| Foundation adapters | `credentials`, `fsstore`, `natsstore`, `pgstore`, `s3store`, `rclonestore`, `flow` |
| Session state | `sessionstore` |
| Models and workflow storage | `inference`, `flow/store` |
| Shared runtime | `harness`, `llm`, `eval` |
| Capabilities and interfaces | `tools`, `mcp`, `acp`, `classifiers`, `tui`, `wui`, `pluto` |
| Orchestration | `foreignloops`, `workflows`, `host`, `factory`, `controller` |
| Products and integration | `carbon`, `client`, `tests` |

This repository also holds the public documentation corpus, runnable examples,
and the journal published at [looprig.com](https://looprig.com).

---

<p align="center"><sub>looprig: the rig that runs the loop.</sub></p>
