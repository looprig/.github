package main

import (
	"errors"
	"fmt"
	"os"

	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
)

// stores is the durable state under one data directory: the session journal
// (so --resume can restore a conversation) and the workspace snapshot store
// the rig requires for its workspace.
type stores struct {
	disk       *fsstore.Store
	sessions   *sessionstore.Store
	workspaces *workspacestore.Store
}

// legacyDataDirError is returned for a data directory written by fsstore
// before v0.6.0. fsstore v0.6.0 changed its on-disk layout with no migration,
// so the only remedy is to move or delete the directory. Never retry.
type legacyDataDirError struct {
	Dir   string
	Cause error
}

func (e *legacyDataDirError) Error() string {
	return fmt.Sprintf("data directory %s was written by an older fsstore layout and cannot be read; move or delete it and start again", e.Dir)
}

func (e *legacyDataDirError) Unwrap() error { return e.Cause }

func openStores(dataDir string) (*stores, error) {
	if err := os.MkdirAll(dataDir, 0o700); err != nil {
		return nil, err
	}
	disk, err := fsstore.Open(fsstore.Options{Root: dataDir})
	if errors.Is(err, fsstore.ErrLegacyLayout) {
		return nil, &legacyDataDirError{Dir: dataDir, Cause: err}
	}
	if err != nil {
		return nil, fmt.Errorf("open data directory %s: %w", dataDir, err)
	}
	// The session store needs Blobs readers whose Close is bounded. fsstore
	// deliberately does not promise that (portable file I/O cannot be
	// cancelled), so opt in to storage's bounded-reader adapter. It is sound
	// for a local directory this process owns; a networked backend should
	// implement storage.BlobReaderLifecycle natively instead (s3store does).
	backend, err := disk.Backend().WithBoundedBlobReaders()
	if err != nil {
		_ = disk.Close()
		return nil, err
	}
	sessions, err := sessionstore.Open(backend)
	if err != nil {
		_ = disk.Close()
		return nil, fmt.Errorf("open session store: %w", err)
	}
	workspaces, err := workspacestore.Open(backend.Blobs)
	if err != nil {
		_ = disk.Close()
		return nil, fmt.Errorf("open workspace store: %w", err)
	}
	return &stores{disk: disk, sessions: sessions, workspaces: workspaces}, nil
}

func (s *stores) Close() error { return s.disk.Close() }
