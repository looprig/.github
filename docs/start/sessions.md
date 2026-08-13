---
id: start/sessions
title: Persist and restore sessions
description: Replace the coding assistant memory store with Fsstore, retain its stable session ID, and restore the same Harness session after a process restart.
audience: developer
section: start
order: 6
publication: released
proofs:
  replace-the-memory-store: [release-github-com-looprig-fsstore, release-github-com-looprig-harness]
  retain-the-session-id: [release-github-com-looprig-harness]
  restore-after-restart: [release-github-com-looprig-fsstore, release-github-com-looprig-harness]
  what-is-persisted: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-fsstore, release-github-com-looprig-harness]
---

# Persist and restore sessions

The coding assistant currently loses its event history when the process exits. Replace the memory backend with Fsstore when session commands, events, and restore state must survive a restart.

## Replace the memory store

Open one application-owned Fsstore and pass its composite backend to `sessionstore.Open`:

```go
type stores struct {
	disk     *fsstore.Store
	sessions *sessionstore.Store
}

func openStores(root string) (*stores, error) {
	disk, err := fsstore.Open(fsstore.Options{Root: root})
	if err != nil {
		return nil, fmt.Errorf("open durable storage: %w", err)
	}
	sessions, err := sessionstore.Open(disk.Backend())
	if err != nil {
		disk.Close()
		return nil, fmt.Errorf("open session store: %w", err)
	}
	return &stores{disk: disk, sessions: sessions}, nil
}
```

Pass `stores.sessions` to `rig.WithSessionStore`. Close the Rig's live sessions before closing the underlying Fsstore.

## Retain the session ID

Every new Session has a stable UUID. Print or store it where your CLI can recover it:

```go
live, err := runtime.NewSession(ctx)
if err != nil {
	return err
}

// Persist this identifier in CLI state, a database, or an explicit flag.
fmt.Printf("session=%s\n", live.SessionID())
```

The session ID is not an authentication token. A service still needs its own authorization policy for deciding who may load or control a session.

## Restore after restart

Construct the same Loop and Rig configuration, reopen Fsstore, and restore by ID:

```go
func restore(ctx context.Context, runtime *rig.Rig, rawID string) (session.Session, error) {
	id, err := uuid.Parse(rawID)
	if err != nil {
		return nil, fmt.Errorf("parse session ID: %w", err)
	}

	// Restore validates persisted configuration against the current Rig.
	live, err := runtime.RestoreSession(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("restore session: %w", err)
	}
	return live, nil
}
```

Restore can reject configuration drift. That is deliberate: changing models, tools, policies, or topology can change the meaning of an existing session. Use a reviewed restore policy when your application intentionally supports compatible changes.

## What is persisted

Session history is an append-only journal of commands and events. It is not the same thing as the model context, filesystem workspace, workflow checkpoint, or UI state. Read [Session runtime](/docs/guides/harness/session-runtime), [Session persistence](/docs/guides/harness/session-persistence), and [Journal replay](/docs/guides/harness/session-persistence/journal/replay) before implementing retention or garbage collection.

## Runnable checkpoint

The [restore checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage09_restore/main.go) creates a session, closes Fsstore, reopens it, restores the same ID, and asserts identity. The preceding [session-store checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage08_session_store/main.go) shows the durable path boundary by itself.

Continue to [add a session workspace](/docs/start/workspaces).
