---
id: contributing/verification
title: Verify a Looprig module change
description: Run repository checks, verify standalone dependency resolution, and keep documentation evidence synchronized when contributing.
audience: developer
section: contributing
order: 1
publication: released
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

# Verify a Looprig module change

This page is for contributors working inside the Looprig source workspace. Consumer applications do not need these repository and release checks.

## Source and tests {#source-and-tests}

Treat each top-level module as its own repository. Read the implementation and adjacent tests, then run that repository's native check. Use standalone module resolution when verifying a release path so the workspace cannot hide an unpublished dependency.

## Executable documentation {#examples}

Documentation examples map to checked source, expected output, cleanup behavior, and CI jobs. When changing a documented contract, update the executable fixture and its page together. Run the repository-local example command and the central documentation verifier before committing.

## Release verification {#release-path}

Confirm direct Looprig dependencies exist remotely before naming their versions. Published module files must not contain local filesystem replacements. Follow the dependency tiers from foundations upward, and verify both the branch and immutable tag after publishing.
