---
id: start/verification
title: Verify a foundation change
description: Use source, tests, and deterministic manifests as a small evidence loop while developing.
audience: developer
section: start
order: 4
publication: released
examples:
  - stage-01-inference
  - stage-10-workspace
proofs:
  source-and-tests:
    - release-github-com-looprig-core
    - release-github-com-looprig-storage
  examples:
    - release-github-com-looprig-core
    - release-github-com-looprig-storage
  release-path:
    - release-github-com-looprig-core
---

# Verify a foundation change

Treat a documentation claim as a small engineering change. Read the current implementation and exported declarations, find the adjacent tests, and run the narrowest deterministic example that exercises the claim. Keep live provider, OAuth, remote NATS, rclone, and host-specific sandbox checks behind their environment gates.

## Source and tests {#source-and-tests}

Run a module's native check, then run its standalone test command with `GOWORK=off`. Read the release module file for the immutable dependency versions. For a package claim, prefer a test that exercises the named constructor or error over an inferred behavior from a neighboring package.

## Examples {#examples}

The central manifest maps an example ID to a real source path, offline command, assertion, workflow path, job ID, cleanup rule, and proof IDs. `stage-01-inference` proves the smallest request; `stage-10-workspace` proves snapshot and materialization. Use the manifest entry rather than copying an untested snippet into a guide.

## Release path {#release-path}

A local workspace can mask a missing tag or a stale replace directive. Use a clean temporary module, an isolated module cache, `GOWORK=off`, and the released versions listed in the manifest. If a page needs source-workspace code, label it explicitly and explain the publication limit.
