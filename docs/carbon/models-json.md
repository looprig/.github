---
id: carbon/models-json
title: Configure and validate models.json
description: Build Carbon's strict model catalog for local, provider, primer, delegate, ACP, and permission-review use.
audience: [human, operator, developer]
section: carbon
order: 3
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  decoder-and-tests:
    - release-github-com-looprig-carbon
---

# Configure and validate `models.json`

Carbon reads `models.json` from the Carbon home, normally
`~/.looprig/carbon/models.json`. The decoder accepts schema version `2` or `3`
and rejects unknown fields, duplicate keys at any depth, trailing JSON, invalid
UTF-8, unsafe file permissions, symlinks, and files larger than 1 MiB. Keep the
file owner-only. A missing file is readable as an empty configuration, but the
session cannot open because it has no primer model.

The smallest known-good example is the exact fixture named
`validLMStudioModelConfig` in Carbon's `internal/app/modelconfig_decode_test.go`.
It defines a version-2 `local` primer with the OpenAI-compatible LM Studio
endpoint, `qwen3-coder`, an empty API key, tool support, and the `none` effort.
Use that test fixture as the starting point for a local installation rather
than copying an untested configuration from a different provider.

## Local and provider models

The row's `provider`, `api_format`, `base_url`, and `model` together identify a
deployment. A local OpenAI-compatible server can use the tested LM Studio
fixture's loopback base URL and an empty API key. A hosted or remote provider
uses the provider/API-format combination accepted by the `llm` policy and an
approved credential binding. Carbon does not infer a missing base URL from a
model name, and it does not turn a provider's environment variable into a
credential reference. Keep a local row and a hosted row as separate aliases if
operators need to switch between them.

## Required shape

The top level must contain:

- `version`, exactly `2` or `3`;
- `primer_default`, the alias of a model whose `uses` includes `primer`;
- `models`, a list of model rows.

Each row names `alias`, `provider`, `api_format`, and `model`. `description` is
required for delegate rows and is bounded, plain text. `base_url` is optional
when the provider supplies its own endpoint. `capabilities` declares tools,
thinking, images, prompt caching, structured output, and structured output with
tools. `efforts` is a non-empty list of `none`, `low`, `medium`, `high`, or
`max`; `default_effort` must be one of those admitted values.

Every Carbon model must advertise `capabilities.tools: true`. A non-`none`
effort requires `thinking: true`. Structured output with tools requires both
structured output and tools. Aliases are normalized and cannot contain a slash,
backslash, colon, whitespace, control character, or more than 128 characters.

## Version 2 and version 3 authentication

Version 2 uses `api_key` value semantics. It cannot use `credential_ref`.
Version 3 makes the binding explicit:

- a local, unauthenticated provider omits both `api_key` and `credential_ref`;
- an authenticated row has exactly one non-empty `api_key` or valid
  `credential_ref`;
- a credential reference has the form `credential://provider/name` and its
  provider must match the model's provider policy.

Inline keys are accepted for the legacy or deliberately local case, but they
make client reuse ineligible and must never be pasted into a support report.
Credential references keep the value in Carbon's credential catalog and bind
it at composition time.

## Uses, primers, and delegates

`uses` can contain `primer`, `delegate`, or both, without duplicates. The
primer is the ordinary Carbon model. Delegate rows are candidates for an ACP
gateway and require a safe bounded description. A delegate description must
not contain a URL, path, secret-like material, control character, or newline.
If `claude_code_small_model` is present, it must name a delegate-capable tools
model. Carbon uses it for the small-model route exposed to the Claude gateway.

The decoder sorts rows by alias after validation, so reordering input does not
create a different normalized catalog. Keep the alias stable if sessions,
diagnostics, or operators need to recognize a model over time.

## Native ACP and review extensions

`native_acp` is optional. Its known harness keys are `claude-code` and `codex`.
An enabled profile with omitted or null `models` lets the harness manage model
selection. A non-empty list is an explicit allowlist of strings or structured
objects with `model`, `efforts`, and `default_effort`. `acp_launchers` can pin a
harness executable, but each path must be absolute and clean.

`permission_review` is optional and contains a configured
`structured_output_with_tools` model plus `strict`. Carbon only activates this
review path for the `trusted` profile. It is disabled by default and does not
turn a read-only session into a writing session.

## Migration

Carbon keeps version-2 files readable and byte-stable. The source contains an
explicit, owner-only, atomic migration helper, but it is an internal
implementation seam, not a public Carbon command or API. There is no supported
CLI migration path in this release. Operators can leave a valid v2 file in
place, or produce a validated owner-only v3 file through their controlled
configuration process. Ordinary loading never rewrites the file. The internal
tests prove the intended migration properties: validation, cooperating-edit
detection, temporary owner-only publication, file and directory sync, and
atomic rename.

## Evidence

The wire schema and strict decoder are in
[`internal/app/modelconfig.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig.go),
normalization and auth rules are in
[`internal/app/modelconfig_normalize.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_normalize.go),
and the exact local fixture and migration tests are in
[`internal/app/modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go),
[`internal/app/modelconfig_validate_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_validate_test.go),
and [`internal/app/modelconfig_native_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_native_test.go).
