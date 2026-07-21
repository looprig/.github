# Build larger systems

The [quickstart](quickstart.md) is already a complete looprig system. Larger
systems use the same composition order and add only the capabilities they need:

```text
model and client
       |
       v
one or more Loops
       |
       v
Rig + storage + workspace + policy
       |
       v
Sessions + your interface
```

This guide shows the main additions independently. You can combine them in one
application without adopting all of them.

## Choose durable storage

The quickstart uses `memstore`, which disappears with the process. Use
`fsstore` when one process should keep its history and snapshots on local disk:

```go
backend, err := fsstore.Open(fsstore.Options{
	Root: storageRoot,
})
if err != nil {
	return err
}
defer func() { _ = backend.Close() }()

sessionStore, err := sessionstore.Open(backend.Backend())
if err != nil {
	return err
}

workspaceStore, err := workspacestore.Open(backend.Blobs)
if err != nil {
	return err
}
```

`sessionStore` persists journals, leases, catalog state, and offloaded content.
`workspaceStore` uses the same blob backend for content-addressed workspace
snapshots. They are separate facades even when they share one backend.

Keep the storage root outside the workspace being captured:

```text
/srv/my-agent/state       session and snapshot storage
/srv/my-agent/workspaces  agent workspaces
```

The Rig rejects overlapping persistence and workspace paths because writing a
journal must not change the tree being snapshotted.

For multiple processes or hosts, use JetStream through `natsstore`:

```go
backend, err := natsstore.Open(ctx, natsstore.Options{
	URL: "nats://nats.internal:4222",
})
if err != nil {
	return err
}
defer func() { _ = backend.Close(context.Background()) }()

sessionStore, err := sessionstore.Open(backend.Backend())
```

Set exactly one of `URL` or `EmbeddedDir`. Embedded mode owns an in-process NATS
server and requires an absolute directory. The caller must ensure that only one
embedded store opens that directory at a time.

`rclonestore` implements the blob contract through an rclone remote. It is useful
for snapshot or offload data, but it does not provide the ledger, lease, and KV
contracts required by `sessionstore`. Combine it with providers for those
contracts through `storage.NewComposite` when you intentionally want a hybrid
backend.

| Backend | Best fit | Contracts |
| --- | --- | --- |
| `memstore` | tests and process-local prototypes | ledger, leases, KV, blobs |
| `fsstore` | one host with local durable state | ledger, leases, KV, blobs |
| `natsstore` | multiple processes or hosts | ledger, leases, KV, blobs |
| `rclonestore` | remote snapshot and offload blobs | blobs only |

Your application owns each backend's lifecycle. Close it only after every
Session using it has shut down.

## Give an agent a workspace

Workspace-bound tools need four pieces:

1. tool definitions on the Loop;
2. an access profile and its OS executor;
3. an access gate on the Loop;
4. a workspace placement and snapshot policy on the Rig.

Call `sandbox.Init()` as the first statement in `main` (see below), then build a
read guard, an access profile, its executor, and one gate for the Loop:

