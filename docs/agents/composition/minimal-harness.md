---
id: agents/composition/minimal-harness
title: Compose a minimal Harness Rig
description: Smallest code path from a Loop definition to a session-backed Rig.
audience: agent
section: agents/composition
order: 1
publication: released
proofs:
  harness:
    - release-github-com-looprig-harness
  foundations:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
    - release-github-com-looprig-storage
---
# Minimal Harness

Imports: `github.com/looprig/harness/pkg/loop`, `rig`, `sessionstore`, `tool`, `github.com/looprig/inference`, `inference/model`, and `storage/memstore`.

Build one immutable `loop.Definition` with `loop.Define`. Supply `loop.WithName`, `loop.WithInference(client, model.Model{...})`, and optional `loop.WithTools(tool.Definition...)`. Open a session store with `sessionstore.Open(memstore.New())`, then assemble `rig.Define(rig.WithLoops(definitions...), rig.WithPrimers("planner"), rig.WithSessionStore(store))`. Bind a definition only at runtime with `Definition.Bind(ctx, tool.Bindings{SessionID, LoopID, ...})`.

Lifecycle: the definition is reusable; the Rig owns topology and lifecycle policy; the Session owns journal, active Loop, turns, gates, and workspace resources. Close the session and store from the owner that opened them. Do not put process-wide mutable state in a definition or tool factory.

Invariants: names are unique; every primer names a configured Loop; delegate names are declared; tool schemas and produced names remain stable; the persisted configuration fingerprint must match the live definition at restore. Failures include `loop.DefinitionError`, missing bindings, `rig.DefinitionError`, restore mismatch, and storage errors. Match types, not strings.

Runnable proof: [`harness/examples/composition/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/composition/example_test.go) constructs a planner, worker, tool, compaction policy, memory store, and delegation limits. Run `GOWORK=off go test ./examples/composition` in the Harness module.
