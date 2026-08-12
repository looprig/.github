---
id: guides/sandboxing/enforcement/index
title: Enforcement
description: Understand how a profile becomes native filesystem, network, environment, and process enforcement.
audience: developer
section: guides
order: 3
publication: released
proofs:
  how-it-works: [release-github-com-looprig-sandbox]
  start-here: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
---

# Enforcement

The enforcement subtree explains what happens after a validated profile reaches a host backend. Compilation turns the profile into an effective policy, probes the native capability ladder, and reports the achieved level, guarantees, and per-feature compilation outcomes. The runtime subtree then uses that compiled authority for actual commands and processes.

## How it works

The public `sandbox.Profile` carries requested authority. A backend compiles it into a reusable spawn transform and checks that required guarantees are present. The transform may be a re-exec helper, Seatbelt wrapper, restricted token, or backend-owned launch. The executor still owns the child environment, working directory, output, and lifecycle.

```go
package example

import "github.com/looprig/sandbox"

func enforcementFacts(executor *sandbox.Executor) (uint8, sandbox.Guarantees, sandbox.CompileReport) {
	return executor.Level(), executor.Guarantees(), executor.Report()
}
```

## Start here

- [Platform levels and guarantees](/docs/guides/sandboxing/enforcement/platforms/) explains native capability differences.
- [Compilation reports](/docs/guides/sandboxing/enforcement/reports/) explains `Enforced`, `narrowed`, and `unenforced` entries.
- [Filesystem, HOME, and environment](/docs/guides/sandboxing/enforcement/filesystem/) explains root and environment boundaries.
- [Network routes and target grants](/docs/guides/sandboxing/enforcement/network/) explains routes and proxy authorization.
- [Runtime executors](/docs/guides/sandboxing/runtime/) shows how compiled enforcement is owned and consumed.

## Source

- [Public enforcement facade](https://github.com/looprig/sandbox/blob/main/sandbox.go)

## Proof

- [Policy and enforcement fixture](https://github.com/looprig/sandbox/blob/main/examples/policy-enforcement/example_test.go)
