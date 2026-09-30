package main

import (
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/tools"
)

// defineAssistant gives the coding assistant three read-only tools and an
// access gate that lets them read inside the workspaces directory and
// nowhere else.
func defineAssistant(client inference.Client, selected model.Model, workspaceBase string) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep and ReadFile for evidence "+
			"and cite the paths you read. Never claim a file was read unless a tool returned it."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
		),
		// Each session's workspace is a directory beneath workspaceBase, so
		// that is the one root reads are allowed under.
		loop.WithReadOnlyAccess(workspaceBase),
	)
}

// defineRuntime gives every session its own workspace directory,
// <workspaceBase>/<session-id>, instead of sharing the repository.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, workspaceBase string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		// Session-owned placement: tools bind to the session's own directory.
		rig.WithSessionWorkspaces(workspaces, workspaceBase),
		// Snapshot the workspace each time a turn ends. SnapshotManual
		// snapshots only when the application calls CheckpointWorkspace.
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotOnTurnDone}),
	)
}
