---
id: reference/tools/overview
title: Standard tools · composition reference
description: Choose and bind Looprig's standard tools while preserving preparation, gate, and runtime boundaries.
audience: developer
section: reference
order: 260
publication: released
examples:
  - stage-04-prepared-tool
  - stage-14-delegation
proofs:
  composition: release-github-com-looprig-tools
  preparation: release-github-com-looprig-tools
  authority: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-tools
---

# Standard tools · composition reference

The `github.com/looprig/tools` module supplies definition builders and focused tool packages. A composition root chooses dependencies, binds definitions to a Harness workspace, and lets the loop prepare each call before the gate decides whether the effect may run.

## Composition {#composition}

Use root builders such as `tools.ReadFileDefinition`, `tools.WriteFileDefinition`, `tools.EditFileDefinition`, `tools.Bash`, `tools.FetchDefinition`, `tools.WebSearchDefinition`, `tools.TaskDefinitions`, and `tools.AskUserDefinition` when assembling a bundle. Builders capture configuration but do not grant authority. The workspace binding supplies the read guard, mutation coordinator, observations, runner, or provider required by each definition.

## Preparation {#preparation}

Prepared tools validate arguments, resolve paths or endpoints, take any required snapshot, and emit a typed requirement before invocation. The runner then evaluates the requirement against its current gate. An invocation that skips preparation is incomplete even when the underlying Go method is callable.

## Authority {#authority}

The gate decides whether a prepared requirement is allowed, denied, or needs a human decision. Sandbox enforcement remains the final operating-system boundary for process effects. Tool options such as host reads or host writes widen a tool's requested resource shape only when the product deliberately supplies a profile that permits it; they do not bypass a gate or create authority by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned tools module](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/). The prepared tool and delegation examples exercise definition binding and call preparation.
