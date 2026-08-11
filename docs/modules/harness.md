---
id: modules/harness
title: Harness loops, sessions, tools, and runtime ownership
description: Assemble Rigs from immutable loop definitions and run them through sessions, gates, journals, workspaces, delegation, and serving seams.
audience: developer
section: modules
order: 14
publication: released
examples:
  - stage-05-loop
  - stage-06-rig
  - stage-07-session-events
  - stage-12-gate-rules
  - stage-14-delegation
  - stage-19-http-serve
proofs:
  boundary:
    - release-github-com-looprig-harness
  composition:
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-harness
  errors-and-limits:
    - release-github-com-looprig-harness
  runnable-proof:
    - release-github-com-looprig-harness
---

# Harness loops, sessions, tools, and runtime ownership

Harness `v0.24.2` is the runtime module that supplies loops, Rigs, Sessions, tool contracts, gates, journals, workspaces, delegation, foreign builders, and an HTTP read/control seam. Install the immutable release `github.com/looprig/harness@v0.24.2`; it stays provider-neutral and uses structural boundaries for Sandbox and concrete tool implementations.

## Boundary {#boundary}

`loop.Definition` is immutable topology: identity, model binding, modes, tool definitions, delegates, policy revision, and limits. `rig.Rig` is the composition root created by `rig.Define`; it owns the configured definitions, stores, gates, workspace placement, classifiers, foreign builders, and lifecycle policy. `session.Session` is the live data and control plane. `tool.Definition` builds session-bound tools, while `gate.Evaluator` decides whether a prepared request may proceed.

The `event` package is a sealed durable and ephemeral event vocabulary. `journal` appends and replays records; `sessionstore` projects durable session metadata and journals; `workspacestore` stores content-addressed workspace snapshots. `serve` depends only on narrow session and reader interfaces, so HTTP serving does not pull storage or inference implementations into the package.

## Composition {#composition}

Compose from the outside in: construct models and tool definitions, define loops, define a Rig with `WithLoops`, attach session storage and optional workspaces, then call `NewSession` or restore. A turn prepares each tool call before the gate, asks the gate for an approval or denial, and only then invokes the concrete tool or Sandbox runner. Delegate tools use the parent-scoped catalog and quota. MCP, ACP, classifiers, and Sandbox attach through interfaces rather than allowing the core runtime to depend on those modules.

## Lifecycle {#lifecycle}

`rig.Define` validates configuration and freezes the topology. `Rig.NewSession` acquires required stores and workspace leases, then creates a live session. The session owns turns, gates, child loops, external toolsets, process resources, and subscriptions. `Shutdown` stops admission, drains work, persists terminal events, closes session resources, releases workspace leases, and returns typed failures. Restore uses a decider and configuration fingerprint before admitting persisted state; a mismatch is not silently ignored.

## Errors and limits {#errors-and-limits}

Use typed `DefinitionError`, `BindError`, `SessionError`, `GateError`, restore errors, journal append and replay errors, and workspace recovery errors with `errors.As`. Bounds cover queued input, concurrent turns, delegate depth and quota, tool output, event payloads, model-facing error text, review context, and store records. A session's durable history, live state, workspace snapshot, model context, and artifact blobs are distinct ownership domains.

## Runnable proof {#runnable-proof}

The progressive examples cover the construction path (`stage-05-loop` through `stage-07-session-events`), deny-before-allow gate order (`stage-12-gate-rules`), delegation quota (`stage-14-delegation`), and a read-only HTTP surface (`stage-19-http-serve`). Run them with `node scripts/docs/run-examples.mjs`. Source is pinned in the [loop package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/), [session package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/), and [Rig composition](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/).
