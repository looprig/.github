# Loop: define one agent

A Loop is the immutable definition of one agent. It answers six questions:

1. What is this agent called?
2. Which model and provider client does it use?
3. What instructions does it follow?
4. Which tools can it call?
5. Which access gate controls those tools?
6. Which other agents may it delegate to?

You define a Loop once and hand it to a [Rig](rig.md). The Rig binds fresh
runtime state for every Session, so the same definition can be reused safely.

## The smallest Loop

```go
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, model),
	loop.WithSystem("Help me plan my work. Be concise and practical."),
)
if err != nil {
	return err
}
```

`WithName` and `WithInference` are required. The system prompt is optional, but
most useful agents define one.

The name is more than a display label. It is the stable identity used by Rig
topology, delegation, attribution, fingerprints, and restoration. Choose a name
that can remain stable across versions of your agent.

## Models and clients are separate

A `model.Model` from `github.com/looprig/inference/model` is a secret-free
description of a model:

- provider name;
- API format;
- endpoint;
- provider-specific model identifier;
- declared capabilities and context limits.

An `inference.Client` performs calls and owns the authentication boundary. API
keys belong on the client, never on the model or Loop.

For an OpenAI-compatible model through OpenRouter:

```go
model := model.CustomModel(
	model.ProviderName(llm.ProviderOpenRouter),
	model.APIFormatOpenAI,
	"https://openrouter.ai/api/v1",
	modelName,
	model.WithTools(),
)
client, err := auto.New(model, auth.APIKey(apiKey))
```

For a local model served by LM Studio:

```go
model := model.CustomModel(
	model.ProviderName(llm.ProviderLMStudio),
	model.APIFormatOpenAI,
	"http://localhost:1234/v1",
	modelName,
	model.WithTools(),
)
client, err := auto.New(model, "")
```

`auto.New` supports providers it can construct from a model and API key alone.
Bedrock requires AWS SigV4 credentials, and Phala requires an attestation policy,
so their provider packages expose direct constructors instead.

Your application owns its model catalog. looprig validates model declarations
but does not silently select or replace models for you.

## Instructions and presentation

```go
agent, err := loop.Define(
	loop.WithName("weekly-planner"),
	loop.WithDisplayName("Weekly Planner"),
	loop.WithDescription("Turns goals and constraints into a realistic weekly plan."),
	loop.WithInference(client, model),
	loop.WithSystem(systemPrompt),
)
```

- `WithName` is the stable machine identity.
- `WithDisplayName` is the human-facing label.
- `WithDescription` helps interfaces and parent agents explain the role.
- `WithSystem` defines the base instructions sent on every inference request.

Keep identity and behavior separate. A display label can change without renaming
the agent in durable topology.

## Tools and permissions

Tools are declared as `tool.Definition` values. A definition is immutable, but
it builds fresh tool instances when a Loop is bound into a Session.

The optional `github.com/looprig/tools` module provides standard definitions. Add each capability explicitly:

```go
loop.WithTools(
	tools.ReadFileDefinition(readGuard),
	tools.WriteFileDefinition(),
	tools.EditFileDefinition(),
	tools.Bash(bash.WithRunner(executor)),
)
```

The file tools require a workspace. A Rig containing them must configure one
of its workspace placements or `rig.Define` will fail.

Tool execution fails secure when no access gate is wired. To let tools run,
install one with `loop.WithAccessGate`. The gate applies the three access states
— `Deny`, `Gated`, `Allow` — to the capabilities each prepared call needs,
routing them to an `AccessSource`. A `*sandbox.Profile` satisfies that seam
directly:

```go
evaluator, err := gate.NewInteractiveEvaluator(
	[]gate.AccessBinding{
		{Kind: "command.execute", Source: profile},
		{Kind: "filesystem.read", Source: profile},
		{Kind: "filesystem.write", Source: profile},
		{Kind: "network", Source: profile},
	},
	ruleStore,           // durable workspace rules (permission.NewWorkspaceStore)
	loop.GateApprover(), // resolves one combined prompt in the live loop
	ruleStore,
	executor,            // *sandbox.Executor mints post-approval grants
)
if err != nil {
	return err
}

agent, err := loop.Define(
	loop.WithName("workspace-assistant"),
	loop.WithInference(client, model),
	loop.WithSystem(systemPrompt),
	loop.WithTools(
		tools.ReadFileDefinition(readGuard),
		tools.WriteFileDefinition(),
		tools.EditFileDefinition(),
		tools.Bash(bash.WithRunner(executor)),
	),
	loop.WithAccessGate(evaluator),
	loop.WithPolicyRevision("workspace-policy-v1"),
)
```

A `Gated` capability uses a matching saved rule or produces one combined
approval offering exactly `Approve`, `Approve always for this workspace`, and
`Deny`. `Allow` proceeds without asking; `Deny` rejects and no saved rule can
override it. Use `gate.NewHeadlessEvaluator` for a non-interactive run.

