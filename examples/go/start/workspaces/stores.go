package main

import (
	"errors"
	"fmt"

	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
)

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
		// The directory was written by fsstore older than v0.6.0, whose
		// layout is not migrated. Retrying cannot help: move or delete it.
		return nil, fmt.Errorf("%s holds data in an old fsstore layout; move or delete it: %w", dir, err)
	}
	if err != nil {
		return nil, fmt.Errorf("open durable storage: %w", err)
	}
	// The session store must be able to close a blob reader promptly, even
	// mid-read. Plain files cannot promise that, so a local store opts in to
	// Storage's bounded reader adapter. It suits one process on one host;
	// shared deployments use a backend that implements the lifecycle itself.
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

// Close releases the storage. Call it only after every session has shut
// down: a session writes its final records while it shuts down.
func (s *stores) Close() error { return s.disk.Close() }
