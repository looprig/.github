---
id: guides/harness/skills/embedded-skills
title: Embedded Skills
description: Compile curated skills into an application and authorize a closed set for each Loop identity.
audience: developer
section: guides
order: 3
publication: released
proofs:
  start: [release-github-com-looprig-tools]
  embed-and-authorize: [release-github-com-looprig-tools]
  source-and-proof: [release-github-com-looprig-tools]
---

# Embedded skills

Embedded skills are application-owned instructions compiled into the binary. They are suitable for procedures that must ship with a known version of the application.

## Embed and authorize

```go
//go:embed skills/*/SKILL.md
var skillFiles embed.FS

agent := identity.AgentName("weather-assistant")
loader := skill.NewEmbeddedSkillLoader(skillFiles, map[identity.AgentName]map[string]struct{}{
	agent: {"weather-briefing": {}}, // This Loop can load only this skill.
})

skillTool := skill.NewSkill(loader, agent)
```

The loader checks `(agent, name)` against the closed allow-set before it constructs `skills/<name>/SKILL.md`. A different Loop using the same embedded filesystem can receive a different set. Unknown agents and unknown names fail closed.

Use [Registering the Skill Tool](/docs/guides/harness/skills/registering-the-skill-tool) to make `skillTool` available through Harness.

## Source and proof

- [Embedded loader implementation](https://github.com/looprig/tools/blob/main/skill/skill_loader.go)
- [Runnable embedded skill example](https://github.com/looprig/tools/blob/main/examples/skills/example_test.go)
