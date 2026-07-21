# looprig Glossary

This glossary defines the shared language used across looprig's code,
documentation, and public interfaces. It focuses on terms that have a specific
meaning inside the project.

Capitalized terms such as **Loop**, **Rig**, and **Session** name public runtime
concepts. Lowercase terms such as **harness** or **flow** usually name a module
or a general idea. Where an item is not implemented yet, its definition is
marked **planned**.

## Core Mental Model

**Agent.** A model-driven program that can receive input, maintain context, use
tools, and produce actions or answers within defined boundaries.

**Agent harness.** The machinery that turns model capability into a usable
agent system. It coordinates context, tools, permissions, events, storage,
recovery, and interfaces around one or more agents.

**Agent loop.** The execution cycle in which a model receives context, produces
output or requests a tool, receives the tool result, and continues until the
Turn ends. A looprig **Loop** is the owned definition and runtime boundary around
that cycle.

**Agentic system.** The complete system built from agents and the machinery
around them. It may include Loops, deterministic tasks, workflows, people,
storage, external services, and user interfaces.

**looprig.** The overall open source project and ecosystem. It includes the
harness, workflow engine, inference stack, storage backends, the sandbox,
standard tools, interfaces, and complete Rigs built from those parts.

**harness.** The runtime module that provides Loops, Rigs, Sessions, tools,
gates, journals, workspaces, delegates, and lifecycle control. The harness
provides the parts. A user assembles a Rig.

**Loop.** The immutable definition of one agent. A Loop selects the agent's
identity, model, instructions, tools, permissions, modes, context policy, and
delegation behavior.

**Rig.** The agent system a user configures, owns, and runs. A Rig assembles one
or more Loops with storage, workspace, access, lifecycle, and delegation
policy. looprig is the project. A Rig is what someone builds with it.

**Session.** One running or restorable instance of a Rig. A Session owns the
live execution state, event history, active Loop, selected access profile,
workspace, and pending gates for a body of work.

**Turn.** One unit of interaction submitted to a Loop, including the model and
tool activity required to complete it.

**Step.** One model execution step within a Turn. A step may produce content,
request tools, or end the Turn.

**Tool.** A named capability a Loop can ask to use, such as reading a file,
running a command, searching, or calling an application API. Tools are selected
individually and remain under the runtime access gate and OS confinement.

**Workflow.** Durable coordination across tasks, agents, people, and external
systems. In looprig, workflows are built with the `flow` module and are separate
from the model-driven execution inside a Loop.

## Foundational AI Terms

**GPU.** Graphics processing unit. GPUs provide the highly parallel computation
used to train and run many neural networks.

**JEPA.** Joint Embedding Predictive Architecture. A family of neural network
architectures that learns by predicting representations rather than directly
reconstructing every detail of an input.

**Large language model or LLM.** A neural network trained across large amounts
of language and other data. LLMs are one form of neural network, not the name
for all machine intelligence.

**Machine intelligence.** The knowledge and reasoning capability produced by
machine learning models. looprig supplies machinery around this capability; it
does not create the underlying intelligence.

**Multimodal model.** A model that can process or produce more than one kind of
content, such as text, images, audio, or documents.

**Neural network.** A learned computational system made from connected layers
of parameters. Neural networks include LLMs, multimodal models, JEPA systems,
and other model families.

**RAG.** Retrieval-augmented generation. A pattern that retrieves relevant
external information and supplies it to a model as context for a response.

**TPU.** Tensor processing unit. A specialized processor built to accelerate
the tensor computations used by machine learning models.

## Agents and Runtime

**Actor.** A runtime component that owns its mutable state and processes
commands serially. Native Loops use this model to keep concurrent activity from
creating conflicting state transitions.

**Active Loop.** The Loop currently selected to receive top-level user input in
a Session.

**Agency.** The identity of the actor responsible for an action, such as a
person, Loop, delegate, policy, or system component.

**Cause.** Correlation information that records what caused an event or action.
It lets later work be traced back to its originating Turn, tool call, delegate,
or control request.

**Context.** The messages, instructions, tool results, summaries, and other
content available to a model for an inference request.

**Context compaction.** Replacing older context with a smaller durable summary
so a Session can continue within the model's context limit.

**Context counter.** A component that estimates or exactly counts how many
tokens a complete inference request will consume.

**Context observation.** A measurement of current context use, including token
count, capacity, and occupancy.

