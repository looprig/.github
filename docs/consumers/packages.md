# Package overview

looprig is a collection of small Go modules, not one all-inclusive framework.
Applications import the boundaries they need and own the composition between
them.

```text
                         your application
        /             /          |          \             \
       v             v           v           v             v
 provider clients   harness    storage     sandbox    presentation
    llm module                  backends                 tui / serve
                       |
                       v
               core + inference + storage contracts

        flow is a sibling engine for durable workflow graphs
```

The harness stays provider-neutral and backend-neutral. Provider implementations
live in `llm`. Durable backend implementations live in the storage modules. The
application chooses and wires both.

## Modules

| Module | What it owns | Import it when |
| --- | --- | --- |
| `core` | shared content blocks, identifiers, logging contracts | exchanging content or IDs across looprig modules |
| `inference` | provider-neutral invocation contracts, with focused model, stream, codec, context-counting, auth, routing, transport, and failure packages | declaring models or implementing an inference client |
| `llm` | provider clients and wire codecs | calling OpenRouter, LM Studio, Bedrock, Google, Phala, Chutes, or another supported provider |
| `harness` | Loops, Rigs, Sessions, tool contracts, gates, journals, workspaces, delegation, serving | building and running an agent system |
| `tools` | optional standard file, command, web, interaction, skill, and permission implementations | adding selected standard capabilities to a Loop |
| `storage` | neutral ledger, lease, KV, and blob contracts plus in-memory implementations | implementing a backend or running in memory |
| `fsstore` | filesystem implementations of all four storage contracts | persisting one-host systems on local disk |
| `natsstore` | JetStream implementations of all four storage contracts | sharing durable state across processes or hosts |
| `rclonestore` | blob storage through rclone | keeping snapshots or offloads on an rclone-supported remote |
| `sandbox` | OS-level command confinement and enforcement reports | giving agents command execution with an operating-system boundary |
| `confinement` | shared binding between harness ceilings, standard tool posture, and sandbox executors | keeping command enforcement and permission decisions aligned |
| `flow` | durable graph execution, messages, checkpoints, ingress, and control plane | coordinating explicit resumable workflows |
| `tui` | reusable interactive terminal presentation | building a terminal interface over a Session adapter |
| `coderig` | a complete coding Rig | studying a production composition or running CodeRig |
| `tests` | cross-module integration and compatibility tests | validating development across the repository set |

`coderig` and `tests` are useful references, but consumer applications do not need
to import them.

## Start with these imports

A text-only agent like the quickstart needs:

```text
github.com/looprig/core
github.com/looprig/harness
github.com/looprig/inference
github.com/looprig/llm
github.com/looprig/storage
```

Add one durable backend when state must survive restart:

```text
github.com/looprig/fsstore
```

or:

```text
github.com/looprig/natsstore
```

Add `github.com/looprig/tools` for standard tools. Add `github.com/looprig/confinement`
with `github.com/looprig/sandbox` when a Loop can spawn confined commands. Add
`github.com/looprig/tui` or the Harness `serve` package only when you want those
presentation surfaces.

## Harness package map

Most consumer code uses a small part of the harness module:

| Package | Consumer role |
| --- | --- |
| `pkg/loop` | define one agent's identity, inference, instructions, tools, permissions, modes, and delegates |
| `pkg/rig` | validate and assemble Loops with storage, workspaces, snapshots, limits, and lifecycle policy |
| `pkg/session` | submit work, observe events, answer gates, interrupt, compact, checkpoint, and control one live execution |
| `pkg/event` | consume typed ephemeral and enduring runtime events |
| `pkg/tool` | define tool contracts, bindings, requirements, approval scopes, and command runners |
| `pkg/gate` | answer durable permission gates |
| `pkg/sessionstore` | open durable Session journals, offloads, leases, and catalog state over `storage.Composite` |
| `pkg/workspacestore` | capture and materialize content-addressed workspace snapshots over `storage.Blobs` |
| `pkg/serve` | expose live and durable Session operations over HTTP and server-sent events |
| `pkg/serve/catalogreader` | connect the durable session catalog to the HTTP read plane |
| `pkg/security` | represent a Session-scoped ordinal security limit |
| `pkg/hustle` | define bounded inference jobs outside the normal turn lane, including compaction work |
| `pkg/foreignloop` | integrate supported foreign Claude or Codex execution engines |

The normal construction path is:

```text
loop.Define
    |
    v
rig.Define
    |
    +-------------------+
    v                   v
NewSession        RestoreSession
    |                   |
    +---------+---------+
              v
        session.Session
```

Read [Loop](loop.md), [Rig](rig.md), and [Session](session.md) in that order when
you need to understand those boundaries in detail.

## Inference packages

`model.Model` from `github.com/looprig/inference/model` describes a model without
secrets. `inference.Client` performs provider calls. Keeping them separate lets a
model declaration participate in validation and fingerprints without putting
credentials into durable state.

The `llm` module contains concrete clients and an `auto` package for providers
that can be constructed from a model plus API key. Providers with extra security
or credential requirements expose direct constructors.

Applications own their model catalog. Declare capabilities such as tool or image
support on each model, and keep credentials on the client side of the boundary.

## Storage packages

The `storage` module defines four independent contracts:

- `Ledger` for ordered append-only records;
- `Leaser` for ownership and coordination;
- `KV` for revisioned keyed state;
- `Blobs` for content-addressed or named binary objects.

`storage.Composite` bundles one implementation of each contract because their
method names overlap and cannot be implemented by one ordinary Go interface.

The harness uses them through two facades:

```text
storage.Composite --> sessionstore.Store
storage.Blobs     --> workspacestore.Store
```

This means Session history and workspace snapshots can share a backend or use
different ones. [Build larger systems](larger-systems.md#choose-durable-storage)
shows the standard choices.

## Harness and flow

The harness and flow solve different problems:

| Harness | Flow |
| --- | --- |
| runs model-driven Loops | runs explicit graph vertices |
| records agent turns, steps, gates, and tool activity | records graph messages and checkpoints |
| supports delegation chosen by an agent | supports routing chosen by graph structure |
| exposes Session control | exposes workflow ingress and control |

Use the harness alone for an agent or multi-agent system. Use flow alone for a
durable graph without agents. Combine them in your application when a workflow
vertex should start or resume agent work.

## Presentation is optional

The main harness boundary is a Go `session.Session`. Nothing requires a specific
interface. You can drive it from:

- a one-shot command;
- a terminal or desktop application;
- an HTTP service;
- a scheduled process;
- a chat integration;
- a workflow task;
- another Go library.

Use the `tui` module when its terminal adapter fits. Use `pkg/serve` when its HTTP
surface fits. Otherwise keep the Session interface and build the interaction
model your product needs.

## What the application owns

Across every module, your application remains the composition root. It owns:

- model selection and provider credentials;
- prompts, tools, permissions, and policy revisions;
- Loop topology and delegation limits;
- storage placement and retention;
- workspace placement and sandbox posture;
- interfaces, authentication, and deployment;
- restore compatibility and configuration migrations.

looprig supplies the reusable machinery and validates the boundaries. The Rig
you assemble remains yours to run, change, and extend.
