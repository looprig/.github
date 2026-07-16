# Where We Are Today

looprig today is a strong foundation for building agent systems people can own,
understand, and change. It is not yet a complete agent product.

That distinction matters. The difficult machinery is taking shape: durable
sessions, typed event history, workspace recovery, human gates, OS confinement,
provider-neutral inference, multiple agents, foreign agents, evaluations, and a
durable workflow engine. What remains is to bring these parts together through
open protocols, broader safety systems, and clients that work out of the box.

This is our honest position as of July 15, 2026.

## What Exists Today

### A Native Agent Harness

The [harness](https://github.com/looprig/harness) provides Loops, Sessions, Rigs,
tools, gates, journals, workspaces, subagents, and lifecycle control. These are
public runtime parts, not hidden behavior behind one fixed agent.

A user can construct a native Loop, choose its model and tools, place it inside
a Rig, run it through a durable Session, observe its events, answer its gates,
and restore it after a failure.

### Durable State and Workspaces

Session history is written as typed, append-only events. Configuration
fingerprints prevent work from silently resuming under an incompatible Rig.
Workspaces can be captured as content-addressed snapshots and restored on
another machine.

The storage layer is not tied to one database. The
[storage](https://github.com/looprig/storage) contracts are implemented by
[fsstore](https://github.com/looprig/fsstore),
[natsstore](https://github.com/looprig/natsstore), and
[rclonestore](https://github.com/looprig/rclonestore), covering local disk,
JetStream, and cloud-addressable blobs.

### Durable Workflows

The [flow](https://github.com/looprig/flow) module is a typed, replayable workflow
engine. It provides graphs, reusable tasks, parallel super-steps, conditional
routing, retries, checkpoints, interruptions, resume, stable idempotency keys,
and local or distributed control planes.

This gives looprig two distinct forms of orchestration:

- The harness runs agents through Loops and Sessions.
- `flow` coordinates durable work across tasks, people, agents, and external
  systems.

The workflow engine is implemented. The next step is making agents first-class
workflow tasks and presenting agent and workflow state through one coherent
client experience.

### Confinement and Human Authority

The [sandbox](https://github.com/looprig/sandbox) enforces filesystem, process,
network, and resource boundaries through operating-system mechanisms. It reports
which guarantees the current platform can actually enforce instead of claiming
security it cannot provide.

The harness adds durable gates so consequential actions can pause for a person
or policy decision and continue afterward.

### Provider-Neutral Inference

The [inference](https://github.com/looprig/inference) module defines the neutral
model contract. It includes native OpenAI, Anthropic, and Gemini wire formats,
streaming, tool calls, usage, model capabilities, and multimodal content.

The [llm](https://github.com/looprig/llm) module adds provider policy,
authentication, model validation, provider routing, and concrete integrations
without coupling the harness to a particular vendor.

### Native and Foreign Agents

Native Loops and foreign agents already share a normalized runtime boundary.
The harness includes adapters for Claude Code and Codex, translating their
streams and tool activity into looprig events while preserving their foreign
session identities.

This proves the foreign Loop model. The broader ACP implementation that will
open this boundary to any compatible agent is still ahead.

### Evaluations and Interfaces

The harness includes a small evaluation framework with cases, runners, metrics,
thresholds, and LLM judges. It provides the foundation for regression and
capability evaluation, but not yet the integrated evaluation and observability
experience offered by more mature platforms.

People can use looprig through the terminal today. The harness also exposes an
HTTP and SSE session API for history, live events, input, gates, interrupts, and
restore. Web, desktop, and mobile clients remain part of the work ahead.

## How We Stand

| Area | Standing today | Our position |
| --- | --- | --- |
| Native harness construction | Very strong | Explicit and replaceable Loops, Sessions, Rigs, gates, journals, tools, storage, and inference boundaries |
| Durability and workspace recovery | Leading | Durable typed history, restoration checks, pluggable storage, and content-addressed workspace snapshots |
| Durable workflows | Strong | `flow` is implemented; first-class agent task integration and unified clients remain |
| Confinement and human control | Strong | OS enforcement, honest guarantee reporting, security limits, and durable gates |
| Provider abstraction | Strong foundation | Native provider formats and a neutral inference contract, with a smaller integration ecosystem than established SDKs |
| Foreign agents | Promising but incomplete | Claude Code and Codex adapters exist; bidirectional ACP remains to be implemented |
| Evaluations | Foundation exists | Core evaluation types and judges exist; integrated datasets, runs, reports, and trace-linked scoring remain |
| Observability | Behind | Lifecycle events and hooks exist; complete correlated OpenTelemetry instrumentation remains |
| MCP and extensions | Behind | Native tools exist; MCP discovery, authentication, policy, elicitation, and audit integration remain |
| Ready user experience | Behind | CLI and HTTP/SSE exist; polished web, desktop, mobile, and universal ACP clients remain |
| Prompt-injection defense | Behind our intended position | Provenance and gates exist; untrusted-content classifiers and broader guardrails remain |
| Secret handling | Behind our intended position | Provider authentication exists; general secret brokerage that keeps values away from models remains |
| Ownership and replaceability | Leading | The user can self-operate and replace the machine at module boundaries |

## Where We Are Strongest

### Users Own the Machine

looprig does not only expose agent configuration. It exposes the machinery around
the agent. Models, inference transports, Loops, tools, gates, journals, storage,
workspaces, workflows, and clients have explicit boundaries.

This makes it possible to change how the system works without waiting for a
hosted product to expose another setting.

### Durability Includes the Work

Many systems persist messages. looprig also treats execution state, authority,
workspace contents, workflow checkpoints, and restoration compatibility as
durable concerns.

The goal is not merely to reopen a conversation. It is to continue useful work
without losing where the system was, what it had changed, or what it was waiting
for.

### Safety Is Structural

Confinement, gates, permissions, and security limits are part of the runtime
contract. They are not instructions asking a model to behave safely.

### Agents and Workflows Are Separate but Composable

A Loop handles model-driven agency. A `flow` graph handles durable,
checkpointed orchestration. Keeping these concerns separate lets deterministic
tasks, agents, people, and external systems participate in the same workflow
without forcing every step to become an agent.

## Where Others Are Ahead

### Omnigent

[Omnigent](https://omnigent.ai/) is currently ahead in foreign-harness
integration and client experience. It already combines many existing agents
behind shared sessions, policies, sandboxes, credential handling, ACP, web,
desktop, and mobile clients.

looprig has the deeper native construction and durability layer. Omnigent starts
by normalizing existing harnesses. looprig starts by letting users build the
native harness itself, then brings foreign agents into it.

### OpenHands

[OpenHands](https://docs.openhands.dev/sdk/arch/sdk) is ahead in delivering a
complete coding-focused SDK and product around persistent agent state, tools,
MCP, security analyzers, secrets, and container execution.

looprig has a more general modular Go architecture, a separate durable workflow
engine, multiple storage implementations, and content-addressed workspace
movement.

### Mastra

[Mastra](https://mastra.ai/ai-agents) is ahead in the integrated TypeScript
developer experience. It combines agents, workflows, memory, MCP, tracing,
evals, guardrails, deployment, clients, and Studio in one mature surface.

`flow` gives looprig a strong workflow kernel. We still need to make the full
agent and workflow system equally easy to assemble, inspect, and operate.

### Goose

[Goose](https://block.github.io/goose/) is ahead in immediate usability,
provider breadth, MCP extensions, ACP, prompt-injection protection, and desktop
distribution.

looprig provides deeper control over the runtime and durability contracts, but
Goose provides a more complete ready-to-use agent today.

## What Must Come Together Next

The core technology is not the largest risk. Integration is.

The next stage must make these capabilities feel like parts of one Rig:

- bidirectional ACP for exposing looprig and hosting compatible foreign agents;
- MCP with durable events, authentication boundaries, permissions, and
  elicitation;
- first-class agent tasks inside `flow` workflows;
- complete OpenTelemetry across models, Loops, tools, gates, delegates,
  workspaces, and workflows;
- prompt-injection classifiers, provenance-aware policy, guardrails, and evals;
- secret references that tools can resolve without exposing values to models;
- multimodal document parsing through a dedicated parser service;
- web, desktop, and mobile clients that work with looprig and ACP agents out of
  the box.

These are not independent feature boxes. Their value comes from sharing the
same identity, session, event, policy, storage, and client model.

## Our Honest Position

Today:

> **looprig is one of the stronger foundations for building an agent harness you
> truly own, but it is not yet one of the most complete agent products.**

Where we are going:

> **looprig will be a native harness construction kit, durable workflow engine,
> and foreign-agent meta-harness with clients that work out of the box.**

Our defensible position is not any one feature. Multi-provider access, MCP, ACP,
subagents, workflows, sandboxes, and clients all exist elsewhere.

Our position is the complete machine:

> **Build your own transparent and durable agent system from native primitives,
> compose it into replayable workflows, and operate external agents through the
> same runtime you own.**

The architecture is credible. The remaining work is to make it visible,
coherent, and immediately useful.

For the broader market comparison, see
[The Agent Harness Landscape](agent-harness-landscape.md).
