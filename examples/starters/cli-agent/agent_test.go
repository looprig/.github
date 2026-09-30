package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/session"
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// harnessUnderTest wires the starter exactly as main does, over a scripted
// model, a temporary repository and a temporary data directory.
type harnessUnderTest struct {
	t       *testing.T
	repo    string
	dataDir string
}

func newHarness(t *testing.T) *harnessUnderTest {
	t.Helper()
	repo := t.TempDir()
	if err := os.WriteFile(filepath.Join(repo, "README.md"), []byte("hello from the repo\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	return &harnessUnderTest{t: t, repo: repo, dataDir: t.TempDir()}
}

// open composes stores, rig and session. resumeID "" starts a new session.
func (h *harnessUnderTest) open(ctx context.Context, client inference.Client, readOnly bool, resumeID string) session.SessionController {
	h.t.Helper()
	st, err := openStores(h.dataDir)
	if err != nil {
		h.t.Fatal(err)
	}
	r, err := defineRig(agentConfig{Root: h.repo, ReadOnly: readOnly, Client: client, Model: inferencetest.Model(), Stores: st})
	if err != nil {
		h.t.Fatal(err)
	}
	live, err := openSession(ctx, r, resumeID)
	if err != nil {
		h.t.Fatal(err)
	}
	h.t.Cleanup(func() {
		_ = live.Shutdown(context.Background())
		_ = st.Close()
	})
	return live
}

func testContext(t *testing.T) context.Context {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	t.Cleanup(cancel)
	return ctx
}

// toolResultContains asserts that the request answers a tool call whose
// result contains want: the tool ran and its output reached the model.
func toolResultContains(want string) func(inference.Request) error {
	return func(req inference.Request) error {
		got, ok := lastToolResult(req)
		if !ok {
			return errors.New("the last message is not a tool result")
		}
		if !strings.Contains(got, want) {
			return fmt.Errorf("tool result %q does not contain %q", got, want)
		}
		return nil
	}
}

func denyAll(context.Context, gate.Prompt) gate.ApprovalAction { return gate.ApprovalDeny }

func TestScriptedTurnReadsAFile(t *testing.T) {
	for _, readOnly := range []bool{false, true} {
		t.Run(fmt.Sprintf("readOnly=%v", readOnly), func(t *testing.T) {
			ctx := testContext(t)
			h := newHarness(t)
			client := inferencetest.New(
				inferencetest.Text("Reading it. ").ToolCall("ReadFile", `{"path":"README.md"}`),
				inferencetest.Text("The README says hello.").Expect(toolResultContains("hello from the repo")),
			)
			live := h.open(ctx, client, readOnly, "")
			var out bytes.Buffer
			if err := runTurn(ctx, live, "What does the README say?", ui{out: &out, approve: denyAll}); err != nil {
				t.Fatal(err)
			}
			if err := client.Err(); err != nil {
				t.Fatal(err)
			}
			for _, want := range []string{"Reading it.", "[tool] ReadFile ok", "The README says hello."} {
				if !strings.Contains(out.String(), want) {
					t.Errorf("output %q lacks %q", out.String(), want)
				}
			}
		})
	}
}

func TestReadOutsideTheWorkspaceIsDenied(t *testing.T) {
	ctx := testContext(t)
	h := newHarness(t)
	outside := filepath.Join(t.TempDir(), "secret.txt")
	if err := os.WriteFile(outside, []byte("top secret"), 0o600); err != nil {
		t.Fatal(err)
	}
	client := inferencetest.New(
		inferencetest.ToolCall("ReadFile", fmt.Sprintf(`{"path":%q}`, outside)),
		inferencetest.Text("Denied.").Expect(func(req inference.Request) error {
			got, _ := lastToolResult(req)
			if strings.Contains(got, "top secret") {
				return errors.New("a read outside the workspace reached the model")
			}
			return nil
		}),
	)
	live := h.open(ctx, client, false, "")
	if err := runTurn(ctx, live, "read it", ui{out: &bytes.Buffer{}, approve: denyAll}); err != nil {
		t.Fatal(err)
	}
	if err := client.Err(); err != nil {
		t.Fatal(err)
	}
}

func TestWritesNeedApproval(t *testing.T) {
	ctx := testContext(t)
	h := newHarness(t)
	target := filepath.Join(h.repo, "notes.txt")
	write := inferencetest.ToolCall("WriteFile", `{"path":"notes.txt","content":"written by the agent\n"}`)
	client := inferencetest.New(
		write, inferencetest.Text("Denied."),
		write, inferencetest.Text("Written."),
	)
	live := h.open(ctx, client, false, "")

	var prompts int
	answer := gate.ApprovalDeny
	approve := func(_ context.Context, p gate.Prompt) gate.ApprovalAction {
		prompts++
		return answer
	}
	if err := runTurn(ctx, live, "write notes", ui{out: &bytes.Buffer{}, approve: approve}); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(target); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("a denied write created the file (stat err %v)", err)
	}
	answer = gate.ApprovalApprove
	if err := runTurn(ctx, live, "write notes", ui{out: &bytes.Buffer{}, approve: approve}); err != nil {
		t.Fatal(err)
	}
	data, err := os.ReadFile(target)
	if err != nil || string(data) != "written by the agent\n" {
		t.Fatalf("approved write: %q, %v", data, err)
	}
	if prompts != 2 {
		t.Fatalf("prompted %d times, want 2", prompts)
	}
}

func TestResumeContinuesTheConversation(t *testing.T) {
	ctx := testContext(t)
	h := newHarness(t)
	first := h.open(ctx, inferencetest.New(inferencetest.Text("Noted.")), false, "")
	id := first.SessionID().String()
	if err := runTurn(ctx, first, "remember the word pineapple", ui{out: &bytes.Buffer{}, approve: denyAll}); err != nil {
		t.Fatal(err)
	}
	if err := first.Shutdown(ctx); err != nil {
		t.Fatal(err)
	}

	client := inferencetest.New(inferencetest.Text("You said pineapple.").Expect(func(req inference.Request) error {
		for _, msg := range req.Messages {
			user, ok := msg.(*content.UserMessage)
			if !ok {
				continue
			}
			for _, block := range user.Blocks {
				if text, ok := block.(*content.TextBlock); ok && strings.Contains(text.Text, "pineapple") {
					return nil
				}
			}
		}
		return errors.New("the restored session lost the first turn")
	}))
	resumed := h.open(ctx, client, false, id)
	if got := resumed.SessionID().String(); got != id {
		t.Fatalf("resumed session %s, want %s", got, id)
	}
	if err := runTurn(ctx, resumed, "what word?", ui{out: &bytes.Buffer{}, approve: denyAll}); err != nil {
		t.Fatal(err)
	}
	if err := client.Err(); err != nil {
		t.Fatal(err)
	}
}

func TestLegacyDataDirIsRefused(t *testing.T) {
	dir := t.TempDir()
	// A pre-v0.6.0 fsstore KV leaf has no "@kv" suffix.
	if err := os.MkdirAll(filepath.Join(dir, "kv"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "kv", "old"), []byte("x"), 0o600); err != nil {
		t.Fatal(err)
	}
	_, err := openStores(dir)
	var legacy *legacyDataDirError
	if !errors.As(err, &legacy) || !strings.Contains(err.Error(), "move or delete") {
		t.Fatalf("openStores = %v, want a legacyDataDirError", err)
	}
}

// The rig must refuse to define with a bad workspace rather than start a
// session whose tools all fail.
func TestDefineRigRefusesAMissingRoot(t *testing.T) {
	st, err := openStores(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	defer st.Close()
	_, err = defineRig(agentConfig{Root: filepath.Join(t.TempDir(), "missing"), Client: inferencetest.New(), Model: inferencetest.Model(), Stores: st})
	if err == nil {
		t.Fatal("defineRig accepted a missing workspace root")
	}
}
