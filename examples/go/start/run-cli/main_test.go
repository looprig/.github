package main

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/looprig/sandbox"
)

// TestMain lets the test binary act as the sandbox's re-executed child.
func TestMain(m *testing.M) {
	sandbox.Init()
	os.Exit(m.Run())
}

func TestTheAssistantAnswersAndContinuesASession(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()
	cfg := config{question: "What is this repository?", repo: fixtureRepo(t), data: t.TempDir(), timeout: time.Minute}

	var first bytes.Buffer
	if err := run(ctx, strings.NewReader(""), &first, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	out := first.String()
	for _, want := range []string{"[ReadFile] ReadFile go.mod", "[Bash] ", "files ls listed"} {
		if !strings.Contains(out, want) {
			t.Errorf("output lacks %q:\n%s", want, out)
		}
	}
	if strings.Contains(out, "refused") {
		t.Errorf("no call may be refused:\n%s", out)
	}

	// Continue the same session in chat mode, reading two questions.
	cfg.sessionID = linePrefixed(t, out, "session: ")
	cfg.question, cfg.chat = "", true
	var second bytes.Buffer
	if err := run(ctx, strings.NewReader("first?\n\nsecond?\n"), &second, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	if got := linePrefixed(t, second.String(), "session: "); got != cfg.sessionID {
		t.Fatalf("restored session %s, want %s", got, cfg.sessionID)
	}
	if n := strings.Count(second.String(), "files ls listed"); n != 2 {
		t.Fatalf("want two answers in chat mode, got %d:\n%s", n, second.String())
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
