# Rig is the harness composition root

The rig is the starting point for building on top of the harness. What a rig actually is, how one is assembled, every option it takes, and how live sessions come out of it.

`package rig` (`github.com/looprig/harness/pkg/rig`) is the **public entry point** for building using looprig.

## What is a rig?

A `Rig` is an immutable blueprint. It describes an agent system once, at startup: the loops that exist, which ones can be a primary, where the workspace lives, when snapshots happen, how
deep delegation can go, and so on. All of that goes to `rig.Define(...)`, which validates the whole thing and returns a `*rig.Rig` that never changes.

From that one rig comes as many live sessions as needed. The rig is safe to hold onto and reuse
across concurrent sessions; each session is a single running execution with its own workspace,
journal, and security ceiling.

```
  rig.Define(options...)   ->   *Rig   (build once, reuse forever)
                                  |
                                  |- NewSession(ctx)        -> SessionController
                                  |- NewSession(ctx, seed)  -> SessionController
                                  '- RestoreSession(ctx,id) -> SessionController
```

A quick note on the naming, since it trips people up. The package is lowercase `rig` (standard Go), and the exported type is `Rig`. A local variable can't be named `rig` because that shadows the package import, so the codebase calls it `assembly`. The type's own doc comment describes a rig as "an immutable design-time assembly," so the name fits.

## Vocabulary

Before the options, here's the vocabulary. A few of these have subtle meanings that matter.

| Term | What it means |
|------|---------------|
| Loop | One agent definition (`loop.Definition`): its model, system prompt, tools, and delegates. |
| Primer | A loop that is allowed to be the session's primary (top-level) loop. A rig can declare more than one. |
| Active primer | The single primer a new session actually starts on. It can be switched at runtime. |
| Session | One live execution minted from the rig, with its own workspace, journal, and ceiling. |
| Placement | Where a session's workspace lives on disk and how it's fenced off from other writers. |
| Fingerprint | A stable, secret-free digest of the rig's config, checked on restore for compatibility. |

One thing worth calling out early: there is no single hard-coded "primary loop." A rig can
declare several primers, and exactly one is active at any moment. `SetActiveLoop` swaps which
primer is active, and a plain `Submit` always goes to whichever one is active right now.

## Building a rig

A rig is built by passing functional options to `rig.Define`. Here's a realistic call:

```go
import "github.com/looprig/harness/pkg/rig"

assembly, err := rig.Define(
    rig.WithLoops(primer, operatorLeaf, reviewerLeaf), // the loop.Definitions
    rig.WithPrimers("operator"),                        // loops allowed to be primary
    rig.WithActivePrimer("operator"),                   // which primer starts active
    rig.WithSessionStore(sessionStore),                 // the durable session store
    rig.WithExclusiveWorkspace(wsStore, root, leaser),  // optional workspace placement
    rig.WithSnapshots(rig.SnapshotPolicy{               // required once a workspace is placed
        Trigger:  rig.SnapshotOnIdle,
        Priority: rig.SnapshotBestEffort,
        Timeout:  60 * time.Second,
    }),
    rig.WithDelegationLimits(rig.DelegationLimits{Depth: 2, Quota: 8}),
    rig.WithFingerprintFields(fields),
    rig.WithCeilingFactory(newCeiling),
    rig.WithOffloadGC(rig.OffloadGCPolicy{Interval: time.Hour, Timeout: time.Minute}),
)
if err != nil {
    return nil, err // typed error, see the error section below
}
```

`Define` fails closed. If the description is inconsistent (no store, an unknown primer, two
workspace placements, a workspace-hungry tool with nowhere to put a workspace, a snapshot
policy with no workspace, and so on) it returns a typed error and no rig. So a `*Rig` in hand is
always a validated rig. Nothing half-built ever escapes.

## Every option, grouped

Options that can only be supplied once are noted as such; passing them twice is a typed
rejection. In each table the middle column tells whether the harness needs it.

### Topology: what actually runs

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithLoops(...loop.Definition)` | Required | The agent loops in this rig. It accumulates, so it can be called more than once. Every loop needs a unique, non-empty name, every delegate it names must also be present, and every loop must be reachable from some primer. |
| `WithPrimers(...string)` | Required | Names of the loops that are allowed to be the session primary. |
| `WithActivePrimer(string)` | Optional (at most once) | Which primer a new session starts on. When exactly one primer is declared and this is skipped, that primer becomes active automatically. |

### Storage: the plumbing

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithSessionStore(*sessionstore.Store)` | Required (at most once) | The durable store that journals sessions, their catalog, and their leases. A nil store, or supplying it twice, is rejected. |

### Workspace placement: at most one

