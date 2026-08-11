---
id: index
title: Looprig developer documentation
description: Entry point for building with Looprig libraries, runtimes, and products.
audience: human
section: home
order: 1
publication: released
proofs:
  choose-a-path:
    - release-github-com-looprig-core
    - release-github-com-looprig-carbon
  publication-labels:
    - release-github-com-looprig-core
    - module-workflows
    - module-flow-store
    - module-kosa
---
# Looprig developer documentation

Looprig provides reusable building blocks for agent runtimes and separately assembled products. This documentation distinguishes immutable releases from code that is available only in the coordinated source workspace.

## Choose a path {#choose-a-path}

Use the human guides to learn the released libraries and compose an application. Use the compact [agent architecture map](agents/architecture.md) when an automated reader needs repository boundaries and publication status without narrative background. Carbon is a product assembled from Looprig libraries rather than another reusable package.

## Publication labels {#publication-labels}

`released` identifies a module with an immutable tag recorded in this snapshot. `source-workspace` identifies code that must be used from the coordinated checkout and must not be presented as a public install path. `unavailable` identifies code, such as Kosa, for which consumers cannot obtain a supported release from a configured remote.
