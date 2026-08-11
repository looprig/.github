---
id: build/14-delegation
title: Build 14: scoped delegation
description: Admit child loops from an immutable delegate list while preserving parent provenance, quotas, and session ownership.
audience: developer
section: build
order: 14
publication: released
examples:
  - stage-14-delegation
proofs:
  boundary:
    - release-github-com-looprig-harness
  composition:
    - release-github-com-looprig-harness
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
    - release-github-com-looprig-storage
  lifecycle:
    - release-github-com-looprig-harness
  errors-and-limits:
    - release-github-com-looprig-harness
  runnable-proof:
    - release-github-com-looprig-harness
---

# Build 14: scoped delegation

Delegation is a Harness session capability, not a second composition root. A parent loop can expose a frozen set of named child definitions, but admission, provenance, depth, quota, cancellation, and result delivery remain controlled by the owning session.

## Boundary {#boundary}

`loop.Definition` declares delegates with `loop.WithDelegates`; `rig.Define` installs the definitions and `rig.WithDelegationLimits` sets depth and quota. The live `session.Session` exposes parent-scoped delegation through its controller and injects one derived Subagent tool into the parent's toolset. The child receives a `loop.Provenance` value that identifies its parent rather than a raw session controller.

## Composition {#composition}

Define inference and tools before defining the Rig, then attach storage and delegation limits at the Rig boundary. The delegation tool prepares a typed `DelegateRequest`; the session resolves the requested child against the parent's catalog and applies limits before starting it. A child can use its own tools and model binding, but it cannot select a definition outside that catalog or widen the parent's authority ceiling.

## Lifecycle {#lifecycle}

The session owns child creation and cleanup. A child start consumes quota, and child stop or terminal failure releases the runtime resources according to the session's lifecycle. Messages carry delivery and response status separately, so an accepted or queued message is not reported as a completed response. Session shutdown drains owned children before stores and external services close.

## Errors and limits {#errors-and-limits}

Use typed `session.SessionError` values for unknown definitions, depth and quota exhaustion, invalid provenance, cancellation, and child failures. Limits include maximum depth, per-parent quota, queued messages, and bounded response text. A caller must not retry a failed start by constructing a child directly, because that bypasses the same admission and audit path.

## Runnable proof {#runnable-proof}

`stage-14-delegation` defines `planner` with one `worker` delegate, creates a session backed by an in-memory store, admits one worker, and asserts that the second admission returns `SessionLoopQuotaExceeded`. Run it with `node scripts/docs/run-examples.mjs`. The [pinned delegation tool](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/internal/delegationtool/prepare.go) and [session admission tests](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/internal/sessionruntime/) show the ownership boundary.
