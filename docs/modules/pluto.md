---
id: modules/pluto
title: Pluto module
description: Released package reference for capability packs, deterministic targets, evaluation runs, profile qualification, pricing, and JSON reports.
audience: developer
section: modules
order: 25
publication: released
examples:
  - stage-23-eval
proofs:
  module-and-cli: [release-github-com-looprig-pluto, release-github-com-looprig-pluto-cmd-pluto]
  qualification-surface: release-github-com-looprig-pluto
  execution-and-limits: release-github-com-looprig-pluto
  example-proof: release-github-com-looprig-pluto
---

# Pluto module

The released root module is [github.com/looprig/pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4). The CLI is a nested module released at [cmd/pluto/v0.1.2](https://github.com/looprig/pluto/tree/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto). Pluto consumes eval reports and produces qualification evidence; it does not replace session history, checkpoints, artifacts, workspace snapshots, or model context.

## Module and CLI {#module-and-cli}

`github.com/looprig/pluto/pkg/cli` exports `Main`, `App`, `LLMConfig`, and exit codes `ExitOK`, `ExitCommandFailure`, `ExitUsage`, `ExitGateFailed`, and `ExitPricing`. The app seam injects registry, client construction, clock, output, environment lookup, and rate limiting. API keys are resolved through the configured environment lookup rather than copied into a manifest.

The root module also includes the codepack constructors under `pkg/codepacks`, the run and report surfaces, and the deterministic target helper. Use the nested command module only for the released command; package APIs belong to the root module.

## Qualification surface {#qualification-surface}

`qual.Manifest` identifies a target and declares role, provider, model, API format, endpoint class, effort, revision, and capabilities. `qual.Pack` and `qual.Table` describe capability checks. `profile.Profile` declares requirements and restrictions, and `profile.Evaluate` returns a disposition with per-requirement and per-restriction results. `compare.Compare` aligns candidate and incumbent scorecards without dropping unmatched or skipped tables.

The codepack packages each export a `Revision` (`v1`) and `V1() qual.Pack`: `capability`, `operational`, `safety`, `structuredoutput`, and `tooluse`. `qual/target` exports `Script`, `Scripted`, `NewScripted`, and `UnscriptedScenarioError` for deterministic observations. These are qualification inputs, not live serving adapters.

## Execution and limits {#execution-and-limits}

`run.Execute` accepts a manifest, packs, target, optional per-table target, progress callback, result callback, and table concurrency. It returns a partial result when a later table fails and keeps skipped capability tables visible. `packfile` strictly decodes bounded YAML and caps a file at 1 MiB. `reportjson` uses `pluto-report/v1`, caps reports at 64 MiB, validates UTF-8 and one JSON value, and retains skipped tables.

`gen.Generate` validates table and scenario count before one structured-output call, returning accepted scenarios and safe rejections. `pricing.FetchSnapshot` and `ParseSnapshot` cap raw pricing at 8 MiB; `pricing.Preflight` exposes unknown rates before a paid run. `ratelimit.New` retries bounded 429, 5xx, and network failures with jitter. Typed errors such as `InvalidReportError`, `ReportTooLargeError`, `MalformedReportError`, `UnknownVersionError`, `RoleMismatchError`, and `ErrJudgeUnconfigured` are meant for `errors.As`.

## Example proof {#example-proof}

The [stage 23 evaluation example](../examples/index.md#stage-23-eval) prints a passing exact report and a Qualified capability report. The package reference pages below pin every exported Pluto package to the [v0.1.2 source commit](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4).
