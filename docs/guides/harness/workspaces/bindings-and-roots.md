---
id: guides/harness/workspaces/bindings-and-roots
title: Bindings and roots
description: Bind tools to canonical Session-owned workspace roots.
audience: developer
section: guides
order: 10
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  placement-options: [release-github-com-looprig-harness]
  canonical-roots-and-lease-names: [release-github-com-looprig-harness]
  tool-bindings: [release-github-com-looprig-harness]
  persistence-boundary: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Bindings and roots

The composition root chooses a placement; individual tools receive only the
capabilities their definition requested. A workspace-bound tool gets a
`WorkspaceBinding` with a canonical root, a mutation coordinator, and optional
same-loop file observations. A read-only evidence tool gets a
`ReadWorkspaceBinding` with only a root string.

## Placement options

```go
func WithExclusiveWorkspace(
	store *workspacestore.Store,
	root string,
	leaser storage.Leaser,
) rig.Option

func WithSessionWorkspaces(
	store *workspacestore.Store,
	baseDir string,
) rig.Option

func WithSharedWorkspace(
	store *workspacestore.Store,
	root string,
) rig.Option
```

Exactly one of these options may be present. `WithExclusiveWorkspace` and
`WithSharedWorkspace` name a fixed root. `WithSessionWorkspaces` names a base
directory and derives an injective `baseDir/<sessionID>` destination for every
non-zero session ID. A workspace store or exclusive leaser that is nil is
rejected at definition time.

## Canonical roots and lease names

`Define` turns a root or base directory into an absolute, clean path. If the
path or an existing parent can be resolved, `EvalSymlinks` is applied so
lexical and symlink aliases converge. Exclusive placement derives the storage
lease name as:

```text
workspace-roots/<sha256(canonical-root) in lowercase hex>
```

The mode and canonical region also enter the rig fingerprint as
`<mode>:<region>`. Changing the mode, or the fixed root of an exclusive or
shared placement, is a durable configuration change that restore reports as
workspace drift. A per-session base is compared by mode alone, so a session
restored on a Host with a different `baseDir` (a pod-specific mount, a changed
mount path, or a symlink that resolves differently) is not refused. A root
lease is acquired only after the session journal lease has been acquired.

## Tool bindings

The public binding structs are intentionally narrow:

```go
type WorkspaceBinding struct {
	Root         string // this process's physical path
	LogicalRoot  string // session-derived path, stable across Hosts
	Coordinator  WorkspaceCoordinator
	Observations WorkspaceObservations
}

type ReadWorkspaceBinding struct {
	Root string
}

type WorkspaceCoordinator interface {
	Acquire(context.Context, WorkspaceOperation, string) (WorkspacePermit, error)
	Healthy() error
}

type WorkspacePermit interface { Release() }
```

`WorkspaceOperationPathMutation` requires a non-empty canonical path and
serializes overlapping scopes. `WorkspaceOperationWholeMutation` is an
exclusive whole-tree permit. `WorkspaceOperationCheckpoint` is the distinct
exclusive snapshot/restore permit and requires an empty path. A canceled wait
returns a typed acquisition error and leaves no permit behind. A mutator must
check `Healthy` before committing; after exclusive lease loss it fails closed.

`Root` is where this process performs filesystem operations and can differ
between Hosts. `LogicalRoot` is `/sessions/<sessionID>/workspace`, derived from
the session ID alone, so a path the model saw before a restore still names the
same tree afterwards. Fresh and restored loops both receive it; a binding with
no session identity carries an empty `LogicalRoot`.

`WorkspaceObservations` is optional shared state for one loop's file tools and
Bash. It does not grant authority or escape the root.

```go
type Bindings struct {
	SessionID     uuid.UUID
	LoopID        uuid.UUID
	Workspace     *WorkspaceBinding
	ReadWorkspace *ReadWorkspaceBinding
	Delegate      DelegateController
	Process       *ProcessBinding
	ToolResults   ToolResultReader
	ExtraTools    []Definition
}
```

`tool.RequiresWorkspace` requires `Workspace != nil`, a non-empty root, and a
healthy coordinator. `tool.RequiresWorkspaceRead` requires an absolute clean
read root and exposes no mutation capability. `tool.RequiresToolResultReader`
requires a non-nil `ToolResults` reader scoped to the calling loop. Build calls receive a defensive
attenuation of `Bindings`, so a definition cannot retain unrelated session
authority.

## Persistence boundary

Session journal paths, workspace blob-provider paths, and the snapshot spool
directory must be outside the managed region. Equality and descendants count as
overlap; an ancestor or sibling does not. `Define` fails with
`*rig.PersistenceOverlapError`, because a checkpoint must not mutate the tree
it is walking by appending its own journal record.

The source is [`pkg/rig/workspace.go`](https://github.com/looprig/harness/blob/main/pkg/rig/workspace.go), [`internal/sessionruntime/workspace_placement.go`](https://github.com/looprig/harness/blob/main/internal/sessionruntime/workspace_placement.go), and [`pkg/tool/definition.go`](https://github.com/looprig/harness/blob/main/pkg/tool/definition.go). Canonicalization, alias convergence, overlap, and binding failures are covered by [`pkg/rig/workspace_test.go`](https://github.com/looprig/harness/blob/main/pkg/rig/workspace_test.go) and [`pkg/tool/definition_test.go`](https://github.com/looprig/harness/blob/main/pkg/tool/definition_test.go).

## Source and proof

- [`workspace placement and canonicalization`](https://github.com/looprig/harness/blob/main/pkg/rig/workspace.go)
- [`workspace binding attenuation`](https://github.com/looprig/harness/blob/main/pkg/tool/definition.go)
- [`placement and binding tests`](https://github.com/looprig/harness/blob/main/pkg/rig/workspace_test.go), [`tool definition tests`](https://github.com/looprig/harness/blob/main/pkg/tool/definition_test.go)
