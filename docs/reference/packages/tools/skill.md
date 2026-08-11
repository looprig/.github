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
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# skill package · skill

Import path: `github.com/looprig/tools/skill`. Skill loads explicitly allowed instruction bundles from embedded or workspace files.

## Package role {#package-role}

`SkillLoader` and `SkillDescriber` separate discovery from model-facing invocation. `NewSkill` binds a loader and agent identity; workspace skills require an explicit root and containment check.

## Exported surface {#exported-surface}

The package exports `Skill`, `SkillLoader`, `SkillDescriber`, `SkillMeta`, `SkillOption`, `MalformedSkillError`, `SkillContainmentError`, `SkillNotFoundError`, and `UnknownSkillError`. Constructors include `NewSkill`, `NewEmbeddedSkillLoader`, `DiscoverWorkspaceSkills`, `WithWorkspaceRoot`, `EmbeddedSkillIdentity`, and `WorkspaceSkillIdentity`.

### Functions and methods {#functions-and-methods}

Discovery returns metadata; loading returns bounded content only for an allowed name and agent. Identity helpers produce stable source labels.

### Types {#types}

Errors distinguish malformed front matter, missing entries, unknown names, and a workspace containment failure. `SkillMeta` is metadata, not permission.

### Constants and variables {#constants-and-variables}

`CapabilityContextLoad` identifies the capability. No workspace root is global.

## Ownership and errors {#ownership-and-errors}

The caller owns the filesystem and `fs.FS`; the tool owns one loaded result. A skill cannot add tools, grants, or host paths by itself.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned skill package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/skill/). Component skill examples cover embedded and workspace loading.
