---
id: integrations/acp/launch-modes
title: ACP native and proxy launch
description: Select adapter, native, or proxy launch while keeping provider credentials and model policy outside ACP.
audience: developer
section: integrations
order: 303
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  adapters: release-github-com-looprig-acp
  preflight: release-github-com-looprig-acp
  limits: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# ACP native and proxy launch

The `launch` package separates provider command shape from ACP protocol handling. Connector values configure argv and environment without spawning; `Dial` uses a proxy-backed configuration, while `DialNative` uses a native Harness configuration.

## Adapters {#adapters}

`Codex` and `ClaudeCode` construct adapter values with provider-specific command shape. `Gemini` is an adapter for environment wiring, not an ACP connector. The launch package does not choose credentials, model policy, or a product's gate rules.

## Preflight {#preflight}

Run `ProbeCodexVersion` through the caller-provided runner before starting a Codex child when that preflight is required. Classify unknown, unsupported, and accepted versions explicitly. A preflight failure is not a protocol fault and must not be hidden by retrying a different executable.

## Limits {#limits}

Proxy readiness, model aliases, environment filtering, and provider version floors are separate launch errors. Do not strip forbidden environment variables or silently downgrade a native request to proxy mode. The proxy or native adapter still sits behind the parent gate and Sandbox policy.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned launch package](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/). `stage-15-acp-foreign` uses adapter configuration without launching a real provider.
