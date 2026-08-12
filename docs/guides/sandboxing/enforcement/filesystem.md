---
id: guides/sandboxing/enforcement/filesystem
title: Filesystem, HOME, and Environment
description: Understand workspace roots, host access, isolated process directories, path policy, and environment scrubbing.
audience: developer
section: guides
order: 6
publication: released
proofs:
  roots-and-precedence: [release-github-com-looprig-sandbox]
  isolated-home-and-tmpdir: [release-github-com-looprig-sandbox]
  environment-is-a-boundary-too: [release-github-com-looprig-sandbox]
  path-grants-are-identity-bound: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  effective-policy: [release-github-com-looprig-sandbox]
  policy-compilation: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Filesystem, HOME, and Environment

Filesystem authority has separate read and write axes. `WorkspaceRoot` and `AdditionalRoots` name the configured roots. `HostRead` and `HostWrite` describe the rest of the host. The compiler turns those values into effective filesystem entries, runtime baselines, a network policy, an environment policy, and optional limits.

## Roots and precedence

The most specific configured root wins for a path. A workspace descendant uses workspace authority unless a longer additional root covers it. A path outside configured roots uses host authority. `AccessFor("filesystem.read", path)` and `AccessFor("filesystem.write", path)` expose this normalized result before execution.

The backends intentionally differ in how a denial appears. Linux Rung 1's mount view can make an unbound host path invisible after `pivot_root`. Linux Rung 2's Landlock allowlist can deny access without making sibling topology disappear. Windows can project restrictions onto configured roots using native ACL mechanisms. Do not use a successful `os.Stat` in the parent as proof that the child can read a path.

## Isolated HOME and TMPDIR

When `Home: IsolatedHome`, each memoized executor gets a private mode-`0700` home under the ExecutorSet child. The set also creates a private mode-`0700` temporary directory for every executor and sets `HOME` and `TMPDIR` in the child environment. The isolated home and temporary directory are added to the compiled writable projection. `RealHome` points `HOME` at the real user home and does not create the same isolation boundary.

## Environment is a boundary too

Sandboxed execution starts from the policy's baseline environment allowlist, not by inheriting every parent variable. The compiler can set values such as `HOME`, `TMPDIR`, and Linux's resolver hint. Secrets in unrelated parent variables are not made available just because a process was launched from a secret-bearing Harness process. `GuaranteeEnvScrub` reports this property.

```go
package example

import (
	"context"
	"fmt"

	"github.com/looprig/sandbox"
)

func inspectChild(executor *sandbox.Executor, workspace string) error {
	output, code, err := executor.RunArgv(context.Background(), workspace,
		[]string{"sh", "-c", "printf 'home=%s\\ntmp=%s\\n' \"$HOME\" \"$TMPDIR\""})
	if err != nil {
		return err
	}
	fmt.Printf("exit=%d\\n%s", code, output)
	return nil
}
```

## Path grants are identity-bound

A gated exact path is not just a string. Grant issuance can capture a path binding and a native handle. Redemption reacquires and compares identity before compiling the transient policy. A path replacement, symlink shape change, or target drift produces `ErrGrantTargetChanged` rather than widening authority. Exact Landlock file grants also require a safe pre-existing regular file shape.

The [network page](/docs/guides/sandboxing/enforcement/network/) describes the analogous target binding for egress. [Tools permissions](/docs/guides/tools/safety/permissions/) explains how a Tool's candidate requirement becomes a grant request; the sandbox remains the final enforcement layer.

## Source

- [Effective policy compilation](https://github.com/looprig/sandbox/blob/main/internal/policy/effective.go)
- [Compiled filesystem policy](https://github.com/looprig/sandbox/blob/main/internal/policy/compiled_fs.go)

## Proof

- [Effective policy tests](https://github.com/looprig/sandbox/blob/main/internal/policy/effective_test.go)