**Context occupancy.** The proportion of a model's available context window
currently in use. It can be used to decide when compaction should begin.

**Context window.** The maximum amount of input and generated content a model
can consider in one request.

**Controller.** A public control surface for changing live state, such as
interrupting work, changing a mode, or selecting the active Loop.

**Command.** A typed request to change runtime state, such as submitting user
input, interrupting a Turn, resolving a Gate, or starting compaction. Commands
express intent; Events record what happened.

**Coordinates.** Stable identifiers that locate an action or event within its
Rig, Session, Loop, Turn, Step, and related execution scope.

**Delegate.** A Loop invoked by another Loop to perform bounded work. The parent
retains responsibility for the overall task.

**Delegation style.** The way a parent may use a Delegate. Synchronous-only
delegation returns one bounded result, while managed delegation permits a
longer-lived child Loop under Session control.

**Delegation depth.** The maximum number of parent-to-child delegation levels
allowed in a Session.

**Delegation quota.** The maximum amount of delegate work allowed by Rig policy.

**Foreign agent.** An agent runtime built outside the native looprig harness,
such as Codex or Claude Code, that is adapted into looprig's session and event
model.

**Foreign Loop.** The looprig representation of a foreign agent. It normalizes
the foreign runtime's input, output, tool activity, permissions, and session
identity without pretending it is a native Loop.

**Foreign session ID.** The session identifier assigned by a foreign agent. It
is preserved alongside looprig's own Session identity so either side can resume
the same work.

**Handle.** The public data-plane surface used to interact with a running Loop
or Session without exposing its internal runtime implementation.

**Hustle.** Auxiliary, managed model work performed for a Session, such as
context compaction or a future classifier. A Hustle is not a user-facing Loop
and has its own purpose, limits, inference binding, run identity, and outcome.

**Human in the loop.** A design in which work can pause for a person's judgment
when authority, ambiguity, or consequences require it.

**Inference binding.** The resolved model and inference client assigned to a
Loop or Hustle at runtime.

**Loop definition.** The immutable recipe used to construct a Loop. Binding the
definition resolves its runtime dependencies without changing the recipe.

**Loop engine.** The execution mechanism behind a Loop. It may be the native
harness engine or a foreign engine such as Claude Code or Codex.

**Meta-harness.** A harness that can host and coordinate other agent harnesses.
looprig is being built to operate native Loops and foreign agents through the
same owned Session, policy, event, storage, workflow, and client model.

**Native Loop.** A Loop executed directly by the looprig harness from explicit
model, context, tool, permission, and lifecycle parts.

**Orchestration.** Coordinating several tasks or actors into one body of work.
Loops orchestrate model and tool activity; Rigs coordinate agents; `flow`
coordinates durable workflows.

**Loop mode.** A named behavioral setting exposed by a Loop. Modes let a user
change an approved part of its behavior without replacing the Loop definition.

**Memory.** Information an agent can reuse beyond the immediate input. In
looprig, this may come from Session history, compacted context, workspace files,
or an application-provided store. Memory is not one hidden global subsystem.

**Primer.** A Loop that is eligible to receive top-level user input. A Rig can
contain several Primers and selects one as the initial active Loop. The active
Loop may change during the Session.

**Provenance.** Information about where instructions, content, configuration,
or actions came from. Provenance supports auditing and policy decisions.

**Runtime context.** Session and environment information supplied to a Loop at
execution time, separate from its immutable definition.

**Quiescence.** The state in which a Session and its participating Loops have no
active work. The Event hub federates those activity signals so a caller can
reliably wait for the whole Session to become idle.

**Single-flight.** An execution rule that permits only one active Turn in a
given Loop at a time.

**Subagent.** General language for an agent working under another agent. In the
harness, managed subagent work is represented through delegation to another
Loop.

**Transcript.** The ordered human-readable projection of a Session's
conversation and tool activity. It is derived from typed runtime history rather
than serving as the source of truth for restoration.

**System prompt.** The highest-level model instructions selected by a Loop
definition. It guides model behavior but does not replace runtime permissions
or OS confinement.

## Models, Inference, and Content

**API format.** The wire-level request and response shape used to communicate
with a model endpoint. OpenAI, Anthropic, and Gemini formats are supported as
native formats. A provider and an API format are not the same thing.

