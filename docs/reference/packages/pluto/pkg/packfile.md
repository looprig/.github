---
id: reference/packages/pluto/pkg/packfile
title: Pluto packfile package
description: Strict, bounded YAML pack and table loading for qualification runs.
audience: developer
section: reference
order: 258
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/packfile`

Packfile boundary in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile).

## Package role {#package-role}

The package decodes and validates pack, rubric, scenario, table, and evaluator YAML before execution. It is a trusted-definition boundary, not a model or session store.

## Exported surface {#exported-surface}

`PackFile`, `Document`, `TableFile`, `Registry`, `ScenarioSpec`, `RunSpec`, `ScriptSpec`, `ToolSpec`, `RubricSpec`, `EvaluatorSpec`, `OutputSchemaSpec`, `StructuredSpec`, `StructuredExpectSpec`, `ExpectSpec`, `AnchorSpec`, `MessageSpec`, `ScriptToolCall`, and `Environment` describe loaded definitions. Constructors/loaders include `DecodePack`, `DecodeTable`, `Load`, `LoadDir`, `Build`, `Lint`, `NewRegistry`, and `VerifyDigest`; `DigestLockfile`, `Schema`, and `StrictDecode` support reproducibility.

## Lifecycle and errors {#lifecycle-and-errors}

Files are capped at `MaxFileBytes` (1 MiB), unknown fields are rejected, and `Lint` reports nonfatal authoring diagnostics. `Load` uses an `fs.FS`; `Build` may require a judge client for judge kinds. Typed `Error` values wrap causes, and `ErrJudgeUnconfigured` distinguishes an absent judge from malformed YAML.

## Source proof {#source-proof}

See the pinned [packfile implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile).