```go
// A read guard is the narrow read-side policy the file tools enforce
// themselves: loop.ReadGuard is DeniedRead(absPath) bool and MaxReadBytes() int64.
type readGuard struct{}

func (readGuard) DeniedRead(absPath string) bool { return false }
func (readGuard) MaxReadBytes() int64            { return 10 << 20 }

guard := readGuard{}

// A sandbox profile chooses each capability's access state directly. There are
// no named modes or presets: the consumer sets every field.
profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
	WorkspaceRoot:  workspaceRoot,
	WorkspaceRead:  sandbox.Allow,
	WorkspaceWrite: sandbox.Allow,
	HostRead:       sandbox.Deny,
	HostWrite:      sandbox.Deny,
	Network:        sandbox.Deny,
	Command:        sandbox.Gated,
	Home:           sandbox.IsolatedHome,
	Isolation:      sandbox.Sandboxed,
})
if err != nil {
	return err
}

// An ExecutorSet memoizes one OS-enforcing executor per opaque key, each with
// its own isolated HOME and grant identity beneath the scratch root.
executors, err := sandbox.NewExecutorSet(
	profile,
	sandbox.WithScratchRoot(scratchRoot),
	sandbox.WithMaxExecutors(8),
)
if err != nil {
	return err
}
defer func() { _ = executors.Close() }()

executor, err := executors.For("workspace-assistant")
if err != nil {
	return err
}

// The single hardened workspace permission file is the gate's rule store.
ruleStore, diagnostics, err := permission.NewWorkspaceStore(permission.Config{
	Path: permissionFilePath, // one explicit absolute path; never discovered
})
if err != nil {
	return err
}
_ = diagnostics // surface manual-rule diagnostics to the operator

// The gate applies Deny/Gated/Allow per capability. *sandbox.Profile is the
// AccessSource; the *sandbox.Executor mints post-approval grants.
evaluator, err := gate.NewInteractiveEvaluator(
	[]gate.AccessBinding{
		{Kind: "command.execute", Source: profile},
		{Kind: "filesystem.read", Source: profile},
		{Kind: "filesystem.write", Source: profile},
		{Kind: "network", Source: profile},
	},
	ruleStore,
	loop.GateApprover(),
	ruleStore,
	executor,
)
if err != nil {
	return err
}

assistant, err := loop.Define(
	loop.WithName("workspace-assistant"),
	loop.WithInference(client, model),
	loop.WithSystem("Help with files in the assigned workspace."),
	loop.WithTools(
		tools.ReadFileDefinition(guard),
		tools.WriteFileDefinition(),
		tools.EditFileDefinition(),
		tools.Bash(bash.WithRunner(executor)),
	),
	loop.WithAccessGate(evaluator),
	loop.WithPolicyRevision("workspace-policy-v1"),
)
```

The Loop receives only the definitions listed above. `tools.Bash` supplies
command execution behind the sandbox executor. The model declaration must include
`model.WithTools()` so the provider codec knows tool calls are supported.

The read guard is enforced inside the file tools. The access gate decides
whether each proposed tool call is automatically allowed, shown to a person, or
denied. Without an access gate, tool execution fails closed.

Now place the workspace on the Rig:

```go
assembly, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("workspace-assistant"),
	rig.WithSessionStore(sessionStore),
	rig.WithExclusiveWorkspace(
		workspaceStore,
		workspaceRoot,
		backend.Leaser,
	),
	rig.WithSnapshots(rig.SnapshotPolicy{
		Trigger:  rig.SnapshotOnTurnDone,
		Priority: rig.SnapshotBestEffort,
		Timeout:  60 * time.Second,
	}),
)
```

