---
id: agents/composition/delegation
title: Add bounded Loop delegation
description: Declare child Loops, choose synchronous or managed delegation, and preserve parent ownership.
audience: agent
section: agents/composition
order: 5
publication: released
proofs:
  topology:
    - release-github-com-looprig-harness
---
# Delegation

Declare child names on the parent definition with `loop.WithDelegates("worker", ...)`. Select `loop.Delegation{Style: loop.DelegationSyncOnly}` for bounded request/response work or `loop.Delegation{Style: loop.DelegationManaged}` when a child has a session-visible lifecycle. At the Rig root set `rig.WithDelegationLimits(rig.DelegationLimits{Depth, Quota})`.

The Rig derives parent-scoped agent tools and binds a `tool.DelegateController` into factories that declare `tool.RequiresDelegateController`. Execute `tool.DelegateRequest` operations such as `DelegateStart`, `DelegateSend`, `DelegateInterrupt`, and `DelegateStatus`. `WaitForResponse` is a start request choice, not a separate model-facing wait operation. Results carry delivery and response status plus bounded agent metadata.

Lifecycle: parent authorizes the child name and mode, journals the request intent, creates or queues the child, and records terminal delivery and response state. A parent remains responsible for quota, cancellation, and user-visible outcome. Restore rehydrates unresolved delegate records before admitting new work.

Invariants: only declared names are accepted; modes must exist on the selected child; depth and quota are enforced before spawn; one parent owns the controller; terminal results are distinct from mechanical status. Failures include unauthorized or unknown agent, unknown mode, depth or quota exhaustion, delivery rejection, timeout, and journal conflict. Use typed delegate errors and inspect `DelegateDeliveryStatus` and `DelegateResponseStatus`.

Proofs: [`harness/pkg/loop/definition.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/definition.go), [`harness/pkg/rig/options.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/options.go), [`harness/internal/sessionruntime/delegation_test.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/internal/sessionruntime/delegation_test.go).
