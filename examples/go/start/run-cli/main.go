// Command looprig-coding-assistant is the complete program from the Looprig
// "Build a coding assistant" tutorial: a command-line coding assistant with
// read-only file tools, commands confined by an operating-system sandbox,
// durable sessions you can continue, and a private workspace per session.
//
// Without OPENAI_API_KEY it runs against a scripted model, so it works with
// no account and no network. With OPENAI_API_KEY and LOOPRIG_MODEL set, it
// talks to OpenAI.
//
//	go run . -ask "What does this repository do?"
//	go run . -session <id> -ask "What did you read?"
//	go run . -chat
package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/session"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/auth"
	"github.com/looprig/inference/inferencetest"
	"github.com/looprig/inference/model"
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
	"github.com/looprig/sandbox"
	"github.com/looprig/tools"
	"github.com/looprig/tools/bash"
)

type config struct {
	question  string
	chat      bool
	repo      string
	data      string
	sessionID string // empty starts a new session
	timeout   time.Duration
}

func main() {
	// On Linux, sandbox.Init must run first: it dispatches the sandbox's
	// re-executed child process and returns at once in the parent.
	sandbox.Init()

	var cfg config
	flag.StringVar(&cfg.question, "ask", "What is this repository?", "question for the coding assistant")
	flag.BoolVar(&cfg.chat, "chat", false, "after -ask, keep reading questions from standard input")
	flag.StringVar(&cfg.repo, "repo", ".", "repository to copy into a new session's workspace")
	flag.StringVar(&cfg.data, "data", defaultDataDir(), "directory for durable assistant data, outside the repository")
	flag.StringVar(&cfg.sessionID, "session", "", "ID of a session to continue")
	flag.DurationVar(&cfg.timeout, "timeout", 2*time.Minute, "time limit for each turn")
	flag.Parse()

	// Ctrl-C or SIGTERM cancels ctx: the running turn stops waiting, and the
	// deferred cleanup in run still shuts everything down.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := run(ctx, os.Stdin, os.Stdout, os.Stderr, cfg); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdin io.Reader, stdout, stderr io.Writer, cfg config) error {
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

	// Acquire resources in dependency order and register each cleanup right
	// after it succeeds. Deferred calls run last-in, first-out, so the
	// session shuts down first, then the sandbox, and storage closes last:
	// a session writes its final records while it shuts down.
	store, err := openStores(filepath.Join(cfg.data, "store"))
	if err != nil {
		return err
	}
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
		// A fresh deadline: ctx may already be cancelled.
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := live.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()
	// Print the ID so a later run can continue this conversation.
	fmt.Fprintf(stdout, "session: %s\n", live.SessionID())

	ask := func(question string) error {
		turnCtx, cancel := context.WithTimeout(ctx, cfg.timeout)
		defer cancel()
		return runTurn(turnCtx, live, question, stdout)
	}
	if cfg.question != "" {
		if err := ask(cfg.question); err != nil {
			return err
		}
	}
	if !cfg.chat {
		return nil
	}
	lines := bufio.NewScanner(stdin)
	for fmt.Fprint(stdout, "> "); lines.Scan(); fmt.Fprint(stdout, "> ") {
		if question := strings.TrimSpace(lines.Text()); question != "" {
			if err := ask(question); err != nil {
				return err
			}
		}
	}
	fmt.Fprintln(stdout)
	return lines.Err()
}

// ---- The model ----

// newModel selects the model the coding assistant talks to and builds the
// client that calls it. With OPENAI_API_KEY set, it calls OpenAI with the
// model named by LOOPRIG_MODEL. Without a key, it returns a scripted client,
// so the program runs, and can be tested, with no account and no network.
func newModel(stderr io.Writer) (inference.Client, model.Model, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		fmt.Fprintln(stderr, "OPENAI_API_KEY is not set: using the scripted model")
		return scriptedClient(), inferencetest.Model(), nil
	}
	name := os.Getenv("LOOPRIG_MODEL")
	if name == "" {
		return nil, model.Model{}, errors.New("set LOOPRIG_MODEL to the OpenAI model to use")
	}
	selected := model.CustomModel(
		model.ProviderName(llm.ProviderOpenAI),
		model.APIFormatOpenAIResponses,
		"https://api.openai.com/v1",
		name,
		model.WithTools(),
	)
	client, err := auto.New(selected, auth.APIKey(apiKey))
	if err != nil {
		return nil, model.Model{}, fmt.Errorf("create OpenAI client: %w", err)
	}
	return client, selected, nil
}

// scriptedClient stands in for a hosted model. Its script reads go.mod, runs
// one command in the sandbox, then answers every later question the same way.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("ReadFile", `{"path":"go.mod"}`),
		inferencetest.ToolCall("Bash", `{"command":"ls"}`),
		inferencetest.Text("This is the Go module example.com/looprig-coding-assistant; "+
			"its workspace holds the files ls listed.").Repeat(),
	)
}

// ---- The agent ----

// readGuard is the read tools' own policy: they never return environment
// files such as .env, and read at most 1 MiB per file.
type readGuard struct{}

func (readGuard) DeniedRead(path string) bool {
	return strings.HasPrefix(filepath.Base(path), ".env")
}

func (readGuard) MaxReadBytes() int64 { return 1 << 20 }

