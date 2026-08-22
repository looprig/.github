---
id: guides/sandboxing/runtime/index
title: Runtime
description: Run commands and prepared processes under compiled sandbox authority with explicit lifecycle and error contracts.
audience: developer
section: guides
order: 8
publication: released
proofs:
  how-it-works: [release-github-com-looprig-sandbox]
  start-here: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
---

# Runtime

The runtime subtree is where an owned `Executor` turns compiled policy into work. Synchronous calls collect bounded or unbounded output. Prepared processes reserve authority before spawning and then expose live pipes, signal, wait, and lifetime-containment behavior.

## How it works

An `ExecutorSet` owns the shared lifecycle. `For(key)` returns a memoized executor with an executor-bound grant key and per-key `HOME` and `TMPDIR`. `RunArgv` and `PrepareProcess` check command access before the native spawn path. `Close` cancels outstanding work and releases the set-owned resources.

```go
package example

import (
	"context"

	"github.com/looprig/sandbox"
)

func run(executor *sandbox.Executor, workspace string) error {
	_, _, err := executor.RunArgv(context.Background(), workspace, []string{"true"})
	return err
}
```

## Start here

- [Executors and ExecutorSets](/docs/guides/sandboxing/runtime/executors) explains ownership and memoization.
- [RunArgv and confinement](/docs/guides/sandboxing/runtime/argv-and-confinement) explains shell and argv choices.
- [Prepared processes and lifetime](/docs/guides/sandboxing/runtime/processes) explains streaming and teardown.
- [Typed errors and recovery](/docs/guides/sandboxing/runtime/errors) explains fail-closed handling.
- [Harness gates and prepared Tools](/docs/guides/sandboxing/integration) explains how approved effects reach this runtime.

## Source

- [Executor and process facade](https://github.com/looprig/sandbox/blob/main/sandbox.go)

## Proof

- [Policy and enforcement runtime fixture](https://github.com/looprig/sandbox/blob/main/examples/policy-enforcement/example_test.go)
