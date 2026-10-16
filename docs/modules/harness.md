---
id: modules/harness
title: Harness
description: Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.
audience: developer
section: modules
order: 18
publication: released
proofs:
  repository: release-github-com-looprig-harness
  description: release-github-com-looprig-harness
  dependencies: release-github-com-looprig-harness
  dependents: release-github-com-looprig-harness
  where-it-fits: release-github-com-looprig-harness
---

# Harness

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/harness` |
| Version | `v0.45.2` |
| GitHub | [looprig/harness](https://github.com/looprig/harness) |

## Description

Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.

## Where it fits

Harness is useful on its own when an application needs to turn model calls and tools into a session-oriented agent runtime. Within Looprig, it composes [Inference](/docs/modules/inference), [Storage](/docs/modules/storage), gates, workspaces, delegation, and tools behind Loops and Rigs. Its session journal and catalog are written in [SessionStore](/docs/modules/sessionstore)'s envelope and layout, so the backend needs every storage primitive plus bounded blob readers, as in [NATSStore](/docs/modules/natsstore), [PGStore](/docs/modules/pgstore) with [S3Store](/docs/modules/s3store), or, on one host, [FSStore](/docs/modules/fsstore) opted in with Storage's `WithBoundedBlobReaders`.

A Rig wired with `rig.WithToolResultObjects` keeps every tool result larger than the preview budget as a session object beside the journal, and the model pages it back with `read_tool_result` from [Tools](/docs/modules/tools). [Host](/docs/modules/host) runs Harness sessions for [Factory](/docs/modules/factory), and the older `pkg/serve` HTTP surface is deprecated in favor of Factory. Harness owns runtime coordination; applications still choose models, authority, persistence, and interfaces.

The optional `session.InputSubmitter` accepts caller-verified `Principal` and client `Metadata` without changing `session.Session`. Public journals retain the principal but strip metadata; native metadata is available through `ReadRuntimeJournal`. The `pkg/present` contract and `rig.WithMessagePresenter` let a product place bounded text around a human's message while journaling the chosen frame for restore. `loop.Unlimited` removes the per-turn iteration or call cap, and `hustle.WithTimeout(0)` removes a Hustle's execution deadline; caller and session cancellation still apply. See [Message presenter](/docs/guides/harness/commands/message-presenter) and [tool limits](/docs/guides/harness/loop/tools-and-tool-limits). Since v0.41.1, plain-JSON Hustle output accepts thinking blocks beside exactly one text block, so reasoning models no longer have valid JSON refused, and it refuses length-limited, content-filtered, tool-use and unrecognized finishes with the typed `inference.StructuredOutputFinishError`. Compaction records `CompactRejectExecutionFailed` rather than `CompactRejectInvalidSummary` for those responses. Since v0.42.0, the ephemeral `ToolCallStarted` and `ToolCallCompleted` events carry `tool_use_id`, the key a committed step is joined on, and Completed adds `tool_name` and `elapsed_ms`; nothing is journaled. Since v0.42.1, every agent tool schema (StartAgent, MessageAgent, ListAgents, StopAgent) is one flat closed object with enums instead of a per-agent `oneOf`, so grammar-constrained and strict-schema providers accept it; per-agent validity is still enforced when the call is prepared. Since v0.43.0, `loop.WithReadOnlyAccess(roots...)` installs the smallest access gate the standard read tools need: reads at or beneath the named directories are allowed, and every other read, write, command and network requirement is denied. It needs no `WithPolicyRevision`, because its canonical roots are hashed into the Loop's policy identity. Workspace tools still need a Rig workspace placement and `rig.WithSnapshots`. Since v0.44.0, `loop.WithWorkspaceAccess(loop.WorkspaceAccess{Roots: ...})` allows reads under its roots and asks before each write there, through the Loop's durable permission gate by default (answered by the TUI, a headless `RespondGate`, or a Host's `gate_response`) or through an in-process `gate.ApproverFunc`. It denies commands, network access, and everything outside the roots. An "Approve always" answer is remembered by a per-session `gate.SessionRules` while the process runs, never across sessions, subagents or restores, unless you supply a durable `gate.RuleStore`. It takes the access-gate slot, so it cannot be combined with `WithAccessGate` or `WithReadOnlyAccess`, and like the read-only gate it judges paths lexically rather than acting as an OS sandbox. Since v0.45.0, `AbandonResidency`, `ReleaseResidency` and `Shutdown` return a wrapped `*session.LeaseReleaseError` when the journal lease or the workspace root lease could not be released, instead of logging it and returning nil; a Host treats that as residency still held.

## Dependencies

- [Core](/docs/modules/core)
- [FSStore](/docs/modules/fsstore)
- [Inference](/docs/modules/inference)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

- [ACP](/docs/modules/acp)
- [Classifiers](/docs/modules/classifiers)
- [Foreign Loops](/docs/modules/foreignloops)
- [Host](/docs/modules/host)
- [MCP](/docs/modules/mcp)
- [Stack](/docs/modules/stack)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
