---
id: modules/drain
title: Drain
description: Coordinate graceful process shutdown with counted holds per reason, one bounded drain sequence, and an outcome record, using only the Go standard library.
audience: developer
section: modules
order: 4
publication: released
proofs:
  repository: release-github-com-looprig-drain
  description: release-github-com-looprig-drain
  dependencies: release-github-com-looprig-drain
  dependents: release-github-com-looprig-drain
  where-it-fits: release-github-com-looprig-drain
---

# Drain

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/drain` |
| Version | `v0.1.0` |
| GitHub | [looprig/drain](https://github.com/looprig/drain) |

## Description

Coordinate graceful process shutdown with counted holds per reason, one bounded drain sequence, and an outcome record, using only the Go standard library.

## Where it fits

Drain is useful on its own when a long-lived Go process has to stop cleanly inside a platform deadline, such as a Kubernetes pod receiving SIGTERM, a systemd or Compose service, or a Job worker that should exit once idle. Each unit of in-flight work takes a hold for a named reason. A drain, started by a signal, by idleness, or by an explicit `Begin`, runs one sequence: quiesce, settle, close admission, wait per reason, abandon what will not finish, and return an `Outcome`. The whole sequence is bounded by a grace period that should sit below the platform's own, such as `terminationGracePeriodSeconds` or `TimeoutStopSec`. Admission is decided by the `ok` result of `Acquire`, because checking `Draining` first is a race. `Run` installs SIGTERM and SIGINT handling, while `Wait` installs nothing, so a process that already owns its signals, such as a terminal UI, calls `Begin` from its own handler. Enable `WithIdleTimeout` only where a clean exit is the intended lifecycle, because under a Deployment or StatefulSet an idle exit becomes a restart loop.

Within Looprig, Drain is a foundation module with no Looprig dependencies. It belongs at the composition root of a long-running process, for example one that embeds [Host](/docs/modules/host) or [Harness](/docs/modules/harness), where a hold per active turn or pending gate decides when exit is safe. The `drain/draintest` package supplies a manual clock so shutdown wiring can be tested without real sleeps. Drain owns the shutdown sequence, admission cutoff, per-reason deadlines, and the grace ceiling. Callers own what each reason means and what abandoning work implies, along with readiness probes, metrics, and persistence.

## Dependencies

None.

## Dependents

None.