`WithPolicyRevision` is required when a Loop captures behavior that cannot be
fingerprinted automatically, including an access gate, runtime context
provider, or middleware. Change the revision whenever that behavior changes so
a restored Session cannot silently adopt different policy.

For commands, pair the access gate with the `sandbox` module. The gate
answers whether a call may run. The sandbox controls what the resulting process
can touch, and the same `*sandbox.Executor` is the gate's grant issuer. See
[Build larger systems](larger-systems.md#confine-commands-with-the-os).

## Tool limits

Limit tool activity per turn when an agent can call tools:

```go
loop.WithToolLimits(loop.ToolLimits{
	Iterations: 12,
	Calls:      40,
	Parallel:   4,
})
```

- `Iterations` bounds model and tool cycles in one turn.
- `Calls` bounds total tool calls in one turn.
- `Parallel` bounds calls that may execute concurrently.

Zero values select harness defaults. Negative values are rejected.

## Multiple modes

A Mode is a predeclared alternative model, effort, tool set, tool limits, or set
of additional instructions for the same agent identity.

```go
agent, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, fastModel),
	loop.WithSystem(baseSystem),
	loop.WithModes(
		loop.Mode{
			Name:         "deep-review",
			Model:        reasoningModel,
			Effort:       model.EffortHigh,
			Instructions: "Review assumptions and identify hidden risks.",
		},
	),
	loop.WithInitialMode("deep-review"),
)
```

At runtime, a trusted caller can select a declared mode through
`loop.Controller.SetMode`. It can also change the model or effort atomically with
`loop.Controller.Change`. Runtime changes apply at a turn boundary.

## Delegation

A Loop may name the agents it is allowed to create or address:

```go
planner, err := loop.Define(
	loop.WithName("planner"),
	loop.WithInference(client, model),
	loop.WithSystem("Plan the work and delegate focused research."),
	loop.WithDelegates("researcher"),
	loop.WithDelegation(loop.Delegation{Style: loop.DelegationManaged}),
)

researcher, err := loop.Define(
	loop.WithName("researcher"),
	loop.WithInference(client, model),
	loop.WithSystem("Investigate one question and return evidence."),
)
```

The Rig must contain both definitions. It rejects missing delegates and Loops
that are unreachable from every primer.

Do not add the `Subagent` tool yourself. When a Loop declares delegates, the
harness injects exactly one scoped Subagent tool from the frozen delegate list.
The parent cannot use it to reach an undeclared agent.

- `DelegationSyncOnly` supports a direct request and response.
- `DelegationManaged` also supports sending follow-up work, waiting, checking
  status, and interrupting a child.

The Rig adds global depth and quota limits as a second boundary.

## Context observation and compaction

Context management is explicit. A Loop can either observe context pressure or
automatically compact it.

Both paths require:

- `WithContextCounter`;
- `WithInferenceCapability`;
- either `WithContextObservation` or `WithCompaction`.

Automatic compaction also names a registered `hustle.Definition`. A Hustle is a
bounded, text-only inference job executed outside the normal turn lane. The Rig
registers Hustles and their concurrency, queue, audit, and drain limits.

The harness supplies no compaction thresholds or timeouts. Applications choose
them because model context limits, latency, cost, and summary quality are product
policy.

## Loop option reference

| Option | Purpose |
| --- | --- |
| `WithName` | Stable agent identity. Required. |
| `WithInference` | Provider-neutral client and secret-free model. Required. |
| `WithDisplayName` | Human-facing name. |
| `WithDescription` | Human-facing role description. |
| `WithSystem` | Base system instructions. |
| `WithTools` | Immutable tool definitions. May accumulate across calls. |
| `WithAccessGate` | Combined three-state access decision gate for every tool call. Requires `WithPolicyRevision`. |
| `WithToolMiddlewares` | Tool execution wrappers. |
| `WithToolLimits` | Per-turn iteration, call, and parallelism limits. |
| `WithEngine` | Native, Claude, or Codex execution engine. |
| `WithDrainTimeout` | Bound shutdown of in-flight Loop work. |
| `WithRuntimeContext` | Session-specific instructions or context. |
| `WithPolicyRevision` | Stable identity for opaque behavior. |
| `WithDelegates` | Names this Loop may delegate to. |
| `WithDelegation` | Synchronous or managed delegation style. |
| `WithModes` | Predeclared alternative configurations. |
| `WithInitialMode` | Mode selected when the Loop starts. |
| `WithContextCounter` | Context measurement implementation. |
| `WithInferenceCapability` | Transport capability paired with the counter. |
| `WithContextObservation` | Context pressure without automatic compaction. |
| `WithCompaction` | Explicit automatic compaction policy. |

`loop.Define` validates and freezes the complete definition. It returns typed
errors for missing identity or inference, invalid tools, conflicting context
policy, invalid modes, duplicate singleton options, and unsafe opaque policy.

Next, [assemble your Loops into a Rig](rig.md).