**Capability.** A declared model feature such as tool use, images, audio,
thinking, or structured output. Capabilities let the runtime validate a request
before sending it.

**Chunk.** One incremental piece of a streaming model response.

**Codec.** The component that translates neutral inference requests and
responses to and from a specific API format.

**Content block.** One typed unit of content in a message. Current block types
include text, image, audio, document, thinking, tool use, and tool result.

**Conversation.** An ordered collection of messages supplied as model context.

**Delta.** A streaming update that adds to or changes the response accumulated
so far.

**Inference.** Running a model against a request to produce a response. The
`inference` module defines the provider-neutral contract for this operation.

**Inference client.** An implementation of the neutral invoke and stream
contract. It sends requests through a selected transport and API codec.

**Message.** A role and an ordered collection of content blocks exchanged in a
conversation.

**Model.** A secret-free description of the model to invoke, its provider
origin, API format, endpoint selection, and capabilities. Credentials are
resolved outside the model value.

**Model origin.** Provenance describing which provider or route supplied a
model, used for validation and policy decisions.

**Model SDK.** A library focused on calling one or more model APIs. It commonly
normalizes generation, streaming, tools, and structured output, but does not by
itself provide the complete durable agent harness.

**Multimodal.** Able to work with more than text, including images, audio, and
documents.

**Provider.** The service or runtime that makes a model available. The `llm`
module owns provider-specific authentication, validation, and routing policy.

**Router.** A component that directs neutral inference requests to the correct
API implementation and transport.

**Streaming.** Delivering model output incrementally as chunks instead of
waiting for the complete response.

**Structured output.** Model output constrained to a declared data shape,
usually a JSON schema, so an application can validate and consume it reliably.

**Thinking block.** Typed model reasoning content when a provider makes that
content available. Its handling depends on provider and Loop policy.

**Token usage.** Normalized input, output, cache, and reasoning token counts
reported for an inference request.

**Transport.** The connection-bound mechanism that carries an inference
request, usually HTTP, independently from the request's API format.

**Wire format.** The concrete bytes and framing exchanged with an external
model API, including JSON, Server-Sent Events, or newline-delimited JSON.

**Attestation.** Cryptographic evidence about the software and environment
running a confidential inference service.

**Confidential inference.** Model inference designed to protect requests and
responses from the surrounding service infrastructure through attestation,
trusted execution, or end-to-end encryption.

**SigV4.** AWS Signature Version 4. The request-signing authentication method
used for services such as Amazon Bedrock.

**TEE.** Trusted execution environment. Hardware-backed isolation used to run
code and handle data with evidence about the executing environment.

## Tools, Permissions, and Safety

**Approval scope.** The boundary within which a granted permission remains
valid, such as one action, one Turn, one Session, or another explicitly defined
scope.

**Auditable tool.** A tool that reports the security-relevant operation it is
about to perform so the runtime can record and evaluate it.

**Classifier.** A component that labels input for policy use. Planned
classifiers include detection of prompt injection and other untrusted content.

**Access profile.** The complete, immutable set of access states a Session's
commands run under: a `Deny`/`Gated`/`Allow` value for each capability
(workspace read/write, host read/write, network, command execution) plus HOME
and isolation choices. A profile is the sandbox's `AccessSource` for the gate and
the source of truth for OS enforcement, so a decision and its enforcement cannot
drift. It is selected before a Session opens and fixed for that Session.

**Access state.** One of the three per-capability decisions in an access profile:
`Deny` (reject without asking; no saved rule overrides it), `Gated` (use a
matching saved rule or ask once), or `Allow` (proceed).

**Confinement.** Whether a command runs inside an OS sandbox (`Sandboxed`) or
directly with the invoking user's authority (`Unconfined`). It is a property of
the executor, independent of the per-capability access states.

**Effect.** What resolving a Gate does to execution. A response may resume
parked work, initiate follow-up work, or apply a control-plane action.

**Fail closed.** Refusing an operation when the required permission or safety
guarantee cannot be established. The system does not silently fall back to a
less safe mode.

**Gate.** A durable pause that requires input from a person or policy before
work can continue. Gates are used for permissions, questions, and resumable
control decisions.

**Gate criticality.** Whether an unresolved Gate must survive restoration or may
be abandoned when a Session is restored.

**Gate control.** The live operation used to answer, reject, or otherwise
resolve a pending Gate.

