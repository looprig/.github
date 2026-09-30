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

func TestEachSessionWorksOnItsOwnCopy(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	repo := fixtureRepo(t)
	cfg := config{question: "What is this repository?", repo: repo, data: t.TempDir()}

	var first bytes.Buffer
	if err := run(ctx, &first, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	out := first.String()
	id := linePrefixed(t, out, "session: ")
	if !strings.Contains(out, "[ReadFile] ReadFile go.mod") || strings.Contains(out, "refused") {
		t.Fatalf("the seeded workspace was not readable:\n%s", out)
	}

	// The workspace is a copy of the repository, not the repository.
	copied := filepath.Join(cfg.data, "workspaces", id, "go.mod")
	if _, err := os.Stat(copied); err != nil {
		t.Fatalf("the session workspace holds no copy of go.mod: %v", err)
	}

	// The session and its workspace survive a restart.
	cfg.sessionID, cfg.question = id, "What did you read?"
	var second bytes.Buffer
	if err := run(ctx, &second, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	if got := linePrefixed(t, second.String(), "session: "); got != id {
		t.Fatalf("restored session %s, want %s", got, id)
	}
}

func linePrefixed(t *testing.T, out, prefix string) string {
	t.Helper()
	for _, line := range strings.Split(out, "\n") {
		if rest, ok := strings.CutPrefix(line, prefix); ok {
			return rest
		}
	}
	t.Fatalf("no %q line in output:\n%s", prefix, out)
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
