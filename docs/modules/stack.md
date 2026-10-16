---
id: modules/stack
title: Stack
description: Run Factory, an in-process pooled Host with Harness agents, and one storage profile as a single process started from one Options value.
audience: developer
section: modules
order: 28
publication: released
proofs:
  repository: release-github-com-looprig-stack
  description: release-github-com-looprig-stack
  dependencies: release-github-com-looprig-stack
  dependents: release-github-com-looprig-stack
  where-it-fits: release-github-com-looprig-stack
---

# Stack

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/stack` |
| Version | `v0.1.2` |
| GitHub | [looprig/stack](https://github.com/looprig/stack) |

## Description

Run Factory, an in-process pooled Host with Harness agents, and one storage profile as a single process started from one Options value.

## Where it fits

Stack is useful when you want the whole hosted system, Factory's public API and browser link, a pooled Host running Harness agents, and one storage profile, in one process from one `stack.Options` value. `stack.Validate` reports every configuration error before any I/O, `stack.Start` composes and starts everything, and `Stop` shuts down in the one safe order: Factory `Quiesce`, Host `Stop`, Factory `Stop`, then storage. The journal binding, launch templates, settlement evidence and journal resolvers come from one place, so they cannot disagree, and every agent runs through `host/harnessruntime`, so recovery, live options, principal and metadata propagation, and payload-reference refusal hold by construction. A session waiting at a gate survives `Stop` and an in-process restart, because Host abandons it crash-equivalently; `Stop` returns `*ParkedSessionsError` if any session could not be released that way. `stack/localdisk` keeps state in [FSStore](/docs/modules/fsstore) directories on one machine, `stack/memory` is for tests, and `stack/devauth` is a development-only identity that requires `Options.AllowDevelopmentIdentity`. `RemoteHosts` with `ServeHost` moves Hosts to other processes over shared storage without changing agent code.

Within Looprig, Stack is a composition over [Factory](/docs/modules/factory), [Host](/docs/modules/host), [Harness](/docs/modules/harness), [SessionStore](/docs/modules/sessionstore) and [Storage](/docs/modules/storage), with wire types from [Core](/docs/modules/core) and requests from [Inference](/docs/modules/inference); it imports no tools, provider, or sandbox packages. The `browser-app` template in [looprig/starters](https://github.com/looprig/starters) is built on it. v0.1.0 has no object policy (Factory's object route answers 503), no checkpointer, and no dedicated placement. It also exposes no workspace snapshot store: an agent that places a workspace opens its own and must keep it durable, for example a separate FSStore directory beside the `localdisk` roots, because after a restart a session restored against an in-memory snapshot store fails with the `materialize_failed` restore error. Linux embedders whose agents run sandboxed commands call `sandbox.Init()` first in `main`, and the shutdown budget and platform termination grace must exceed the Host drain's `Grace` + 2 × `IdleBoundary`.

Stack owns the composition, its ordering, and the derived agreements between Factory and Host. Callers own identity for production, agent definitions, tools and their access gates, the shared storage for a multi-process deployment, and the process's listeners and signals.

## Dependencies

- [Core](/docs/modules/core)
- [Factory](/docs/modules/factory)
- [FSStore](/docs/modules/fsstore)
- [Harness](/docs/modules/harness)
- [Host](/docs/modules/host)
- [Inference](/docs/modules/inference)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