Use exclusive placement for one canonical checkout, per-session placement for an
isolated directory per Session, or shared placement when outside writers must
touch the same tree. [Rig](rig.md#workspace-placement) describes the tradeoffs.

## Confine commands with the OS

The access gate answers whether a command may run. The `sandbox` module limits
what the resulting process can read, write, execute, and reach over the network.
The two layers share one `sandbox.Profile`: it is the gate's `AccessSource` and
the source of truth for OS enforcement, so a decision and its enforcement cannot
drift.

Call `sandbox.Init()` as the first statement in `main`. This lets the module
perform platform setup (a re-executed Linux confinement helper) before the
application starts goroutines. On other platforms it is a no-op:

```go
func main() {
	sandbox.Init()

	if err := run(); err != nil {
		log.Fatal(err)
	}
}
```

A profile chooses an access state — `Deny`, `Gated`, or `Allow` — for each
capability directly. There are no reusable named modes or presets; the consumer
sets every field. The workspace example above builds one such profile. A product
typically defines a small set of named profiles from these fields. CodeRig, for
instance, exposes three:

| Capability | ReadOnly | Trusted | Unconfined |
| --- | --- | --- | --- |
| Workspace read | `Allow` | `Allow` | `Allow` |
| Workspace write | `Deny` | `Allow` | `Allow` |
| Host read | `Deny` | `Allow` | `Allow` |
| Host write | `Deny` | `Gated` | `Allow` |
| Network | `Deny` | `Allow` | `Allow` |
| Command execution | `Gated` | `Allow` | `Allow` |
| Command HOME | `IsolatedHome` | `IsolatedHome` | `RealHome` |
| Isolation | `Sandboxed` | `Sandboxed` | `Unconfined` |

`Sandboxed` execution compiles the profile into the strongest available OS
boundary — Seatbelt on macOS, namespaces/Landlock/seccomp/nftables/cgroups on
Linux — and construction reports the guarantees actually achieved, failing
closed when a required one is unavailable. A `Gated` capability stays OS-blocked
until a per-spawn grant opens the exact approved delta. `Unconfined` runs with
the invoking user's authority, requires every filesystem and network field to be
`Allow`, and requires `AckUnconfined`.

Restrict a role below the selected profile with
`sandbox.Restrict(base, ceiling)`, which returns the component-wise, immutable
intersection and never widens `base`. Target-scoped Bash network access is
enforced by a loopback egress proxy the sandbox owns; the child reaches only that
listener and direct remote egress is denied.

## Add more agents

Define each role as an ordinary Loop. Give only the parent a delegate list:

```go
planner, err := loop.Define(
	loop.WithName("planner"),
	loop.WithInference(client, model),
	loop.WithSystem("Plan the work and delegate focused research."),
	loop.WithDelegates("researcher"),
	loop.WithDelegation(loop.Delegation{
		Style: loop.DelegationManaged,
	}),
	loop.WithAccessGate(plannerGate),
	loop.WithPolicyRevision("planner-delegation-v1"),
)

researcher, err := loop.Define(
	loop.WithName("researcher"),
	loop.WithInference(client, model),
	loop.WithSystem("Research one focused question and return evidence."),
)

assembly, err := rig.Define(
	rig.WithLoops(planner, researcher),
	rig.WithPrimers("planner"),
	rig.WithSessionStore(sessionStore),
	rig.WithDelegationLimits(rig.DelegationLimits{
		Depth: 2,
		Quota: 8,
	}),
)
```

The harness injects one scoped Subagent tool into `planner`. Do not add that tool
yourself. The frozen delegate list controls which Loop definitions the parent can
reach, while Rig limits bound total depth and child count.

The parent model must declare `model.WithTools()` because the injected
Subagent definition is model-facing. The Subagent tool still passes through the
parent's access gate (`plannerGate`), constructed as shown earlier. With no
matching saved rule, each delegate call produces one approval; a saved allow rule
can approve known delegate calls, and a deny rule refuses delegation outright.

## Expose Sessions over HTTP

The `serve` package turns a Rig into a small HTTP and server-sent events surface.
It separates live Session control from durable catalog reads:

```go
catalog := sessionStore.OpenCatalog()
reads := catalogreader.New(catalog, sessionStore)

handler := serve.Handler(assembly, reads)
server, err := serve.Server("127.0.0.1:8080", handler)
if err != nil {
	return err
}

go func() {
	if err := server.ListenAndServe(); err != nil &&
		!errors.Is(err, http.ErrServerClosed) {
		log.Printf("looprig server stopped: %v", err)
	}
}()
```

The surface can create and restore Sessions, submit input, interrupt work, answer
gates, stream events, and read session status or journal history. The returned
value is a standard `*http.Server`; your application owns startup and graceful
shutdown:

```go
shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
err = server.Shutdown(shutdownCtx)
```

A loopback bind may omit authentication for local use. A public bind is refused
unless the handler has `serve.WithAuth` or the caller explicitly acknowledges an
authenticating external proxy with `serve.WithInsecurePublicBind`.

## Add an interface

The harness does not choose how people interact with a Session. A consumer can
use the Session interface directly from a CLI, desktop application, service,
chat integration, scheduled job, or another Go package.

The `tui` module supplies an interactive terminal UI and accepts an adapter through its
`tui.Agent` interface. The `serve` package supplies HTTP for remote or
multi-process interfaces. Both are optional presentation layers over the same
Session behavior.

## Coordinate durable workflows

The `flow` module is a sibling workflow engine for durable, Pregel-style graphs.
Use it when work has explicit vertices, messages, checkpoints, and resumable
control flow. Keep agent execution in the harness and workflow coordination in
flow, then connect them through application-owned tasks when that separation is
useful.

Flow is not required to run a Rig, and a Rig does not become more durable merely
because it is placed inside a workflow. Each module owns a different boundary.

## Production checklist

Before exposing a system to other users or machines, decide explicitly:

- which model catalog and credentials the application owns;
- which Loops are primers and which may be delegated to;
- which tools exist and how every tool call is permitted or denied;
- which access profile each Loop's command tools run under;
- where journals, leases, KV state, blobs, and workspaces live;
- whether snapshots are best effort or required;
- how Sessions are restored after process failure;
- which callers receive the data plane or trusted control plane;
- how HTTP authentication, transport security, and graceful shutdown work;
- which policy and fingerprint revisions change when behavior changes.

The shape stays the same as the quickstart. The application continues to own its
agents, policy, data, and deployment while looprig supplies the runtime machinery.
