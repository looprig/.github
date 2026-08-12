---
id: agents/repositories/secrets
title: Secret values and stores
description: Keep secret bytes opaque and persist them through the versioned Store contract.
audience: agent
section: agents/repositories
order: 20
publication: released
proofs:
  module:
    - release-github-com-looprig-secrets
---
# secrets

`github.com/looprig/secrets@v0.1.0` has no Looprig module dependency. `secrets.New([]byte)` creates an opaque `Secret`; `NewReference(scheme, path)` and `NewNamespace` create validated addresses. Use the `Store` interface for put, get, delete, and paged listing. `local.New(root)` opens the filesystem implementation.

Use `CreateOnlyPut()` when a credential must not overwrite an existing version. Store references and versions, not secret values, in `credentials` records or model configuration. The local store validates root containment, uses owner-only paths, and implements the contract tests.

Invalid references, namespaces, versions, page tokens, paths, conflicts, unavailable backends, and cancellation are typed errors. Proofs: [`secret.go`](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/secret.go), [`store.go`](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/store.go), [`local/store.go`](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/local/store.go), [`contracttest/store.go`](https://github.com/looprig/secrets/blob/7b2e3a604b59343e9a0775398ce10c80f9708d12/contracttest/store.go).
