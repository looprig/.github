---
id: start/tools-and-gates
title: Add read-only tools and gates
description: Give the coding assistant Glob, Grep, and ReadFile over the repository, allow them with a read-only access gate, and place the workspace they bind to.
audience: developer
section: start
order: 5
publication: released
proofs:
  how-a-tool-call-runs: [release-github-com-looprig-core, release-github-com-looprig-harness]
  register-read-only-tools: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  place-the-workspace: [release-github-com-looprig-harness, release-github-com-looprig-storage]
  print-tool-calls: [release-github-com-looprig-harness]
  run-it: [release-github-com-looprig-harness, release-github-com-looprig-tools]
  runnable-checkpoint: [release-github-com-looprig-harness, release-github-com-looprig-tools]
---

# Add read-only tools and gates

The coding assistant can answer general questions without tools, but it needs evidence to discuss a repository. Start with read-only file inspection. Commands come later, behind a sandbox.

```sh
go get github.com/looprig/tools@v0.15.1
```

## How a tool call runs

The model does not call Go functions. It returns a `content.ToolUseBlock` naming a registered tool and carrying JSON arguments. Harness then:

1. asks the tool to prepare the call (`PrepareCall`), which validates the arguments and declares what the call needs, such as a `filesystem.read` of one canonical path;
2. asks the Loop's **access gate** whether every declared requirement is allowed;
3. runs the call only if the gate approves, and sends the result back to the model as a correlated tool result.

**A Loop with no access gate denies every tool call.** The model receives `permission denied [unavailable]` for each one, and the turn still ends normally, so nothing fails loudly. `loop.WithReadOnlyAccess(roots...)` is the smallest gate that lets the standard read tools work: it allows reads at or beneath the roots you name and denies every other read, every write, every command, and all network access. The gate judges the paths tools declare; the standard tools also confine the read they perform to the approved path, which is what makes the pair safe.

## Register read-only tools

Create `guard.go`. A `loop.ReadGuard` is the read tools' own filter inside the directories the gate allows: which canonical paths they never return, and how many bytes they read per file:

<!-- example: examples/go/start/tools-and-gates/guard.go -->
```go
package main

import (
	"path/filepath"
	"strings"
)

// readGuard is the read tools' own policy: which canonical paths they must
// never return, and how many bytes they read per file. The access gate
// decides which directories may be read at all; the guard filters inside
// them.
type readGuard struct{}

// DeniedRead hides environment files such as .env and .env.local.
func (readGuard) DeniedRead(path string) bool {
	return strings.HasPrefix(filepath.Base(path), ".env")
}

// MaxReadBytes caps each file read at 1 MiB.
func (readGuard) MaxReadBytes() int64 { return 1 << 20 }
```

Replace `agent.go`:

<!-- example: examples/go/start/tools-and-gates/agent.go -->
```go
package main

import (
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/tools"
)

// defineAssistant gives the coding assistant three read-only tools and an
// access gate that lets them read inside repo and nowhere else.
func defineAssistant(client inference.Client, selected model.Model, repo string) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep and ReadFile for evidence "+
			"and cite the paths you read. Never claim a file was read unless a tool returned it."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
		),
		// Every tool call passes an access gate before it runs, and a Loop
		// with no gate denies every call. This one allows file reads inside
		// repo and denies everything else: other reads, writes, commands and
		// network access.
		loop.WithReadOnlyAccess(repo),
	)
}

// defineRuntime assembles the Rig. The read tools need a workspace to bind
// to, so the Rig places one: the repository itself, shared with you.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, repo string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		// A shared workspace is a fixed directory that people and other
		// tools may change while the session runs.
		rig.WithSharedWorkspace(workspaces, repo),
		// A workspace needs a snapshot policy. Manual means snapshots are
		// taken only when the application asks for one.
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotManual}),
	)
}
```

## Place the workspace

`Glob`, `Grep`, and `ReadFile` declare that they need a workspace, and Harness binds each one to the session's workspace root. A Rig with workspace tools and no workspace placement fails `rig.Define` with `workspace_tool_without_placement`, and a Rig with a workspace must also say when to snapshot it, or `rig.Define` fails with `invalid snapshot policy (required)`.

`rig.WithSharedWorkspace` places the workspace at a fixed directory, here the repository itself. Replace `main.go`:

<!-- example: examples/go/start/tools-and-gates/main.go -->
```go
package main

import (
	"context"
	"flag"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/storage/memstore"
)

func main() {
	question := flag.String("ask", "What is this repository?", "question for the coding assistant")
	repo := flag.String("repo", ".", "repository the assistant may read")
	flag.Parse()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, *repo, *question); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, repoDir, question string) error {
	// Give the workspace and the gate one canonical path: absolute, with
	// symlinks resolved.
	repo, err := canonicalDir(repoDir)
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
	// Session history and workspace snapshots share one in-memory backend.
	memory := memstore.New()
	sessions, err := sessionstore.Open(memory)
	if err != nil {
		return err
	}
	workspaces, err := workspacestore.Open(memory.Blobs)
	if err != nil {
		return err
	}
	runtime, err := defineRuntime(assistant, sessions, workspaces, repo)
	if err != nil {
		return err
	}

	live, err := runtime.NewSession(ctx)
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

	return runTurn(ctx, live, question, stdout)
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

`canonicalDir` resolves the repository path once, absolute and with symlinks resolved, and the gate and the workspace both get that one path. `WithReadOnlyAccess` resolves its roots' symlinks itself when the Loop is defined, so the gate would also accept a root spelled through a symlink (such as `/tmp` on macOS). Resolving once up front keeps the gate, the workspace, and the paths tools declare all naming the same canonical directory.

## Print tool calls

Add two cases to `turn.go` so you can watch the tools run. The rest of the file is unchanged:

<!-- example: examples/go/start/tools-and-gates/turn.go -->
```go
package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"strings"

	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/session"
)

