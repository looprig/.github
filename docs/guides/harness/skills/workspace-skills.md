---
id: guides/harness/skills/workspace-skills
title: Workspace Skills
description: Discover and load project-local skills through a bounded, gated workspace path.
audience: developer
section: guides
order: 4
publication: released
proofs:
  start: [release-github-com-looprig-tools]
  enable-a-workspace-source: [release-github-com-looprig-tools]
  discovery-limits: [release-github-com-looprig-tools]
  source-and-proof: [release-github-com-looprig-tools]
---

# Workspace skills

Workspace skills let a project add local procedures without rebuilding the application. Treat them as untrusted project input, not as an extension of the embedded catalog.

## Enable a workspace source

```go
skillTool := skill.NewSkill(
	loader,
	agentName,
	skill.WithWorkspaceRoot(workspaceRoot),
)

available := skill.DiscoverWorkspaceSkills(workspaceRoot)
```

The expected layout is `.skills/<name>/SKILL.md`. Discovery returns metadata only. Loading a non-embedded name snapshots the file during preparation and requests both `context.load` and the applicable `filesystem.read` capability. Embedded names still resolve from the compiled catalog.

## Discovery limits

```text
candidate directory entries: 256
documents inspected:          64
metadata records returned:    32
```

Malformed documents, symlinks, unsafe names, and unreadable paths are omitted. An oversized candidate directory closes the catalog instead of returning a partial, attacker-controlled view.

## Source and proof

- [Workspace discovery](https://github.com/looprig/tools/blob/main/skill/skill_metadata.go)
- [Workspace snapshot loader](https://github.com/looprig/tools/blob/main/skill/skill_workspace.go)
