---
id: agents/harness/index
title: Harness agent index
description: Token-efficient routing for Harness packages, symbols, source proofs, invariants, and composition recipes.
audience: agent
section: agents/harness
order: 28
publication: released
proofs:
  route-by-task:
    - release-github-com-looprig-harness
  public-package-map:
    - release-github-com-looprig-harness
  canonical-composition-recipes:
    - release-github-com-looprig-harness
  cross-cutting-invariants:
    - release-github-com-looprig-harness
  source-and-runnable-proof-set:
    - release-github-com-looprig-harness
  source:
    - release-github-com-looprig-harness
  examples:
    - release-github-com-looprig-harness
---

# Harness agent index

Use this page after [`/llms.txt`](/llms.txt). The published module is
`github.com/looprig/harness@v0.24.2`; resolve the module record before adding a
dependency. The source links below pin the checked-out Harness proof at
`8b91dadbb8d52d6486e0e5808803881d9888b19b`. Read code and tests as authority;
the human routes are navigation targets only.

## Route by task

| Task | Agent page | Human route roots |
| --- | --- | --- |
| Define a Loop, Rig, Session, or restore policy | [`definition.md`](definition.md) | [`/docs/guides/harness/loop`](/docs/guides/harness/loop), [`/docs/guides/harness/rig`](/docs/guides/harness/rig), [`/docs/guides/harness/session-runtime`](/docs/guides/harness/session-runtime) |
| Submit, control, observe, or shut down runtime work | [`runtime.md`](runtime.md) | [`/docs/guides/harness/commands`](/docs/guides/harness/commands), [`/docs/guides/harness/events`](/docs/guides/harness/events), [`/docs/guides/harness/turn`](/docs/guides/harness/turn), [`/docs/guides/harness/step`](/docs/guides/harness/step) |
| Add tools, permissions, approvals, or hooks | [`policy.md`](policy.md) | [`/docs/guides/harness/gates`](/docs/guides/harness/gates), [`/docs/guides/harness/hooks`](/docs/guides/harness/hooks) |
| Persist, replay, restore, or checkpoint state | [`persistence.md`](persistence.md) | [`/docs/guides/harness/session-persistence`](/docs/guides/harness/session-persistence), [`/docs/guides/harness/workspaces`](/docs/guides/harness/workspaces) |
| Delegate, compact, run Hustles, or attach a foreign backend | [`delegation.md`](delegation.md) | [`/docs/guides/harness/delegation`](/docs/guides/harness/delegation), [`/docs/guides/harness/compaction`](/docs/guides/harness/compaction), [`/docs/guides/harness/hustles`](/docs/guides/harness/hustles) |
| Expose reads and live controls over HTTP | [`serve.md`](serve.md) | [`/docs/guides/harness/http-server`](/docs/guides/harness/http-server) |

The module-level orientation is [`/docs/guides/harness`](/docs/guides/harness).
The existing composition recipes remain useful for cross-module selection:
[`minimal-harness`](../composition/minimal-harness.md),
[`tools`](../composition/tools.md),
[`gates-sandbox`](../composition/gates-sandbox.md),
[`persistence`](../composition/persistence.md), and
[`delegation`](../composition/delegation.md).

## Public package map

| Package | Primary public surface | Human reference |
| --- | --- | --- |
| `pkg/loop` | `Define`, `Definition`, `BoundDefinition`, `Mode`, `Controller`, `RuntimeCatalog`, `CompactionPolicy` | [`loop`](/docs/reference/packages/harness/loop) |
| `pkg/rig` | `Define`, `Rig`, `Option`, `NewSession`, `RestoreSession`, `DelegationLimits`, workspace and snapshot options | [`rig`](/docs/reference/packages/harness/rig) |
| `pkg/session` | `Session`, `SessionController`, `RestoreDecider`, typed restore and runtime errors | [`session`](/docs/reference/packages/harness/session) |
| `pkg/command` | sealed `Command`, command envelopes, `ValidateCommand`, JSON codec | [`command`](/docs/reference/packages/harness/command) |
| `pkg/event` | sealed `Event`, headers, classes, scopes, filters, terminal and lifecycle records, JSON codec | [`event`](/docs/reference/packages/harness/event) |
| `pkg/hub` | `Hub`, `EventSubscription`, event publication, turn reservations, idle and fault boundaries | [`hub`](/docs/reference/packages/harness/hub) |
| `pkg/tool` | `Definition`, `Bindings`, `InvokableTool`, `CallPreparer`, `Request`, `PreparedCall`, process and delegate contracts | [`tool`](/docs/reference/packages/harness/tool) |
| `pkg/gate` | `Evaluator`, access bindings, `Gate`, responses, approvals, forms, permission review | [`gate`](/docs/reference/packages/harness/gate) |
| `pkg/hook` | `Set`, `Compile`, `Runner`, guard and around operations, typed snapshots | [`hook`](/docs/reference/packages/harness/hook) |
| `pkg/hustle` | immutable `Definition`, `Bind`, bounded evidence and retry policy, descriptors and outcomes | [`hustle`](/docs/reference/packages/harness/hustle) |
| `pkg/journal` | sealed records, `SessionJournal`, leases, cursors, idempotent appenders and replay | [`journal`](/docs/reference/packages/harness/journal) |
| `pkg/sessionstore` | `Open`, journal/replayer/lease facades, `Catalog`, projection repair, blob offload and GC | [`sessionstore`](/docs/reference/packages/harness/sessionstore) |
| `pkg/workspacestore` | `Open`, `Ref`, `Snapshot`, `Materialize`, `Delete`, `GC` | [`workspacestore`](/docs/reference/packages/harness/workspacestore) |
| `pkg/identity` | `AgentName`, `Coordinates`, `Cause`, `Agency` | [`identity`](/docs/reference/packages/harness/identity) |
| `pkg/foreign` | builder registries, restored seeds, broker and delivery seams | [`foreign`](/docs/reference/packages/harness/foreign) |
| `pkg/serve` | generic `Handler`, `ReadHandler`, `Server`, read/live interfaces, visibility and bind policy | [`serve`](/docs/reference/packages/harness/serve) |
| `pkg/serve/catalogreader` | `Reader` adapter over `sessionstore.Catalog` and `Store` | [`serve/catalogreader`](/docs/reference/packages/harness/serve/catalogreader) |

