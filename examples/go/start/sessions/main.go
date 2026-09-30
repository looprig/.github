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
