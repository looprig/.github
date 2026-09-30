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
| `harness` | Loops, Rigs, Sessions, tool contracts, gates, journals, workspaces, delegation, and the deprecated `pkg/serve` HTTP surface | building and running an agent system |
| `tools` | optional standard file, command, web, interaction, skill, and permission implementations | adding selected standard capabilities to a Loop |
| `storage` | neutral ledger, lease, KV, blob, and ordered-index contracts plus in-memory implementations | implementing a backend or running in memory |
| `fsstore` | filesystem implementations of all five storage contracts | persisting one-host systems on local disk |
| `natsstore` | JetStream implementations of all five storage contracts | sharing durable state across processes or hosts |
| `rclonestore` | blob storage through rclone | keeping snapshots or offloads on an rclone-supported remote |
| `sandbox` | access profiles, OS-level command enforcement, and honest guarantee reports | giving agents command execution with an operating-system boundary |
| `flow` | durable graph execution, messages, checkpoints, ingress, and control plane | coordinating explicit resumable workflows |
| `tui` | reusable interactive terminal presentation | building a terminal interface over a Session adapter |
| `carbon` | a complete coding Rig | studying a production composition or running Carbon |
| `tests` | cross-module integration and compatibility tests | validating development across the repository set |

`carbon` and `tests` are useful references, but consumer applications do not need
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

Add `github.com/looprig/tools` for standard tools. Add
`github.com/looprig/sandbox` when a Loop can spawn confined commands: its
`Profile` drives both the access gate and OS enforcement. Add
`github.com/looprig/tui` when you want a terminal interface. For a public web
service, use Factory (with Host and SessionStore) and the `@looprig/client`
browser packages; the Harness `serve` package is deprecated (see below).

## Harness package map

Most consumer code uses a small part of the harness module:

| Package | Consumer role |
| --- | --- |
| `pkg/loop` | define one agent's identity, inference, instructions, tools, permissions, modes, and delegates |
| `pkg/rig` | validate and assemble Loops with storage, workspaces, snapshots, limits, and lifecycle policy |
| `pkg/session` | submit work, observe events, answer gates, interrupt, compact, checkpoint, and control one live execution |
| `pkg/event` | consume typed ephemeral and enduring runtime events |
| `pkg/tool` | define tool contracts, bindings, prepared requests, capability requirements, and command runners |
| `pkg/gate` | evaluate the three access states and answer durable permission gates |
| `pkg/sessionstore` | open durable Session journals, offloads, leases, and catalog state over `storage.Composite` |
| `pkg/workspacestore` | capture and materialize content-addressed workspace snapshots over `storage.Blobs` |
| `pkg/serve` | deprecated, frozen compatibility surface exposing live and durable Session operations over HTTP and server-sent events; use Factory for new public services |
| `pkg/serve/catalogreader` | connect the durable session catalog to the HTTP read plane |
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

The `storage` module defines five independent contracts:

- `Ledger` for ordered append-only records;
- `Leaser` for ownership and coordination;
- `KV` for revisioned keyed state;
- `Blobs` for content-addressed or named binary objects;
- `OrderedIndex` for durable records with an immutable acceptance order plus
  ranked and due views.

`storage.Composite` bundles one implementation of each contract because their
method names overlap and cannot be implemented by one ordinary Go interface.
`Ledger`, `Leaser`, `KV`, and `Blobs` are embedded; `OrderedIndex` is a named
field that may be nil. `storage.NewComposite` takes only the first four and
leaves `OrderedIndex` unwired, while `storage.NewCompositeWithOrderedIndex`
requires all five. Call `Composite.RequireOrderedIndex` when a component needs
the index. `fsstore.Open`, `natsstore.Open`, and `memstore.New` (from
`github.com/looprig/storage/memstore`) all return a composite with every
primitive wired, including `OrderedIndex`.

`fsstore.Open` refuses a root written by fsstore before v0.6.0 with
`*fsstore.LegacyLayoutError`, which wraps `fsstore.ErrLegacyLayout`. Check it
with `errors.Is(err, fsstore.ErrLegacyLayout)` and tell the user to move or
delete that root. Do not retry: no migration exists, and an older fsstore must
never be pointed at a v0.6.0 root, because it misreads it instead of refusing.

The harness uses the contracts through two facades:

```text
storage.Composite --> sessionstore.Store
storage.Blobs     --> workspacestore.Store
```

This means Session history and workspace snapshots can share a backend or use
different ones. `sessionstore.Open` also requires the `Blobs` provider to
implement `storage.BlobReaderLifecycle`, and fails otherwise with
`sessionstore: invalid backend: missing BlobReaderLifecycle`. Raw fsstore
`Blobs` does not implement it, so an fsstore composite cannot back a Session
store directly. Embedded natsstore
(`natsstore.Open(ctx, natsstore.Options{EmbeddedDir: absPath})`) and s3store
`Blobs` do. [Build larger systems](larger-systems.md#choose-durable-storage)
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

Use the `tui` module when its terminal adapter fits. For a new public web
service, use Factory, Host, and SessionStore with the `@looprig/client` and
`@looprig/react` browser packages. `pkg/serve` is deprecated: it remains
available, with frozen routes and schemas, only as a compatibility surface for
existing consumers while they migrate. Otherwise keep the Session interface and
build the interaction model your product needs.

## What the application owns

Across every module, your application remains the composition root. It owns:

- model selection and provider credentials;
- prompts, tools, permissions, and policy revisions;
- Loop topology and delegation limits;
- storage placement and retention;
- workspace placement and the access profile command tools run under;
- interfaces, authentication, and deployment;
- restore compatibility and configuration migrations.

looprig supplies the reusable machinery and validates the boundaries. The Rig
you assemble remains yours to run, change, and extend.
