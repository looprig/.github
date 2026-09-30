package main

import (
	"context"
	"flag"
	"io"
	"log"
	"os"
	"time"

	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/storage/memstore"
)

func main() {
	question := flag.String("ask", "What can you do?", "question for the coding assistant")
	flag.Parse()

	// Bound the run: a provider that never answers cannot hang the program.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, *question); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, question string) error {
	client, selected, err := newModel(stderr)
	if err != nil {
		return err
	}
	assistant, err := defineAssistant(client, selected)
	if err != nil {
		return err
	}
	// An in-memory session store. It disappears with the process; a later
	// step replaces it with one on disk.
	sessions, err := sessionstore.Open(memstore.New())
	if err != nil {
		return err
	}
	runtime, err := defineRuntime(assistant, sessions)
	if err != nil {
		return err
	}

	// A Session is one live execution of the Rig.
	live, err := runtime.NewSession(ctx)
	if err != nil {
		return err
	}
	defer func() {
		// Shut down with a fresh deadline: ctx may already have expired, and
		// shutdown still writes its final records.
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := live.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()

	return runTurn(ctx, live, question, stdout)
}