**Gate resolver.** The Loop-level or Session-level owner responsible for
processing a Gate response.

**Gate route.** The Gate, Loop, and tool execution identifiers needed to deliver
a response to the correct resolver.

**Grant token.** An authenticated token issued by the sandbox authority to
permit a bounded escalation that untrusted code cannot forge.

**Guardrail.** A check or policy applied around model input, output, tool use,
or workflow execution. Broader integrated guardrails are planned.

**Permission.** Runtime authority for a proposed tool or system action. A model
requesting an action does not itself grant permission to perform it.

**Call preparer.** The preparation boundary a tool owns. It decodes and validates
untrusted arguments once, normalizes and canonicalizes the resources involved,
and emits one typed request listing the capability requirements the call needs.
Tools classify capabilities; the access gate decides `Deny`, `Gated`, or `Allow`.

**Prompt injection.** Untrusted content that attempts to redirect an agent,
override its instructions, obtain secrets, or cause unsafe actions.

**Read guard.** An in-process check that decides whether a native tool may read
a path. It complements OS confinement for subprocesses.

**Sandbox.** OS-level enforcement around spawned commands. The `sandbox` module
can restrict filesystem, process, network, environment, and resource access.

**Sandbox guarantee.** A report of what the current host actually enforced.
The sandbox reports achieved guarantees, not only the policy that was
requested.

**Restrict.** The operation that intersects a base access profile with a ceiling,
component-wise, without ever widening the base. It is how a role such as a
reviewer is held below the Session's selected profile.

**Grant.** A short-lived, single-spawn capability token the sandbox executor
mints only after the gate approves a `Gated` requirement. It binds the exact
command, working directory, profile fingerprint, and expiry, and is never a
durable permission record.

**Secret brokerage.** **Planned.** Resolving secret references only inside an
authorized tool or transport so raw secret values do not enter model context.

**Tool definition.** The reusable, unbound description of a tool, including its
name, input schema, and factory.

**Tool binding.** A tool definition connected to the runtime dependencies and
policy required for one Loop.

**Tool call.** One model request to invoke a named tool with structured input.

**Tool middleware.** A wrapper that can observe or constrain tool invocation
without changing the tool's business logic.

**Tool result.** The typed output of a tool call returned to the Loop. It may
contain content for the model and separate runtime metadata.

**Unconfined.** An explicitly acknowledged mode with no OS sandbox boundary. It
is never treated as a safe fallback.

**Untrusted content.** Content whose instructions must not automatically gain
authority, including web pages, files, tool output, and messages from external
systems.

**Workspace permit.** The runtime authority for a tool to perform a declared
operation against the Session workspace.

## Events, Durability, and Recovery

**Ambiguous append.** A storage write whose acknowledgement was lost, leaving
the caller unsure whether the record committed. `AppendDefinite` resolves this
by reading the Ledger state before deciding whether to retry.

**Append-only.** A persistence rule that allows new records to be added but
does not rewrite committed history.

**Blob.** An immutable byte object addressed by a key. Workspace snapshots use
Blobs for durable content.

**CAS.** Compare-and-swap. A write succeeds only if the stored revision or
sequence still matches the caller's expected value.

**Checkpoint.** A durable record of execution state from which work can resume.
Sessions checkpoint workspaces, while `flow` checkpoints graph state and the
execution frontier.

**Configuration fingerprint.** A stable digest of the Rig configuration that
affects restoration. It prevents a Session from silently resuming under an
incompatible definition.

**Content-addressed.** Stored under a key derived from the content itself,
usually a cryptographic digest. Identical content can be reused and corruption
can be detected.

**Enduring event.** An event persisted in the Session Journal because it
changes durable state or is required to reconstruct what happened.

**Ephemeral event.** A live-only event, such as a streaming token delta, that is
useful to clients but is not written to the Journal.

**Epoch.** A strictly increasing ownership generation assigned by a Lease. A
new owner receives a newer epoch than every prior owner.

**Event.** A typed fact emitted by the harness about Rig, Session, Loop, Turn,
Step, tool, gate, workspace, delegate, or lifecycle activity.

**Event hub.** The Session-level fan-in that publishes live events, tracks
subscribers, and supports quiescence without becoming the durable Journal.

**Fencing token.** The epoch used to prevent a stale process from continuing as
the accepted owner after another process has taken the Lease. The Session
Journal records its writer epoch as an opening fence.

