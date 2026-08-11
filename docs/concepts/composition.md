---
id: concepts/composition
title: Compose a Rig from owned pieces
description: Understand which layer owns content, model access, state, execution, and evaluation.
audience: human
section: concepts
order: 1
publication: released
proofs:
  layers:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
    - release-github-com-looprig-storage
  ownership:
    - release-github-com-looprig-secrets
    - release-github-com-looprig-sandbox
  example:
    - release-github-com-looprig-inference
---

# Compose a Rig from owned pieces

Looprig modules are intentionally narrow. Core owns shared content values. Inference owns provider-neutral invocation and streaming. LLM owns provider clients and credential policy. Storage owns durable primitives. Flow owns graph execution. Sandbox owns OS-level enforcement. Eval owns scenarios, scoring, and redacted reports. A user-owned application or runtime assembles these pieces into a Rig.

## Layers {#layers}

Keep the dependency direction visible. A request can carry Core messages into Inference, then pass through an LLM client that has been constructed with Credentials and Secrets. A runtime can persist history through a Storage composite, ask Sandbox to run an approved process, and send the resulting observation to Eval. None of these modules silently becomes the owner of the others' state.

## Ownership {#ownership}

Credentials owns how a catalog record becomes a source and when a lease is refreshed. Secrets owns opaque values and reference parsing. Storage owns bytes and revisions but not the meaning of a session or workspace. Sandbox enforces the authority a caller has chosen but does not decide whether a tool call is approved. This separation makes replacement practical: swap Fsstore for Natsstore without changing the ledger or blob contract, or replace a provider without changing message history.

## Example {#example}

The first two progressive entries show the lower half of this composition: Core values cross the Inference interface with a fake transport. Later entries add a session store, workspace blobs, a sandbox process, and a gateway. Read those source paths in order when designing a system with more than one lifetime.
