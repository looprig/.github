# Rig: assemble an agent system

A Rig is the immutable blueprint for an agent system. It combines one or more
[Loops](loop.md) with durable session storage, workspace placement, snapshots,
delegation limits, gates, and lifecycle policy.

The harness provides the parts. You assemble a Rig that matches what you want
your agents to do.

```text
loop.Definition values + stores + policy
                  |
                  v
          rig.Define(options...)
                  |
                  v
                *Rig
             /          \
     NewSession      RestoreSession
          |                |
          +--------+-------+
                   v
        session.SessionController
```

Define the Rig once and reuse it across concurrent Sessions. Each Session gets
its own live Loops, journal, security ceiling, and resolved workspace.

## The smallest Rig

```go
store, err := sessionstore.Open(memstore.New())
if err != nil {
	return err
}

assembly, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(store),
)
if err != nil {
	return err
}
```

This is enough for an agent with no workspace-bound tools. The complete running
form is in the [quickstart](quickstart.md).

Every Rig requires:

- at least one Loop;
- at least one primer;
- one session store.

When there is exactly one primer, it becomes active automatically. A Rig with
multiple primers must select one with `WithActivePrimer`.

## Loops, primers, and the active primer

A **Loop** defines one agent. A **primer** is a Loop that may act as the
top-level agent for a Session. The **active primer** is the one that receives a
plain `Session.Submit` call.

```go
assembly, err := rig.Define(
	rig.WithLoops(planner, operator),
	rig.WithPrimers("planner", "operator"),
	rig.WithActivePrimer("planner"),
	rig.WithSessionStore(store),
)
```

A Session can switch between declared primers through `SetActiveLoop`. It can
also address any live Loop directly through `SubmitToLoop`.

Rig validates the complete topology:

- every Loop name is present and unique;
- every primer names a declared Loop;
- the active primer is one of the primers;
- every declared delegate exists;
- every Loop is reachable from a primer.

An invalid or orphaned agent system never reaches runtime.

## Create and restore Sessions

Create a new execution:

```go
session, err := assembly.NewSession(ctx)
```

Restore an existing execution from its durable session identifier:

```go
session, err := assembly.RestoreSession(ctx, sessionID)
```

Both methods return `session.SessionController`. The controller is the trusted
runtime surface for submitting work, observing events, answering gates,
changing policy, checkpointing a workspace, and shutting down. See
[Session](session.md).

`RestoreSession` compares the stored configuration fingerprint with the current
Rig. A changed topology, model, prompt, tool set, policy revision, workspace
placement, or other fingerprinted behavior is rejected instead of being
silently applied to old history.

Build a dedicated restore Rig with `WithAllowConfigMismatch` only when your
application has deliberately reviewed and accepted that drift.

## Session storage

`WithSessionStore` accepts a `*sessionstore.Store`. That facade records session
journals, leases, catalog state, and offloaded content over the neutral
`storage.Composite` contract.

For a process-local prototype:

```go
sessionStore, err := sessionstore.Open(memstore.New())
```

