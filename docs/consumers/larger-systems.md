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

Workspace-bound tools need three pieces:

1. tool definitions on the Loop;
2. a permission gate on the Loop;
3. a workspace placement and snapshot policy on the Rig.

For one known workspace root, create an immutable read guard and a fresh
permission gate for every bound Loop:

```go
hardDeny := tools.DefaultHardDeny()

readGuard, err := tools.NewPermissionChecker(tools.PermissionPolicy{
	WorkspaceRoot: workspaceRoot,
	HardDeny:      hardDeny,
})
if err != nil {
	return err
}

permissionFactory := func(
	_ context.Context,
	bindings tool.Bindings,
) (loop.PermissionGate, error) {
	return tools.NewPermissionChecker(tools.PermissionPolicy{
		WorkspaceRoot: bindings.Workspace.Root,
		HardDeny:      hardDeny,
	})
}

assistant, err := loop.Define(
	loop.WithName("workspace-assistant"),
	loop.WithInference(client, model),
	loop.WithSystem("Help with files in the assigned workspace."),
	loop.WithTools(
		tools.ReadFileDefinition(readGuard),
		tools.WriteFileDefinition(),
		tools.EditFileDefinition(),
		tools.Bash(),
	),
	loop.WithPermissionFactory(permissionFactory),
	loop.WithPolicyRevision("workspace-policy-v1"),
)
```

The Loop receives only the definitions listed above. `tools.Bash` supplies
command execution. The model declaration must include
`inference.WithTools()` so the provider codec knows tool calls are supported.

The read guard is enforced inside the file tools. The permission factory creates
the gate that decides whether each proposed tool call is automatically approved,
shown to a person, or denied. Without a permission gate, tool execution is
denied.

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

A permission gate answers whether a command may run. The `sandbox` module limits
what the resulting process can read, write, execute, and reach over the network.
Use both layers for command-capable agents.

Call `sandbox.Init()` as the first statement in `main`. This lets the module
perform platform setup before the application starts goroutines:

```go
func main() {
	sandbox.Init()

	if err := run(); err != nil {
		log.Fatal(err)
	}
}
```

Build a policy and give its executor to the Bash definition:

```go
policy := sandbox.PolicyFor(sandbox.Write, workspaceRoot)
executor, err := sandbox.NewExecutor(policy)
if err != nil {
	return err
}

assistant, err := loop.Define(
	loop.WithName("workspace-assistant"),
	loop.WithInference(client, model),
	loop.WithTools(
		tools.ReadFileDefinition(readGuard),
		tools.WriteFileDefinition(),
		tools.EditFileDefinition(),
		tools.Bash(tools.WithRunner(executor)),
	),
	loop.WithPermissionFactory(permissionFactory),
	loop.WithPolicyRevision("workspace-policy-v2"),
)
```

The preset ladder is:

| Mode | Intended boundary |
| --- | --- |
| `ZeroTrust` | workspace reads, minimal system reads, no writes or network |
| `ReadOnly` | broad reads, gated writes and network |
| `Write` | workspace and temporary-file writes, gated network |
| `Trusted` | confined writes with broader default network access |
| `Unconfined` | full user-level authority with explicit acknowledgement |

Construction reports the enforcement level available on the current platform.
Applications that change posture at runtime can use `NewExecutorDynamic` and
wire the same ceiling source into both the executor and permission checker. The
CodeRig demonstrates dynamic confinement through the
`github.com/looprig/confinement` module.

## Add more agents

Define each role as an ordinary Loop. Give only the parent a delegate list:

```go
delegatePermissions := func(
	_ context.Context,
	_ tool.Bindings,
) (loop.PermissionGate, error) {
	// With no automatic approval rule, each Subagent call asks for approval.
	return tools.NewPermissionChecker(tools.PermissionPolicy{})
}

planner, err := loop.Define(
	loop.WithName("planner"),
	loop.WithInference(client, model),
	loop.WithSystem("Plan the work and delegate focused research."),
	loop.WithDelegates("researcher"),
	loop.WithDelegation(loop.Delegation{
		Style: loop.DelegationManaged,
	}),
	loop.WithPermissionFactory(delegatePermissions),
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

The parent model must declare `inference.WithTools()` because the injected
Subagent definition is model-facing. The Subagent tool still passes through the
parent's permission gate. The example asks a person for every call. Your policy
can instead automatically approve known delegate calls or deny delegation.

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
- which OS sandbox posture command tools receive;
- where journals, leases, KV state, blobs, and workspaces live;
- whether snapshots are best effort or required;
- how Sessions are restored after process failure;
- which callers receive the data plane or trusted control plane;
- how HTTP authentication, transport security, and graceful shutdown work;
- which policy and fingerprint revisions change when behavior changes.

The shape stays the same as the quickstart. The application continues to own its
agents, policy, data, and deployment while looprig supplies the runtime machinery.
