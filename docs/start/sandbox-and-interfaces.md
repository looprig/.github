---
id: start/sandbox-and-interfaces
title: Sandbox process tools
description: Call sandbox.Init, describe the coding assistant's process authority in one Profile, derive the access gate from it, bind Bash to a sandbox executor, and verify the guarantees the host achieves.
audience: developer
section: start
order: 8
publication: released
proofs:
  describe-the-authority: [release-github-com-looprig-sandbox, release-github-com-looprig-harness]
  bind-bash-to-the-executor: [release-github-com-looprig-sandbox, release-github-com-looprig-tools, release-github-com-looprig-harness]
  initialize-the-application: [release-github-com-looprig-sandbox]
  run-it: [release-github-com-looprig-sandbox, release-github-com-looprig-tools]
  verify-achieved-enforcement: [release-github-com-looprig-sandbox]
  runnable-checkpoint: [release-github-com-looprig-sandbox]
---

# Sandbox process tools

Read tools run inside the Go process and confine themselves. A command is different: it is a child process that can do anything its operating-system permissions allow. Add Sandbox before the coding assistant runs Bash. The gate decides whether a prepared command is authorized; the sandbox decides what the operating system lets the child do.

```sh
go get github.com/looprig/sandbox@v0.9.3
```

## Describe the authority

Create `sandbox.go`. One `sandbox.Profile` states the authority. The same profile feeds the access gate, which decides each call before it runs, and the executor, which enforces it on the process while it runs, so the two cannot disagree:

<!-- example: examples/go/start/sandbox/sandbox.go -->
```go
package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/sandbox"
)

// newSandbox builds the operating-system confinement for the assistant's
// commands and the access gate that agrees with it. One Profile states the
// authority; the gate decides each call from it before the call runs, and
// the executor enforces it on the process while it runs.
func newSandbox(workspaceBase, scratch string, stderr io.Writer) (*sandbox.ExecutorSet, *sandbox.Executor, *gate.Evaluator, error) {
	profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot:  workspaceBase,
		WorkspaceRead:  sandbox.Allow,
		WorkspaceWrite: sandbox.Deny,
		HostRead:       sandbox.Deny,
		HostWrite:      sandbox.Deny,
		Network:        sandbox.Deny,
		// Allow lets the headless gate approve commands without asking.
		// Gated would need an interactive approver or saved rules.
		Command:   sandbox.Allow,
		Home:      sandbox.IsolatedHome,
		Isolation: sandbox.Sandboxed,
	})
	if err != nil {
		return nil, nil, nil, err
	}
	// The scratch root holds per-process temporary state. It must exist.
	if err := os.MkdirAll(scratch, 0o700); err != nil {
		return nil, nil, nil, err
	}
	executors, err := sandbox.NewExecutorSet(profile,
		sandbox.WithScratchRoot(scratch),
		sandbox.WithMaxExecutors(1),
	)
	if err != nil {
		return nil, nil, nil, err
	}
	// One executor per Loop identity.
	executor, err := executors.For("coding-assistant")
	if err != nil {
		_ = executors.Close()
		return nil, nil, nil, err
	}

	// Requested policy and achieved enforcement are different facts: check
	// what this host actually enforces before running anything.
	guarantees := executor.Guarantees()
	if executor.Level() == sandbox.LevelNone || !guarantees.ProcessBoundary || !guarantees.WriteBoundary {
		_ = executors.Close()
		return nil, nil, nil, fmt.Errorf("sandbox unavailable on this host: level=%v report=%+v", executor.Level(), executor.Report())
	}
	fmt.Fprintf(stderr, "sandbox: level=%v\n", executor.Level())

	// The gate routes each requirement kind a tool declares to the profile.
	// A requirement of any other kind is denied. The executor is the grant
	// issuer: an approved command carries a grant only it accepts.
	evaluator, err := gate.NewHeadlessEvaluator([]gate.AccessBinding{
		{Kind: "filesystem.read", Source: profile},
		{Kind: "filesystem.write", Source: profile},
		{Kind: "command.execute", Source: profile},
		{Kind: "network", Source: profile},
	}, nil, executor)
	if err != nil {
		_ = executors.Close()
		return nil, nil, nil, err
	}
	return executors, executor, evaluator, nil
}
```

The profile lets commands read the session workspaces and nothing else, write nothing, and reach no network. `Command: sandbox.Allow` lets the headless gate approve commands without asking anyone. `sandbox.Gated` would need an interactive approver or saved rules; see [access gates](/docs/guides/harness/gates/access-gates). `sandbox.Restrict` intersects a requested profile with an application ceiling and never widens it.

The scratch root holds per-process temporary state and must exist before `NewExecutorSet`, so `newSandbox` creates it.

## Bind Bash to the executor

Replace `agent.go`. Bash sends each approved command to the executor instead of starting `sh` itself, and the Loop's gate is now the one derived from the profile:

<!-- example: examples/go/start/sandbox/agent.go -->
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
	"github.com/looprig/sandbox"
	"github.com/looprig/tools"
	"github.com/looprig/tools/bash"
)

