---
id: start/workspaces
title: Add a session workspace
description: Configure session-owned file roots, snapshot storage, materialization, checkpoints, and rewind independently from conversation history.
audience: developer
section: start
order: 6
publication: released
proofs:
  workspaces:
    - release-github-com-looprig-harness
---

# Add a session workspace

A workspace is a session-owned file tree used by file and process tools. It is separate from the session event journal and conversation history.

```go
runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(sessions),
	rig.WithSessionWorkspaces(workspaceStore),
	rig.WithSnapshots(snapshotStore),
)
```

Expected lifecycle:

```text
materialize workspace → run file tools → checkpoint → rewind or restore → clean up
```

Next, [confine process tools and attach an interface](/docs/start/sandbox-and-interfaces).