// runTurn submits one question to a live session and prints the answer as
// it streams. It returns when the turn ends, when ctx ends, or when the
// event stream closes, whichever happens first.
func runTurn(ctx context.Context, live session.Session, question string, out io.Writer) error {
	// Subscribe before submitting, so no event can pass before we listen.
	// Ephemeral events carry live progress such as token deltas; enduring
	// events are the durable record, including how the turn ended.
	stream, err := live.SubscribeEvents(event.EventFilter{
		Ephemeral: event.LoopScope{All: true},
		Enduring:  event.LoopScope{All: true},
	})
	if err != nil {
		return err
	}
	defer func() { _ = stream.Close() }()

	// Submit queues the question on the active Loop. The outcome arrives as
	// events, not as Submit's return value.
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: question}}); err != nil {
		return err
	}
	return waitForTurn(ctx, stream, out)
}

// waitForTurn prints streamed text until the turn reaches one of its three
// terminal events. A subscription stays open after a turn ends, so ranging
// over the channel alone could wait forever: always select on ctx as well.
func waitForTurn(ctx context.Context, stream event.Subscription, out io.Writer) error {
	events := stream.Events()
	midLine := false // streamed text has not ended its line yet
	endLine := func() {
		if midLine {
			fmt.Fprintln(out)
			midLine = false
		}
	}
	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("waiting for the turn: %w", ctx.Err())
		case delivery, ok := <-events:
			if !ok {
				// The subscription closed, for example because this consumer
				// fell too far behind. Err reports why.
				if err := stream.Err(); err != nil {
					return err
				}
				return errors.New("event stream closed before the turn ended")
			}
			switch ev := delivery.Event.(type) {
			case event.TokenDelta:
				// Live model output. Print text as it arrives.
				if chunk, ok := ev.Chunk.(*content.TextChunk); ok {
					fmt.Fprint(out, chunk.Text)
					midLine = !strings.HasSuffix(chunk.Text, "\n")
				}
			case event.ToolCallStarted:
				// The model called a tool.
				endLine()
				fmt.Fprintf(out, "[%s] %s\n", ev.ToolName, ev.Summary)
			case event.ToolCallCompleted:
				// A refused or failed call goes back to the model as the
				// call's result, so the model can recover; the turn goes on.
				if ev.IsError {
					fmt.Fprintf(out, "[%s] refused: %s\n", ev.ToolName, firstLine(ev.ResultPreview))
				}
			case event.TurnDone:
				endLine()
				return nil
			case event.TurnFailed:
				// A failed turn carries its typed cause, such as a provider's
				// 401 or a rate limit.
				endLine()
				if ev.Err != nil {
					return fmt.Errorf("turn failed: %w", ev.Err)
				}
				return errors.New("turn failed")
			case event.TurnInterrupted:
				endLine()
				return errors.New("turn was interrupted")
			}
		}
	}
}

// firstLine returns the first line of s.
func firstLine(s string) string {
	line, _, _ := strings.Cut(s, "\n")
	return line
}
```

A refused or failed call is not a failed turn: its error goes back to the model as the tool result, and the model can try something else.

## Run it

Replace `scripted.go` with a script that calls the tools the way a model would:

<!-- example: examples/go/start/tools-and-gates/scripted.go -->
```go
package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. Its script calls the read
// tools the way a model would: list the Go files, read go.mod, then answer.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("Glob", `{"pattern":"*.go"}`),
		inferencetest.ToolCall("ReadFile", `{"path":"go.mod"}`),
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
Let me look.
[Glob] Glob *.go
[ReadFile] ReadFile go.mod
This is the Go module example.com/looprig-coding-assistant, according to its go.mod.
```

With a hosted model, point it at any repository: `go run . -repo ~/src/some-project -ask "Where is the HTTP router?"`.

When the assistant should also change files, `loop.WithWorkspaceAccess` is the next one-option gate: reads under its roots run, each write under them asks an approver first, and commands and network stay denied. The [workspace page](/docs/start/workspaces) switches to it once each session has its own copy of the repository. For any other policy, such as sandboxed commands, compose a `gate.Evaluator` yourself and install it with `loop.WithAccessGate` and `loop.WithPolicyRevision`, as the [sandbox page](/docs/start/sandbox-and-interfaces) does. Interactive approval, saved rules, and headless policies are covered in [access gates](/docs/guides/harness/gates/access-gates) and the [built-in tool catalog](/docs/guides/tools/built-in-tools).

## Runnable checkpoint

The complete program is [`examples/go/start/tools-and-gates`](https://github.com/looprig/.github/tree/main/examples/go/start/tools-and-gates). Its [test](https://github.com/looprig/.github/blob/main/examples/go/start/tools-and-gates/main_test.go) checks both halves of the rule: with the gate, reads inside the repository run; without it, every call is refused with `permission denied [unavailable]`.

Continue to [persist and restore sessions](/docs/start/sessions).
