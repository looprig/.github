package main

import (
	"path/filepath"
	"strings"
)

// readGuard is the read tools' own policy: which canonical paths they must
// never return, and how many bytes they read per file. The access gate
// decides which directories may be read at all; the guard filters inside
// them.
type readGuard struct{}

// DeniedRead hides environment files such as .env and .env.local.
func (readGuard) DeniedRead(path string) bool {
	return strings.HasPrefix(filepath.Base(path), ".env")
}

// MaxReadBytes caps each file read at 1 MiB.
func (readGuard) MaxReadBytes() int64 { return 1 << 20 }
