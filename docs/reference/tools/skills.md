---
id: reference/tools/skills
title: Skill tool
description: Load embedded or explicitly enabled workspace skills within one agent's identity boundary.
audience: developer
section: reference
order: 266
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  constructor-and-scope: release-github-com-looprig-tools
  preparation: release-github-com-looprig-tools
  failure-and-limits: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# Skill tool

`skill.NewSkill` binds a loader and an `identity.AgentName`. By default it loads only curated embedded skills. `skill.WithWorkspaceRoot` is an explicit composition choice that adds a workspace source for names not found in the embedded set.

## Constructor and scope {#constructor-and-scope}

The loader receives the bound agent identity and requested name. The tool holds no global catalog or allow-map, so one agent cannot ask its Skill tool to load another agent's skill. Embedded names win when both sources contain the name.

## Preparation {#preparation}

Preparation validates the name and, for a workspace skill, takes a TOCTOU-safe snapshot and emits the context and filesystem requirements. Invocation consumes the approved artifact instead of rereading the path. The gate still decides whether an untrusted workspace load may proceed.

## Failure and limits {#failure-and-limits}

Unknown, empty, traversal, snapshot, gate, and loader failures fail closed. A workspace root option does not make every file a skill, and it does not grant filesystem access to other tools. Keep the embedded-only default for agents that do not need runtime skills.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Skill package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/skill/). The tools skill example and package tests cover embedded and workspace preparation paths.