`pkg/evalmigration` has no consumer-facing implementation surface in this
checkout. `internal/loopruntime`, `internal/sessionruntime`,
`internal/hustleruntime`, and `internal/registry` are implementation details,
not import paths for consumers.

## Canonical composition recipes

| Recipe | Stable seam | Proof and route |
| --- | --- | --- |
| Minimal native session | `loop.Define` -> `sessionstore.Open` -> `rig.Define` -> `Rig.NewSession` -> `Session.Submit`/`SubscribeEvents` -> `Shutdown` | [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go), [`/docs/guides/harness/rig/lifecycle`](/docs/guides/harness/rig/lifecycle) |
| Effectful tool | tool `PrepareCall` -> `gate.Evaluator.Evaluate` or `Authorize` -> `Resolve` -> executor; never parse raw model args in the gate | [`pkg/tool/preparation.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/preparation.go), [`pkg/gate/evaluator.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/evaluator.go), [`/docs/guides/harness/gates`](/docs/guides/harness/gates) |
| Durable restore | `sessionstore.Store.OpenJournal` under an acquired `journal.Lease`; replay through `OpenEventReplayer`; restore only with compatible configuration or an explicit `RestoreDecider` | [`pkg/sessionstore/replay.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/replay.go), [`pkg/session/decider.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/session/decider.go), [`/docs/guides/harness/session-persistence/restore`](/docs/guides/harness/session-persistence/restore) |
| Bounded delegation | declare names with `loop.WithDelegates`; select `DelegationSyncOnly` or `DelegationManaged`; enforce `rig.DelegationLimits`; use `tool.DelegateController` | [`pkg/loop/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition.go), [`pkg/tool/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/definition.go), [`/docs/guides/harness/delegation`](/docs/guides/harness/delegation) |
| HTTP read/live split | `serve.ReadHandler` for stateless reads; generic `serve.Handler` for live controls; `serve.Server` rejects public unauthenticated binds | [`pkg/serve/serve.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/serve/serve.go), [`examples/serving/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/serving/example_test.go), [`/docs/guides/harness/http-server`](/docs/guides/harness/http-server) |

## Cross-cutting invariants

- `loop.Definition`, `rig.Rig`, `hustle.Definition`, stores, and compiled hooks
  are construction-time values. Bind session and loop state at runtime; do not
  share mutable bound state between sessions.
- `event.Event` and `command.Command` are sealed. Use the provided concrete
  variants, validators, and codecs; external packages cannot add variants.
- An event's `Class`, `Scope`, and `Visibility` drive delivery. Ephemeral
  deliveries have `JournalSeq == 0`; only enduring events are journal records.
- Every I/O path receives `context.Context`. Match typed errors with
  `errors.Is` or `errors.As`, never diagnostic strings.
- A gate decides from a tool-owned typed `tool.Request`; grants are fresh and
  execution-bound. A prompt is not OS enforcement.
- A session owns live loops, subscriptions, queues, gates, tools, workspace
  permits, Hustle activity, and shutdown. The composition root closes the
  session before its stores and backends.
- Configuration fingerprints, manifests, journal order, lease epochs, and
  workspace refs are restore boundaries. Do not silently accept drift or
  fabricate a `workspacestore.Ref` by string surgery.

## Source and runnable proof set

Use the current pinned source files for declaration details:

- [`pkg/loop/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition.go) and [`pkg/rig/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/definition.go): immutable composition.
- [`pkg/session/session.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/session/session.go), [`pkg/event/event.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/event.go), and [`pkg/command/command.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/command/command.go): runtime contracts and sealed unions.
- [`pkg/journal/journal.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/journal.go), [`pkg/sessionstore/sessionstore.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/sessionstore.go), and [`pkg/workspacestore/store.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/workspacestore/store.go): durable boundaries.
- [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go), [`examples/lifecycle/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/lifecycle/example_test.go), [`examples/persistence/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/persistence/example_test.go), and [`examples/serving/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/serving/example_test.go): deterministic runnable proofs.
