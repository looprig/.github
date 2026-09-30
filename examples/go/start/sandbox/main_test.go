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

func TestCommandsRunInTheSandbox(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	cfg := config{question: "What is this repository?", repo: fixtureRepo(t), data: t.TempDir()}

	var stdout bytes.Buffer
	if err := run(ctx, &stdout, &bytes.Buffer{}, cfg); err != nil {
		t.Fatal(err)
	}
	out := stdout.String()
	for _, want := range []string{"[ReadFile] ReadFile go.mod", "[Bash] ", "files ls listed"} {
		if !strings.Contains(out, want) {
			t.Errorf("output lacks %q:\n%s", want, out)
		}
	}
	if strings.Contains(out, "refused") {
		t.Errorf("no call may be refused:\n%s", out)
	}
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
