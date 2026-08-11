---
id: carbon/model-routing
title: Carbon model routing and runtime selection
description: Learn how Carbon compiles model rows into primer, delegate, native ACP, and review routes and how runtime selection behaves.
audience: [human, operator, developer]
section: carbon
order: 5
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  production-models:
    - release-github-com-looprig-carbon
---

# Carbon model routing and runtime selection

Carbon reads the validated model catalog once when it composes a session. It
turns rows into a shared in-process client, a primer candidate set, delegate
sources, optional native ACP profiles, and an optional permission-review
classifier model. Clients are reused by deployment identity and authentication
mode where the source permits it. Inline API keys are deliberately ineligible
for client reuse; credential references preserve the safe reference identity
while the source remains private.

## Primer candidates

`primer_default` names the initial Carbon model. Every row marked `primer` is a
candidate that the TUI can expose as a runtime primer. Selecting another
candidate changes the model for subsequent turns without changing the access
profile, workspace lease, or session identity. If the current effort is not
admitted by the selected model, Carbon moves to that candidate's default
effort. The selection is validated against the normalized `efforts` list.

Primer selection is not a provider discovery mechanism. Carbon does not fetch a
catalog from a provider to fill missing aliases. Add and validate a row in
`models.json`, then start a new process so the composition sees it.

## Effort and mode

The model row admits neutral efforts (`none`, `low`, `medium`, `high`, `max`)
and names a default. The TUI's quick and deep modes map to the admitted low and
maximum ends of the selected model. A mode or effort request that is not
admitted is rejected. Carbon does not silently invent a provider-specific
effort name.

## Delegate routes

A row with `uses: ["delegate"]` becomes a gateway-backed ACP source. The alias
is a Carbon model identity, while the selected harness is a separate runtime
profile. `claude_code_small_model`, when present, selects a delegate-capable
tools model for the small request path used by the Claude gateway. Provider
credentials remain in Carbon's client and are not passed to the ACP child.

Native ACP entries are compiled separately. They use the harness's own
authentication and model selection rules, subject to any explicit Carbon
allowlist. Disabled native profiles remain part of the configuration identity
but do not create runtime rows.

## Permission-review route

`permission_review.model` names a model with tools and structured output with
tools. Carbon constructs one command-safety classifier for that model only when
the setting is enabled and the selected access profile is `trusted`. The
classifier may recommend automatic approval within its policy, or leave a gate
for a human. It does not widen the access profile or bypass the ordinary access
gate.

## Configuration changes and restore

The normalized model configuration contributes to a secret-free revision. A
normal restore rejects a session whose model or MCP configuration fingerprint
no longer matches. Carbon's internal restore seam can explicitly allow a
configuration mismatch, but the CLI does not expose that escape hatch. Edit
`models.json` and start a new process when making a deliberate routing change.
If a provider credential rotates behind a stable reference, recompose so the
new source generation is acquired.

## Evidence

Model compilation and candidate construction are in
[`internal/app/productionmodels.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/productionmodels.go)
and [`internal/app/modelconfig_normalize.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_normalize.go).
Runtime selection behavior is exercised by
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go)
and [`internal/app/productionmodels_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/productionmodels_test.go).
