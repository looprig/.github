---
id: modules/host
title: Host
description: Keep agent sessions resident on a runtime host, apply the commands Factory admits, serve HostLink, advertise capabilities, and drain on release.
audience: developer
section: modules
order: 25
publication: released
proofs:
  repository: release-github-com-looprig-host
  description: release-github-com-looprig-host
  dependencies: release-github-com-looprig-host
  dependents: release-github-com-looprig-host
  where-it-fits: release-github-com-looprig-host
---

# Host

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/host` |
| Version | `v0.11.0` |
| GitHub | [looprig/host](https://github.com/looprig/host) |

## Description

Keep agent sessions resident on a runtime host, apply the commands Factory admits, serve HostLink, advertise capabilities, and drain on release.

## Where it fits

Host is useful on its own when you need a long-lived process that keeps agent runtimes resident and applies durable commands to them. It restores a session under the same runtime identity instead of restarting it, publishes open approval gates, and settles each command only from the runtime's own evidence. You describe the agents it may launch as a Department of launch targets, compose it with `host.Compose`, and run it with `host.Run` or start and stop the returned `Service` yourself. `Stop` drains every resident session and returns a `DrainReport` listing anything an operator must reconcile.

Within Looprig, Host is the runtime side of [Factory](/docs/modules/factory). Factory dials each tenant's HostLink address, derived from the base endpoint Host advertises, to attach, bind, deliver commands, and drain, and it admits a gate response only when the Host advertises that capability. Host runs [Harness](/docs/modules/harness) rigs and records claims, attempts, gates, and residency through [SessionStore](/docs/modules/sessionstore) over a [Storage](/docs/modules/storage) backend, using wire types from [Core](/docs/modules/core) and requests from [Inference](/docs/modules/inference). [Controller](/docs/modules/controller) starts dedicated Host Pods and ends them drain-before-delete. A product runtime should implement `department.AttemptCloser`; without it, Host cannot close a predecessor's stranded attempt after a failover, and that session's command stream stays blocked.

Host owns residency, command consumption, the HostLink surface, and drain. Callers own the Department, the storage backend, the harness journal stores used as settlement evidence, credential verification, and deployment.

Host v0.11.0 advertises `hostlink.attribution.principal` only when it carries `Principal` on all five command kinds and `Metadata` on create and input into the product runtime. A product's field-by-field `runtimecommand.Admitted` adapter must copy both fields; dropping either loses attribution silently. Upgrade Hosts before enabling Factory's principal stamping.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
