---
id: start/workspaces
title: Add a session workspace
description: Give each coding-assistant session its own workspace directory seeded from a snapshot of the repository, let the assistant write there with your approval, snapshot it after every turn, and restore it with the session.
audience: developer
section: start
order: 7
publication: released
proofs:
  shared-or-session-owned: [release-github-com-looprig-harness]
  give-each-session-its-own-directory: [release-github-com-looprig-harness, release-github-com-looprig-tools]
  approve-writes: [release-github-com-looprig-harness]
  seed-it-from-the-repository: [release-github-com-looprig-harness, release-github-com-looprig-fsstore]
  run-it: [release-github-com-looprig-harness]
  checkpoint-and-restore: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-harness, release-github-com-looprig-fsstore]
---

# Add a session workspace

A workspace is the file tree the coding assistant works in. It is separate from session history: the journal records what happened, and the workspace holds the files. Until now the workspace was your repository itself. Before the assistant changes files or runs commands, give each session its own copy.

## Shared or session-owned

| Placement | Option | Use it when |
| --- | --- | --- |
| Shared | `rig.WithSharedWorkspace(store, root)` | Sessions, people, and other tools deliberately work in one fixed directory. There is no lease, so every snapshot is marked fuzzy. |
| Session-owned | `rig.WithSessionWorkspaces(store, base)` | Each session works alone in `<base>/<session-id>`. |
| Exclusive | `rig.WithExclusiveWorkspace` | One session at a time holds a lease on one fixed directory. |

Placement is part of the Rig's configuration, so it takes part in restore's compatibility check. See [workspace bindings and roots](/docs/guides/harness/workspaces/bindings-and-roots).

## Give each session its own directory

Replace `agent.go`. The assistant gains `EditFile` and `WriteFile`, the gate's root becomes the workspaces directory, and the Rig derives one directory per session beneath it:

<!-- example: examples/go/start/workspaces/agent.go -->
```go
package main

import (
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/tools"
)

// defineAssistant gives the coding assistant the read tools plus EditFile
// and WriteFile, and an access gate that lets it read inside the workspaces
// directory and write there only when approver says yes.
func defineAssistant(client inference.Client, selected model.Model, workspaceBase string, approver gate.Approver) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep and ReadFile for evidence "+
			"and cite the paths you read. Use EditFile or WriteFile to change files; each write needs approval."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
			tools.EditFileDefinition(),
			tools.WriteFileDefinition(),
		),
		// Each session's workspace is a directory beneath workspaceBase, so
		// that is the one root. Reads there run, a write there asks approver
		// first, and everything else is denied: other paths, commands and
		// network access.
		loop.WithWorkspaceAccess(loop.WorkspaceAccess{
			Roots:    []string{workspaceBase},
			Approver: approver,
		}),
	)
}

// defineRuntime gives every session its own workspace directory,
// <workspaceBase>/<session-id>, instead of sharing the repository.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, workspaceBase string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		// Session-owned placement: tools bind to the session's own directory.
		rig.WithSessionWorkspaces(workspaces, workspaceBase),
		// Snapshot the workspace each time a turn ends. SnapshotManual
		// snapshots only when the application calls CheckpointWorkspace.
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotOnTurnDone}),
	)
}
```

`rig.WithSnapshots` is required whenever a workspace is placed. `SnapshotOnTurnDone` snapshots the workspace as each turn ends and journals a `WorkspaceCheckpointed` event with the snapshot's reference; `SnapshotOnStepDone` and `SnapshotOnIdle` choose other boundaries, and `SnapshotManual` snapshots only when you call `CheckpointWorkspace`.

## Approve writes

`loop.WithWorkspaceAccess` replaces `loop.WithReadOnlyAccess` when the assistant should also write. Reads under its roots run as before. A write under them asks an approver first, and everything else is still denied: paths outside the roots, commands, and network access. Like the read-only gate it is one option, it derives the Loop's policy revision from its roots, and it judges the paths tools declare rather than acting as an operating-system sandbox. It takes the Loop's one access-gate slot, so it cannot be combined with `WithAccessGate` or `WithReadOnlyAccess`.

With no `Approver`, the question goes to the Loop's durable permission gate, which a TUI, a headless session's `RespondGate`, or a Host's gate response answers. This program answers in-process instead. Create `approve.go`:

