---
id: modules/tools
title: Tools
description: Provide prepared read, write, process, network, task, skill, and tool-result paging capabilities with validation before effect.
audience: developer
section: modules
order: 19
publication: released
proofs:
  repository: release-github-com-looprig-tools
  description: release-github-com-looprig-tools
  dependencies: release-github-com-looprig-tools
  dependents: release-github-com-looprig-tools
  where-it-fits: release-github-com-looprig-tools
---

# Tools

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/tools` |
| Version | `v0.15.0` |
| GitHub | [looprig/tools](https://github.com/looprig/tools) |

## Description

Provide prepared read, write, process, network, task, skill, and tool-result paging capabilities with validation before effect.

## Where it fits

Tools are useful on their own when an application needs prepared file, process, network, interaction, task, or skill operations with validation before effect. Within Looprig, [Harness](/docs/modules/harness) exposes them to Loops, while [Sandbox](/docs/modules/sandbox) and gates can constrain process execution and sensitive effects.

The `readtoolresult` package supplies `read_tool_result`, which lets a model page through a result that Harness retained in full after showing only a preview, such as a long build log from Bash. The model names only a capture id, and Harness decides what that Loop may read. Register the tool only on a Rig that wires tool-result retention. Tools describe and perform operations; the runtime owns admission, authority, and cleanup.

Since v0.15.0, `ProcessOutput` bounds its output: `limit_bytes` has a schema maximum of 33,554,432 and one call's serialized result is capped at 32 MiB across all process ids, so callers page with `next_cursor`.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)
- [Storage](/docs/modules/storage)

## Dependents

None.
