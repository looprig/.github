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

Import path: `github.com/looprig/tools/skill`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`SkillLoader` and `SkillDescriber` separate discovery from model-facing invocation. `NewSkill` binds a loader and agent identity; workspace skills require an explicit root and containment check.

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
- `func (l *embeddedSkillLoader) Load(ctx context.Context, agent identity.AgentName, name string) (string, error)`
- `func (l *embeddedSkillLoader) Describe(ctx context.Context, agent identity.AgentName, name string) (SkillMeta, error)`
- `func (l *embeddedSkillLoader) Allowed(agent identity.AgentName, name string) bool`

### Types {#types}

`Skill`, `SkillOption`, `UnknownSkillError`, `MalformedSkillError`, `SkillNotFoundError`, `SkillContainmentError`, `SkillMeta`, `SkillLoader`, `SkillDescriber`

### Constants {#constants}

`CapabilityContextLoad`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownSkillError`, `MalformedSkillError`, `SkillNotFoundError`, `SkillContainmentError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [skill/skill.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill.go)
- [skill/skill_errors.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_errors.go)
- [skill/skill_frontmatter.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_frontmatter.go)
- [skill/skill_loader.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_loader.go)
- [skill/skill_metadata.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_metadata.go)
- [skill/skill_workspace.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_workspace.go)

Adjacent tests at the same commit:

- [skill/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/preparecall_test.go)
- [skill/result_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/result_test.go)
- [skill/skill_errors_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_errors_test.go)
- [skill/skill_frontmatter_fuzz_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_frontmatter_fuzz_test.go)
- [skill/skill_frontmatter_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_frontmatter_test.go)
- [skill/skill_loader_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_loader_test.go)
- [skill/skill_metadata_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_metadata_test.go)
- [skill/skill_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_test.go)
- [skill/skill_workspace_integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_workspace_integration_test.go)
- [skill/skill_workspace_skilltool_integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_workspace_skilltool_integration_test.go)
- [skill/skill_workspace_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/skill/skill_workspace_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