<!-- example: examples/go/start/workspaces/approve.go -->
```go
package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"strings"
	"sync"

	"github.com/looprig/harness/pkg/gate"
)

// approveOnTerminal returns the approver the access gate calls while a write
// waits. It prints what the call needs to prompts and reads one answer line
// from answers: y approves this write, a approves it and remembers the answer
// for matching writes in this session while the process runs, and anything
// else, including end of input, denies it. A write never runs unanswered.
func approveOnTerminal(answers io.Reader, prompts io.Writer) gate.Approver {
	var mu sync.Mutex // one question at a time
	lines := bufio.NewScanner(answers)
	return gate.ApproverFunc(func(ctx context.Context, prompt gate.ApprovalPrompt) (gate.ApprovalAction, error) {
		mu.Lock()
		defer mu.Unlock()
		if err := ctx.Err(); err != nil {
			return "", err // an approver error fails the call closed
		}
		fmt.Fprintf(prompts, "%s asks to:\n", prompt.Request.ToolName)
		for _, unmet := range prompt.Unmet {
			fmt.Fprintf(prompts, "  %s\n", unmet.Description)
		}
		fmt.Fprint(prompts, "Allow? [y]es / [a]lways / [N]o: ")
		// Scan blocks until a line or end of input arrives; it does not
		// watch ctx. The cli-agent starter shows a cancellable reader.
		if !lines.Scan() {
			return gate.ApprovalDeny, nil
		}
		switch strings.ToLower(strings.TrimSpace(lines.Text())) {
		case "y", "yes":
			return gate.ApprovalApprove, nil
		case "a", "always":
			return gate.ApprovalApproveAlwaysWorkspace, nil
		}
		return gate.ApprovalDeny, nil
	})
}
```

`gate.ApproverFunc` adapts a function to `gate.Approver`. `gate.ApprovalApproveAlwaysWorkspace` is "Approve always": with `WorkspaceAccess.Rules` left nil, each session's Loop remembers it in its own `gate.SessionRules` while the process runs, so a matching write later in the same session skips the question. It never reaches another session, a subagent, or a restored session, and it can never widen access past the roots. Supply a durable `gate.RuleStore` in `Rules` to keep those answers across restarts. See [access gates](/docs/guides/harness/gates/access-gates).

The gate's root is the whole workspaces directory, so a write into another session's directory is asked about too, never allowed silently. A product that serves different people gives each session's Loop its own root, as the [browser-app starter](/docs/start/starters) does.

## Seed it from the repository

A new session's directory starts empty. Replace `main.go` so a new session starts from a snapshot of the repository, and so the approver reads your answers from the terminal:

<!-- example: examples/go/start/workspaces/main.go -->
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
	"github.com/looprig/harness/pkg/workspacestore"
)

type config struct {
	question  string
	repo      string
	data      string
	sessionID string    // empty starts a new session
	answers   io.Reader // approval answers; main reads the terminal
}

func main() {
	var cfg config
	flag.StringVar(&cfg.question, "ask", "What is this repository?", "question for the coding assistant")
	flag.StringVar(&cfg.repo, "repo", ".", "repository to copy into a new session's workspace")
	flag.StringVar(&cfg.data, "data", defaultDataDir(), "directory for durable assistant data, outside the repository")
	flag.StringVar(&cfg.sessionID, "session", "", "ID of a session to continue")
	flag.Parse()
	cfg.answers = os.Stdin

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, cfg); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, cfg config) error {
	if cfg.data == "" {
		return errors.New("set -data to a directory outside the repository")
	}
	repo, err := canonicalDir(cfg.repo)
	if err != nil {
		return err
	}
	// Session workspaces live under the data directory, one per session.
	if err := os.MkdirAll(filepath.Join(cfg.data, "workspaces"), 0o700); err != nil {
		return err
	}
	workspaceBase, err := canonicalDir(filepath.Join(cfg.data, "workspaces"))
	if err != nil {
		return err
	}
	client, selected, err := newModel(stderr)
	if err != nil {
		return err
	}
	assistant, err := defineAssistant(client, selected, workspaceBase, approveOnTerminal(cfg.answers, stderr))
	if err != nil {
		return err
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
	runtime, err := defineRuntime(assistant, store.sessions, store.workspaces, workspaceBase)
	if err != nil {
		return err
	}

	live, err := startSession(ctx, runtime, store.workspaces, repo, cfg.sessionID)
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
	fmt.Fprintf(stdout, "session: %s\n", live.SessionID())

	return runTurn(ctx, live, cfg.question, stdout)
}

// startSession creates a new session whose workspace starts as a copy of
// repo, or restores the session named by id together with its workspace.
func startSession(ctx context.Context, runtime *rig.Rig, workspaces *workspacestore.Store, repo, id string) (session.SessionController, error) {
	if id == "" {
		// Snapshot the repository, then seed the new session's workspace
		// from that snapshot. The assistant works on the copy; your
		// checkout is never its workspace.
		seed, err := workspaces.Snapshot(ctx, repo)
		if err != nil {
			return nil, fmt.Errorf("snapshot %s: %w", repo, err)
		}
		return runtime.NewSession(ctx, rig.WithSeedSnapshot(seed))
	}
	parsed, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("parse session ID: %w", err)
	}
	// Restore replays the journal and reattaches the session's workspace.
	live, err := runtime.RestoreSession(ctx, parsed)
	if err != nil {
		return nil, fmt.Errorf("restore session %s: %w", parsed, err)
	}
	return live, nil
}

