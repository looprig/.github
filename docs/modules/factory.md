---
id: modules/factory
title: Factory
description: Embed an orchestration service providing the HTTP and WebSocket client surface, command admission, session placement, and HostLink connections to Hosts.
audience: developer
section: modules
order: 26
publication: released
proofs:
  repository: release-github-com-looprig-factory
  description: release-github-com-looprig-factory
  dependencies: release-github-com-looprig-factory
  dependents: release-github-com-looprig-factory
  where-it-fits: release-github-com-looprig-factory
---

# Factory

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/factory` |
| Version | `v0.12.0` |
| GitHub | [looprig/factory](https://github.com/looprig/factory) |

## Description

Embed an orchestration service providing the HTTP and WebSocket client surface, command admission, session placement, and HostLink connections to Hosts.

## Where it fits

Factory is useful on its own when you are building the public front end of a hosted agent service. Typical cases are a multi-tenant service where browsers and API clients create sessions, send input, answer approval gates, and follow live output, and a deployment that spreads sessions across pooled Hosts or starts one dedicated Host per session. It is a library composed with `factory.New`, and it ships no binary and no UI. A product mounts its own interface with `WithUIFS`, `WithUIHandler`, or `WithUIRoutes`, and Factory serves it behind its authentication, origin, and CSRF guards. Authentication and authorization are seams you inject, such as `identity.Verifier` and an `Authorizer`; an authorizer that returns `identity.ErrUnauthorized` produces a 403.

Within Looprig, Factory imports neither [Host](/docs/modules/host) nor [Harness](/docs/modules/harness). It talks to Hosts only through [Core](/docs/modules/core) wire records and [SessionStore](/docs/modules/sessionstore) records. Factory admits commands into SessionStore and places sessions with open work on a live, compatible Host, attaching and binding them over HostLink with one link per Host and tenant, and relays each watched session's live output to its viewers. It sends a gate response only to a Host that advertises that capability. Dedicated placement goes through the platform-neutral `WorkloadController` seam, which [Controller](/docs/modules/controller) implements for Kubernetes, and [WUI](/docs/modules/wui) is a ready browser interface to mount. A Host advertises a bare HostLink base from which Factory derives each tenant's address, so Factory and Host releases should move together.

Factory owns the client-facing protocol, admission, and placement decisions. Callers own identity, authorization policy, the UI, the storage backends, and the platform that runs Host workloads.

`WithPrincipalStamping` is off by default. When enabled, Factory stamps the verified `Principal` after credential verification and refuses to place attributed work on a Host lacking `hostlink.attribution.principal`. `AuditAuthorizer` optionally grants `Principal` and `Metadata` on `GET /v1/sessions/{sid}/commands/{cid}`; otherwise public command status omits both audit members.

## Dependencies

- [Core](/docs/modules/core)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

- [Controller](/docs/modules/controller)
