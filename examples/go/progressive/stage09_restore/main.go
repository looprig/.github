package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/.github/examples/go/progressive/internal/fakeinference"
	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference/model"
)

func run(output io.Writer) error {
	ctx := context.Background()
	root, err := os.MkdirTemp("", "looprig-restore-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(root)

	definition, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(fakeinference.New(), model.CustomModel("offline", model.APIFormatOpenAI, "http://localhost", "fixture")),
	)
	if err != nil {
		return err
	}
	build := func(backend *fsstore.Store) (*rig.Rig, error) {
		store, openErr := sessionstore.Open(backend.Backend())
		if openErr != nil {
			return nil, openErr
		}
		return rig.Define(rig.WithLoops(definition), rig.WithPrimers("assistant"), rig.WithSessionStore(store))
	}

	backend, err := fsstore.Open(fsstore.Options{Root: root})
	if err != nil {
		return err
	}
	harness, err := build(backend)
	if err != nil {
		return err
	}
	live, err := harness.NewSession(ctx)
	if err != nil {
		return err
	}
	id := live.SessionID()
	if err := live.Shutdown(ctx); err != nil {
		return err
	}
	if err := backend.Close(); err != nil {
		return err
	}

	reopened, err := fsstore.Open(fsstore.Options{Root: root})
	if err != nil {
		return err
	}
	defer reopened.Close()
	restoredHarness, err := build(reopened)
	if err != nil {
		return err
	}
	restored, err := restoredHarness.RestoreSession(ctx, id)
	if err != nil {
		return err
	}
	defer restored.Shutdown(ctx)
	assertoutput.MustEqual("restored session ID", restored.SessionID(), id)
	_, err = fmt.Fprintln(output, "restore: same session resumed")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
