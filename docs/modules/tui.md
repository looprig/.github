---
id: modules/tui
title: TUI
description: Build terminal screens for session events, replay, restore decisions, runtime teardown, widgets, and rendering styles.
audience: developer
section: modules
order: 24
publication: released
proofs:
  repository: release-github-com-looprig-tui
  description: release-github-com-looprig-tui
  dependencies: release-github-com-looprig-tui
  dependents: release-github-com-looprig-tui
  where-it-fits: release-github-com-looprig-tui
---

# TUI

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/tui` |
| Version | `v0.16.1` |
| GitHub | [looprig/tui](https://github.com/looprig/tui) |

## Description

Build terminal screens for session events, replay, restore decisions, runtime teardown, widgets, and rendering styles.

## Where it fits

TUI is useful on its own when a terminal application needs reusable session views, event rendering, input, completion, restore decisions, and teardown coordination. Within Looprig, it presents [Harness](/docs/modules/harness) sessions and [Inference](/docs/modules/inference) content in a ready terminal interface. TUI owns presentation and interaction; the runtime remains the source of session state.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
