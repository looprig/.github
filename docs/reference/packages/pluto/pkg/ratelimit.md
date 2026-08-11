---
id: reference/packages/pluto/pkg/ratelimit
title: Pluto rate-limit package
description: Bounded retry and concurrency decorator for inference clients.
audience: [developer, operator]
section: reference
order: 264
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/ratelimit`

Inference rate-limit decorator in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/ratelimit).

## Package role {#package-role}

`ratelimit` constrains evaluation traffic before it reaches an `inference.Client`. It is a run resource policy, not a provider adapter or session queue.

## Exported surface {#exported-surface}

`Config` carries `MaxRPM`, `MaxConcurrent`, `MaxRetries`, `BaseBackoff`, and `MaxBackoff`; `New(inner, config)` returns an `inference.Client` decorator.

## Lifecycle and errors {#lifecycle-and-errors}

Zero limits disable the corresponding bound. Retries cover 429, 5xx, and network failures with exponential full jitter. The underlying inference interface does not expose response headers, so `Retry-After` cannot be honored. Context cancellation stops waiting and returns its cause.

## Source proof {#source-proof}

See the pinned [rate-limit implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/ratelimit).
