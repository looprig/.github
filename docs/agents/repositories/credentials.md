---
id: agents/repositories/credentials
title: Credential references and lifecycle
description: Describe provider credentials without putting secret values into model or runtime configuration.
audience: agent
section: agents/repositories
order: 5
publication: released
proofs:
  module:
    - release-github-com-looprig-credentials
---
# credentials

`github.com/looprig/credentials@v0.1.0` depends on `github.com/looprig/secrets@v0.1.0`. Use `credentials.NewReference(provider, name)` and `NewDescriptor(...)` for stable identity and metadata. `catalog.New(root)` opens a local catalog. Credential values are held by the `secrets` store; catalog records contain a secret reference and lifecycle metadata.

Use `NewProviderFactories` to bind provider descriptors to source factories. The refresh package provides `NewSource`, `NewState`, `EncodeState`, `DecodeState`, and process or file coordinators. `httpauth.NewBearer` and `NewHeader` turn a resolved secret into an outbound authorizer. `CreateCredentialState` persists a newly created value through the secret store and catalog record.

Reject invalid references, descriptors, records, generations, refresh state, and catalog conflicts with typed errors. Do not log `secrets.Secret` or use a secret value as a model identifier. Proofs: [`reference.go`](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/reference.go), [`descriptor.go`](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/descriptor.go), [`catalog/local.go`](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/catalog/local.go), [`refresh/source.go`](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/refresh/source.go), [`examples/source-lifecycle/example_test.go`](https://github.com/looprig/credentials/blob/12c2f7f7a41f979db494306f8c64ec46ba6b7b4b/examples/source-lifecycle/example_test.go).
