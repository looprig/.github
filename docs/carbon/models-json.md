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
  local-and-provider-models:
    - release-github-com-looprig-carbon
  required-shape:
    - release-github-com-looprig-carbon
  version-2-and-version-3-authentication:
    - release-github-com-looprig-carbon
  uses-primers-and-delegates:
    - release-github-com-looprig-carbon
  native-acp-and-review-extensions:
    - release-github-com-looprig-carbon
  migration:
    - release-github-com-looprig-carbon
  evidence:
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

## Create a file safely

Carbon has no separate configuration-validation command. `--list` reads the
session listing catalog and does not read `models.json` or `mcp.json`. Model and
MCP decoding happens while Carbon opens a normal session. The safest check is
therefore to write the file with owner-only permissions and start a read-only
session. That checks the file's location, permissions, JSON shape, and model
normalization before you grant a session write access.

The following POSIX commands create the default file without exposing a key in
the shell command itself. Run the same pattern for any example below.

```sh
carbon_home="${HOME}/.looprig/carbon"
umask 077
mkdir -p "$carbon_home"
cat > "$carbon_home/models.json" <<'JSON'
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
JSON
chmod 600 "$carbon_home/models.json"
carbon --access-profile readonly
```

The JSON body is also shown on its own when you need to inspect or generate it
from another tool:

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
```

This is a complete version-2 file, not a template fragment. It is the
`validLMStudioModelConfig` fixture used by `TestModelConfigWithoutDelegateDefaultsIsValid`
and the `valid no-auth LM Studio file` case in `TestDecodeModelConfig` in
[`internal/app/modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go).
The LM Studio server and the `qwen3-coder` model are not bundled with Carbon;
start and configure that local server separately.

## Version 3 with a credential reference

Version 3 makes authentication explicit. The following is the complete shape
from Carbon's schema-v3 credential-reference test. The reference must already
name a credential source in Carbon's local catalog. The string is an identity,
not an API key, and is safe to keep in the file.

```json
{
  "version": 3,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "OpenAI Responses coding model.",
    "provider": "openai",
    "api_format": "openai-responses",
    "base_url": "https://api.openai.com/v1",
    "model": "qwen3-coder",
    "credential_ref": "credential://openai/personal",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
```

This exact shape is exercised by `TestDecodeModelConfigAcceptsSchemaV3CredentialReference`
and the credential branch of `TestNormalizeModelConfigV3AuthModes` in
[`internal/app/modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go)
and [`internal/app/modelconfig_validate_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_validate_test.go).
Do not add `api_key` alongside `credential_ref`. Version 3 accepts exactly one
credential binding for an authenticated provider.

## Native ACP with harness-managed model selection

`native_acp` selects a supported native harness. Omitting `models`, or writing
it as `null`, means the harness chooses its own model. Carbon still validates
the profile name and enabled flag. This example keeps the local primer from
the first fixture and enables managed selection for Codex.

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }],
  "native_acp": {
    "codex": {
      "enabled": true,
      "models": null
    }
  }
}
```

The managed distinction is covered by `TestModelConfigNativeACPProfilesDistinguishAbsentManagedAndExplicit`
and `TestDecodeModelConfigAcceptsNullNativeACPModelsAsManaged` in
[`internal/app/modelconfig_native_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_native_test.go).
Native ACP uses the installed Codex harness and its own authentication. Carbon
does not install that harness or choose a remote service for it.

## Native ACP with a structured allowlist

Use a non-empty `models` array when the parent configuration must constrain the
native harness. Each structured entry needs a model ID, a non-empty effort
allowlist, and a default that appears in that allowlist. The IDs below are
native Codex model IDs, not aliases from Carbon's top-level `models` array.

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }],
  "native_acp": {
    "codex": {
      "enabled": true,
      "models": [{
        "model": "gpt-5.6-sol",
        "efforts": ["medium", "high"],
        "default_effort": "medium"
      }]
    }
  }
}
```

Carbon accepts legacy string entries too, but structured entries are the form
that records effort policy in the file. The exact object form is covered by
`TestModelConfigNativeACPModelsAcceptLegacyAndStructuredEntries` in
[`internal/app/modelconfig_native_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_native_test.go).
An empty array is rejected. A structured default outside `efforts`, duplicate
model IDs, or duplicate efforts is rejected before a child starts.

## Pin ACP launcher executables

`acp_launchers` is machine-local executable configuration. Paths must be
absolute and clean. Carbon checks the environment override first, then this
map, then the fixed default executable name. The configured file must still be
present and executable when a child starts.

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }],
  "acp_launchers": {
    "claude-code": {
      "executable": "/usr/local/bin/claude-code-acp"
    },
    "codex": {
      "executable": "/usr/local/bin/codex-acp"
    }
  }
}
```

This is the accepted block from `TestDecodeModelConfigACPLaunchers`, with the
normalization checks in `TestNormalizeModelConfigACPLaunchers` and the
production handoff covered by `TestCompileProductionModelsCarriesACPLaunchers`.
Those tests live in
[`internal/app/modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go),
[`internal/app/modelconfig_validate_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_validate_test.go),
and [`internal/app/productionmodels_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/productionmodels_test.go).
The two adapter executables are not bundled with Carbon. Replace these paths
with absolute paths to the adapters installed on the host.

## Enable permission review with a structured-output model

Permission review names a separate model row by alias. The row must advertise
both `structured_output` and `structured_output_with_tools`; it does not need a
`uses` entry, because `permission_review.model` is its binding. This complete
version-2 example uses a safe placeholder string for the classifier key. Put a
real value only in the owner-only file, or use a supported credential source in
a version-3 row.

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [
    {
      "alias": "local",
      "description": "Local LM Studio coding model.",
      "provider": "lmstudio",
      "api_format": "openai",
      "base_url": "http://localhost:1234/v1",
      "model": "qwen3-coder",
      "api_key": "",
      "uses": ["primer", "delegate"],
      "capabilities": {
        "tools": true,
        "thinking": false,
        "images": false,
        "prompt_caching": false,
        "structured_output": false,
        "structured_output_with_tools": false
      },
      "efforts": ["none"],
      "default_effort": "none"
    },
    {
      "alias": "classifier",
      "provider": "openai",
      "api_format": "openai-responses",
      "base_url": "https://api.openai.com/v1",
      "model": "classifier-model",
      "api_key": "REPLACE_WITH_YOUR_OPENAI_API_KEY",
      "capabilities": {
        "tools": true,
        "structured_output": true,
        "structured_output_with_tools": true
      },
      "efforts": ["none"],
      "default_effort": "none"
    }
  ],
  "permission_review": {
    "model": "classifier",
    "strict": true
  }
}
```

The classifier shape follows `modelConfigJSONWithUnusedClassifier` and is
covered end to end by `TestNormalizeModelConfigPermissionReviewSection` and
`TestProductionModelsResolvesUnusedClassifierPermissionReview` in
[`internal/app/modelconfig_permission_review_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_permission_review_test.go)
and [`internal/app/productionmodels_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/productionmodels_test.go).
Carbon applies this review path to the `trusted` profile. The OpenAI endpoint
and classifier model are external dependencies, not part of the Carbon
release.

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
