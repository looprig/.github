# The Agent Harness Landscape

Models provide intelligence. Harnesses turn that intelligence into work.

The market often groups model SDKs, agent frameworks, coding agents, and
orchestration products under the same word: agent. They solve different parts
of the problem. This document separates those layers, compares their documented
capabilities, and explains where looprig fits.

This comparison was reviewed on July 15, 2026. It uses first-party documentation
and repositories. A capability marked "not documented" may exist in a plugin,
community project, private service, or newer release. It means we did not find it
as a documented part of the first-party core.

> **Publication note:** The looprig row describes the release we are building
> toward, including the capabilities listed in our public direction. Publish this
> comparison as a current-state matrix when those capabilities have landed.

## Four Layers of the Landscape

These categories overlap, but they make the different design centers easier to
see.

### Model and Application SDKs

These normalize access to models and provide primitives for generation,
streaming, tools, structured output, and user interfaces. Vercel AI SDK is the
clearest example. It gives an application excellent model-level building blocks,
while the application remains responsible for most runtime, policy, storage, and
deployment decisions.

### Agent Frameworks and Runtimes

These provide a programmable agent loop plus some combination of memory, tools,
workflows, persistence, security, and observability. OpenHands and Mastra belong
here. They are not merely provider wrappers. They already provide substantial
machinery for building and operating agents.

### Complete Agent Products

These are ready-to-use agents with their own interface and operating model.
Goose, Claude Code, Codex, OpenCode, Pi, and Perplexity Computer begin from a
working product rather than a blank framework. Several also expose APIs or SDKs,
but their primary experience remains the agent they ship.

### Harness and Meta-Harness Systems

These treat the runtime around an agent as a first-class system. Omnigent can run
and combine several existing agent harnesses behind shared policies, sandboxes,
sessions, and clients. looprig is being built as both a native harness
construction kit and a meta-harness: people can build their own Loops from the
parts, compose them into durable workflows with `flow`, then run those Loops
beside foreign agents inside the same Rig.

## Capability Comparison

The tables use short phrases instead of a single yes or no because the shape of
support matters. "Application-owned" means the project provides hooks or
patterns, but the consuming application must assemble and operate that layer.
"Extension" means the documented extension system can add it, but it is not a
default core behavior.

### Models, Agents, and Tools

