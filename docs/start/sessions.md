---
id: start/sessions
title: Persist and restore sessions
description: Replace memory storage with Fsstore and restore a Harness session by its stable ID.
audience: developer
section: start
order: 5
publication: released
proofs:
  sessions:
    - release-github-com-looprig-fsstore
    - release-github-com-looprig-harness
---

# Persist and restore sessions

The first Harness example uses memory storage. Replace it when conversation history and lifecycle events must survive process restarts.

```go
disk, err := fsstore.Open(fsstore.Options{Root: "./agent-data"})
if err != nil { return err }
defer disk.Close()

sessions, err := sessionstore.Open(disk.Backend())
if err != nil { return err }

runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(sessions),
)
restored, err := runtime.RestoreSession(ctx, savedSessionID)
```

Expected lifecycle:

```text
create session → save ID → shutdown → restore same ID
```

Next, [add a workspace](/docs/start/workspaces).
