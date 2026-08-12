---
id: agents/harness/policy
title: Harness tools, gates, and hooks
description: Bind model-facing tools to typed capability requests, policy evaluation, approval, enforcement seams, and runtime hooks.
audience: agent
section: agents/harness
order: 31
publication: released
proofs:
  effectful-call-path:
    - release-github-com-looprig-harness
  tool-surface:
    - release-github-com-looprig-harness
  gate-surface:
    - release-github-com-looprig-harness
  hooks:
    - release-github-com-looprig-harness
  human-routes:
    - release-github-com-looprig-harness
  source-and-tests:
    - release-github-com-looprig-harness
  tools:
    - release-github-com-looprig-harness
  policy:
    - release-github-com-looprig-harness
---

# Tools, gates, and hooks

## Effectful call path

```text
InvokableTool argsJSON
  -> CallPreparer.PrepareCall(executionID, argsJSON)
  -> validated tool.Request
  -> gate.Evaluator.Evaluate / Authorize
  -> Resolve(action) and fresh execution-bound grants
  -> InvokableRun(ctx, argsJSON)
```

`pkg/tool` owns argument decoding, normalization, canonical resource identity,
and typed requirements. `pkg/gate` owns the three-state decision, durable rule
matching/persistence, approval response, and grant issuance. An enforcing
consumer owns the sandbox or OS boundary. A prompt is not enforcement.

## Tool surface

| Symbol | Contract |
| --- | --- |
| `tool.Definition` | immutable metadata plus `Build(context.Context, tool.Bindings)` |
| `NewDefinition`, `NewBundleDefinition`, `NewEvidenceDefinition` | constructors; produced names and `ToolInfo` must agree with built tools |
| `tool.Requirements` | `RequiresWorkspace`, `RequiresDelegateController`, `RequiresWorkspaceRead`, `RequiresProcessServices` capability bits |
| `tool.Bindings` | non-zero session/loop IDs plus optional workspace, read workspace, delegate, process, and extra-tool bindings; never retained by definitions |
| `tool.InvokableTool` | `Info(ctx)` plus `InvokableRun(ctx, argsJSON)`; args are untrusted |
| `tool.CallPreparer` | required for effectful tools; absent preparation fails closed |
| `tool.Request` / `ValidateRequest` | normalized requirements and optional exact grant binding; match `*tool.RequestValidationError` |
| `tool.PreparedCall` | execution ID, request, opaque artifact, and fresh grants; grant tokens do not enter prompts, journals, or audit records |
| `tool.ToolMiddleware` | before/after wrapper; may short-circuit or call `next` |
| `tool.ToolResult` / `TextResult` | non-empty content result; no terminate flag in v1 |

Optional interfaces (`Sequential`, `Auditable`, `WriteTarget`, process,
workspace, and observation contracts) are discovered by type assertion. Keep
`BaseTool` narrow; do not make a consumer tool implement unrelated capability
interfaces. Tool factories should not import `pkg/loop` or runtime internals.

## Gate surface

| Symbol | Use |
| --- | --- |
| `gate.AccessBinding`, `NewAccessBindings` | exact requirement-kind to `AccessSource` routing |
| `gate.NewInteractiveEvaluator` | approver plus durable writer; supports approval and reusable rule persistence |
| `gate.NewHeadlessEvaluator` | no prompt; unmet access resolves as typed approval-required denial |
| `Evaluator.Evaluate`, `Authorize`, `Resolve` | evaluate prepared request, authorize without interaction, then resolve one `ApprovalAction` |
| `gate.Gate`, `OpenPayload`, `GateResponse` | durable open/response envelope; validate before journaling |
| forms | `PromptSchema`, `FormPayload`, `ParseFormAnswers`, `FormAudit` for bounded structured answers |
| permission review | `PermissionReviewPolicy`, `PermissionReviewSubject`, `EvaluatePermissionAssessment`, `CombinePermissionAssessments` |

Evaluation checks access denials and durable rules before approval; all deny
matches win over allows. Interactive approval is consulted once, errors fail
closed, and grant issuance follows the decision. Permission classifiers produce
eligibility data, not gate authority. Use typed `*gate.AccessError`,
`*gate.EvaluationError`, `*gate.GateValidationError`, and review/form validation
errors.

## Hooks

`hook.Set` contains ordered `Guards` and `Around` observers. Guards require a
non-empty policy revision; observers do not change policy identity. Compile
once with `hook.Compile`, then call `Runner.Start(ctx, hook.Call)` and finish
with the returned `FinishFunc`.

`hook.Call` and `hook.Result` are immutable snapshots with exactly one matching
operation payload (`TurnData`, `StepData`, `InferenceData`, `CompactionData`,
`ToolCallData`, `GateWaitData`, `ToolExecutionData`, or `JournalAppendData`).
Guards run registration order; around begins in registration order and finishes
reverse order. Callbacks can run concurrently across operations and must be
safe for concurrent use. Redact `Result.Err` before crossing a trust boundary.

## Human routes

[`/docs/guides/harness/gates`](/docs/guides/harness/gates) covers access,
approval, evidence, forms, and review policies. [`/docs/guides/harness/hooks`](/docs/guides/harness/hooks)
covers operation selection and failure behavior. Package details are in
[`/docs/reference/packages/harness/tool`](/docs/reference/packages/harness/tool),
[`/docs/reference/packages/harness/gate`](/docs/reference/packages/harness/gate),
and [`/docs/reference/packages/harness/hook`](/docs/reference/packages/harness/hook).

## Source and tests

- [`pkg/tool/definition.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/definition.go), [`pkg/tool/preparation.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/preparation.go), [`pkg/tool/tool.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/tool.go), [`pkg/tool/preparation_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/tool/preparation_test.go).
- [`pkg/gate/evaluator.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/evaluator.go), [`pkg/gate/access.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/access.go), [`pkg/gate/review.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/review.go), [`pkg/gate/gate_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/gate_test.go), [`pkg/gate/evaluator_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/gate/evaluator_test.go).
- [`pkg/hook/hook.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hook/hook.go), [`pkg/hook/runner.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hook/runner.go), [`pkg/hook/runner_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/hook/runner_test.go).
- [`examples/policy/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/policy/example_test.go).