A rig can bind sessions to a filesystem workspace, but at most one placement may be configured.
As a group these are optional, with one catch: if any loop wires a tool that requires a
workspace and no placement is configured, `Define` fails. Two placements also fail.

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithExclusiveWorkspace(store, root, leaser)` | Optional (at most one placement) | One fixed canonical `root`, edited in place. Fenced by an exclusive root lease named `workspace-roots/<sha256(root)>`, so symlink and lexical aliases of the same root contend on the same lease. |
| `WithSessionWorkspaces(store, baseDir)` | Optional (at most one placement) | A per-session root at `baseDir/<sessionID>`. Isolated by construction, so no root lease is needed. |
| `WithSharedWorkspace(store, root)` | Optional (at most one placement) | One fixed `root` shared with other harness sessions, humans, and outside tools. No root lease, and every checkpoint is stamped "fuzzy" since a clean capture of a tree others are writing can't be guaranteed. |

Two rules ride along with placement. Any configured placement requires a `WithSnapshots`
policy, and a snapshot policy with no workspace is rejected, so those two travel together. And
a `SnapshotRequired` priority is illegal on a shared workspace, because an atomic snapshot of a
tree other writers are touching can't be promised.

The rig also enforces a persistence-overlap check: it refuses to place a workspace whose
managed region contains any of the session-store or workspace-store persistence paths. That
keeps a journal append from ever corrupting a captured tree.

### Snapshots: required once a workspace exists

`WithSnapshots(SnapshotPolicy)`, at most once, controls automatic workspace checkpoints.

```go
type SnapshotPolicy struct {
    Trigger  SnapshotTrigger  // SnapshotManual | SnapshotOnIdle | SnapshotOnTurnDone | SnapshotOnStepDone
    Priority SnapshotPriority // SnapshotBestEffort | SnapshotRequired
    Timeout  time.Duration    // per-snapshot deadline, defaults to 60s when zero
}
```

Trigger says when a snapshot fires, and defaults to `SnapshotOnIdle` when left unset. Priority
says what happens on failure: `SnapshotBestEffort` logs and moves on, while `SnapshotRequired`
turns a failed snapshot into a hard error (and, again, is not allowed on a shared workspace).

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithSnapshots(SnapshotPolicy)` | Required with a workspace, forbidden without one (at most once) | Automatic workspace checkpointing. Trigger, priority, and per-snapshot timeout as above. |

### Lifecycle and policy knobs

Everything here is optional and can be supplied at most once.

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithDelegationLimits(DelegationLimits{Depth, Quota})` | Optional (at most once) | Caps subagent spawn depth and total spawn quota. Negative values are rejected. |
| `WithGateCaps(GateCaps{MaxOpen, MaxTimeout})` | Optional (at most once) | Bounds how many permission gates can be open at once and their maximum timeout. |
| `WithCeilingFactory(func() *ceiling.State)` | Optional (at most once) | Mints a fresh per-session security ceiling. Called once per session, so any captured state has to be concurrency-safe. |
| `WithFingerprintFields(ConfigFingerprintFields)` | Optional (at most once) | Folds extra behavior inputs (agent kind, adapter id, permission posture, and so on) into the restore-compatibility fingerprint. |
| `WithForeignBuilders(builder, restored)` | Optional (at most once) | Wires foreign-agent (claude, codex, ACP) loop builders for both new and restored sessions. |
| `WithOffloadGC(OffloadGCPolicy{Interval, Timeout})` | Optional (at most once) | Arms periodic GC of orphaned content-addressed session offload blobs. Both fields have to be positive. |
| `WithAllowConfigMismatch()` | Optional, restore only (at most once) | Lets `RestoreSession` proceed even if the config fingerprint changed since the session was created. Never set for a new session. |

## Creating and restoring sessions

Given a `*Rig`, sessions are minted off it. Both calls hand back a
`session.SessionController`, the trusted control-plane view of a live session.

A brand-new session:

```go
controller, err := assembly.NewSession(ctx)
```

Optionally seed the workspace from an earlier snapshot. This only works for per-session roots
or an empty exclusive root, never a shared one:

```go
controller, err := assembly.NewSession(ctx, rig.WithSeedSnapshot(ref))
```

`WithSeedSnapshot` materializes `ref` into the new session's workspace before any loop starts,
and journals it as the first checkpoint. A bad or unresolvable ref fails closed.

Restoring a prior session by id:

```go
controller, err := assembly.RestoreSession(ctx, sessionID)
```

Restore replays the session's durable history. It compares the rig's frozen config fingerprint
against the one recorded when the session was created. A mismatch is rejected unless the rig was
built with `WithAllowConfigMismatch()`.

The `NewSession` options themselves are a small set:

| Option | Required / Optional | Description |
|--------|---------------------|-------------|
| `WithSeedSnapshot(ref)` | Optional, per `NewSession` call (at most once) | Materializes `ref` into the new workspace before any loop runs and journals it as the first checkpoint. Per-session or empty-exclusive roots only, never shared. |

## What gets driven: SessionController

Both constructors return a `session.SessionController` from
`github.com/looprig/harness/pkg/session`. It's the trusted superset of the ordinary `Session`
data-plane view. Here's the whole surface:

```go
// Data plane (Session)
SessionID() uuid.UUID
ActiveLoop() loop.Handle
Loop(uuid.UUID) (loop.Handle, bool)
Submit(ctx, []content.Block) (uuid.UUID, error)
SubmitToLoop(ctx, loopID, []content.Block) (uuid.UUID, error)
SubscribeEvents(event.EventFilter) (event.Subscription, error)
RespondGate(ctx, gate.GateResponse) error
Interrupt(ctx) (bool, error)

