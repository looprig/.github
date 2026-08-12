---
id: agents/harness/definition
title: Harness definitions and live sessions
description: Resolve immutable Loop and Rig declarations into bound loops, live Session controllers, and restore decisions.
audience: agent
section: agents/harness
order: 29
publication: released
proofs:
  construction-graph:
    - release-github-com-looprig-harness
  public-symbols:
    - release-github-com-looprig-harness
  binding-and-restore-rules:
    - release-github-com-looprig-harness
  composition-shape:
    - release-github-com-looprig-harness
  source-tests-runnable-proof:
    - release-github-com-looprig-harness
  declarations:
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-harness
---

# Definitions and live sessions

## Construction graph

| Stage | API | Owns | Do not put here |
| --- | --- | --- | --- |
| Loop definition | `loop.Define(opts ...loop.Option) (loop.Definition, error)` | immutable name, model, system, tools, modes, limits, gates, context policy, delegates | `tool.Bindings`, session IDs, live queues |
| Bound loop | `Definition.Bind(ctx, tool.Bindings) (loop.BoundDefinition, error)` | session/loop-bound tool instances and read-only runtime view | cross-session mutable state |
| Rig | `rig.Define(opts ...rig.Option) (*rig.Rig, error)` | loop topology, primers, stores, hooks, Hustles, workspaces, limits, restore policy | a live turn |
| Session | `Rig.NewSession(ctx, opts...)` or `Rig.RestoreSession(ctx, id)` | live loops, turns, queues, event subscriptions, gates, resources, shutdown | reusable configuration |

`loop.Definition` and `rig.Rig` validate and freeze configuration. Definitions
reject missing names/clients, invalid models, duplicate options or modes,
negative limits, invalid policy revisions, and incompatible context policy with
typed `*loop.DefinitionError` or `*rig.DefinitionError`. `Definition.Bind`
returns typed `*loop.BindError` for invalid bindings. Read returned slices as
defensive copies.

## Public symbols

| Package | Use these symbols | Human routes |
| --- | --- | --- |
| `loop` | `Definition`, `Define`, `WithName`, `WithInference`, `WithSystem`, `WithTools`, `WithModes`, `WithInitialMode`, `WithToolLimits`, `WithAccessGate`, `WithCompaction`, `WithDelegates`, `WithDelegation`, `BoundDefinition`, `Mode`, `Controller`, `RuntimeCatalog` | [`/docs/guides/harness/loop/define-a-loop`](/docs/guides/harness/loop/define-a-loop), [`/docs/guides/harness/loop/modes`](/docs/guides/harness/loop/modes), [`/docs/guides/harness/loop/models-and-inference`](/docs/guides/harness/loop/models-and-inference), [`/docs/reference/packages/harness/loop`](/docs/reference/packages/harness/loop) |
| `rig` | `Rig`, `Define`, `WithLoops`, `WithPrimers`, `WithSessionStore`, `WithHooks`, `WithHustles`, `WithDelegationLimits`, workspace options, `WithSnapshots`, `WithRestoreDecider` | [`/docs/guides/harness/rig/define-a-rig`](/docs/guides/harness/rig/define-a-rig), [`/docs/guides/harness/rig/validation-and-fingerprints`](/docs/guides/harness/rig/validation-and-fingerprints), [`/docs/reference/packages/harness/rig`](/docs/reference/packages/harness/rig) |
| `session` | `Session`, `SessionController`, `Submit`, `SubmitToLoop`, `SubscribeEvents`, `RespondGate`, `Interrupt`, `Compact`, `SetActiveLoop`, `CheckpointWorkspace`, `RestoreWorkspace`, `Shutdown` | [`/docs/guides/harness/session-runtime/controller`](/docs/guides/harness/session-runtime/controller), [`/docs/guides/harness/session-runtime/create-and-restore`](/docs/guides/harness/session-runtime/create-and-restore), [`/docs/reference/packages/harness/session`](/docs/reference/packages/harness/session) |
| `identity` | `AgentName`, `Coordinates`, `Cause`, `Agency` | [`/docs/reference/packages/harness/identity`](/docs/reference/packages/harness/identity) |

## Binding and restore rules

- `tool.Bindings.SessionID` and `.LoopID` must be non-zero. Bindings are used
  while building tools and are not retained by the immutable definition.
- A `BoundDefinition` is sealed and read-only. Use
  `loop.SelectBoundMode`, `OverrideBoundAccess`, or the validated runtime
  override helpers at the composition boundary; do not mutate a definition.
- `rig.WithLoops` requires unique names. Every primer names a configured loop;
  delegate names and modes must resolve in the frozen topology.
- `SessionStarted` records the configuration fingerprint/manifest. Restore
  compares the live configuration, workspace placement, runtime identity, and
  policy posture. A mismatch needs a consumer `session.RestoreDecider`; do not
  bypass it by changing journal records.
- `RestoreDecision.Accept` is audited with a bounded source, actor, and message.
  Use `errors.As` for `*session.RestoreError`, `*session.ConfigMismatchError`,
  `*session.RestoreRejectedError`, and workspace restore errors.

## Composition shape

```go
agent, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
	loop.WithTools(defs...),
)
store, err := sessionstore.Open(memstore.New())
runtime, err := rig.Define(
	rig.WithLoops(agent), rig.WithPrimers("assistant"), rig.WithSessionStore(store),
)
session, err := runtime.NewSession(ctx)
defer session.Shutdown(context.Background())
```

The store is opened by the composition root and closed after the session. A
session's `ActiveLoop` and `LoopController` are live views; use them only while
that session is open.

## Source, tests, runnable proof

- [`pkg/loop/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition.go), [`pkg/loop/bound_overrides.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/bound_overrides.go), [`pkg/loop/definition_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition_test.go).
- [`pkg/rig/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/definition.go), [`pkg/rig/options.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/options.go), [`pkg/rig/lifecycle.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/lifecycle.go), [`pkg/rig/lifecycle_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/lifecycle_test.go).
- [`pkg/session/session.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/session/session.go), [`pkg/session/decider.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/session/decider.go), [`pkg/session/contracts_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/session/contracts_test.go).
- [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go) and [`examples/lifecycle/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/lifecycle/example_test.go).
