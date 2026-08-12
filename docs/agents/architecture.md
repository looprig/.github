---
id: agents/architecture
title: Looprig architecture map
description: Machine-readable routing for module boundaries, versions, products, and source-workspace packages.
audience: agent
section: agents
order: 1
publication: released
proofs:
  module-records:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
    - release-github-com-looprig-carbon
    - module-kosa
    - module-workflows
  publication-rules:
    - module-flow-store
    - module-workflows
  composition-layers:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
    - release-github-com-looprig-inference
    - release-github-com-looprig-eval
  interface-rule:
    - source-client-sdk-core-package
    - source-client-sdk-svelte-package
  nested-boundaries:
    - release-github-com-looprig-flow
    - module-flow-store
    - release-github-com-looprig-pluto
    - release-github-com-looprig-pluto-cmd-pluto
---
# Looprig architecture map

Start at `/llms.txt`. It is the only agent index. Each listed path also has a raw Markdown form at the same path with `.md`. Read code, tests, module files, and `_data/*.json` as authority. Do not infer APIs from prose or plans.

## Module records

`docs/_data/modules.json` classifies every module. `packages.json` enumerates Go packages and private TypeScript workspaces. `dependencies.json` gives typed edges. Choose the smallest released module set that satisfies the request.

Publication rules:

- `released`: use the exact `module@tag` in the record. Do not add a local `replace`.
- `source-workspace`: use the checked-out source and its module file. No public install command exists.
- `pending`: source only until a release record exists.
- `unavailable`: product source is not a supported consumer dependency.

## Composition layers

`core` owns content, messages, chunks, usage, IDs, and logging. `secrets`, `storage`, and `sandbox` are independent foundations. `credentials`, the storage backends, and `flow` adapt those contracts. `inference` and `llm` provide model access. `harness` composes model, storage, tools, gates, sessions, workspaces, and delegation. `acp`, `mcp`, `foreignloops`, `classifiers`, `tools`, `tui`, and `client` adapt the runtime. `workflows` coordinates durable work over Flow and Harness. `eval` and `pluto` measure behavior.

Carbon is the complete harness product. The other reusable modules are components for purpose-built systems. Kosa is a separate source product, not a runtime dependency.

## Interface rule

For browser UI, use `client/sdk/core` first. It owns transport, validation, SSE parsing, folding, joining, and typed errors. The vanilla DOM binding is an example. `client/sdk/svelte` is optional Svelte 5 state wrapping. React, Vue, Solid, or another framework can consume the core view and action functions; no framework is required and no unlisted adapter is implied.

## Nested boundaries

Treat `github.com/looprig/flow/store` as a separate source-workspace module from Flow. Treat `github.com/looprig/pluto/cmd/pluto` as a separate module because its tag is `cmd/pluto/v0.1.2`. Keep both records distinct when resolving dependencies.
