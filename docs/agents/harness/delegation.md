---
id: agents/harness/delegation
title: Harness delegation, Hustles, and foreign loops
description: Compose declared child loops, bounded auxiliary inference, compaction policy, and foreign runtime builders without leaking authority.
audience: agent
section: agents/harness
order: 33
publication: released
proofs:
  delegation-topology:
    - release-github-com-looprig-harness
  hustles-and-compaction:
    - release-github-com-looprig-harness
  foreign-backends:
    - release-github-com-looprig-harness
  boundaries-and-failures:
    - release-github-com-looprig-harness
  human-routes:
    - release-github-com-looprig-harness
  source-tests-runnable-proof:
    - release-github-com-looprig-harness
  delegation:
    - release-github-com-looprig-harness
  auxiliary-runtime:
    - release-github-com-looprig-harness
---

# Delegation, Hustles, and foreign loops

## Delegation topology

1. Declare reachable child names on the parent with
   `loop.WithDelegates(identity.AgentName...)` and choose
   `loop.Delegation{Style: loop.DelegationSyncOnly|loop.DelegationManaged}`.
2. Register all definitions in `rig.WithLoops`; set
   `rig.WithDelegationLimits(rig.DelegationLimits{Depth, Quota})`.
3. The runtime binds a parent-scoped `tool.DelegateController` only to tools
   declaring `tool.RequiresDelegateController`.
4. Send typed `tool.DelegateRequest` operations:
   `DelegateStart`, `DelegateSend`, `DelegateInterrupt`, `DelegateStatus`.
   Read `DelegateDeliveryStatus` separately from `DelegateResponseStatus`.

Only declared names/modes are accepted. Depth and quota are checked before
spawn; the parent owns cancellation, quota, controller, and user-visible
outcome. `WaitForResponse` is a start request choice, not another public wait
operation. Restore unresolved delegate records before admitting new work.

## Hustles and compaction

`hustle.Define` freezes a bounded auxiliary inference definition. Relevant
options are `WithName`, `WithCurrentLoopModel` or `WithNamedInference`,
`WithSystemPrompt`, `WithOutputSchema`, `WithEvidenceTools`, `WithLimits`,
`WithTimeout`, `WithParticipation`, `WithRetryPolicy`, and
`WithPolicyRevision`. `Definition.Bind` accepts only `hustle.Bindings{Models}`;
`BoundDefinition` exposes resolution and evidence-tool binding, not a public
arbitrary run method. Rig/session runtime owns invocation and durable
`HustleStarted`/`HustleCompleted`/`HustleFailed` events.

Hustles are bounded by serialized input/output limits, participation lane,
timeouts, retry policy, output schema, and optional evidence-tool ceilings.
`DefinitionDescriptor` is the secret-free behavioral identity used for
fingerprints and audit. Evidence bindings receive only session/loop identity
and optional read-only workspace; they do not receive mutation, delegation,
gate, grant, or session-controller authority.

`loop.CompactionPolicy` is explicit: `Automatic`, `CounterPolicy`, thresholds,
reserved output, safety margin, summary cap, count timeout, and Hustle name.
Harness supplies no policy timeout or threshold defaults. Compaction commits a
validated summary against an exact `event.ContextBasis`; `CompactionStarted`,
`CompactionCommitted`, and `CompactionRejected` are the durable outcome family.

## Foreign backends

`foreign.BuilderRegistry` maps a stable `loop.RuntimeProfileName` to a
`foreign.Builder` plus `RestoredBuilder`; services-aware registration adds
broker and delivery seams. A builder returns a `loop.Backend` and foreign
session ID. A restored builder receives `foreign.RestoredForeign` state and
must resume the recorded foreign session rather than silently create a new
one.

`foreign.DeliveryIntent` and `DeliveryResolution` carry loop/request identity
and resolution state only. The session binds the exact command payload at its
private boundary. `foreign.Services` is immutable; the zero value intentionally
has no broker or delivery authority.

## Boundaries and failures

- Parent definitions authorize child names; a child cannot access the parent
  controller or widen its profile.
- Model-facing delegate results expose delivery and response state, not command
  or journal internals. Handle typed delegate errors and event transitions.
- Hustle failure records use closed `Stage` and `ReasonCode` combinations;
  retry only `RetryPolicyClassifiedOnce` cases marked by package-owned typed
  recovery markers.
- Compaction basis, policy revision, summary size, and context counter must
  match at commit and restore. Do not accept an arbitrary summary string.
- Foreign runtime code belongs behind `foreign.Builder`; do not import internal
  actor/runtime packages or assume native event production in an adapter.

## Human routes

[`/docs/guides/harness/delegation`](/docs/guides/harness/delegation),
[`/docs/guides/harness/hustles`](/docs/guides/harness/hustles), and
[`/docs/guides/harness/compaction`](/docs/guides/harness/compaction) provide
leaf navigation. Package routes are [`/docs/reference/packages/harness/hustle`](/docs/reference/packages/harness/hustle),
[`/docs/reference/packages/harness/foreign`](/docs/reference/packages/harness/foreign),
[`/docs/reference/packages/harness/loop`](/docs/reference/packages/harness/loop),
and [`/docs/reference/packages/harness/event`](/docs/reference/packages/harness/event).

## Source, tests, runnable proof

- [`pkg/loop/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition.go), [`pkg/rig/options.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/rig/options.go), [`pkg/tool/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/definition.go), [`pkg/loop/definition_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/definition_test.go).
- [`pkg/hustle/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hustle/definition.go), [`pkg/hustle/run.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hustle/run.go), [`pkg/hustle/evidence.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hustle/evidence.go), [`pkg/hustle/definition_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hustle/definition_test.go), [`pkg/hustle/run_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hustle/run_test.go).
- [`pkg/loop/compaction_policy.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/compaction_policy.go), [`pkg/loop/compaction.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/compaction.go), [`pkg/event/compaction.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/event/compaction.go), [`pkg/loop/compaction_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/loop/compaction_test.go).
- [`pkg/foreign/builder.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/foreign/builder.go), [`pkg/foreign/restored.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/foreign/restored.go), [`pkg/foreign/registry_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/foreign/registry_test.go), [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go).
