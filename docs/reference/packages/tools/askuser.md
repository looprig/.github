---
id: reference/packages/tools/askuser
title: askuser package · askuser
description: Reference for the user-question tool.
audience: developer
section: reference
order: 161
publication: released
examples:
  - stage-03-pure-tool
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

# askuser package · askuser

Import path: `github.com/looprig/tools/askuser`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package askuser exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAskUser() *AskUser`

### Methods {#methods}

- `func (a *AskUser) Info(context.Context) (*tool.ToolInfo, error)`
- `func (a *AskUser) AuditSummary(argsJSON string) string`
- `func (a *AskUser) InvokableRun(ctx context.Context, argsJSON string) (*tool.ToolResult, error)`
- `func (a *AskUser) PrepareCall(context.Context, uuid.UUID, string) (tool.Request, tool.PreparedArtifact, error)`

### Types {#types}

```go
type AskUser struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [askuser/askuser.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/askuser/askuser.go)

Adjacent tests at the same commit:

- [askuser/askuser_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/askuser/askuser_test.go)
- [askuser/preparecall_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/askuser/preparecall_test.go)
- [askuser/result_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/askuser/result_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