// Control plane (SessionController adds)
SetActiveLoop(ctx, loopID) error
LoopController(loopID) (loop.Controller, bool)
SetSecurityCeiling(ctx, ceiling.Level) error
CheckpointWorkspace(ctx) (workspacestore.Ref, error)
RestoreWorkspace(ctx, ref) error
Shutdown(ctx) error
```

### Submit versus SubmitToLoop

These two are easy to mix up, so here's the difference.

`Submit(ctx, blocks)` sends a turn to the active primer, whichever loop that currently is. This
is the common case. It's the "talk to the agent" call, and it follows `SetActiveLoop` around:
switch the active primer, and the next `Submit` lands on the new one.

`SubmitToLoop(ctx, loopID, blocks)` sends a turn to a specific loop by id, regardless of which
primer is active. It's the right call when a loop needs to be addressed directly instead of
whoever happens to be active, for instance driving a particular loop while the active primer is
something else, or wiring up a UI that talks to more than one loop in the same session. A loop
id comes from `ActiveLoop()` or `Loop(id)`. Both calls return the id of the turn they started,
which can be matched against streamed events.

The usual rhythm is: `Submit` (or `SubmitToLoop`) a turn, `SubscribeEvents` to stream the
response, answer any permission prompts with `RespondGate`, and `Shutdown` at the end.

## A full example

This is the shape the SWE-Swarm consumer uses (`swe/swarms/swe/persistence.go`), trimmed a
little:

```go
func buildRig(defs []loop.Definition, stores *swarmStores, root string, cfg Config, allowMismatch bool) (*rig.Rig, error) {
    options := []rig.Option{
        rig.WithLoops(defs...),
        rig.WithPrimers("operator"),
        rig.WithActivePrimer("operator"),
        rig.WithSessionStore(stores.session),
        rig.WithExclusiveWorkspace(stores.workspace, root, stores.leaser), // edit the open checkout
        rig.WithSnapshots(rig.SnapshotPolicy{
            Trigger:  rig.SnapshotOnIdle,
            Priority: rig.SnapshotBestEffort,
            Timeout:  snapshotTimeout,
        }),
        rig.WithDelegationLimits(rig.DelegationLimits{Depth: 2, Quota: 8}),
        rig.WithFingerprintFields(operatorFingerprintFields(cfg)),
        rig.WithCeilingFactory(newCeilingFactory(cfg.SecurityCeiling)),
        rig.WithOffloadGC(rig.OffloadGCPolicy{Interval: offloadGCInterval, Timeout: offloadGCTimeout}),
    }
    if allowMismatch { // resume only
        options = append(options, rig.WithAllowConfigMismatch())
    }
    return rig.Define(options...)
}

// then, per session:
assembly, err := buildRig(defs, stores, root, cfg, false)
controller, err := assembly.NewSession(ctx)
```

## When things go wrong

Every failure mode is a typed error, reachable with `errors.As`.

| Error type | Raised by | Some of the kinds |
|------------|-----------|-------------------|
| `*rig.DefinitionError` | `Define` | `missing_loop`, `invalid_primer`, `duplicate_option`, `missing_session_store` |
| `*rig.WorkspacePlacementError` | `Define` | multiple placements, nil store or leaser, empty or uncanonicalizable root, workspace tool with no placement |
| `*rig.SnapshotPolicyError` | `Define` | required but missing, without a workspace, invalid trigger, priority, or timeout, shared-required |
| `*rig.PersistenceOverlapError` | `Define` | a persistence path sits inside the managed workspace |
| `*rig.InvalidOffloadGCIntervalError`, `*rig.InvalidOffloadGCTimeoutError` | `Define` | non-positive GC interval or timeout |
| `*rig.SessionOptionError` | `NewSession` | nil option, duplicate or empty seed |
| `*rig.LifecycleError` | `NewSession`, `RestoreSession` | `lease_failed`, `journal_failed`, `ceiling_failed`, `session_failed` |

Since `Define` fails closed, an error from it means nothing partial escaped. Fix the
description and call it again.

## Where the rig sits

```
  composition root (cmd/..., swe/swarms/...)
        |  builds loop.Definitions, opens stores
        v
  rig.Define(options...)          (this guide)
        |
        v
  session.SessionController
        |  Submit / SubmitToLoop / SubscribeEvents / RespondGate / Shutdown
        v
  live agent execution
```

A few pointers on the neighbors:

- Loops are defined with `pkg/loop` (`loop.Define`) before being handed to `WithLoops`.
- Stores come from the storage backends (`fsstore`, `natsstore`, in-memory `memstore`, and so
  on) wrapped by the harness `sessionstore` and `workspacestore` facades.
- Serving a rig over an API is handled by `pkg/serve`, which only depends on the generic
  `NewSession` and `RestoreSession` contract, so it never imports `pkg/rig` directly.

The source of truth is `pkg/rig/doc.go`, `pkg/rig/options.go`, `pkg/rig/workspace.go`, and
`pkg/rig/snapshot_policy.go`.