// defaultDataDir keeps the assistant's data in the user's configuration
// directory. It must not be inside the repository: the Rig refuses storage
// that overlaps a workspace, because snapshots would capture it.
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

`workspaces.Snapshot` stores the repository's files as a content-addressed snapshot, and `rig.WithSeedSnapshot` materializes it into the new session's directory before the session starts. Seeding is allowed only for session-owned and empty exclusive workspaces, never for a shared one. Snapshots include every file under the root, so keep large build outputs out of the repository you seed from.

## Run it

Replace `scripted.go` so the scripted model also asks to write a note:

<!-- example: examples/go/start/workspaces/scripted.go -->
```go
package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. Its script calls the tools
// the way a model would: list the Go files, read go.mod, ask to write a
// note, then answer.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("Glob", `{"pattern":"*.go"}`),
		inferencetest.ToolCall("ReadFile", `{"path":"go.mod"}`),
		inferencetest.ToolCall("WriteFile", `{"path":"NOTES.md","content":"Module: example.com/looprig-coding-assistant\n"}`),
		inferencetest.Text("This is the Go module example.com/looprig-coding-assistant, "+
			"according to its go.mod.").Repeat(),
	)
}
```

```sh
go run .
```

```text
OPENAI_API_KEY is not set: using the scripted model
session: 63148aea-6875-47c6-b8ef-c88267a20f5f
Let me look.
[Glob] Glob *.go
[ReadFile] ReadFile go.mod
WriteFile asks to:
  write /Users/you/Library/Application Support/looprig-coding-assistant/workspaces/63148aea-6875-47c6-b8ef-c88267a20f5f/NOTES.md
Allow? [y]es / [a]lways / [N]o: y
[WriteFile] WriteFile NOTES.md (45 bytes)
This is the Go module example.com/looprig-coding-assistant, according to its go.mod.
```

The files the tools read and write are the session's copy under `<data>/workspaces/<session-id>`, not your checkout: `NOTES.md` lands there and your repository is unchanged. Answer `n` and the call is refused with `[WriteFile] refused: ...`; the refusal goes back to the model as the tool result, and the turn goes on.

## Checkpoint and restore

`RestoreSession` brings the session's workspace back with its history. `SessionController` also exposes `CheckpointWorkspace(ctx)`, which snapshots on demand once the session is idle and returns the reference, and `RestoreWorkspace(ctx, ref)`, which replaces the live workspace with an earlier snapshot. Snapshot references are recorded in the journal; the contents live in the workspace store. See [snapshots](/docs/guides/harness/workspaces/snapshots) and [restore and cleanup](/docs/guides/harness/workspaces/restore-and-cleanup).

## Runnable checkpoint

The complete program is [`examples/go/start/workspaces`](https://github.com/looprig/.github/tree/main/examples/go/start/workspaces). Its [test](https://github.com/looprig/.github/blob/main/examples/go/start/workspaces/main_test.go) checks that the session reads its seeded copy, that the copy exists under the session's directory, that an approved write lands in that copy and not in the repository, and that after a restart the session restores and a denied write is refused.

Continue to [sandbox process tools](/docs/start/sandbox-and-interfaces).
