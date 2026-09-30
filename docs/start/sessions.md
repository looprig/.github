---
id: start/sessions
title: Persist and restore sessions
description: Move the coding assistant's session history and workspace snapshots to Fsstore on local disk, print each session's ID, and restore the same session after the process restarts.
audience: developer
section: start
order: 6
publication: released
proofs:
  open-durable-storage: [release-github-com-looprig-fsstore, release-github-com-looprig-storage, release-github-com-looprig-harness]
  start-or-restore-a-session: [release-github-com-looprig-harness, release-github-com-looprig-core]
  run-it: [release-github-com-looprig-harness, release-github-com-looprig-fsstore]
  what-is-persisted: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-fsstore, release-github-com-looprig-harness]
---

# Persist and restore sessions

The coding assistant still loses its history when the process exits. This page moves session history and workspace snapshots to disk with Fsstore, so a later run can continue a conversation by its session ID.

```sh
go get github.com/looprig/fsstore@v0.6.0 github.com/looprig/storage@v0.9.0
```

Storage v0.9.0 or later is required: it adds the bounded blob readers that let Fsstore back a session store. Fsstore alone would leave you on an older Storage.

## Open durable storage

Create `stores.go`:

<!-- example: examples/go/start/sessions/stores.go -->
```go
package main

import (
	"errors"
	"fmt"

	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
)

// stores is the assistant's durable storage: one fsstore directory holds
// both the session journals and the workspace snapshots.
type stores struct {
	disk       *fsstore.Store
	sessions   *sessionstore.Store
	workspaces *workspacestore.Store
}

func openStores(dir string) (*stores, error) {
	disk, err := fsstore.Open(fsstore.Options{Root: dir})
	if errors.Is(err, fsstore.ErrLegacyLayout) {
		// The directory was written by fsstore older than v0.6.0, whose
		// layout is not migrated. Retrying cannot help: move or delete it.
		return nil, fmt.Errorf("%s holds data in an old fsstore layout; move or delete it: %w", dir, err)
	}
	if err != nil {
		return nil, fmt.Errorf("open durable storage: %w", err)
	}
	// The session store must be able to close a blob reader promptly, even
	// mid-read. Plain files cannot promise that, so a local store opts in to
	// Storage's bounded reader adapter. It suits one process on one host;
	// shared deployments use a backend that implements the lifecycle itself.
	backend, err := disk.Backend().WithBoundedBlobReaders()
	if err != nil {
		_ = disk.Close()
		return nil, fmt.Errorf("adapt blob readers: %w", err)
	}
	sessions, err := sessionstore.Open(backend)
	if err != nil {
		_ = disk.Close()
		return nil, fmt.Errorf("open session store: %w", err)
	}
	workspaces, err := workspacestore.Open(disk.Blobs)
	if err != nil {
		_ = disk.Close()
		return nil, fmt.Errorf("open workspace store: %w", err)
	}
	return &stores{disk: disk, sessions: sessions, workspaces: workspaces}, nil
}

// Close releases the storage. Call it only after every session has shut
// down: a session writes its final records while it shuts down.
func (s *stores) Close() error { return s.disk.Close() }
```

Two details matter:

- **Bounded blob readers.** The session store must be able to close a blob reader promptly, even while a read is blocked, and refuses a backend that cannot promise it with `sessionstore: invalid backend: missing BlobReaderLifecycle`. Plain files cannot promise it, so `WithBoundedBlobReaders` opts the local store in to Storage's adapter. It is meant for one process on one host. A shared deployment uses a backend that implements the lifecycle itself, such as `s3store` for blobs; see [Which modules do I need?](/docs/overview/which-modules).
- **Old layouts.** Fsstore v0.6.0 changed its on-disk layout and does not migrate. `fsstore.Open` refuses a directory written by an older version with an error matching `fsstore.ErrLegacyLayout`. Retrying cannot help: tell the user to move or delete the directory.

## Start or restore a session

Replace `main.go`. The Loop, the Rig, and `turn.go` do not change:

