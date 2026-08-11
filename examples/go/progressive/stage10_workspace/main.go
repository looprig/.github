package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/storage/memstore"
)

func run(output io.Writer) error {
	ctx := context.Background()
	root, err := os.MkdirTemp("", "looprig-workspace-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(root)
	source := filepath.Join(root, "source")
	if err := os.Mkdir(source, 0o700); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(source, "result.txt"), []byte("verified\n"), 0o600); err != nil {
		return err
	}

	backend := memstore.New()
	store, err := workspacestore.Open(backend.Blobs)
	if err != nil {
		return err
	}
	ref, err := store.Snapshot(ctx, source)
	if err != nil {
		return err
	}
	restored := filepath.Join(root, "restored")
	if err := store.Materialize(ctx, ref, restored); err != nil {
		return err
	}
	contents, err := os.ReadFile(filepath.Join(restored, "result.txt"))
	if err != nil {
		return err
	}
	assertoutput.MustEqual("restored contents", string(contents), "verified\n")
	_, err = fmt.Fprintln(output, "workspace: snapshot restored exactly")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
