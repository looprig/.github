---
id: modules/controller
title: Controller
description: Run one dedicated Host Pod per session on Kubernetes as an optional workload controller, draining each Host before deleting its Pod.
audience: developer
section: modules
order: 27
publication: released
proofs:
  repository: release-github-com-looprig-controller
  description: release-github-com-looprig-controller
  dependencies: release-github-com-looprig-controller
  dependents: release-github-com-looprig-controller
  where-it-fits: release-github-com-looprig-controller
---

# Controller

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/controller` |
| Version | `v0.2.1` |
| GitHub | [looprig/controller](https://github.com/looprig/controller) |

## Description

Run one dedicated Host Pod per session on Kubernetes as an optional workload controller, draining each Host before deleting its Pod.

## Where it fits

Controller is useful on its own when a hosted agent service on Kubernetes wants a dedicated Pod per session and keeps its desired placement in SessionStore. It creates direct Pods, one for each dedicated session's desired generation, adopts an existing Pod only when every identity label and the recorded spec hash match, and deletes Pods with a UID precondition. Each Pod is built from a strictly decoded, versioned payload that references credentials but never carries them inline. The `cmd/controller` package refuses to start without a storage `Bootstrap` supplied by the product, because the module composes no storage backend itself.

Within Looprig, Controller implements [Factory](/docs/modules/factory)'s `WorkloadController` seam and its optional endpoint discovery. It lives in its own repository so that Kubernetes client libraries never enter Factory's dependency graph; Factory is a test-only requirement here. Its work loop reads desired state and the Host registry from [SessionStore](/docs/modules/sessionstore) under a reconciliation claim. When a workload is no longer wanted, it drains the [Host](/docs/modules/host) over its own HostLink client built from [Core](/docs/modules/core), clears the registry fence, deletes the Pod, and records the outcome. Each Pod gets a bare HostLink base, so it must run a Host image that serves that layout.

Controller owns the Pod lifecycle and the drain-before-delete order. Factory still decides placement and attaches sessions, and the product owns storage, images, RBAC, and cluster operations.

## Dependencies

- [Core](/docs/modules/core)
- [Factory](/docs/modules/factory)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
