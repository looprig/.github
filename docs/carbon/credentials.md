---
id: carbon/credentials
title: Carbon credentials and credential references
description: Store, inspect, bind, and remove provider credentials without putting secret values in models or child processes.
audience: [human, operator]
section: carbon
order: 4
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  lifecycle:
    - release-github-com-looprig-carbon
  complete-credential-bound-model-file:
    - release-github-com-looprig-carbon
  list-what-is-configured:
    - release-github-com-looprig-carbon
  login-posture:
    - release-github-com-looprig-carbon
  logout-is-two-local-operations:
    - release-github-com-looprig-carbon
  credentials-and-sessions:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon credentials and credential references

Carbon treats a credential as a named local source, not as a value to copy into
every model or child process. A version-3 model row can refer to
`credential://provider/name`; Carbon resolves that reference through its local
catalog when it composes an inference client. The reference and provider are
safe identity data. The credential value stays inside the credential source.

## Complete credential-bound model file

A version-3 row carries a reference, not the provider secret. This complete
`models.json` file can be used after the referenced catalog entry has been
created with the explicit login or provisioning path.

```json
{
  "version": 3,
  "primer_default": "cloud",
  "models": [{
    "alias": "cloud",
    "description": "Credential-backed coding model.",
    "provider": "openai",
    "api_format": "openai-responses",
    "base_url": "https://api.openai.com/v1",
    "model": "gpt-5",
    "credential_ref": "credential://openai/personal",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": true,
      "images": false,
      "prompt_caching": false,
      "structured_output": true,
      "structured_output_with_tools": true
    },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
```

The accepted schema-v3 shape is exercised by
[`modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go)
and the credential mode checks in
[`modelconfig_validate_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_validate_test.go).

## List what is configured

Use either the flags or the subcommand form:

```sh
carbon --credentials-list
carbon credentials list
```

The output contains a reference and safe descriptor fields such as provider,
transport, scheme, usage, and status. It does not print a key, token, account
identifier, state path, or secret value. Treat the reference itself as
identifying metadata, not as authorization.

## Login posture

Login is explicit and separate from opening a session:

```sh
carbon --login openai
carbon credentials login openai
```

Carbon checks the provider registration policy before any browser or network
path. The current Carbon implementation has explicit subscription gates for
`openai` and `anthropic`; those gates return their typed unsupported result in
this release. Other provider names fail as unsupported. Do not document a
browser login flow that the current binary does not provide.

Provider keys can still be supplied through an approved credential source or,
for version-2 compatibility, an inline `api_key`. Carbon's composition boundary
uses the credential reference when present and validates that the reference
provider and transport match the selected model's policy. It does not consult
ambient provider environment variables to satisfy a reference.

## Logout is two local operations

Logout requires a full reference:

```sh
carbon --logout credential://provider/name
carbon credentials logout credential://provider/name
```

Carbon first blocks new sessions for that reference and waits for active users
to drain. It then closes the in-process source and removes the catalog record
and its named local state as separate operations. The command reports
`local_catalog` and `local_state` independently, so a state deletion failure is
not hidden by a successful catalog removal.

The current API-key source has no remote revocation operation. Carbon therefore
reports remote revocation as not attempted, rather than claiming that a
provider has revoked anything. If logout reports a partial local outcome,
preserve that outcome, stop new compositions using the reference, and reconcile
the local catalog and state before retrying.

## Credentials and sessions

Credential lifecycle is process-scoped for one resolved Carbon home. A session
borrows the source while it is live, and the runtime closes the source,
catalog, and secret store after the session and its tools have drained. A
second Carbon process does not coordinate this drain with the first process;
avoid deleting a credential from one process while another process is using it.

Credentials are also intentionally absent from model configuration digests,
access digests, ACP child environments, and diagnostic errors. A credential
rotation keeps the reference identity stable; reopen or recompose a session if
the provider client must acquire the new source generation.

## Evidence

The CLI operations and safe projections are implemented in
[`internal/app/credentials.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/credentials.go)
and [`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
Lifecycle and redaction coverage is in
[`internal/app/credentials_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/credentials_test.go)
and the ACP child tests linked from
[`internal/app/acpchildren_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren_test.go).
