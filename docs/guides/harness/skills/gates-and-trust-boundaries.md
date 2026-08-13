---
id: guides/harness/skills/gates-and-trust-boundaries
title: Gates and Trust Boundaries
description: Apply different access decisions to curated embedded skills and untrusted workspace skills.
audience: developer
section: guides
order: 7
publication: released
proofs:
  start: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  prepared-requirements: [release-github-com-looprig-tools]
  recommended-policy: [release-github-com-looprig-tools]
  source-and-proof: [release-github-com-looprig-tools, release-github-com-looprig-harness]
---

# Gates and trust boundaries

Skill loading is a context capability. It is not command execution and it should not be silently mapped to a sandbox profile.

## Prepared requirements

```go
const CapabilityContextLoad = "context.load"

// Embedded load
tool.Requirement{
	Kind:  skill.CapabilityContextLoad,
	Scope: skill.EmbeddedSkillIdentity("weather-briefing"),
	Match: skill.EmbeddedSkillIdentity("weather-briefing"),
}

// Workspace loads also add a filesystem.read requirement for the snapshot path.
```

The Skill tool validates arguments once in `PrepareCall`. A workspace body is read into `tool.SkillArtifact` before approval, then execution returns that snapshot instead of reopening the file.

## Recommended policy

| Request | Default decision |
| --- | --- |
| Known embedded skill allowed for this Loop | Allow under product policy |
| Workspace skill | Ask or deny, plus enforce the read boundary |
| Unknown or malformed name | Deny |
| Skill not listed for this Loop | Deny |

Use [Gates](/docs/guides/harness/gates) for interactive approvals and durable gate responses. The all-allow gates in the example applications are clearly marked demo policy and must not be copied into a production trust boundary.

## Source and proof

- [Skill preparation and capability requests](https://github.com/looprig/tools/blob/main/skill/skill.go)
- [Harness access gate contract](https://github.com/looprig/harness/blob/main/pkg/loop/deps.go)
