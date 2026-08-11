---
id: agents/architecture
title: Looprig architecture map for agents
description: Compact module, product, nesting, and availability boundaries for automated readers.
audience: agent
section: agents
order: 1
publication: released
proofs:
  reusable-layers:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
  products-and-source-workspaces:
    - release-github-com-looprig-carbon
    - module-kosa
    - module-workflows
    - source-client-sdk-core-package
    - source-client-sdk-svelte-package
  nested-modules:
    - release-github-com-looprig-flow
    - module-flow-store
    - release-github-com-looprig-pluto
    - release-github-com-looprig-pluto-cmd-pluto
---
# Looprig architecture map for agents

Treat each repository and nested module as its own dependency and release boundary. Read `modules.json` for module-level classification, `packages.json` for Go import paths and private npm workspaces, and `dependencies.json` for typed edges.

## Reusable layers {#reusable-layers}

Core defines shared contracts at the bottom of the reusable stack. Harness composes Core with inference and storage contracts into the shared runtime layer. Depend on the smallest released module set that provides the required capability.

## Products and source workspaces {#products-and-source-workspaces}

Carbon and Kosa are product-only compositions. Carbon has a released module; Kosa is source-only and unavailable to external consumers. Workflows is pending and source-workspace. The private `@looprig/client` package is the framework-neutral TypeScript client, while private `@looprig/svelte` is an optional adapter; both are version `0.0.0` and have no public installation command.

## Nested modules {#nested-modules}

Model `github.com/looprig/flow/store` separately from released Flow: it is a nested, source-only module whose availability is source-workspace. Model `github.com/looprig/pluto/cmd/pluto` separately from the Pluto root module because the root and command module use distinct release tags.
