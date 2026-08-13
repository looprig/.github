---
id: guides/harness/skills/errors-and-auditing
title: Errors and Auditing
description: Handle unknown, malformed, denied, and missing skills without leaking instruction bodies into audit records.
audience: developer
section: guides
order: 8
publication: released
proofs:
  start: [release-github-com-looprig-tools]
  failure-model: [release-github-com-looprig-tools]
  audit-output: [release-github-com-looprig-tools]
  source-and-proof: [release-github-com-looprig-tools]
---

# Errors and auditing

Skill preparation fails securely before any gate opens when arguments, paths, or workspace snapshots are invalid. Execution failures are returned to the model as tool-result error text.

## Failure model

```text
malformed or empty name  -> preparation error, no execution
unknown embedded name    -> error tool result
missing SKILL.md          -> typed SkillNotFoundError
malformed frontmatter     -> typed MalformedSkillError
unsafe workspace path     -> typed SkillContainmentError
denied requirement        -> Harness gate denial
```

Applications should expose a short recovery hint such as “choose a listed skill,” not fall back to an arbitrary file path.

## Audit output

```go
summary := skillTool.AuditSummary(`{"name":"weather-briefing"}`)
// summary == "Skill weather-briefing"
```

Audit summaries include the requested name only. They never include the Markdown body, which may contain proprietary procedures or untrusted workspace text. Tool start and completion are also visible through the [Harness event stream](/docs/guides/harness/events/tool-events).

## Source and proof

- [Typed skill errors](https://github.com/looprig/tools/blob/main/skill/skill_errors.go)
- [Redacted audit summary](https://github.com/looprig/tools/blob/main/skill/skill.go)
