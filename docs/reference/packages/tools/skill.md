---
id: reference/packages/tools/skill
title: skill package · skill
description: Reference for embedded and workspace skill discovery and loading.
audience: developer
section: reference
order: 170
publication: released
examples:
  - stage-04-prepared-tool
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

# skill package · skill

Import path: `github.com/looprig/tools/skill`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package skill implements the Skill tool: an on-demand reader of curated embedded (and optionally untrusted workspace) SKILL.md bodies, scoped to the one agent the tool is bound to.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithWorkspaceRoot(root string) SkillOption`
- `func NewSkill(loader SkillLoader, agent identity.AgentName, opts ...SkillOption) *Skill`
- `func EmbeddedSkillIdentity(name string) string`
- `func WorkspaceSkillIdentity(name string) string`
- `func NewEmbeddedSkillLoader(fsys fs.FS, allow map[identity.AgentName]map[string]struct{}) *embeddedSkillLoader`
- `func DiscoverWorkspaceSkills(root string) []SkillMeta`

### Methods {#methods}

- `func (s *Skill) Info(context.Context) (*tool.ToolInfo, error)`
- `func (s *Skill) AuditSummary(argsJSON string) string`
- `func (s *Skill) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (s *Skill) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (e *UnknownSkillError) Error() string`
- `func (e *MalformedSkillError) Error() string`
- `func (e *SkillNotFoundError) Error() string`
- `func (e *SkillNotFoundError) Unwrap() error`
- `func (e *SkillContainmentError) Error() string`

### Types {#types}

```go
type Skill struct {
	// contains filtered or unexported fields
}
```

```go
type SkillOption func(*Skill)
```

```go
type UnknownSkillError struct {
	Agent identity.AgentName
	Name  string
}
```

```go
type MalformedSkillError struct {
	Name   string
	Reason string
}
```

```go
type SkillNotFoundError struct {
	Name string
	Err  error
}
```

```go
type SkillContainmentError struct {
	Name   string
	Reason string
}
```

```go
type SkillMeta struct {
	Name        string
	Description string
}
```

```go
type SkillLoader interface {
	Load(ctx context.Context, agent identity.AgentName, name string) (string, error)
	Allowed(agent identity.AgentName, name string) bool
}
```

```go
type SkillDescriber interface {
	Describe(ctx context.Context, agent identity.AgentName, name string) (SkillMeta, error)
}
```

### Constants {#constants}

`CapabilityContextLoad`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `MalformedSkillError`, `SkillContainmentError`, `SkillNotFoundError`, `UnknownSkillError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [skill/skill.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill.go)
- [skill/skill_errors.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_errors.go)
- [skill/skill_frontmatter.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_frontmatter.go)
- [skill/skill_loader.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_loader.go)
- [skill/skill_metadata.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_metadata.go)
- [skill/skill_workspace.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_workspace.go)

Adjacent tests at the same commit:

- [skill/preparecall_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/preparecall_test.go)
- [skill/result_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/result_test.go)
- [skill/skill_errors_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_errors_test.go)
- [skill/skill_frontmatter_fuzz_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_frontmatter_fuzz_test.go)
- [skill/skill_frontmatter_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_frontmatter_test.go)
- [skill/skill_loader_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_loader_test.go)
- [skill/skill_metadata_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_metadata_test.go)
- [skill/skill_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_test.go)
- [skill/skill_workspace_integration_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_workspace_integration_test.go)
- [skill/skill_workspace_skilltool_integration_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_workspace_skilltool_integration_test.go)
- [skill/skill_workspace_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/skill/skill_workspace_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
