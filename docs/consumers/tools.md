# Tools

Tools are capabilities you choose for a Loop. The harness defines the contracts. The optional `github.com/looprig/tools` module provides standard implementations. You can use those implementations, write your own, or combine both.

## Use a standard tool

Each standard tool is its own definition. Select only what the Loop needs:

The read tools take a `loop.ReadGuard`: the narrow read-side policy they enforce
themselves. It filters denied paths and caps per-file reads, and is deliberately
stdlib-typed so a consumer can derive it from the same sandbox profile that drives
OS enforcement.

```go
// loop.ReadGuard: DeniedRead(absPath) bool and MaxReadBytes() int64.
type readGuard struct{}

func (readGuard) DeniedRead(absPath string) bool { return false }
func (readGuard) MaxReadBytes() int64            { return 10 << 20 }

guard := readGuard{}

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
    tools.Bash(bash.WithRunner(executor)),
    tools.TodoDefinition(),
    tools.AskUserDefinition(),
)
```

File definitions share observations and mutation coordination through the Loop's workspace binding. ReadFile can authorize a safe compare-and-swap edit, and Bash can invalidate those observations after an opaque workspace mutation.

## Permissions are separate from tool selection

Adding a tool makes it available to the Loop. An access gate then decides, per
prepared tool call, whether each required capability runs automatically, asks a
person, or is denied. Install one with `loop.WithAccessGate`; without it every
tool call fails closed.

The gate evaluates the three access states — `Deny`, `Gated`, `Allow` — for the
capabilities a call needs (`command.execute`, `filesystem.read`,
`filesystem.write`, `network`). Each capability is routed to an `AccessSource`; a
`*sandbox.Profile` satisfies that structural seam directly, so the same profile
that drives OS enforcement also decides access:

```go
evaluator, err := gate.NewInteractiveEvaluator(
    []gate.AccessBinding{
        {Kind: "command.execute", Source: profile},
        {Kind: "filesystem.read", Source: profile},
        {Kind: "filesystem.write", Source: profile},
        {Kind: "network", Source: profile},
    },
    ruleStore,           // gate.RuleMatcher: durable workspace rules
    loop.GateApprover(), // gate.Approver: resolves one combined prompt in the live loop
    ruleStore,           // gate.RuleWriter: persists "always for this workspace" rules
    executor,            // gate.GrantIssuer: *sandbox.Executor mints post-approval grants
)
if err != nil {
    return err
}

definition, err := loop.Define(
    // ...
    loop.WithAccessGate(evaluator),
    loop.WithPolicyRevision("workspace-policy-v1"),
)
```

A `Gated` capability uses a matching saved rule or produces one combined
approval offering exactly three actions: `Approve`, `Approve always for this
workspace`, and `Deny`. Use `gate.NewHeadlessEvaluator(bindings, ruleStore,
executor)` for a non-interactive run: it never prompts and returns a typed
approval-required denial for any unmet `Gated` capability. The `ruleStore` is the
single hardened workspace permission file from `tools`
(`permission.NewWorkspaceStore`), which is both the rule matcher and writer.

Use `github.com/looprig/sandbox` when Bash or another command tool should run
behind the looprig OS sandbox. Build a `sandbox.Profile`, create an
`ExecutorSet`, and pass the per-Loop executor to Bash with
`tools.Bash(bash.WithRunner(executor))`. Because that same `*sandbox.Executor` is
the gate's grant issuer, approvals and OS enforcement stay aligned. See
[Build larger systems](larger-systems.md#confine-commands-with-the-os).

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

Implement `tool.CallPreparer` when a tool can mutate state, execute code, reach a network, spend money, or otherwise needs judgment. Its `PrepareCall` decodes and validates the arguments once, normalizes and canonicalizes the resources involved, and emits one typed `tool.Request` listing the capability requirements the call needs. The tool classifies capabilities; it never decides `Deny`, `Gated`, or `Allow` — that belongs to the access gate. Each requirement's display text should contain the minimum information a person needs to decide, without leaking secrets.

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
