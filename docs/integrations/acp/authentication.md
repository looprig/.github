---
id: integrations/acp/authentication
title: ACP authentication and permissions
description: Keep ACP authentication callbacks, permission requests, and Harness authorization as distinct decisions.
audience: developer
section: integrations
order: 304
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  authentication: release-github-com-looprig-acp
  permissions: release-github-com-looprig-acp
  authority: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-acp
---

# ACP authentication and permissions

ACP transports bytes and typed requests. Authentication and permission policy are injected at the edge that owns the resource, not inferred from a successful handshake.

## Authentication {#authentication}

The client or agent receives an explicit authenticator or authentication handler when the host supports one. Credential storage, refresh, audience, and provider identity remain product concerns. Return typed authentication failures and avoid placing tokens in update metadata, audit summaries, or child environment values unless the launch policy explicitly permits that route.

## Permissions {#permissions}

A child permission request or an ACP client request is an input to the host's policy path. Translate it into a prepared Harness requirement, let the gate decide, and then invoke the narrowly scoped callback. Capability advertisement and an authenticated connection do not approve filesystem, terminal, network, or model effects.

## Authority {#authority}

Classifier evidence can explain a risky ACP request but cannot expand the selected gate rule or Sandbox profile. Keep host callbacks, parent credentials, and child process authority separate so a child cannot turn protocol reachability into host access.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned ACP agent and client](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/). The package tests cover typed authentication and permission errors; `stage-15-acp-foreign` proves deterministic builder wiring.
