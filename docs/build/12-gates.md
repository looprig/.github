---
id: build/12-gates
title: Build 12: gate decisions
description: Evaluate prepared requirements with explicit deny, gated, and allow outcomes before any effectful tool runs.
audience: developer
section: build
order: 12
publication: released
examples:
  - stage-12-gate-rules
proofs:
  boundary:
    - release-github-com-looprig-harness
  evaluation-order:
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-harness
  errors-and-limits:
    - release-github-com-looprig-harness
  runnable-proof:
    - release-github-com-looprig-harness
---

# Build 12: gate decisions

Harness gates operate on typed tool requirements. They decide whether a call may proceed, but they do not enforce OS isolation and they do not parse raw model arguments. This boundary is where a Rig chooses a headless or interactive approval policy and where every unmet gated requirement becomes one auditable decision.

## Boundary {#boundary}

`gate.Evaluator` consumes `tool.Request` values and structural `AccessBinding` sources. `NewHeadlessEvaluator` and `NewInteractiveEvaluator` select the decision mode. `Resolution` records approval, denial, or a gate requirement; `GateResponse` carries one of the offered approval actions. Rule matching and persistence are supplied by the consumer through `RuleMatcher` and `RuleWriter`.

The gate package deliberately does not import `sandbox`, does not read a permission file, and does not grant authority based on a tool display name. A requirement kind and normalized match identify the capability being evaluated.

## Evaluation order {#evaluation-order}

The runtime sequence is preparation, gate evaluation, grant issuance, and effect. A `CallPreparer` must reject malformed arguments before the evaluator is called. Deny sources are checked before allow sources, so an allow rule cannot override an explicit deny. Gated requirements are combined into one approval prompt, then the caller issues the narrow grant that the enforcing layer can verify.

The gate's decision is not the Sandbox's guarantee. An approved `command.execute` request still needs a correctly scoped executor and a matching grant. Conversely, a Sandbox backend cannot turn a denied gate into a process.

## Lifecycle {#lifecycle}

An interactive evaluator owns its approver and rule writer for the evaluator lifetime. A resolution must be answered through the same gate identity and route that opened it. Durable gate events are journaled by Harness; a pending gate is not an invitation to retry the underlying tool call without a new decision.

## Errors and limits {#errors-and-limits}

Validate requirements, bindings, gate payloads, and approval actions at construction and response boundaries. Handle `AccessError`, `GateValidationError`, payload codec errors, and evaluator failures with `errors.Is` or `errors.As`. Bounds cover requirement counts, review context, payload size, classifier names, and form fields. Diagnostic text is bounded and not a compatibility contract.

## Runnable proof {#runnable-proof}

`stage-12-gate-rules` installs a source that reports a gated capability and a matcher that reports both deny and allow. It asserts that the result is not approved and that the allow matcher is never consulted after deny. Run it with `node scripts/docs/run-examples.mjs`. The [pinned evaluator](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evaluator.go) and [gate tests](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/) show the ordering contract.
