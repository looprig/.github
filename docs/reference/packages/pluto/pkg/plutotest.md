---
id: reference/packages/pluto/pkg/plutotest
title: Pluto test package
description: Offline testing helpers for running a Pluto pack and checking qualification dispositions.
audience: developer
section: reference
order: 259
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/plutotest`

Testing helpers in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest).

## Package role {#package-role}

`plutotest` provides deterministic test orchestration around Pluto's qualification engine. It is not a production runner and does not make inference calls unless the supplied spec does so.

## Exported surface {#exported-surface}

`Run(t, RunSpec)` returns a `qual.Scorecard`; `RunSpec` carries manifest, packs, target, and trial count. `RequireDisposition(t, card, profile, allowed...)` checks the evaluated profile disposition.

## Lifecycle and errors {#lifecycle-and-errors}

The testing helper reports failures through the supplied test interface and keeps trial count explicit. Invalid manifests, packs, target fixtures, and profile dispositions fail the test rather than being converted into a passing zero value.

## Source proof {#source-proof}

See the pinned [plutotest source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/plutotest).
