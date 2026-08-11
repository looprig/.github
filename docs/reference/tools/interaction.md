---
id: reference/tools/interaction
title: AskUser and permission tools
description: Keep user interaction and permission presentation separate from effectful tool authority.
audience: developer
section: reference
order: 264
publication: released
examples:
  - stage-04-prepared-tool
  - stage-12-gate-rules
proofs:
  ask-user: release-github-com-looprig-tools
  permission: release-github-com-looprig-tools
  gate-boundary: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-tools
---

# AskUser and permission tools

`AskUser` is an interaction tool; the permission package supplies shared request and presentation values used by effectful tools. Neither should be treated as a substitute for the loop gate.

## AskUser {#ask-user}

`askuser.NewAskUser` has no filesystem or network dependency. It calls `loop.RequestUserInput` through the loop context, validates an optional choice list, and returns malformed input, cancellation, provider, and choice failures as tool-result text. The question is already visible to the user, so its audit summary includes the question rather than creating a second effect approval.

## Permission {#permission}

The `permission` package defines capability requirements and the values standard tools attach to prepared calls. A requirement describes the requested resource and operation; it does not decide whether the call is allowed. The gate evaluates it against rules and may ask the user.

## Gate boundary {#gate-boundary}

Keep the interaction path explicit: prepare the request, evaluate the gate, then invoke the tool or ask the user. Classifier evidence may explain why a request is risky, but it cannot turn a denied requirement into an allowed one.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned interaction and permission packages](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/). The prepared-tool and gate-rules examples show the distinct user and effect decisions.