**Journal.** The ordered, durable history of enduring Session events.

**Journal sequence.** The monotonic position of an enduring event in the
Journal. Ephemeral events do not receive one.

**KV.** A revisioned key-value storage primitive whose writes use CAS.

**Lease.** Time-bounded, single-writer ownership of a named resource. Leases
and epochs prevent two runtimes from safely claiming the same Session writer.

**Ledger.** The neutral append-only record log defined by `storage`. A Session
Journal is persisted on a Ledger.

**Restore.** Reconstructing a Session and its workspace from durable events,
snapshots, and compatible Rig configuration.

**Snapshot.** An immutable capture of workspace contents. Snapshots can be
taken manually or by policy when a Step, Turn, or idle transition completes.

**Snapshot policy.** The rule that decides when workspace snapshots are taken
and whether a snapshot failure is best-effort or must fail the operation.

**Snapshot priority.** Whether a snapshot is best-effort or required. A
required snapshot failure fails the surrounding operation instead of being
reported only as an observation.

**Storage backend.** A concrete implementation of the neutral Ledger, Leaser,
KV, or Blobs contracts.

**Workspace.** The filesystem state assigned to a Session. It is where tools
read and change working files.

**Exclusive workspace.** A workspace whose root is leased so only one Session
runtime can own it at a time.

**Per-session workspace.** A separate workspace root created for each Session.
It isolates working files between Sessions.

**Shared workspace.** A workspace root intentionally used without exclusive
per-Session placement. Required snapshots are not permitted for this placement
because another actor may change the same files.

**Workspace coordinator.** The runtime boundary that validates and observes
tool operations against a workspace.

**Workspace observation.** Recorded information about files a tool read,
created, changed, or removed.

**Workspace store.** The harness component that captures and restores
content-addressed workspace snapshots through `storage.Blobs`.

## Durable Workflows

**Bulk Synchronous Parallel.** The execution model used by `flow`. All vertices
in a super-step read the same frozen state, run in parallel, then cross a
barrier before their reducers are applied in stable order.

**Conditional edge.** A graph connection whose destination is chosen from the
current state or task result.

**Control plane.** The component that coordinates workflow execution across
workers. The term also describes session operations that change live state,
such as gates and interrupts.

**Edge.** A directed connection that determines which graph vertex may run
after another vertex completes.

**Flow.** A durable workflow defined and run through the `flow` module. In
ordinary prose, we prefer **workflow** unless referring to the module or public
type.

**Frontier.** The set of graph vertices eligible to execute in the next
super-step.

**Graph.** A typed workflow definition containing vertices, edges, shared
state, and stable identifiers.

**Graph run.** One execution of a compiled Graph, identified independently so
it can be inspected, interrupted, checkpointed, and resumed.

**Graph state.** The shared typed state carried through a workflow. Tasks read
selected input from it and reducers fold task output back into it.

**Idempotency key.** A stable identifier for a side effect. External systems
can use it to avoid performing the same operation twice after a retry or
recovery.

**Ingress.** The boundary that accepts a request to start, resume, or otherwise
control a workflow run.

**Interruption.** An intentional durable pause that returns control to the
caller while preserving enough state to resume later.

**Manifest.** A description of a registered Graph and the task kinds it needs,
used to make workflow definitions discoverable to a control plane.

**Reducer.** A function that folds one task's output into Graph state after the
parallel execution barrier.

**Resume payload.** New information supplied when interrupted work continues,
such as a person's answer or an external system's result.

**Selector.** A function that derives one task's typed input from the frozen
Graph state.

**Super-step.** One parallel round of eligible workflow vertices, followed by a
barrier and deterministic state reduction.

**Task.** A reusable unit of workflow work with typed input and output. A Task
can be deterministic, call an agent, wait for a person, or interact with an
external system.

**Vertex.** A stable position in a Graph that binds a Task to selectors,
reducers, and routing.

**Workflow checkpoint.** The durable Graph state, completed work, frontier,
and execution metadata needed to recover a Graph run.

## Interfaces and Protocols

**ACP.** Agent Client Protocol. **Planned for the general integration.** ACP will
let looprig expose native Rigs to compatible clients and host compatible foreign
agents through a shared protocol. Existing Codex and Claude Code adapters prove
the foreign Loop boundary but are not the complete ACP implementation.