| Project | Primary shape | Model access | Build your own agent | Tools and MCP | Multimodal input | Ready interfaces |
| --- | --- | --- | --- | --- | --- | --- |
| [Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-core) | Model and application SDK | Broad provider ecosystem | TypeScript Agent API | Tools and MCP built in | Built in across supported models | Web UI hooks; application supplies the product |
| [Goose](https://block.github.io/goose/) | General-purpose agent and API | Broad provider support | Recipes, extensions, and API | Tools through deep MCP integration | Provider and extension dependent | Desktop, CLI, and API |
| [OpenHands](https://docs.openhands.dev/sdk/index) | Agent SDK and coding product | Provider neutral | Python SDK and REST API | Tools and MCP built in | Model and tool dependent | CLI, REST, local UI, and Cloud |
| [Mastra](https://mastra.ai/ai-agents) | TypeScript agent framework | Broad model router | Agents, workflows, and networks | Tools and MCP built in | Built in across supported models | Server, client SDK, and Studio |
| [Omnigent](https://omnigent.ai/docs/build/harnesses) | Meta-harness | Models available through each harness and gateway | YAML agents and harness plugins | Functions, agents, and MCP | Harness dependent | Terminal, web, native desktop, mobile, and REST |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started) | Complete coding agent | Claude through Anthropic, Bedrock, or Vertex AI | Agent SDK and non-interactive mode | Native tools and MCP | Images and text | CLI and editor integrations |
| [Codex](https://github.com/openai/codex) | Complete coding agent | OpenAI-first, with supported compatible endpoints | SDK and app-server protocol | Native tools and MCP client/server | Images and text | CLI, IDE, app, and web |
| [OpenCode](https://dev.opencode.ai/docs/agents/) | Complete coding agent and server | Broad provider ecosystem | Configured agents, SDK, and server | Native tools and MCP | Provider dependent | Terminal, web, desktop, SDK, server, and ACP |
| [Pi](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) | Minimal agent SDK and coding agent | Broad provider ecosystem | Agent core, SDK, RPC, and extensions | Native tools; MCP through extensions | Images and text | Terminal, SDK, RPC, and web UI components |
| [Perplexity Computer](https://www.perplexity.ai/help-center/en/articles/13901210-computer-for-enterprise) | Managed digital worker | Automatic multi-model orchestration | Reusable skills, not an exposed harness | Managed tools and connectors | Rich media and files | Web, Mac, and iPhone |
| **looprig** | Native harness, workflow engine, and meta-harness | Broad providers plus native OpenAI, Anthropic, and Gemini protocol boundaries | Go modules, Loops, Sessions, Rigs, and typed `flow` graphs | Native tools and MCP | Built in | CLI, web, desktop, mobile, and APIs |

### Runtime, Durability, and Orchestration

| Project | Resumable sessions | Durable work | Execution record | Isolation and approval | Multiple agents | ACP and foreign agents |
| --- | --- | --- | --- | --- | --- | --- |
| Vercel AI SDK | Application-owned message persistence | Application-owned | Callbacks and OpenTelemetry | Application-owned | Agent composition patterns | Not documented |
| Goose | Session history and continuation | Recipes can run repeatable workflows | Visible conversation and tool activity | Sandbox, permissions, and safety review | Built-in subagents | ACP server and ACP agents as providers |
| OpenHands | Persistent conversations and restore | Persistent agent state | Event log is a core abstraction | Docker or Kubernetes isolation, confirmations, and security analyzers | Built-in multi-agent composition | Not documented |
| Mastra | Persistent memory and threads | Workflow snapshots, suspend, and resume | Traces, logs, and workflow state | Human review and application-hosted controls | Agent networks and agents as tools | Not documented |
| Omnigent | Persistent, shared live sessions | Long-running sessions; durable workflow engine not documented | Shared session activity | OS sandbox and contextual policy decisions | Built-in supervisors and subagents | Generic ACP harness plus direct and native harness adapters |
| Claude Code | Continue and resume by session | No durable workflow engine documented | Conversation history, verbose events, and OpenTelemetry | OS sandbox and permission rules | Built-in subagents | No first-party ACP interface documented |
| Codex | Persistent threads with resume and fork | Cloud tasks, but no general durable workflow engine documented | Typed event stream and OpenTelemetry | OS sandbox and approvals | Built-in collaboration and subagents | MCP server and app-server; no first-party ACP interface documented |
| OpenCode | Persistent sessions | No durable workflow engine documented | Session and server events | Granular allow, ask, and deny permissions; no core OS sandbox documented | Built-in primary agents and subagents | ACP server |
| Pi | Persistent JSONL session tree with resume, fork, and compaction | No durable workflow engine | JSONL history and SDK event stream | Deliberately left to containers and extensions | Extension pattern | No core ACP interface documented |
| Perplexity Computer | Persistent memory and sessions | Background and scheduled tasks | Managed activity and enterprise audit logs | Secure cloud sandbox and authorization for sensitive actions | Teams of managed subagents | Not exposed |
| **looprig** | Durable Sessions that restore across machines | `flow` workflows with checkpoints, parallel steps, interruptions, and resume | Typed append-only journals, workflow checkpoints, audit views, and traces | OS confinement with explicit guarantee reports and human gates | Native subagents and agent-to-agent communication | ACP clients and foreign Loops under the same Rig |

### Ownership, Safety, and Operations

| Project | Source and operation | Persistence and workspaces | Observability and evals | Untrusted input and guardrails | Secrets | Documents and files |
| --- | --- | --- | --- | --- | --- | --- |
| Vercel AI SDK | Open-source SDK; application operated | Application-owned persistence and workspace | OpenTelemetry plus testing and third-party evaluation integrations | Middleware and application policy | Application-owned | Application-owned parsers and storage |
| Goose | Apache-2.0; local and self-operated | Local agent sessions; pluggable runtime storage not documented | Agent activity is visible; first-party eval system not documented | Prompt-injection detection, permissions, sandbox mode, and adversary review | Provider credentials; general secret brokerage not documented | Local files plus MCP extensions |
| OpenHands | MIT core with separately licensed enterprise code; self-hostable | Persistent event state and isolated workspaces | Events and evaluation infrastructure | Confirmation policies and security analyzers | SecretRegistry injects and masks secrets | Workspace tools and extensible parsers |
| Mastra | Apache-2.0 core with separately licensed enterprise code; self-hostable | Storage adapters, memory, threads, and workflow snapshots | Built-in traces, scorers, and evals | Input/output processors and prompt-injection or data-leak guardrails | Application and deployment owned | MDocument and RAG pipelines |
| Omnigent | Apache-2.0; self-hostable | Persistent sessions; pluggable journal and workspace snapshots not documented | Session visibility and platform integrations; first-party eval system not documented | Contextual policies, PII controls, and OS sandbox | Credential management and brokerage | Tools, connectors, and harness-dependent parsing |
| Claude Code | Closed-source product running locally | Product-managed sessions and project workspace | OpenTelemetry for usage and activity; no general eval framework | Prompt-injection protections, permissions, hooks, and sandbox | Protected product credentials; general tool-secret brokerage not documented | Native project files and model-supported documents |
| Codex | Apache-2.0 local client with managed services | Product-managed threads and project workspace | OpenTelemetry and typed events; no general eval framework | Approvals, sandbox policy, and network controls | OS keyring for credentials; general tool-secret brokerage not documented | Native project files, images, and connected apps |
| OpenCode | Open-source and self-hostable | Product-managed sessions and project workspace | Server events; first-party tracing and eval framework not documented | Tool permissions; prompt-injection classifier not documented | Stored provider credentials; general secret brokerage not documented | Native project files and tools |
| Pi | MIT and self-operated | User-owned JSONL sessions and project workspace | SDK events; tracing and evals left to extensions | Permissions and isolation deliberately left to extensions or containers | Auth storage; general secret brokerage not built in | Native project files and extension-defined parsers |
| Perplexity Computer | Managed product | Managed memory, sessions, artifacts, and cloud sandbox | Managed analytics and enterprise audit logs | Managed controls; classifier details are not exposed | Managed authenticated connectors | Built-in file analysis and artifact creation |
| **looprig** | Fully open source and self-operated | Pluggable storage, durable journals, workflow checkpoints, and content-addressed workspace snapshots | OpenTelemetry across Rig, Session, Loop, workflow, turn, tool, gate, delegate, and model spans, plus evals | Provenance-aware untrusted-content classification, prompt-injection classifiers, guardrails, and gates | Secret references resolved at execution without exposing values to models | Multimodal content plus a Python parser service using leading open parsers such as MarkItDown |

## What Each Project Is Designed to Do

### Vercel AI SDK

Vercel AI SDK is a strong foundation for TypeScript applications that need to
work across model providers. It covers text and structured generation, tool
calling, embeddings, media APIs, model middleware, MCP, frontend streaming, and
[OpenTelemetry](https://ai-sdk.dev/docs/ai-sdk-core/telemetry). Its
[Agent API](https://ai-sdk.dev/docs/reference/ai-sdk-core/agent) can run tool
loops, while AI SDK UI supplies framework-specific chat primitives.

Its center of gravity is the application call boundary. Persistence, process
recovery, workspaces, authority, and deployment topology are normally assembled
by the application. looprig begins one layer lower and continues several layers
higher: provider protocols, agent loops, durable sessions, journals, workspaces,
policy, and ready clients are parts of one owned Rig.

### Goose

Goose is an Apache-2.0, general-purpose local agent that was created at Block and
is now part of the Agentic AI Foundation. It already offers broad provider
support, Desktop, CLI, an API, MCP extensions, recipes, subagents,
prompt-injection detection, permissions, a sandbox, and an adversary reviewer.
It also supports ACP in both directions: clients can use Goose as an ACP agent,
and Goose can use agents such as Claude Code and Codex as providers.

Goose optimizes for a capable agent that works immediately and can be extended.
looprig optimizes for assembling the runtime itself. A user can replace the Loop,
journal, storage, workspace, policy, inference transport, or client boundary and
still preserve the surrounding Rig.

### OpenHands

OpenHands is one of the closest comparisons at the framework layer. Its
[SDK architecture](https://docs.openhands.dev/sdk/arch/sdk) includes an agent
loop, events, state persistence, tools, workspaces, context compression, MCP,
security analyzers, and local or remote execution. Its
[conversation persistence](https://docs.openhands.dev/sdk/guides/convo-persistence)
restores messages, events, execution state, tool output, statistics, workspace
context, secrets, and agent state. It also supports multi-agent composition and
Docker or Kubernetes isolation.

OpenHands is centered on software development and Python or REST integration.
looprig is intended as a general Go harness with smaller replaceable modules,
content-addressed workspace movement, multiple storage implementations, and the
same Session model for native Loops and external ACP agents.

### Mastra

Mastra is a broad TypeScript framework for stateful agents and workflows. It
includes a model router, memory, tools, MCP, agent networks, durable workflow
snapshots, human review, storage adapters, deployment, a client SDK, Studio,
tracing, guardrails, and evals. Its
[Studio](https://mastra.ai/studio) provides a polished environment for inspecting
traces and scoring historical or live runs.

Mastra focuses on building agent applications and typed workflows in the
TypeScript ecosystem. looprig focuses on the harness as an independently owned
machine: durable event history, workspace restoration, confinement guarantees,
native provider wire boundaries, and foreign agents are designed to remain
visible and replaceable within the Rig.

### Omnigent

The project built by members of the Databricks AI team and Neon is named
**Omnigent**, although it is sometimes referred to as OmniAgent. It describes
itself as a meta-harness. That is accurate and places it very close to part of
looprig's direction.

Omnigent provides a common layer over Claude Code, Codex, Goose, Pi, OpenCode,
and other harnesses. It supports direct and native TUI modes, YAML agents,
harness plugins, persistent sessions, web and mobile clients, multi-agent
supervisors, contextual policies, credential brokerage, and a fail-closed
[OS sandbox](https://omnigent.ai/docs/policies/os-sandbox). Its generic ACP
harness can connect any ACP-compatible agent and relay Omnigent tools through
MCP.

The difference is the starting point. Omnigent primarily normalizes and combines
existing harnesses. looprig starts with a native, typed harness that users can
assemble from provider transport through durable execution, then admits foreign
agents into that same runtime. Both projects can orchestrate external agents.
looprig's distinct focus is making the underlying Loop, journal, storage,
workspace, gates, and restoration contract first-class parts of the system a
user owns.

### Claude Code

Claude Code is a finished coding agent with strong repository exploration,
editing, shell use, MCP, hooks, subagents, resumable sessions, and programmatic
execution. Its permission model and OS-level sandbox provide practical controls,
and its monitoring surface can export OpenTelemetry data. Anthropic also
documents the reasoning behind its
[sandboxing model](https://www.anthropic.com/engineering/claude-code-sandboxing).
It is optimized around Claude models, including access through Anthropic, Amazon
Bedrock, and Google Vertex AI.

Claude Code is valuable inside a Rig as a specialized foreign Loop. looprig does
not need to reproduce its coding behavior. It can supply the surrounding session,
policy, storage, coordination, audit, and client layer while preserving access to
the native Claude Code experience where that is useful.

### Codex

Codex is an open-source local coding agent with CLI, IDE, app, and web surfaces.
It includes sandboxing, approvals, MCP client and server support, persistent
threads, collaboration tools, multimodal input, skills, plugins, and telemetry.
The [app-server protocol](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md)
exposes typed threads, turns, events, approvals, tools, and account state to rich
clients. OpenAI also documents how the sandbox, approvals, network policy, secure
credential storage, and telemetry work in its
[Codex safety model](https://openai.com/index/running-codex-safely/).

Codex is a complete OpenAI-first coding system. looprig can treat it as one Loop
among many while applying a Rig-wide view of state, authority, workspace
placement, and orchestration. For agents without a native ACP endpoint, an
adapter can map their supported protocol into the foreign Loop boundary.

### OpenCode

OpenCode is an open-source coding agent with broad provider support through
Vercel AI SDK and Models.dev. Its
[provider layer](https://dev.opencode.ai/docs/providers) supports hosted and
local models. It has configurable primary agents and subagents, granular
permissions, MCP, a server and SDK, terminal and graphical clients, and a
first-party [ACP server](https://dev.opencode.ai/docs/acp/).

OpenCode already gives users a capable, customizable agent and several ready
interfaces. looprig's focus is broader than a coding agent configuration. It is
the construction and operating layer for systems that may contain OpenCode,
other foreign agents, native Loops, deterministic services, and human gates in
one durable topology.

### Pi

Pi is deliberately small and deeply extensible. Its monorepo includes a unified
multi-provider model API, agent core, coding agent, terminal UI, web components,
and an [SDK](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md).
Its persistent JSONL sessions support trees, resume, fork, clone, and compaction.
Extensions can replace tools, add interfaces, introduce permissions, run remote
operations, or create subagent patterns.

Pi intentionally leaves MCP, permissions, sandboxing, background commands, and
subagents out of the default core. That is a philosophy, not an omission. It
makes Pi a strong example of an understandable, user-shaped agent. looprig shares
the preference for ownership, but puts durability, confinement, gates, journals,
storage, and multi-agent coordination into explicit reusable harness contracts.

### Perplexity Computer

Perplexity Computer is a managed digital worker rather than an open agent
framework. It combines search, tools, connectors, file and media creation,
persistent memory, cloud sandboxes, scheduled work, and teams of models behind a
single product experience. Personal Computer extends that experience to local
files and native Mac applications through its
[Mac client](https://www.perplexity.ai/help-center/en/articles/14659663-what-is-personal-computer),
while the separate
[Agent API](https://docs.perplexity.ai/docs/agent-api/quickstart) gives developers
a multi-provider API with Perplexity tools.

Computer demonstrates the value of making orchestration disappear behind a
useful client. looprig aims to provide that same out-of-the-box usefulness
without hiding or owning the machine on the user's behalf. The user can inspect,
change, self-host, and replace every part of a Rig.

## Where looprig Fits

The original intuition is partly right: many projects normalize providers and
make it easier to call models or start from a prebuilt agent. But that does not
describe the entire landscape. OpenHands and Mastra are substantial agent
runtimes. Goose, OpenCode, and Pi expose meaningful extension or embedding
surfaces. Omnigent already operates as a meta-harness across foreign agents.

Multi-provider access, tool calling, MCP, ACP, subagents, and a polished client
are therefore necessary, but none of them alone is a durable distinction.

looprig's position is the combination of five commitments:

1. **Users own the machine, not only its configuration.** The harness is made of
   replaceable Go modules. A Rig belongs to the person or group running it and
   can be changed without waiting for a hosted product to expose a setting.
2. **The runtime remains visible.** Loops, Sessions, tools, gates, journals,
   workflows, storage, workspaces, inference transports, and clients have
   explicit boundaries. Useful abstractions should reduce repeated work without
   hiding where authority or state lives.
3. **Native and foreign agents share one operating model.** A native Loop and an
   ACP agent can appear in the same Rig, use the same session and event view,
   participate in the same policy decisions, and coordinate with other Loops.
4. **Durability includes the work, not only the conversation.** The `flow`
   module creates typed, replayable workflows that checkpoint their execution
   frontier, pause for people or external systems, and resume without starting
   over. Typed journals, restoration fingerprints, content-addressed workspace
   snapshots, pluggable storage, leases, gates, and recovery allow the agents
   inside those workflows to continue across failures, machines, and long
   pauses.
5. **The whole system is usable immediately.** CLI, web, desktop, and mobile
   clients should work with looprig Rigs and compatible ACP agents out of the
   box. Ownership should not require everyone to build a user interface before
   they can benefit from the harness.

The intended result is not one universal agent. It is a way to assemble many
kinds of intelligence into a system whose behavior, authority, memory, and tools
remain understandable and owned.

## A Complementary Ecosystem

These projects do not need to be mutually exclusive.

Vercel AI SDK can power a model-facing application. Mastra or OpenHands can run a
specialized service. Claude Code, Codex, OpenCode, Pi, and Goose can operate as
foreign Loops. Omnigent and looprig can help normalize heterogeneous runtimes,
with different starting points and contracts. Perplexity Computer shows how far
a complete user experience can take the underlying machinery.

The intellectual revolution will have many engines, tools, agents, protocols,
and interfaces. Our work is to make them useful together without taking
ownership away from the people who depend on them.