For history that survives restart, use `fsstore` or `natsstore`, then open the
same facade over that backend. See
[Choose durable storage](larger-systems.md#choose-durable-storage).

The session store is required even when your agent has no filesystem workspace.
Session durability and workspace durability are related but separate concerns.

## Workspace placement

A workspace gives tools a filesystem root and lets the harness capture files as
content-addressed snapshots. A Rig may configure at most one placement mode.

### Exclusive workspace

```go
rig.WithExclusiveWorkspace(workspaceStore, root, leaser)
```

Every Session uses the same canonical root, such as the checkout currently open
in an editor. The harness holds an exclusive root lease, so two Sessions cannot
silently mutate the same tree at once.

### Per-session workspaces

```go
rig.WithSessionWorkspaces(workspaceStore, baseDir)
```

Each Session receives `baseDir/<sessionID>`. Isolation comes from separate
directories, so no root lease is needed.

### Shared workspace

```go
rig.WithSharedWorkspace(workspaceStore, root)
```

Sessions, people, and outside tools may all mutate the same root. No root lease
is taken. Snapshots are marked fuzzy because the harness cannot guarantee a
stable tree while another writer is active.

If any Loop declares a tool with `tool.RequiresWorkspace`, the Rig must configure
a placement. The definition fails otherwise.

The Rig also rejects a workspace that contains its own session or workspace
storage. This prevents a journal append from changing the tree while that tree
is being captured.

## Snapshots

Every configured workspace requires an explicit snapshot policy:

```go
rig.WithSnapshots(rig.SnapshotPolicy{
	Trigger:  rig.SnapshotOnIdle,
	Priority: rig.SnapshotBestEffort,
	Timeout:  60 * time.Second,
})
```

Available triggers are:

- `SnapshotManual`;
- `SnapshotOnIdle`;
- `SnapshotOnTurnDone`;
- `SnapshotOnStepDone`.

`SnapshotBestEffort` reports a failed automatic snapshot but lets agent work
continue. `SnapshotRequired` turns snapshot failure into a hard failure. Required
snapshots are not allowed with a shared workspace because atomic capture cannot
be guaranteed there.

The zero trigger defaults to `SnapshotOnIdle`, and a zero timeout defaults to 60
seconds. A snapshot policy without a workspace is rejected.

You can also checkpoint explicitly through
`SessionController.CheckpointWorkspace`.

## Seed a new Session from a snapshot

`WithSeedSnapshot` is the only current per-call `NewSession` option:

```go
session, err := assembly.NewSession(ctx, rig.WithSeedSnapshot(ref))
```

The snapshot is materialized before any Loop starts and becomes the first
workspace checkpoint in the new journal. Seeding is valid for a per-session
workspace or an empty exclusive root, never a shared root.

## Delegation limits

Loop definitions control which agents may delegate to which. The Rig adds
system-wide limits:

```go
rig.WithDelegationLimits(rig.DelegationLimits{
	Depth: 2,
	Quota: 8,
})
```

- `Depth` bounds nesting below a primer.
- `Quota` bounds the total number of child Loops created in one Session.

These are backstops, not a replacement for a narrow delegate list on each Loop.

## Gate limits and the security ceiling

Bound the permission gates a Session may hold open:

```go
rig.WithGateCaps(rig.GateCaps{
	MaxOpen:    8,
	MaxTimeout: 15 * time.Minute,
})
```

Provide a fresh security ceiling for every Session when your permission system
supports runtime posture changes:

```go
rig.WithCeilingFactory(func() *ceiling.State {
	return ceiling.NewClamped(maxLevel)
})
```

The harness treats the ceiling as an ordinal. Your application defines what each
level means and wires the same state into its permission checker. A trusted
caller can change the effective level with `SetSecurityCeiling`, subject to the
clamp.

## Configuration fingerprints

The Rig automatically fingerprints Loop topology and behavior. Add application
configuration that affects behavior but is not already visible to the harness:

```go
rig.WithFingerprintFields(rig.ConfigFingerprintFields{
	AgentKind: "personal-research-v2",
})
```

Use only secret-free, stable values. Fingerprints are compatibility identities,
not storage for API keys or credentials.

## Hustles and compaction

A Hustle is a bounded, text-only inference job outside the normal agent turn
lane. Context compaction is one consumer of this mechanism.

Register Hustles and their required lane limits together:

```go
assembly, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(store),
	rig.WithHustles(compactor),
	rig.WithHustleLimits(rig.HustleLimits{
		BlockingConcurrent:   2,
		BlockingQueued:       16,
		BackgroundConcurrent: 2,
		BackgroundQueued:     32,
		AuditTimeout:         5 * time.Second,
		FinalizationTimeout:  5 * time.Second,
		WorkerDrainTimeout:   10 * time.Second,
	}),
)
```

Hustle limits are required when any Hustle is registered and rejected when no
Hustle uses them. The Rig also verifies that every Loop compaction policy names
a compatible blocking Hustle.

## Other lifecycle policy

```go
rig.WithOffloadGC(rig.OffloadGCPolicy{
	Interval: time.Hour,
	Timeout:  time.Minute,
})
```

This runs periodic garbage collection for orphaned session offload blobs. Both
values must be positive.

```go
rig.WithForeignBuilders(liveBuilder, restoredBuilder)
```

This supplies the construction seams required by Loops that use a foreign
Claude or Codex engine. Both builders are required together.

## Rig option reference

| Option | Requirement | Purpose |
| --- | --- | --- |
| `WithLoops` | Required | Add immutable Loop definitions. Accumulates across calls. |
| `WithPrimers` | Required | Declare Loops eligible to receive top-level input. |
| `WithActivePrimer` | Required with multiple primers | Select the initial active primer. |
| `WithSessionStore` | Required, once | Supply durable session storage. |
| `WithExclusiveWorkspace` | Optional placement | Use one exclusively leased root. |
| `WithSessionWorkspaces` | Optional placement | Create one directory per Session. |
| `WithSharedWorkspace` | Optional placement | Use a root shared with other writers. |
| `WithSnapshots` | Required with placement | Configure automatic workspace snapshots. |
| `WithDelegationLimits` | Optional, once | Bound child depth and total child count. |
| `WithGateCaps` | Optional, once | Bound open gates and gate timeouts. |
| `WithCeilingFactory` | Optional, once | Create fresh security-ceiling state per Session. |
| `WithFingerprintFields` | Optional, once | Add stable application behavior to restore compatibility. |
| `WithHustles` | Optional | Register immutable Hustle definitions. Accumulates across calls. |
| `WithHustleLimits` | Required with Hustles | Bound execution lanes, queues, audit, finalization, and drain. |
| `WithForeignBuilders` | Required for foreign engines | Build new and restored foreign Loops. |
| `WithOffloadGC` | Optional, once | Collect orphaned offload blobs periodically. |
| `WithAllowConfigMismatch` | Restore-only opt-in | Accept reviewed configuration drift. |

`rig.Define` validates and freezes the entire assembly. Definition, workspace,
snapshot, persistence-overlap, and lifecycle failures retain typed error
identity for `errors.As`.

Next, learn how to [drive a live Session](session.md).