**BFF.** Backend for frontend. A service surface shaped for a particular user
interface while delegating runtime behavior to the harness.

**CLI.** Command-line interface. A text command surface intended for terminals,
scripts, and automation.

**Client.** A user-facing interface that observes and controls a Session, such
as a terminal, web, desktop, or mobile application. This is distinct from an
inference client, which calls a model API.

**Control plane operation.** A request that changes live execution, such as
submitting input, resolving a Gate, interrupting work, changing a mode, or
restoring a Session.

**HTTP API.** The harness service interface for Session history and control.
Its live event stream uses SSE.

**JSON-RPC.** A request and response protocol encoded in JSON. It is used by
several external agent and tool protocols.

**Live plane.** The stream of events produced while a Session is running. It
contains both enduring and ephemeral events.

**History-to-live join.** The handoff a client performs from durable Journal
history to the live event stream without losing or duplicating enduring events.

**MCP.** Model Context Protocol. **Planned.** MCP integration will connect
external tools and context servers to Loops while preserving looprig's
authentication, permission, gate, provenance, and audit boundaries.

**NDJSON or JSONL.** Newline-delimited JSON, where each line is one complete
JSON value. It is useful for streaming structured records between processes.

**Read plane.** The durable history surface used to inspect a Session from its
Journal, whether or not that Session is currently running.

**SSE.** Server-Sent Events. A one-way HTTP stream used to deliver live Session
events to clients.

**TUI.** Terminal user interface. looprig's interactive terminal presentation
layer is separate from the harness runtime.

## Evaluation and Observability

**Evaluation.** A repeatable test of an agent or workflow against defined cases
and metrics.

**Golden set.** A maintained collection of representative evaluation cases and
expected properties used to detect regressions.

**Hook.** A lifecycle callback that observes runtime or workflow activity
without owning the underlying state transition.

**LLM judge.** A model used as an evaluation metric to score output against a
rubric. Its score is evidence, not an infallible ground truth.

**Metric.** A rule that converts an evaluation result into a score or pass/fail
decision.

**OpenTelemetry.** A vendor-neutral standard for traces, metrics, and logs.
Complete correlated instrumentation across looprig is planned; existing events
and hooks provide part of the required foundation.

**Score.** A metric's structured evaluation of one result, including its value,
reasoning, and threshold outcome.

**Span.** One timed operation inside a distributed trace, such as an inference,
tool call, Gate, delegate run, or workflow task.

**Trace.** Correlated observability data that follows work across components and
services.

## Modules and Repositories

**`tui`.** The interactive terminal presentation module. It provides the TUI surface
without making the harness depend on terminal libraries.

**`client`.** **Planned.** The shared client module for web, desktop, mobile,
and framework-specific interfaces over the harness HTTP and SSE contract.

**`coderig`.** A complete coding Rig built from looprig modules. It demonstrates
how an application owns model policy, Loop definitions, tools, prompts,
delegation, storage, and its composition root.

**`core`.** The smallest shared vocabulary, including typed content, UUIDs,
stream accumulation, and structured logging helpers.

**`flow`.** The durable, replayable workflow engine for typed graphs, parallel
tasks, retries, checkpoints, interruptions, and resume.

**`foreignloop`.** The harness boundary and adapters that translate external
agent runtimes into looprig's Loop, Session, permission, and Event vocabulary.

**`fsstore`.** The local-filesystem implementation of all four `storage`
primitives.

**`inference`.** The provider-neutral model contract, content mapping, codecs,
streaming, routing, transport, usage, and context counting layer.

**`llm`.** The provider policy and integration layer built on `inference`. It
adds authentication, provider selection, model validation, and concrete model
services.

**`memstore`.** The in-memory reference backend for the four `storage`
primitives. It is useful for tests and short-lived local execution.

**`natsstore`.** The distributed implementation of all four `storage`
primitives over NATS JetStream. It can use an embedded or remote server.

**`rclonestore`.** A `storage.Blobs` implementation that uses the external
`rclone` program to reach local or cloud remotes without linking its dependency
tree into looprig.

**`sandbox`.** The standalone module that owns the access profile and its OS
enforcement for commands. It compiles a profile into the strongest available OS
boundary, mints post-approval grant tokens, and reports the guarantees achieved
by the current platform.

**`storage`.** The dependency-light persistence contract module. It defines
Ledger, Leaser, KV, and Blobs plus reference and conformance utilities.

