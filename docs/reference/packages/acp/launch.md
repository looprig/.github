---
id: reference/packages/acp/launch
title: launch package · launch
description: Reference for ACP adapter configuration, native and proxy launch, and Codex preflight.
audience: developer
section: reference
order: 192
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions-and-methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants-and-variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# launch package · launch

Import path: `github.com/looprig/acp/launch`. Launch composes an ACP client, child process, adapter command, and optional model proxy.

## Package role {#package-role}

`Codex`, `ClaudeCode`, and `Gemini` construct adapter values. `Dial` uses a proxy-backed config; `DialNative` uses a native harness config. The package supplies command and environment shape, not provider credentials or model policy.

## Exported surface {#exported-surface}

Public values include `Config`, `NativeConfig`, `ManagedClient`, `ModelProxy`, `ProxyBinding`, `HarnessAdapter`, `NativeHarnessAdapter`, `CodexConnector`, `ClaudeConnector`, `GeminiAdapter`, model collections, `CodexPosture`, version result/error types, and path, env, alias, selection, and proxy errors. `ProbeCodexVersion` is the injectable one-shot preflight.

### Functions and methods {#functions-and-methods}

Connector configure methods build argv and environment without spawning. `ProbeCodexVersion` runs only through a caller-provided runner; `Dial` and `DialNative` own the actual child/proxy lifecycle.

### Types {#types}

`CodexVersionResult` classifies unknown, unsupported, and accepted versions. `ProxyNotReadyError` and `ModelAliasError` keep launch setup failures separate from protocol failures.

### Constants and variables {#constants-and-variables}

The minimum Codex version and probe timeout are explicit preflight limits. Gemini is intentionally an adapter, not an ACP connector.

## Ownership and errors {#ownership-and-errors}

The caller owns config values and provider credentials; ManagedClient owns only resources created by a successful dial. Run version preflight before launch and do not silently strip forbidden child environment variables.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned launch package](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/). The foreign ACP example uses adapter config without starting a real provider.
