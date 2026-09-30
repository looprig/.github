package main

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestASessionContinuesAfterARestart(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	cfg := config{question: "What is this repository?", repo: fixtureRepo(t), data: t.TempDir()}

	// The first run creates a session and prints its ID.
	var first bytes.Buffer
	if err := run(ctx, &first, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	id := sessionID(t, first.String())

	// The second run is a new process in all but name: new model client,
	// new Loop, new Rig, storage reopened from disk. It restores the session.
	cfg.sessionID, cfg.question = id, "What did you read?"
	var second bytes.Buffer
	if err := run(ctx, &second, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	if got := sessionID(t, second.String()); got != id {
		t.Fatalf("restored session %s, want %s", got, id)
	}
}

func TestAnUnknownSessionIsRefused(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cfg := config{question: "hello", repo: fixtureRepo(t), data: t.TempDir(),
		sessionID: "018f2b4e-0000-7000-8000-000000000000"}
	if err := run(ctx, &bytes.Buffer{}, &bytes.Buffer{}, cfg); err == nil {
		t.Fatal("restoring a session that was never created must fail")
	}
}

func TestAnOldStoreLayoutIsReportedNotRetried(t *testing.T) {
	dir := t.TempDir()
	// A leaf file without v0.6.0's "@" suffix marks a pre-v0.6.0 store.
	if err := os.MkdirAll(filepath.Join(dir, "kv"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "kv", "old"), []byte("x"), 0o600); err != nil {
		t.Fatal(err)
	}
	_, err := openStores(dir)
	if err == nil || !strings.Contains(err.Error(), "move or delete it") {
		t.Fatalf("want a move-or-delete error, got %v", err)
	}
}

func sessionID(t *testing.T, out string) string {
	t.Helper()
	for _, line := range strings.Split(out, "\n") {
		if id, ok := strings.CutPrefix(line, "session: "); ok {
			return id
		}
	}
	t.Fatalf("no session line in output:\n%s", out)
	return ""
}

func fixtureRepo(t *testing.T) string {
	t.Helper()
	repo, err := canonicalDir(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	for name, text := range map[string]string{
		"go.mod":  "module example.com/looprig-coding-assistant\n",
		"main.go": "package main\n",
	} {
		if err := os.WriteFile(filepath.Join(repo, name), []byte(text), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	return repo
}
