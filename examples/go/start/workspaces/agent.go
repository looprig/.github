package main

import (
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/tools"
)

// defineAssistant gives the coding assistant the read tools plus EditFile
// and WriteFile, and an access gate that lets it read inside the workspaces
// directory and write there only when approver says yes.
func defineAssistant(client inference.Client, selected model.Model, workspaceBase string, approver gate.Approver) (loop.Definition, error) {
	guard := readGuard{}
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Use Glob, Grep and ReadFile for evidence "+
			"and cite the paths you read. Use EditFile or WriteFile to change files; each write needs approval."),
		loop.WithInference(client, selected),
		loop.WithTools(
			tools.GlobDefinition(guard),
			tools.GrepDefinition(guard),
			tools.ReadFileDefinition(guard),
			tools.EditFileDefinition(),
			tools.WriteFileDefinition(),
		),
		// Each session's workspace is a directory beneath workspaceBase, so
		// that is the one root. Reads there run, a write there asks approver
		// first, and everything else is denied: other paths, commands and
		// network access.
		loop.WithWorkspaceAccess(loop.WorkspaceAccess{
			Roots:    []string{workspaceBase},
			Approver: approver,
		}),
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
