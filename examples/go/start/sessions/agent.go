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
// access gate that lets them read inside repo and nowhere else.
func defineAssistant(client inference.Client, selected model.Model, repo string) (loop.Definition, error) {
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
		// Every tool call passes an access gate before it runs, and a Loop
		// with no gate denies every call. This one allows file reads inside
		// repo and denies everything else: other reads, writes, commands and
		// network access.
		loop.WithReadOnlyAccess(repo),
	)
}

// defineRuntime assembles the Rig. The read tools need a workspace to bind
// to, so the Rig places one: the repository itself, shared with you.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store, workspaces *workspacestore.Store, repo string) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
		// A shared workspace is a fixed directory that people and other
		// tools may change while the session runs.
		rig.WithSharedWorkspace(workspaces, repo),
		// A workspace needs a snapshot policy. Manual means snapshots are
		// taken only when the application asks for one.
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotManual}),
	)
}
