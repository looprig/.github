---
id: reference/interface-matrix
title: Interface boundary matrix
description: Trace event history, session state, session stores, workspace snapshots, artifacts, model context, and their public interfaces.
audience: developer
section: reference
order: 302
publication: released
proofs:
  durable-foundations: [release-github-com-looprig-flow, release-github-com-looprig-storage]
  orchestration-and-serving: [module-workflows, release-github-com-looprig-harness]
  clients-and-terminal: [release-github-com-looprig-client, release-github-com-looprig-tui]
  evaluation-and-qualification: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Interface boundary matrix

The same UUID can appear in several systems without making those systems one store. Use the following map when composing a product.

## Durable foundations {#durable-foundations}

| Concern | Source of truth | Public boundary | Persistence meaning |
| --- | --- | --- | --- |
| Event history | Harness/session journal | `Reader.ReadJournal`, replay APIs, client `readHistory` | Enduring events in journal order; ephemeral progress is excluded. |
| Session state | Session controller and projected status | `Reader.ReadStatus`, client status types | Current status projection; it can be read without a live process. |
| Session store | Storage `Ledger`, `KV`, `Leaser`, `Blobs` primitives | `storage.Composite` and adapters | Generic durability primitives, not a domain session object. |
| Workflow checkpoint | Flow `CheckpointStore` | `Append`, `Latest`, `History` | Graph state/frontier/revision used for resume; distinct from event history. |

## Orchestration and serving {#orchestration-and-serving}

| Concern | Interface | Lifecycle |
| --- | --- | --- |
| Typed workflow | `workflows.Definition`, `TypedDefinition`, `Catalog` | Validate identity/input/resume, then start/resume/get/history/cancel. Source-workspace only. |
| Workflow supervision | `workflows.Supervisor` | Activate one session-owned lease, schedule, adopt, wait idle, bounded shutdown. |
| Serving | `serve.Rig`, `serve.LiveSession`, `serve.Reader` | Live/control routes require a live session; read routes use durable projections. |
| Live transport | Harness SSE and client `LiveFrameSource` | Open live before history, buffer, filter by journal cursor, reconnect, and close iterator. |

## Clients and terminal {#clients-and-terminal}

| Consumer | Primary API | Cleanup contract |
| --- | --- | --- |
| Browser core | `LooprigTransport`, `fold`, `joinSessionView` | Abort and call live iterator `return()`; leave view binding independent. |
| Vanilla browser | DOM binding over `SessionView` | Remove event listeners and call the core disposer. |
| Optional Svelte | `LiveSessionViewStore`, `SessionComposerStore`, `GateStore` | `$effect` cleanup calls `stop`; stopped generations discard stale responses. |
| TUI | `tui/sessionadapter.Adapter` and `FoldDisplay` | Close subscription and adapter; adapter performs one session shutdown. |

## Evaluation and qualification {#evaluation-and-qualification}

| Artifact | Boundary | Keep it separate from |
| --- | --- | --- |
| Model context | `inference.Request.Messages` and target observation trace | Durable session state and workspace snapshots. |
| Evaluation report | `eval/reportjson` or Pluto `reportjson` | Event history and Flow checkpoints. |
| Workspace snapshot | Storage blob reference chosen by the application | Run metadata and model prompt text. |
| Qualification scorecard | Pluto `qual.Scorecard` and profile result | Provider credentials and live gate state. |

Use references for large artifacts and snapshots. Keep event history append-only, checkpoint state revisioned, run metadata bounded, and model context redacted before reports leave the evaluation boundary.
