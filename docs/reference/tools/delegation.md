---
id: reference/tools/delegation
title: Task tools
description: Bind task creation and updates to the loop's delegation scope and quota.
audience: developer
section: reference
order: 265
publication: released
examples:
  - stage-14-delegation
proofs:
  constructors: release-github-com-looprig-tools
  scope-and-quota: release-github-com-looprig-harness
  failure: release-github-com-looprig-harness
  source-and-runnable-proof:
    - release-github-com-looprig-tools
    - release-github-com-looprig-harness
---

# Task tools

`tools.TaskDefinitions` returns the `TaskCreate`, `TaskUpdate`, `TaskGet`, and `TaskList` bundle. The definitions are loop-scoped and delegate through Harness's task and rig boundaries.

## Constructors {#constructors}

The root builder has no provider argument because the loop binding supplies the task implementation. Install the returned bundle in the intended loop and do not reuse a definition across sessions with different identity or quota policy.

## Scope and quota {#scope-and-quota}

Task calls can create or update work only within the caller's delegation scope. Harness owns child identity, lifecycle, and quota checks. A planner may prepare a task, but the runner and rig still enforce the permitted depth and count before a child starts.

## Failure {#failure}

Quota exhaustion, departed actors, invalid task state, and cancellation are reported as typed Harness or tool-result failures. Do not recover by silently creating an unscoped child or by changing the parent identity.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned task package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/task/) and [Harness rig](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/). `stage-14-delegation` shows the second child failing at the configured quota.
