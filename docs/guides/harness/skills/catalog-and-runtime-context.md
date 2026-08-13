---
id: guides/harness/skills/catalog-and-runtime-context
title: Skill Catalog and Runtime Context
description: Advertise allowed skill metadata to a model without inserting every skill body into every request.
audience: developer
section: guides
order: 5
publication: released
proofs:
  start: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  render-the-catalog: [release-github-com-looprig-tools]
  inject-per-turn-context: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-tools, release-github-com-looprig-harness]
---

# Skill catalog and runtime context

The catalog answers “what can I load?” without paying the context cost of every instruction body. `SkillDescriber` returns only the validated name and description.

## Render the catalog

```text
<available_skills>
- weather-briefing: Turn weather observations into a practical recommendation.
- severe-weather: Escalate hazardous conditions using verified observations.
</available_skills>
```

Build this list from the same per-agent allow-set used by the loader. Do not advertise names the Loop cannot load. Keep the body behind the Skill tool.

## Inject per-turn context

Harness accepts a `RuntimeContextProvider` for volatile, per-turn blocks:

```go
type RuntimeContextProvider interface {
	Blocks(context.Context) []content.Block
}

definition, err := loop.Define(
	loop.WithRuntimeContext(skillCatalogProvider),
	loop.WithPolicyRevision("skills-catalog-v1"),
)
```

The provider has no error return, so catalog construction should be bounded and fail soft. Its behavior participates in the Loop policy revision. See [Runtime Context](/docs/guides/harness/loop/runtime-context) for lifecycle and fingerprint rules.

## Source and proof

- [Skill metadata interfaces](https://github.com/looprig/tools/blob/main/skill/skill_loader.go)
- [Harness runtime context contract](https://github.com/looprig/harness/blob/main/pkg/loop/runtime_context.go)
