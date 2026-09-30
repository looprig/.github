package main

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference/inferencetest"
	"github.com/looprig/storage/memstore"
	"github.com/looprig/tools"
)

func TestReadToolsAnswerFromTheRepository(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var stdout, stderr bytes.Buffer
	if err := run(ctx, &stdout, &stderr, fixtureRepo(t), "What is this repository?"); err != nil {
		t.Fatal(err)
	}
	out := stdout.String()
	for _, want := range []string{"[Glob] Glob *.go", "[ReadFile] ReadFile go.mod", "according to its go.mod"} {
		if !strings.Contains(out, want) {
			t.Errorf("output lacks %q:\n%s", want, out)
		}
	}
	if strings.Contains(out, "refused") {
		t.Errorf("no read inside the repository may be refused:\n%s", out)
	}
}

// Without an access gate, every tool call is refused. This is why the
// assistant's Loop names one with loop.WithReadOnlyAccess.
func TestWithoutAnAccessGateEveryToolCallIsRefused(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	repo := fixtureRepo(t)

	ungated, err := loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithInference(scriptedClient(), inferencetest.Model()),
		loop.WithTools(tools.GlobDefinition(readGuard{}), tools.ReadFileDefinition(readGuard{})),
	)
	if err != nil {
		t.Fatal(err)
	}
	memory := memstore.New()
	sessions, err := sessionstore.Open(memory)
	if err != nil {
		t.Fatal(err)
	}
	workspaces, err := workspacestore.Open(memory.Blobs)
	if err != nil {
		t.Fatal(err)
	}
	runtime, err := defineRuntime(ungated, sessions, workspaces, repo)
	if err != nil {
		t.Fatal(err)
	}
	live, err := runtime.NewSession(ctx)
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = live.Shutdown(context.Background()) }()

	var out bytes.Buffer
	if err := runTurn(ctx, live, "What is this repository?", &out); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(out.String(), "[Glob] refused: error: permission denied [unavailable]") {
		t.Fatalf("an ungated tool call must be refused:\n%s", out.String())
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
