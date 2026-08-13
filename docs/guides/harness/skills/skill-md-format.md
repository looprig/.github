---
id: guides/harness/skills/skill-md-format
title: SKILL.md Format
description: Write the validated frontmatter and instruction body used by the Skill loader.
audience: developer
section: guides
order: 2
publication: released
proofs:
  start: [release-github-com-looprig-tools]
  document-shape: [release-github-com-looprig-tools]
  writing-guidelines: [release-github-com-looprig-tools]
  source-and-proof: [release-github-com-looprig-tools]
---

# SKILL.md format

Each skill is a directory containing one `SKILL.md`. Its frontmatter supplies catalog metadata; the remaining Markdown is the body returned by the Skill tool.

## Document shape

```yaml
---
name: weather-briefing
description: Turn weather observations into a practical recommendation.
---
Use the weather lookup tool before answering.

1. State the city, temperature, and conditions.
2. Give one practical recommendation.
3. Do not invent measurements.
```

The directory name and frontmatter `name` must match. Names are validated before a path is constructed. `description` is the short catalog text the model sees before it loads the body.

## Writing guidelines

- State when to use the skill and when not to use it.
- Name tools by their model-facing names.
- Describe required evidence and output shape.
- Keep credentials, tokens, and environment-specific secrets out of the file.
- Prefer steps and small examples over a second system prompt.

```text
skills/
└── weather-briefing/
    └── SKILL.md
```

## Source and proof

- [Skill parser and metadata types](https://github.com/looprig/tools/blob/main/skill/skill_frontmatter.go)
- [Parser tests](https://github.com/looprig/tools/blob/main/skill/skill_frontmatter_test.go)
