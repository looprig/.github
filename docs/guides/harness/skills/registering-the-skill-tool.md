---
id: guides/harness/skills/registering-the-skill-tool
title: Registering the Skill Tool
description: Bind one Skill tool per Loop identity and register it through a Harness tool Definition.
audience: developer
section: guides
order: 6
publication: released
proofs:
  start: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  create-the-definition: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-tools, release-github-com-looprig-harness]
---

# Registering the Skill tool

The Skill instance is bound to one immutable `identity.AgentName`. Wrap it in a Harness `tool.Definition` so each live Loop receives the correctly bound tool.

## Create the definition

```go
skillDefinition := tool.NewDefinition(
	"Skill",
	0,
	func(ctx context.Context, bindings tool.Bindings) ([]tool.InvokableTool, error) {
		return []tool.InvokableTool{
			skill.NewSkill(loader, agentName),
		}, nil
	},
)

assistant, err := loop.Define(
	loop.WithName(agentName),
	loop.WithInference(client, selectedModel),
	loop.WithTools(skillDefinition),
	loop.WithAccessGate(accessGate),
	loop.WithPolicyRevision("assistant-skills-v1"),
)
```

The model-facing tool is named `Skill` and accepts one required string property, `name`. Without `WithAccessGate`, Harness denies every tool call. The access policy must therefore make an explicit decision for the prepared `context.load` requirement.

## Source and proof

- [Skill tool metadata and constructor](https://github.com/looprig/tools/blob/main/skill/skill.go)
- [Harness tool Definition](https://github.com/looprig/harness/blob/main/pkg/tool/definition.go)
- [Loop tool and access options](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
