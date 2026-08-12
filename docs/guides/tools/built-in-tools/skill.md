---
id: guides/tools/built-in-tools/skill
title: Skill
description: Load embedded or workspace skills through an agent-scoped loader.
audience: developer
section: guides
order: 18
publication: released
proofs:
  embedded-and-workspace-sources: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Skill

`Skill` loads one named `SKILL.md` body on demand. The tool is constructed for one `identity.AgentName` and receives a narrow `SkillLoader`. The loader owns the closed allow-set and the body source, so the tool never holds a product catalog or guesses a path.

## Embedded and Workspace Sources

`NewSkill(loader, agent)` is embedded-only. A name is authorized through `SkillLoader.Allowed`, then loaded from the curated embedded filesystem. An unknown name fails securely. Embedded names win even when workspace loading is enabled, so an attacker cannot shadow a curated skill with a same-named file.

`WithWorkspaceRoot(root)` enables a second, untrusted source for non-embedded names. Preparation validates the name, takes a TOCTOU-safe snapshot of `.skills/<name>/SKILL.md`, and emits a combined request: one `context.load` requirement scoped to `workspace:<name>` plus a filesystem read requirement for the canonical snapshot path. `InvokableRun` returns the approved snapshot body and never re-reads the file.

The embedded request uses `context.load` scoped to `embedded:<name>`. These requirements have no durable permission candidate because context loading is a product-owned capability, not an executor grant. `AuditSummary` includes only the skill name, never the body.

```go
// The closed allow-set is checked before a path is constructed.
loader := skill.NewEmbeddedSkillLoader(catalogue, map[identity.AgentName]map[string]struct{}{
	"reviewer": {"check": {}},
})
skills := skill.NewSkill(loader, identity.AgentName("reviewer"))
request, artifact, err := skills.PrepareCall(ctx, executionID, `{"name":"check"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := skills.InvokableRun(prepared, `{}`)
```

The [embedded skill fixture](https://github.com/looprig/tools/blob/main/examples/skills/example_test.go) shows both a permitted load and an unknown-name error. For the general prepare-before-effect contract, see [Tool Definitions, Preparation, and Results](/docs/guides/tools/core-concepts/). For model tool content, see Inference's [tool-use blocks](/docs/guides/inference/content-blocks/tool-use/).

## Source

- [Skill tool](https://github.com/looprig/tools/blob/main/skill/skill.go)
- [Skill loader](https://github.com/looprig/tools/blob/main/skill/skill_loader.go)
- [Workspace skill snapshot](https://github.com/looprig/tools/blob/main/skill/skill_workspace.go)

## Proof

- [Skill behavior tests](https://github.com/looprig/tools/blob/main/skill/skill_test.go)
- [Skill preparation tests](https://github.com/looprig/tools/blob/main/skill/preparecall_test.go)
- [Workspace Skill integration tests](https://github.com/looprig/tools/blob/main/skill/skill_workspace_skilltool_integration_test.go)
- [Runnable embedded skill fixture](https://github.com/looprig/tools/blob/main/examples/skills/example_test.go)