// defineAssistant freezes the coding assistant's definition: instructions,
// model, tools, and the access gate every tool call must pass.
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
			// Bash runs each approved command through the sandbox executor.
			tools.Bash(bash.WithRunner(executor)),
		),
		loop.WithAccessGate(access),
		// Change the revision whenever the gate's policy changes.
		loop.WithPolicyRevision("coding-assistant/sandbox-v1"),
	)
}

// defineRuntime gives every session its own workspace directory,
// <workspaceBase>/<session-id>, and snapshots it when each turn ends.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, workspaceBase string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		rig.WithSessionWorkspaces(workspaces, workspaceBase),
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotOnTurnDone}),
	)
}

// ---- The sandbox ----

// newSandbox builds the operating-system confinement for the assistant's
// commands and the access gate that agrees with it: one Profile states the
// authority, the gate decides each call from it, and the executor enforces
// it on the process.
func newSandbox(workspaceBase, scratch string, stderr io.Writer) (*sandbox.ExecutorSet, *sandbox.Executor, *gate.Evaluator, error) {
	profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot:  workspaceBase,
		WorkspaceRead:  sandbox.Allow,
		WorkspaceWrite: sandbox.Deny,
		HostRead:       sandbox.Deny,
		HostWrite:      sandbox.Deny,
		Network:        sandbox.Deny,
		Command:        sandbox.Allow,
		Home:           sandbox.IsolatedHome,
		Isolation:      sandbox.Sandboxed,
	})
	if err != nil {
		return nil, nil, nil, err
	}
	if err := os.MkdirAll(scratch, 0o700); err != nil {
		return nil, nil, nil, err
	}
	executors, err := sandbox.NewExecutorSet(profile, sandbox.WithScratchRoot(scratch), sandbox.WithMaxExecutors(1))
	if err != nil {
		return nil, nil, nil, err
	}
	executor, err := executors.For("coding-assistant")
	if err != nil {
		_ = executors.Close()
		return nil, nil, nil, err
	}
	guarantees := executor.Guarantees()
	if executor.Level() == sandbox.LevelNone || !guarantees.ProcessBoundary || !guarantees.WriteBoundary {
		_ = executors.Close()
		return nil, nil, nil, fmt.Errorf("sandbox unavailable on this host: level=%v report=%+v", executor.Level(), executor.Report())
	}
	fmt.Fprintf(stderr, "sandbox: level=%v\n", executor.Level())
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

// ---- Storage and sessions ----

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
		// Written by fsstore older than v0.6.0, whose layout is not
		// migrated. Retrying cannot help: move or delete the directory.
		return nil, fmt.Errorf("%s holds data in an old fsstore layout; move or delete it: %w", dir, err)
	}
	if err != nil {
		return nil, fmt.Errorf("open durable storage: %w", err)
	}
	// Opt local files in to Storage's bounded blob readers, which the
	// session store requires. It suits one process on one host.
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

// Close releases the storage, after every session has shut down.
func (s *stores) Close() error { return s.disk.Close() }

// startSession creates a new session whose workspace starts as a copy of
// repo, or restores the session named by id together with its workspace.
func startSession(ctx context.Context, runtime *rig.Rig, workspaces *workspacestore.Store, repo, id string) (session.SessionController, error) {
	if id == "" {
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
	live, err := runtime.RestoreSession(ctx, parsed)
	if err != nil {
		return nil, fmt.Errorf("restore session %s: %w", parsed, err)
	}
	return live, nil
}

// ---- Turns ----

// runTurn submits one question to a live session and prints the answer as
// it streams, with a line for each tool call.
func runTurn(ctx context.Context, live session.Session, question string, out io.Writer) error {
	// Subscribe before submitting, so no event can pass before we listen.
	stream, err := live.SubscribeEvents(event.EventFilter{
		Ephemeral: event.LoopScope{All: true},
		Enduring:  event.LoopScope{All: true},
	})
	if err != nil {
		return err
	}
	defer func() { _ = stream.Close() }()
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: question}}); err != nil {
		return err
	}

	// A subscription stays open after a turn ends, so select on ctx too.
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
			endLine()
			return fmt.Errorf("waiting for the turn: %w", ctx.Err())
		case delivery, ok := <-events:
			if !ok {
				if err := stream.Err(); err != nil {
					return err
				}
				return errors.New("event stream closed before the turn ended")
			}
			switch ev := delivery.Event.(type) {
			case event.TokenDelta:
				if chunk, ok := ev.Chunk.(*content.TextChunk); ok {
					fmt.Fprint(out, chunk.Text)
					midLine = !strings.HasSuffix(chunk.Text, "\n")
				}
			case event.ToolCallStarted:
				endLine()
				fmt.Fprintf(out, "[%s] %s\n", ev.ToolName, ev.Summary)
			case event.ToolCallCompleted:
				if ev.IsError {
					fmt.Fprintf(out, "[%s] refused: %s\n", ev.ToolName, firstLine(ev.ResultPreview))
				}
			case event.TurnDone:
				endLine()
				return nil
			case event.TurnFailed:
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

// ---- Helpers ----

// defaultDataDir keeps the assistant's data in the user's configuration
// directory. It must not be inside the repository: the Rig refuses storage
// that overlaps a workspace.
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

// firstLine returns the first line of s.
func firstLine(s string) string {
	line, _, _ := strings.Cut(s, "\n")
	return line
}