**`storetest`.** The shared conformance suite that checks whether a storage
backend obeys the neutral storage contracts.

**`serve`.** The harness package that projects Session history, live events,
input, Gates, interrupts, and restore over an HTTP and SSE API.

**`sessionstore`.** The harness persistence facade that stores and reconstructs
Session Journals over the neutral `storage` contracts.

**`tests`.** The cross-repository integration module that verifies looprig
modules work together through their public contracts.

**`tools`.** Optional standard tool implementations. Consumers can select each
tool independently, combine them with custom tools, or use none of them.

## Architecture and Engineering Language

**Composition root.** The application location where concrete models, stores,
Loops, tools, policies, interfaces, and other dependencies are selected and
wired together. The user's application remains the final composition root.

**Conformance suite.** Reusable tests that every implementation of a public
contract must pass.

**Contract hub.** A small, stable module that defines shared interfaces and
types without depending on their concrete implementations.

**Data plane.** The surface used for ordinary runtime work, such as submitting
input, receiving output, and invoking tools, rather than changing control
policy.

**Dependency inversion.** Defining a small contract at the layer that needs it,
then supplying concrete behavior from the outside. This keeps the harness from
depending directly on every backend or integration.

**Dependency direction.** The rule that lower, more stable contract modules do
not import higher-level products or concrete integrations. Dependencies point
toward shared contracts.

**Durability.** The ability to preserve and recover meaningful state after a
crash, restart, disconnection, pause, or move to another machine.

**Leaf module.** A narrowly scoped module with few dependencies and no reason
to import the wider looprig runtime.

**Module.** An independently versioned Go module and repository boundary, such
as `harness`, `flow`, or `storage`.

**Package.** A Go source boundary inside a module. Packages group closely
related types and behavior.

**Public seam.** An intentional interface between replaceable parts of the
system, such as inference, storage, the sandbox, or foreign agent execution.

**Reference backend.** A small implementation used to demonstrate and test the
expected behavior of a contract.

**Reference oracle.** A simple implementation whose behavior is used as the
expected result when testing more complex implementations.

**Replay.** Reconstructing state deterministically from durable history or
checkpoints without repeating already committed side effects.

**Structural coupling.** Satisfying a small Go interface by method shape rather
than importing the package that owns a concrete implementation.

**SDK.** Software development kit. A library surface intended to be embedded in
another application, as distinct from a finished agent product.

**stdlib-first.** A project preference for the Go standard library at stable
contract layers, adding third-party dependencies only where they provide clear
value and can be contained.

## Mission and Brand

**Federated knowledge.** Knowledge and reasoning made broadly available through
open, composable systems instead of remaining trapped in a few people,
institutions, models, or vendors. Here, federated describes access and ownership,
not one specific distributed-learning technique.

**Industrial Revolution.** The historical transformation in which engines,
machine tools, factories, and infrastructure converted new sources of physical
power into large-scale automation.

**Intellectual Revolution.** Our name for the shift from knowledge and
reasoning concentrated in a few people toward intelligence that can be made
widely available through neural networks and the machinery built around them.

**Lathe.** The mission metaphor for looprig. GPUs and TPUs provide computing
power, neural networks turn it into intelligence, and looprig gives that
intelligence the precision and control needed to produce useful systems. The
power source will keep changing. We intend looprig to remain the adaptable
machine that puts it to work.

**Steam engine.** The mission metaphor for a foundational source of power. In
the current era, GPUs and TPUs supply computation in the way steam engines once
supplied mechanical power. Neural networks turn that computation into
intellectual capability.

**Loop in the logo.** The open infinity form represents intelligence and its
continuing potential.

**Rig in the logo.** The triangle represents the structure that contains,
directs, and makes that potential reliable.

**Rig in the name.** A rig is assembled equipment that harnesses power for a
purpose. Sailing rigs harness wind, drilling rigs put mechanical power to work,
and test rigs make systems controlled and repeatable. A looprig applies that
same idea to an agent Loop.

**Electric Lime, `#D4F84D`.** The energy color. It represents the active power
of intelligence moving through the Rig.

**Light Sky Blue, `#A2D2FF`.** The stability color. It represents trust,
reliability, clarity, and calm control around that power.

**The rig that runs the loop.** A compact expression of the project name: the
Loop is the continuing intelligence, and the Rig is the owned machinery that
makes it useful.
