---
id: build/10-workspaces
title: Build 10: workspaces and release boundaries
description: Keep released module versions reproducible while using the coordinated source workspace for development and verification.
audience: developer
section: build
order: 10
publication: released
examples:
  - stage-08-session-store
  - stage-10-workspace
proofs:
  boundary:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
  composition:
    - release-github-com-looprig-storage
  released-modules:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
  source-workspace-modules:
    - release-github-com-looprig-storage
  verification-boundary:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
  choosing-a-workspace:
    - release-github-com-looprig-storage
  lifecycle:
    - release-github-com-looprig-fsstore
  errors-and-limits:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
  runnable-proof:
    - release-github-com-looprig-storage
    - release-github-com-looprig-fsstore
---

# Build 10: workspaces and release boundaries

The Looprig checkout can coordinate many modules, but a released module must remain reproducible outside that checkout. Build and publish against immutable dependency versions; use workspace wiring only for development and for the examples that intentionally exercise the coordinated source tree.

## Released modules {#released-modules}

A released module has a versioned `go.mod` dependency and an immutable tag. Core, Secrets, Credentials, Storage, Fsstore, Natsstore, Rclonestore, Sandbox, Flow, Inference, LLM, and Eval each have release records in this corpus. A consumer should use those versions and run its checks with `GOWORK=off` so a local checkout cannot mask a missing or incompatible dependency.

## Source-workspace modules {#source-workspace-modules}

`flow/store` is the important exception in this foundation set. It is a nested module with its own `go.mod`, currently developed through a local replacement in the coordinated workspace, and has no published tag in this snapshot. It is useful for local Flow checkpoint experiments, but it must be labelled `source-workspace` and must not be copied into a published module file as a filesystem replacement.

## Verification boundary {#verification-boundary}

Run each module's native tests and examples with its own module boundary, then run the progressive examples from the workspace. Check that generated artifacts, storage roots, NATS processes, and provider fixtures are cleaned up by the example manifest. When a source-workspace example is intentional, record that fact in the example metadata rather than presenting it as an installable release path.

## Choosing a workspace {#choosing-a-workspace}

Use Fsstore for a local single-process path when an explicit root and file durability are appropriate. Use Storage interfaces in application code so Natsstore or another backend can be substituted later. Keep workspace layout, local replacement rules, and release versions separate from runtime ownership of stores, clients, and model credentials.

## Runnable proof {#runnable-proof}

`stage-08-session-store` proves the released Fsstore path and `stage-10-workspace` proves a Storage snapshot round trip. Run them with `node scripts/docs/run-examples.mjs`, then repeat relevant module tests with `GOWORK=off`. Source trees are pinned in the [Storage release](https://github.com/looprig/storage/tree/v0.3.1/) and [Fsstore release](https://github.com/looprig/fsstore/tree/v0.3.2/). Precise source/test proof IDs beyond the release records are pending Task15 evidence promotion.
