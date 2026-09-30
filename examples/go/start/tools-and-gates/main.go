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
