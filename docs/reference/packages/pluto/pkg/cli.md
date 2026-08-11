---
id: reference/packages/pluto/pkg/cli
title: Pluto CLI package
description: Process boundary for Pluto commands, injected clients, environment lookup, output, and exit codes.
audience: [developer, operator]
section: reference
order: 250
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto-cmd-pluto
---

# `github.com/looprig/pluto/pkg/cli`

CLI composition package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli).

## Package role {#package-role}

The package keeps command parsing and process policy at a narrow seam. It receives dependencies from `App` instead of reading global clients or embedding credentials.

## Exported surface {#exported-surface}

`Main(args, app)` returns an integer. `App` carries registry, client factory, counter factory, environment lookup, stdout/stderr, clock, and rate-limit policy. `LLMConfig` carries provider/model/API-format/base-URL configuration. Exit constants are `ExitOK`, `ExitCommandFailure`, `ExitUsage`, `ExitGateFailed`, and `ExitPricing`.

## Lifecycle and errors {#lifecycle-and-errors}

`Main` owns command lifetime and output; the caller owns injected resources. Usage, gate, pricing, and command failures remain distinct exit classes. API keys are looked up through the environment function, and sensitive values are not placed in `LLMConfig` diagnostics.

## Source proof {#source-proof}

Root CLI declarations are pinned to [pkg/cli](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli); the separately released command module is pinned at [cmd/pluto/v0.1.2](https://github.com/looprig/pluto/tree/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto).
