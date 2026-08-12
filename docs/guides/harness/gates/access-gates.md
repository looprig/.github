---
id: guides/harness/gates/access-gates
title: Access gates
description: Route requirements through access state, stored rules, approval, and grants.
audience: developer
section: guides
order: 11
publication: released
proofs:
  access-abi: [release-github-com-looprig-harness]
  bindings: [release-github-com-looprig-harness]
  evaluator-contract: [release-github-com-looprig-harness]
  decision-order: [release-github-com-looprig-harness]
  resolution: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Access gates

## Access ABI

The generic evaluator uses a dependency-free access ABI:

| Public name | Exact contract |
| --- | --- |
| `CurrentAccessVersion` | `uint16 = 1` |
| `AccessDeny` | `uint8 = 0` |
| `AccessGated` | `uint8 = 1` |
| `AccessAllow` | `uint8 = 2` |
| `AccessSource` | `AccessVersion() uint16`; `AccessFor(kind, scope string) (uint8, error)` |
| `AccessBinding` | `Kind string`; `Source AccessSource` |
| `AccessBindings` | Validated exact-kind routing table returned by `NewAccessBindings` |

An access source must fail closed for unknown kinds and malformed scopes. `NewAccessBindings` rejects blank or whitespace-padded kinds, nil sources, duplicate kinds, and unsupported versions. `AccessBindings.AccessFor(requirement tool.Requirement)` returns only the three ABI values and wraps source failures in `*gate.AccessError`.

## Bindings

```go
package main

import (
    "github.com/looprig/harness/pkg/gate"
    "github.com/looprig/harness/pkg/tool"
)

type profile struct{}

func (profile) AccessVersion() uint16 { return gate.CurrentAccessVersion }
func (profile) AccessFor(kind, scope string) (uint8, error) {
    if kind == "filesystem.read" && scope != "" {
        return gate.AccessGated, nil
    }
    return gate.AccessDeny, nil
}

func route(req tool.Requirement) (uint8, error) {
    bindings, err := gate.NewAccessBindings([]gate.AccessBinding{{
        Kind: "filesystem.read", Source: profile{},
    }})
    if err != nil {
        return gate.AccessDeny, err
    }
    return bindings.AccessFor(req)
}
```

`AccessError` carries `Kind AccessErrorKind`, `Requirement string`, and `Cause error`. The closed kinds are `AccessKindInvalid`, `AccessSourceMissing`, `AccessSourceDuplicate`, `AccessSourceNil`, `AccessVersionUnsupported`, `AccessValueInvalid`, and `AccessSourceFailed`. Missing routes return `AccessDeny` plus an error, so callers cannot accidentally treat an unconfigured capability as allowed.

## Evaluator contract

`gate.Evaluator` composes the bindings with these structural interfaces:

| Interface | Methods | Authority |
| --- | --- | --- |
| `RuleMatcher` | `MatchesDeny(ctx, requirement) (bool, error)`; `MatchesAllow(ctx, requirement) (bool, error)` | Reads consumer-owned durable rules. |
| `RuleWriter` | `WriteRules(ctx, []tool.RuleCandidate) error` | Atomically persists the displayed workspace candidates. |
| `GrantIssuer` | `GrantVersion() uint16`; `IssueGrant(ctx, executionID, command, cwd, kind, scope, class, target string, expiryUnixMilli int64) (string, error)` | Mints execution-bound grants only after resolution. |
| `Approver` | `RequestApproval(ctx, ApprovalPrompt) (ApprovalAction, error)` | Answers one combined interactive prompt. |

`NewHeadlessEvaluator(bindings, matcher, issuer)` never prompts and accepts no writer. `NewInteractiveEvaluator(bindings, matcher, approver, writer, issuer)` requires both an approver and writer so all three actions remain honest. `CurrentGrantVersion` is `uint16 = 1`; an issuer with another version is rejected at construction.

## Decision order

For each prepared `tool.Request`, `Evaluate` applies this order:

1. Route every requirement through `AccessBindings`. Any `AccessDeny` is a structural denial and stops further rule evaluation.
2. For gated requirements, ask `RuleMatcher.MatchesDeny` for every requirement. Any match is a stored denial and stops before allow rules.
3. Ask `MatchesAllow` for every remaining gated requirement. Unmatched requirements are combined into one `Evaluation.Unmet` set, preserving request order, and their candidates are combined into one prompt.

An `Evaluation` has `Denied []tool.Requirement`, `Unmet []tool.Requirement`, and `Candidates []tool.RuleCandidate`. It retains private request and grant state for `Resolve`; grants and denial routing are not serialized.

## Resolution

`Authorize` evaluates once and opens at most one prompt. A headless unmet request returns `*gate.EvaluationError{Kind: EvaluationApprovalRequired}`. An interactive approver must return exactly `ApprovalApprove`, `ApprovalApproveAlwaysWorkspace`, or `ApprovalDeny`.

| Action | Persistence | Grants |
| --- | --- | --- |
| `ApprovalApprove` | No rule write. | Fresh grants for grant-bearing requirements. |
| `ApprovalApproveAlwaysWorkspace` | One atomic `RuleWriter.WriteRules` call for every displayed candidate; a write error blocks execution. | Fresh grants only after persistence succeeds. |
| `ApprovalDeny` | None. | None; returns an unapproved `Resolution`. |

`Resolution` has `Approved bool`, `Grants []string` with `json:"-"`, `Denial DenialReason` with `json:"-"`, and `DenialDescription` with `json:"-"`. A configured or stored denial is a successful evaluation with `Approved == false`, not an exceptional process error. Dependency failures are `*gate.EvaluationError` with kinds `EvaluationRuleMatchFailed`, `EvaluationDenied` deprecated, `EvaluationActionInvalid`, `EvaluationApproverMissing`, `EvaluationApprovalRequired`, `EvaluationApprovalFailed`, `EvaluationWriterMissing`, `EvaluationWriteFailed`, `EvaluationIssuerMissing`, `EvaluationGrantVersionUnsupported`, or `EvaluationGrantFailed`.

The full decision implementation is [`pkg/gate/evaluator.go`](https://github.com/looprig/harness/blob/main/pkg/gate/evaluator.go); access routing is [`pkg/gate/access.go`](https://github.com/looprig/harness/blob/main/pkg/gate/access.go). This package never imports an enforcing sandbox, stores a permission-file format, or accepts a grant token in a prompt or journal payload.

## Source and proof

- [`gate.Evaluator`](https://github.com/looprig/harness/blob/main/pkg/gate/evaluator.go)
- [`access routing`](https://github.com/looprig/harness/blob/main/pkg/gate/access.go)
- [`policy` runnable fixture](https://github.com/looprig/harness/blob/main/examples/policy/example_test.go)
