package main

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/sessionstore"
)

func run(output io.Writer) error {
	root, err := os.MkdirTemp("", "looprig-session-store-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(root)

	backend, err := fsstore.Open(fsstore.Options{Root: root})
	if errors.Is(err, fsstore.ErrLegacyLayout) {
		// fsstore v0.6.0 refuses a pre-v0.6.0 root and never migrates it.
		// Move or delete the root; retrying cannot succeed.
		return fmt.Errorf("move or delete %s: %w", root, err)
	}
	if err != nil {
		return err
	}
	defer backend.Close()
	// SessionStore requires bounded blob readers; fsstore's filesystem Blobs
	// provider is adapted rather than trusted to cancel a blocked Read.
	composite, err := backend.Backend().WithBoundedBlobReaders()
	if err != nil {
		return err
	}
	store, err := sessionstore.Open(composite)
	if err != nil {
		return err
	}
	paths, err := store.PersistencePaths()
	if err != nil {
		return err
	}
	assertoutput.MustEqual("persistence path count", len(paths), 1)
	canonicalRoot, err := filepath.EvalSymlinks(root)
	if err != nil {
		return err
	}
	assertoutput.MustEqual("persistence path", paths[0], canonicalRoot)
	_, err = fmt.Fprintln(output, "session store: durable path configured")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
