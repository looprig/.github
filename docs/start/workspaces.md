---
id: start/workspaces
title: Add a session workspace
description: Give each coding-assistant session its own materialized file root, connect workspace-aware tools, and define snapshot behavior separately from session history.
audience: developer
section: start
order: 7
publication: released
proofs:
  create-the-workspace-store: [release-github-com-looprig-harness, release-github-com-looprig-storage]
  choose-session-owned-placement: [release-github-com-looprig-harness]
  connect-workspace-aware-tools: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  checkpoint-and-restore: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-harness, release-github-com-looprig-storage]
---

# Add a session workspace

A workspace is the file tree that the coding assistant may inspect or change. It is independent from session history: the journal records what happened, while the workspace stores the files those actions affected.

## Create the workspace store

Reuse the blob primitive from the application's Fsstore backend:

```go
func openWorkspaceStore(disk *fsstore.Store) (*workspacestore.Store, error) {
	// Workspace snapshots are content-addressed blobs.
	store, err := workspacestore.Open(disk.Backend().Blobs)
	if err != nil {
		return nil, fmt.Errorf("open workspace store: %w", err)
	}
	return store, nil
}
```

The workspace store owns snapshots and materialization. The base directory remains an application choice.

## Choose session-owned placement

Give each session a separate child under one base directory:

```go
runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("coding-assistant"),
	rig.WithSessionStore(stores.sessions),
	// Harness derives <base>/<session-id> and binds tools to that root.
	rig.WithSessionWorkspaces(workspaces, "./agent-data/workspaces"),
	rig.WithSnapshots(rig.SnapshotPolicy{
		Trigger: rig.SnapshotManual,
	}),
)
```

Use a shared workspace only when concurrent sessions and humans are expected to edit the same tree. Use an exclusive workspace when one session must hold a root lease. The placement affects restore compatibility and should be explicit.

## Connect workspace-aware tools

Definitions such as `ReadFile`, `Glob`, `Grep`, `WriteFile`, `EditFile`, and `Bash` declare `RequiresWorkspace`. Harness binds the materialized root when it creates the live Loop:

```go
loop.WithTools(
	// Read definitions receive the session root through tool.Bindings.
	tools.ReadFileDefinition(readGuard),
	tools.GlobDefinition(readGuard),
	tools.GrepDefinition(readGuard),
)
```

Do not pass an arbitrary user-supplied root directly to each tool. One bound workspace keeps path policy, snapshots, restore, and cleanup aligned.

## Checkpoint and restore

```go
ref, err := live.CheckpointWorkspace(ctx)
if err != nil {
	return err
}
fmt.Printf("workspace checkpoint=%s\n", ref)

// Restore materializes the exact snapshot selected by the application.
if err := live.RestoreWorkspace(ctx, ref); err != nil {
	return err
}
```

Checkpoint metadata is recorded with the session, but snapshot contents live in the workspace store. Read [workspace bindings and roots](/docs/guides/harness/workspaces/bindings-and-roots), [snapshots](/docs/guides/harness/workspaces/snapshots), and [restore and cleanup](/docs/guides/harness/workspaces/restore-and-cleanup) for placement and lifetime details.

## Runnable checkpoint

The [workspace checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage10_workspace/main.go) snapshots a real file tree, materializes it into a new directory, and asserts the bytes are identical.

Continue to [sandbox process tools](/docs/start/sandbox-and-interfaces).
