---
id: agents/repositories/harness
title: Harness composition runtime
description: Compose loops, tools, gates, sessions, workspaces, delegation, and runtime services.
audience: agent
section: agents/repositories
order: 11
publication: released
proofs:
  module:
    - release-github-com-looprig-harness
---
# harness

`github.com/looprig/harness@v0.24.2` is the main reusable Go runtime. Its public packages include `loop`, `rig`, `tool`, `gate`, `hustle`, `session`, `sessionstore`, `workspacestore`, `serve`, `event`, and `foreign`.

Define a loop with `loop.Define` and a rig with `rig.Define`; compose model, tools, access gate, compaction, policy, workspace, and delegation options there. Open a durable session store with `sessionstore.Open(*storage.Composite, options...)`, then pass the store to the rig. Bind definitions to a session before running; do not share mutable bound runtime state between sessions.

The runtime owns cancellation, event delivery, journal and checkpoint persistence, tool binding, gate decisions, workspace leases, and delegation limits. Construction rejects missing required dependencies and incompatible options. Runtime failures include context cancellation, gate denial, tool preparation, session lease or replay errors, workspace conflicts, delegation limits, and restore incompatibility. Proofs: [`pkg/loop/definition.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/definition.go), [`pkg/rig/definition.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/definition.go), [`pkg/sessionstore/sessionstore.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/sessionstore.go), [`examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go).
