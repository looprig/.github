---
id: reference/packages/tools/task
title: task package · task
description: Reference for session-scoped task creation, listing, retrieval, and updates.
audience: developer
section: reference
order: 171
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions: release-github-com-looprig-tools
  methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants: release-github-com-looprig-tools
  variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# task package · task

Import path: `github.com/looprig/tools/task`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package task exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewTools() []tool.InvokableTool`

### Methods {#methods}

- `func (t *TaskCreate) Info(context.Context) (*tool.ToolInfo, error)`
- `func (*TaskCreate) AuditSummary(string) string`
- `func (t *TaskCreate) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *TaskCreate) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (*TaskCreate) Sequential() bool`
- `func (t *TaskGet) Info(context.Context) (*tool.ToolInfo, error)`
- `func (*TaskGet) AuditSummary(string) string`
- `func (t *TaskGet) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *TaskGet) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (*TaskGet) Sequential() bool`
- `func (t *TaskList) Info(context.Context) (*tool.ToolInfo, error)`
- `func (t *TaskList) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *TaskList) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (*TaskList) Sequential() bool`
- `func (t *TaskUpdate) Info(context.Context) (*tool.ToolInfo, error)`
- `func (t *TaskUpdate) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *TaskUpdate) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (*TaskUpdate) Sequential() bool`

### Types {#types}

```go
type TaskCreate struct {
	// contains filtered or unexported fields
}
```

```go
type TaskGet struct {
	// contains filtered or unexported fields
}
```

```go
type TaskList struct {
	// contains filtered or unexported fields
}
```

```go
type Status string
```

```go
type Task struct {
	ID          string          `json:"id"`
	Subject     string          `json:"subject"`
	Description string          `json:"description"`
	ActiveForm  string          `json:"activeForm,omitempty"`
	Status      Status          `json:"status"`
	BlockedBy   []string        `json:"blockedBy,omitempty"`
	Blocks      []string        `json:"blocks,omitempty"`
	Metadata    json.RawMessage `json:"metadata,omitempty"`
}
```

```go
type TaskUpdate struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`StatusPending`, `StatusInProgress`, `StatusCompleted`, `StatusCommandDeleted`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [task/create.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/create.go)
- [task/get.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/get.go)
- [task/list.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/list.go)
- [task/model.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/model.go)
- [task/store.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/store.go)
- [task/tool.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/tool.go)
- [task/update.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/update.go)

Adjacent tests at the same commit:

- [task/create_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/create_test.go)
- [task/get_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/get_test.go)
- [task/list_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/list_test.go)
- [task/model_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/model_test.go)
- [task/store_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/store_test.go)
- [task/tool_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/tool_test.go)
- [task/update_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task/update_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
