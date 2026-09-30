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