// defineAssistant adds a Bash tool whose commands run in the sandbox, and
// replaces the read-only gate with one derived from the sandbox profile.
func defineAssistant(client inference.Client, selected model.Model, executor *sandbox.Executor, access *gate.Evaluator) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep, ReadFile and Bash for evidence "+
			"and cite what you inspected. Commands run read-only, without network access."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
			// Bash runs each approved command through the sandbox executor
			// instead of starting sh itself.
			tools.Bash(bash.WithRunner(executor)),
		),
		loop.WithAccessGate(access),
		// A gate you build yourself is opaque to Harness, so name its policy.
		// Change the revision whenever the gate's policy changes.
		loop.WithPolicyRevision("coding-assistant/sandbox-v1"),
	)
}

// defineRuntime gives every session its own workspace directory,
// <workspaceBase>/<session-id>, instead of sharing the repository.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, workspaceBase string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		rig.WithSessionWorkspaces(workspaces, workspaceBase),
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotOnTurnDone}),
	)
}
```

`loop.WithReadOnlyAccess` is gone: a Loop has exactly one access gate. A gate you build yourself is opaque to Harness, so `loop.WithPolicyRevision` names its policy; change the revision whenever the policy changes. For several Loops, resolve one executor per Loop identity rather than sharing one runner. Background and supervised processes are covered in [process ownership](/docs/guides/tools/processes).

## Initialize the application

Replace `main.go`. On Linux, `sandbox.Init()` must be the first statement in `main`: it dispatches the sandbox's re-executed child and returns at once in the parent. The sandbox and its executors are acquired after storage and closed before it:

<!-- example: examples/go/start/sandbox/main.go -->
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
	"github.com/looprig/sandbox"
)

type config struct {
	question  string
	repo      string
	data      string
	sessionID string // empty starts a new session
}

func main() {
	// On Linux, sandbox.Init must run first: it dispatches the sandbox's
	// re-executed child process and returns at once in the parent.
	sandbox.Init()

	var cfg config
	flag.StringVar(&cfg.question, "ask", "What is this repository?", "question for the coding assistant")
	flag.StringVar(&cfg.repo, "repo", ".", "repository to copy into a new session's workspace")
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
	store, err := openStores(filepath.Join(cfg.data, "store"))
	if err != nil {
		return err
	}
	// Deferred calls run last-in, first-out, so register cleanup in the
	// order resources are acquired: storage closes last, after the
	// executors, and both close after the session has shut down.
	defer func() {
		if err := store.Close(); err != nil {
			log.Printf("close storage: %v", err)
		}
	}()
	executors, executor, access, err := newSandbox(workspaceBase, filepath.Join(cfg.data, "sandbox"), stderr)
	if err != nil {
		return err
	}
	defer func() {
		if err := executors.Close(); err != nil {
			log.Printf("close sandbox: %v", err)
		}
	}()
	assistant, err := defineAssistant(client, selected, executor, access)
	if err != nil {
		return err
	}
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

The application is still built with the ordinary Go toolchain. A test binary that runs the sandbox needs the same call in `TestMain`; see the [test](https://github.com/looprig/.github/blob/main/examples/go/start/sandbox/main_test.go).

## Run it

Replace `scripted.go` with a script that runs a command:

<!-- example: examples/go/start/sandbox/scripted.go -->
```go
package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. Its script reads go.mod, runs
// one command in the sandbox, then answers.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("ReadFile", `{"path":"go.mod"}`),
		inferencetest.ToolCall("Bash", `{"command":"ls"}`),
		inferencetest.Text("This is the Go module example.com/looprig-coding-assistant; "+
			"its workspace holds the files ls listed.").Repeat(),
	)
}
```

```sh
go run .
```

```text
OPENAI_API_KEY is not set: using the scripted model
sandbox: level=2
session: 7da72e77-89ae-4f36-9bb3-e427767c9101
Let me look.
[ReadFile] ReadFile go.mod
[Bash] Bash: ls
This is the Go module example.com/looprig-coding-assistant; its workspace holds the files ls listed.
```

## Verify achieved enforcement

What you request and what the host enforces are different facts. `Executor.Level` reports none, degraded, or full enforcement; `Executor.Guarantees` reports each enforced property as a fail-closed boolean; and `Executor.Report` returns the `CompileReport`, which explains each feature. `newSandbox` refuses to run when the host cannot provide a process boundary and a write boundary. Check these on the machine you deploy to: Docker, a microVM, or a managed sandbox is an outer boundary, but it does not prove which inner features succeeded. See [deployment environments](/docs/guides/sandboxing/deployment-environments) and [Sandboxing](/docs/guides/sandboxing).

## Runnable checkpoint

The complete program is [`examples/go/start/sandbox`](https://github.com/looprig/.github/tree/main/examples/go/start/sandbox). Its test runs a real confined command and checks that no call is refused.

Continue to [run the coding assistant CLI](/docs/start/run-cli).