<!-- example: examples/go/start/sessions/main.go -->
```go
package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/session"
)

type config struct {
	question  string
	repo      string
	data      string
	sessionID string // empty starts a new session
}

func main() {
	var cfg config
	flag.StringVar(&cfg.question, "ask", "What is this repository?", "question for the coding assistant")
	flag.StringVar(&cfg.repo, "repo", ".", "repository the assistant may read")
	flag.StringVar(&cfg.data, "data", defaultDataDir(), "directory for durable assistant data, outside the repository")
	flag.StringVar(&cfg.sessionID, "session", "", "ID of a session to continue")
	flag.Parse()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, cfg); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, cfg config) error {
	repo, err := canonicalDir(cfg.repo)
	if err != nil {
		return err
	}
	client, selected, err := newModel(stderr)
	if err != nil {
		return err
	}
	assistant, err := defineAssistant(client, selected, repo)
	if err != nil {
		return err
	}
	if cfg.data == "" {
		return errors.New("set -data to a directory outside the repository")
	}
	store, err := openStores(filepath.Join(cfg.data, "store"))
	if err != nil {
		return err
	}
	// Deferred calls run last-in, first-out. Registering Close before the
	// session's Shutdown makes storage close after the session stops.
	defer func() {
		if err := store.Close(); err != nil {
			log.Printf("close storage: %v", err)
		}
	}()
	runtime, err := defineRuntime(assistant, store.sessions, store.workspaces, repo)
	if err != nil {
		return err
	}

	live, err := startSession(ctx, runtime, cfg.sessionID)
	if err != nil {
		return err
	}
	defer func() {
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := live.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()
	// Print the ID so a later run can continue this conversation.
	fmt.Fprintf(stdout, "session: %s\n", live.SessionID())

	return runTurn(ctx, live, cfg.question, stdout)
}

// startSession creates a new session, or restores the one named by id.
func startSession(ctx context.Context, runtime *rig.Rig, id string) (session.SessionController, error) {
	if id == "" {
		return runtime.NewSession(ctx)
	}
	parsed, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("parse session ID: %w", err)
	}
	// Restore replays the session's journal and refuses a Rig whose
	// configuration no longer matches the one the session was created with.
	live, err := runtime.RestoreSession(ctx, parsed)
	if err != nil {
		return nil, fmt.Errorf("restore session %s: %w", parsed, err)
	}
	return live, nil
}

// defaultDataDir keeps the assistant's data in the user's configuration
// directory. It must not be inside the repository: the Rig refuses storage
// that overlaps the workspace, because snapshots would capture it.
func defaultDataDir() string {
	dir, err := os.UserConfigDir()
	if err != nil {
		return ""
	}
	return filepath.Join(dir, "looprig-coding-assistant")
}

// canonicalDir returns dir as an absolute path with symlinks resolved.
func canonicalDir(dir string) (string, error) {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	return filepath.EvalSymlinks(abs)
}
```

The data directory defaults to your user configuration directory and must be outside the repository. The Rig refuses storage that overlaps a workspace (`persistence path ... overlaps workspace root`), because snapshots would capture it.

`RestoreSession` replays the journal and checks the Rig against the configuration the session was created with. Changing the model, tools, gate, or topology can change what an existing session means, so a mismatch is refused rather than silently accepted. The session ID is an identifier, not a credential: an application serving several users still decides who may restore which session.

## Run it

```sh
go run .
```

```text
OPENAI_API_KEY is not set: using the scripted model
session: 56f9ea61-50a1-4f93-a4ca-9c3e6c6ea435
Let me look.
[Glob] Glob *.go
[ReadFile] ReadFile go.mod
This is the Go module example.com/looprig-coding-assistant, according to its go.mod.
```

Continue that session in a new process:

```sh
go run . -session 56f9ea61-50a1-4f93-a4ca-9c3e6c6ea435 -ask "What did you read?"
```

With a hosted model, the second answer can refer to the first turn, because the restored session sends the model the whole conversation. The scripted model simply replays its script.

## What is persisted

Session history is an append-only journal of commands and events. It is not the model context window, the workspace files, a workflow checkpoint, or UI state. Read [Session runtime](/docs/guides/harness/session-runtime), [Session persistence](/docs/guides/harness/session-persistence), and [Create and restore](/docs/guides/harness/session-runtime/create-and-restore) before implementing retention.

## Runnable checkpoint

The complete program is [`examples/go/start/sessions`](https://github.com/looprig/.github/tree/main/examples/go/start/sessions). Its [tests](https://github.com/looprig/.github/blob/main/examples/go/start/sessions/main_test.go) create a session, reopen the storage as a new process would, restore the same ID, refuse an unknown ID, and report an old Fsstore layout with a move-or-delete message.

Continue to [add a session workspace](/docs/start/workspaces).
