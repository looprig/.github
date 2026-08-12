---
id: agents/composition/gates-sandbox
title: Gate effects and sandbox execution
description: Wire capability requests through classification, approval, grants, and OS enforcement.
audience: agent
section: agents/composition
order: 3
publication: released
proofs:
  gate:
    - release-github-com-looprig-harness
  sandbox:
    - release-github-com-looprig-sandbox
  classifiers:
    - release-github-com-looprig-classifiers
---
# Gates and sandbox

Use one path for effectful calls: tool `PrepareCall` -> `gate.Evaluator.Evaluate` or `Authorize` -> `Resolve` -> sandbox grant -> executor. Build a profile with `sandbox.NewProfile(sandbox.ProfileConfig{WorkspaceRoot, WorkspaceRead, WorkspaceWrite, Command, Network, ...})`, then `sandbox.NewExecutorSet(profile, sandbox.WithMaxExecutors(n))` and `set.For(key)`. Pass that executor to command tools and to the gate's `GrantIssuer`.

Use `gate.NewInteractiveEvaluator(bindings, matcher, approver, writer, issuer)` when a person or session host can answer. Use `gate.NewHeadlessEvaluator(bindings, matcher, issuer)` for a non-interactive process; unmet capability returns a typed denial. `gate.AccessBinding` maps capability kind and scope to the profile or another `AccessSource`. `classifiers/pkg/commandsafety` can provide deterministic command classification before the gate.

The profile is normalized, immutable, fingerprinted, and restrictable. A restricted child profile cannot exceed its ceiling. The gate checks access denials before stored rules, checks every deny before any allow, and mints grants only after approval and rule persistence succeed. The executor enforces the profile at the OS boundary. Never treat a prompt as OS enforcement.

Failures: `sandbox.ErrInvalidProfile`, executor closed or limit errors, grant/profile mismatch, access routing errors, malformed permission payloads, and gate evaluation or resolution errors. Fail closed when a matcher, writer, issuer, or platform guarantee is missing.

Proofs: [`harness/pkg/gate/evaluator.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evaluator.go), [`sandbox/pkg/profile/profile.go`](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/profile.go), [`classifiers/pkg/commandsafety`](https://github.com/looprig/classifiers/tree/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety).
