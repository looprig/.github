package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/sandbox"
)

// newSandbox builds the operating-system confinement for the assistant's
// commands and the access gate that agrees with it. One Profile states the
// authority; the gate decides each call from it before the call runs, and
// the executor enforces it on the process while it runs.
func newSandbox(workspaceBase, scratch string, stderr io.Writer) (*sandbox.ExecutorSet, *sandbox.Executor, *gate.Evaluator, error) {
	profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot:  workspaceBase,
		WorkspaceRead:  sandbox.Allow,
		WorkspaceWrite: sandbox.Deny,
		HostRead:       sandbox.Deny,
		HostWrite:      sandbox.Deny,
		Network:        sandbox.Deny,
		// Allow lets the headless gate approve commands without asking.
		// Gated would need an interactive approver or saved rules.
		Command:   sandbox.Allow,
		Home:      sandbox.IsolatedHome,
		Isolation: sandbox.Sandboxed,
	})
	if err != nil {
		return nil, nil, nil, err
	}
	// The scratch root holds per-process temporary state. It must exist.
	if err := os.MkdirAll(scratch, 0o700); err != nil {
		return nil, nil, nil, err
	}
	executors, err := sandbox.NewExecutorSet(profile,
		sandbox.WithScratchRoot(scratch),
		sandbox.WithMaxExecutors(1),
	)
	if err != nil {
		return nil, nil, nil, err
	}
	// One executor per Loop identity.
	executor, err := executors.For("coding-assistant")
	if err != nil {
		_ = executors.Close()
		return nil, nil, nil, err
	}

	// Requested policy and achieved enforcement are different facts: check
	// what this host actually enforces before running anything.
	guarantees := executor.Guarantees()
	if executor.Level() == sandbox.LevelNone || !guarantees.ProcessBoundary || !guarantees.WriteBoundary {
		_ = executors.Close()
		return nil, nil, nil, fmt.Errorf("sandbox unavailable on this host: level=%v report=%+v", executor.Level(), executor.Report())
	}
	fmt.Fprintf(stderr, "sandbox: level=%v\n", executor.Level())

	// The gate routes each requirement kind a tool declares to the profile.
	// A requirement of any other kind is denied. The executor is the grant
	// issuer: an approved command carries a grant only it accepts.
	evaluator, err := gate.NewHeadlessEvaluator([]gate.AccessBinding{
		{Kind: "filesystem.read", Source: profile},
		{Kind: "filesystem.write", Source: profile},
		{Kind: "command.execute", Source: profile},
		{Kind: "network", Source: profile},
	}, nil, executor)
	if err != nil {
		_ = executors.Close()
		return nil, nil, nil, err
	}
	return executors, executor, evaluator, nil
}
