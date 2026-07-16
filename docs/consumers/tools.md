# Tools

Tools are capabilities you choose for a Loop. The harness defines the contracts. The optional `github.com/looprig/tools` module provides standard implementations. You can use those implementations, write your own, or combine both.

## Use a standard tool

Each standard tool is its own definition. Select only what the Loop needs:

```go
guard, err := tools.NewPermissionChecker(tools.PermissionPolicy{
    HardDeny: tools.DefaultHardDeny(),
})
if err != nil {
    return err
}

definition, err := loop.Define(
    loop.WithName("reviewer"),
    loop.WithInference(client, model),
    loop.WithSystem("Review the change and report findings. Do not edit it."),
    loop.WithTools(
        tools.ReadFileDefinition(guard),
        tools.GlobDefinition(guard),
        tools.GrepDefinition(guard),
    ),
)
```

This reviewer receives no WriteFile or EditFile tool. Nothing constructs and discards tools behind the scenes.

For a coding Loop, add the individual capabilities it needs:

```go
loop.WithTools(
    tools.ReadFileDefinition(guard),
    tools.WriteFileDefinition(),
    tools.EditFileDefinition(),
    tools.GlobDefinition(guard),
    tools.GrepDefinition(guard),
    tools.Bash(),
    tools.TodoDefinition(),
    tools.AskUserDefinition(),
)
```

File definitions share observations and mutation coordination through the Loop's workspace binding. ReadFile can authorize a safe compare-and-swap edit, and Bash can invalidate those observations after an opaque workspace mutation.

## Permissions are separate from tool selection

Adding a tool makes it available to the Loop. A permission factory decides whether an effect runs automatically, asks a person, or is denied.

```go
permissionFactory := func(
    _ context.Context,
    bindings tool.Bindings,
) (loop.PermissionGate, error) {
    policy := tools.PermissionPolicy{
        WorkspaceRoot: bindings.Workspace.Root,
        HardDeny:      tools.DefaultHardDeny(),
        HardApprove: tools.HardApproveRules{
            Tools: []string{"ReadFile", "Glob", "Grep", "Todo", "AskUser"},
        },
    }
    return tools.NewPermissionChecker(policy)
}
```

Register it with `loop.WithPermissionFactory`. Keep mutating, command, and network tools out of the hard-approve list unless another boundary makes that safe.

Use `github.com/looprig/confinement` when Bash or another command tool should run behind the looprig OS sandbox. The confinement Factory keeps the command runner, read-only argv runner, and permission posture on the same executor.

## Create your own tool

A tool implements two methods:

```go
type Clock struct{}

func (Clock) Info(context.Context) (*tool.ToolInfo, error) {
    return &tool.ToolInfo{
        Name: "Clock",
        Desc: "Return the current UTC time.",
        Schema: json.RawMessage(`{
            "type": "object",
            "additionalProperties": false
        }`),
    }, nil
}

func (Clock) InvokableRun(ctx context.Context, argsJSON string) (*tool.ToolResult, error) {
    if err := ctx.Err(); err != nil {
        return nil, err
    }
    var args struct{}
    if err := json.Unmarshal([]byte(argsJSON), &args); err != nil {
        return tool.TextResult("error: invalid arguments"), nil
    }
    return tool.TextResult(time.Now().UTC().Format(time.RFC3339)), nil
}
```

Wrap the concrete tool in an immutable definition:

```go
clockDefinition := tool.NewDefinition(
    "Clock",
    0,
    func(context.Context, tool.Bindings) ([]tool.InvokableTool, error) {
        return []tool.InvokableTool{Clock{}}, nil
    },
)
```

The definition name and `Info().Name` must match. Build a fresh concrete instance for each binding when the tool has mutable state.

Use `tool.RequiresWorkspace` when the factory reads `bindings.Workspace`. Use `tool.RequiresDelegateController` only for a delegation control tool.

## Effectful tools

Implement `tool.PermissionPrompter` when a tool can mutate state, execute code, reach a network, spend money, or otherwise needs judgment. Its request should contain the minimum information a person needs to decide, without leaking secrets.

Implement `tool.Auditable` for a stable, redacted summary. Never place credentials, file contents, or untrusted response bodies in an audit summary.

Tool execution must honor context cancellation. Validate model-supplied JSON before using it, contain paths before filesystem access, and fail closed when permission or safety state is ambiguous.

## Test a tool

At minimum, test:

- metadata and JSON Schema;
- valid execution;
- malformed and missing arguments;
- context cancellation;
- permission request construction for effects;
- redacted audit output;
- workspace containment for filesystem tools;
- concurrency when instances share state.

The standard tools module is a reference implementation, not a requirement. Your Rig owns its capabilities.
