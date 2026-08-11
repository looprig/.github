---
id: reference/tools/processes
title: Standard process tools
description: Bind Bash and process supervision without confusing command preparation, gate approval, and Sandbox containment.
audience: developer
section: reference
order: 262
publication: released
examples:
  - stage-04-prepared-tool
  - stage-11-sandbox-process
proofs:
  bash: release-github-com-looprig-tools
  supervision: release-github-com-looprig-tools
  containment: release-github-com-looprig-sandbox
  source-and-runnable-proof:
    - release-github-com-looprig-tools
    - release-github-com-looprig-sandbox
---

# Standard process tools

The Bash family turns a model-supplied command into a prepared Harness request. The process package exposes supervised operations for work that may outlive one synchronous call. The Sandbox profile still owns operating-system containment.

## Bash {#bash}

`bash.NewFactory` and `bash.NewSupervisedFactory` validate their runner and workspace bindings before producing definitions. The prepared command carries its normalized command and resource requirements to the gate. A denied or unprepared request must not reach the process runner, and a successful gate decision does not make the command trusted.

## Supervision {#supervision}

Supervised factories resolve the runner from the validated loop binding and return bounded output, exit status, and lifecycle errors. The caller owns cancellation and closes the returned process handle. Do not use a background process to evade the loop quota or gate; the shared supervisor enforces lifetime and quota policy.

## Containment {#containment}

Bind the command runner to a Sandbox `ExecutorSet` when the product needs OS-level restrictions. A gate decision answers whether this request may proceed under application policy. The selected sandbox executor decides which filesystem, network, identity, and process effects the child can actually perform. Either boundary can reject the effect.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Bash package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/bash/) and [pinned Sandbox package](https://github.com/looprig/sandbox/tree/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/). The prepared-tool and sandbox-process examples cover the two decisions.
