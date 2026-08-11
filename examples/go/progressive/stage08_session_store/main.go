package main

import (
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
	if err != nil {
		return err
	}
	defer backend.Close()
	store, err := sessionstore.Open(backend.Backend())
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
