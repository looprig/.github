---
id: start/installation
title: Install immutable Looprig modules
description: Add released modules by tag and keep source-workspace development separate from published consumers.
audience: developer
section: start
order: 2
publication: released
proofs:
  release-pins:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
    - release-github-com-looprig-llm
  workspace-warning:
    - module-flow-store
  tidy:
    - release-github-com-looprig-storage
---

# Install immutable Looprig modules

Add the module that owns the API you import, using the immutable version shown by its module guide. For example, Core is `github.com/looprig/core@v0.5.1`, Inference is `github.com/looprig/inference@v0.9.2`, LLM is `github.com/looprig/llm@v0.13.3`, and Storage is `github.com/looprig/storage@v0.3.1`. Dependent modules name compatible released versions in their own `go.mod` files.

## Release pins {#release-pins}

Use `go get github.com/looprig/<module>@<tag>` from a consumer module, then run `GOWORK=off go mod tidy`. Keep the selected tag visible in the consumer's module graph. A local `go.work` can make an unreleased checkout appear healthy while hiding a missing published dependency, so standalone verification must disable the workspace.

## Workspace warning {#workspace-warning}

The nested `github.com/looprig/flow/store` module is source-workspace-only. It currently relies on local replacements for its sibling modules and has no immutable tag. Use it only from the coordinated source tree. Do not publish its `replace` directives and do not write an installation command with a fabricated version.

## Tidy and verify {#tidy}

After changing versions, run the module's native check and its standalone tests with `GOWORK=off`. A release tag is immutable, but a consumer's dependency selection is not: review the final graph and verify that no local filesystem replacement remains in published module files. The progressive example runner creates clean temporary modules and isolated Go caches, which is useful for checking the released path rather than the workspace path.
