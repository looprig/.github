package main

import (
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/sandbox"
	"github.com/looprig/tools"
	"github.com/looprig/tools/bash"
)

// defineAssistant adds a Bash tool whose commands run in the sandbox, and
// replaces the workspace-access gate with one derived from the sandbox
// profile. That gate is headless and the profile denies workspace writes, so
// EditFile and WriteFile are left out.
func defineAssistant(client inference.Client, selected model.Model, executor *sandbox.Executor, access *gate.Evaluator) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep, ReadFile and Bash for evidence "+
			"and cite what you inspected. Commands run read-only, without network access."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
			// Bash runs each approved command through the sandbox executor
			// instead of starting sh itself.
			tools.Bash(bash.WithRunner(executor)),
		),
		loop.WithAccessGate(access),
		// A gate you build yourself is opaque to Harness, so name its policy.
		// Change the revision whenever the gate's policy changes.
		loop.WithPolicyRevision("coding-assistant/sandbox-v1"),
	)
}

// defineRuntime gives every session its own workspace directory,
// <workspaceBase>/<session-id>, instead of sharing the repository.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, workspaceBase string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		rig.WithSessionWorkspaces(workspaces, workspaceBase),
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotOnTurnDone}),
	)
}
