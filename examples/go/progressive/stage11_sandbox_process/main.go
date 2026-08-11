package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/sandbox"
)

func run(output io.Writer) error {
	workspace, err := os.MkdirTemp("", "looprig-sandbox-workspace-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(workspace)
	scratch, err := os.MkdirTemp("", "looprig-sandbox-scratch-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(scratch)

	profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot: workspace, WorkspaceRead: sandbox.Allow, WorkspaceWrite: sandbox.Deny,
		HostRead: sandbox.Allow, HostWrite: sandbox.Deny, Network: sandbox.Deny,
		Command: sandbox.Allow, Home: sandbox.IsolatedHome, Isolation: sandbox.Sandboxed,
	})
	if err != nil {
		return err
	}
	set, err := sandbox.NewExecutorSet(profile, sandbox.WithScratchRoot(scratch), sandbox.WithMaxExecutors(1))
	if err != nil {
		return err
	}
	defer set.Close()
	executor, err := set.For("worker")
	if err != nil {
		return err
	}
	result, code, err := executor.RunCommand(context.Background(), workspace, "echo confined")
	if err != nil {
		return err
	}
	assertoutput.MustEqual("exit code", code, 0)
	assertoutput.MustContain("process output", strings.ToLower(string(result)), "confined")
	assertoutput.MustEqual("OS confinement available", executor.Level() != sandbox.LevelNone, true)
	_, err = fmt.Fprintln(output, "sandbox: confined process exited 0")
	return err
}

func main() {
	sandbox.Init()
	assertoutput.MustSucceed(run(os.Stdout))
}
