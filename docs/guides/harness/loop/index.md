---
id: guides/harness/loop/index
title: Overview
description: Freeze one agent's model, instructions, tools, limits, modes, and delegation policy.
audience: developer
section: guides
order: 6
publication: released
proofs:
  how-it-works: [release-github-com-looprig-harness]
  configure-a-loop: [release-github-com-looprig-harness]
  lifecycle: [release-github-com-looprig-harness]
  public-boundary: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Loop

A `loop.Definition` is one agent's immutable design-time contract. It carries the
inference client and model, system text, declared tool factories, access policy,
limits, context policy, output schema, modes, and delegate names. It contains no
conversation, goroutine, lease, or session ID. A [Rig](/docs/guides/harness/rig)
owns the graph of definitions and binds them when it creates a session.

## How it works

The public lifecycle has three deliberately different values:

| Value | Created by | Owns | May mutate live state? |
| --- | --- | --- | --- |
| `loop.Definition` | `loop.Define(opts ...loop.Option)` | validated, frozen policy | no |
| `loop.BoundDefinition` | `Definition.Bind(ctx, tool.Bindings)` | fresh tool instances and resolved modes | no; read-only view |
| `loop.Handle` / `loop.Controller` | a session runtime | live loop identity and actor commands | `Controller` only, at turn boundaries |

Binding is a separate step because tool factories receive session and loop IDs.
The definition can therefore be reused by several sessions without sharing tool
instances or mutable slices. The public package does not expose the internal
`loopruntime.Loop`; use `session.Session` and `session.SessionController` for
conversation, events, persistence, and shutdown.

```mermaid
%%{init: {"theme":"dark"}}%%
flowchart LR
    O[loop.Option values] --> D[loop.Define]
    D -->|validated| DF[immutable loop.Definition]
    DF -->|Bind(ctx, tool.Bindings)| B[loop.BoundDefinition]
    B --> H[live loop Handle]
    H --> C[loop.Controller]
    C --> T[turn-boundary changes]
```

## Configure a Loop

The smallest definition has a name and a valid provider-neutral model. The
inference client is an `inference.Client`; the model is `model.Model`.

```go
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel), // client is an inference.Client.
	loop.WithSystem("You help the user inspect and change a project."),
	loop.WithTools(readFile, grep, editFile),  // tool.Definition values.
)
if err != nil {
	var definitionErr *loop.DefinitionError
	if errors.As(err, &definitionErr) {
		log.Printf("definition rejected: %s", definitionErr.Kind)
	}
	return fmt.Errorf("define loop: %w", err)
}
```

Every option is applied once for singleton settings. `WithTools`,
`WithToolMiddlewares`, `WithDelegates`, and `WithModes` are additive. A gated
or middleware-enabled loop must include a nonempty `WithPolicyRevision`; this
opaque revision gives restore a stable identity for function-valued policy.
Context counting requires a counter, an inference capability, and exactly one
of observation or compaction; see [Context Observation](/docs/guides/harness/loop/context-observation)
for the policy split and [Compaction Policy](/docs/guides/harness/loop/compaction-policy).

## Lifecycle

The Rig checks that delegate names exist and that every registered loop is
reachable from a primer. A session then binds each definition, creates a live
loop actor, and routes input through a [Turn](/docs/guides/harness/turn). A Turn
may contain several conceptual [Steps](/docs/guides/harness/step). A controller
change is validated and committed at a turn boundary; it does not mutate the
immutable definition or retroactively change a running step.

## Public boundary

The sealed `BoundDefinition` interface exposes read-only accessors such as
`Model`, `EffectiveSystem`, `Tools`, `Mode`, `ContextCounter`, and
`RuntimeIdentity`. It returns defensive copies for models, slices, and output
schemas. `Handle` exposes only `ID`, `Mode`, and `Model`; `Controller` embeds it
and adds `SetMode`, `Change`, and subtree-scoped `Interrupt`.

Do not type-assert a bound value to an internal runtime or construct an actor
directly. That would bypass session ownership, durable events, and shutdown
ordering.

## Source and proof

- [Definition, binding, options, and the sealed bound view](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Public handle/controller contracts and typed change errors](https://github.com/looprig/harness/blob/main/pkg/loop/controller.go)
- [Loop public-boundary tests](https://github.com/looprig/harness/blob/main/pkg/loop/public_boundary_test.go)
- [Definition validation, defaults, and defensive-copy tests](https://github.com/looprig/harness/blob/main/pkg/loop/definition_test.go)
