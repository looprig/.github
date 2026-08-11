---
id: concepts/security-boundaries
title: Keep gates, credentials, and enforcement separate
description: Give each trust boundary one job and make uncertain outcomes visible.
audience: human
section: concepts
order: 4
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  secret-safety:
    - release-github-com-looprig-secrets
    - release-github-com-looprig-credentials
  enforcement:
    - release-github-com-looprig-sandbox
  failure-safety:
    - release-github-com-looprig-storage
---

# Keep gates, credentials, and enforcement separate

A permission decision and an OS guarantee answer different questions. A credential source and a model identity have different lifetimes. A visible mutation with uncertain durability is not the same as a failed mutation. Looprig's foundation modules keep those distinctions in the type and error boundaries.

## Secret safety {#secret-safety}

Secrets copies values and makes byte access explicit. Credentials catalogs contain descriptors and references, not secret material. Provider clients receive credentials only at construction or request authorization. Redacted typed errors avoid echoing tokens, URLs with userinfo, provider response bodies, and caller text.

## Enforcement {#enforcement}

Sandbox receives a profile and reports achieved guarantees. It does not decide whether a tool is allowed. An application or harness may gate a prepared action first, then give Sandbox only the authority required for that spawn. A Sandboxed request that cannot be enforced returns `ErrSandboxUnavailable`; running it unconfined is not an implicit fallback.

## Failure safety {#failure-safety}

Storage conflicts, corruption, ambiguous commits, and lease loss stay visible. Rclonestore does not treat a subprocess timeout as an empty remote. Natsstore does not grant a lease after an ambiguous read. The safest recovery is often reread and classify, not retry a different effect.
