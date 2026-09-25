---
id: guides/sandboxing/runtime/executors
title: Executors and Executor Sets
description: Own compiled policy state, memoize keyed executors, apply limits, and close every sandbox resource.
audience: developer
section: guides
order: 9
publication: released
proofs:
  create-the-owner: [release-github-com-looprig-sandbox]
  ownership-and-memoization: [release-github-com-looprig-sandbox]
  close-is-a-lifecycle-barrier: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  set-lifecycle: [release-github-com-looprig-sandbox]
  set-ownership: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Executors and Executor Sets

`ExecutorSet` is the owner. It selects a backend once, creates a caller-owned scratch child, memoizes one `Executor` per key, and coordinates close with every active or prepared process. An `Executor` holds the compiled policy, environment, grant key, route state, and platform report needed for each spawn.

## Create the owner

```go
package example

import (
	"context"
	"fmt"
	"time"

	"github.com/looprig/sandbox"
)

func runForKey(profile *sandbox.Profile, workspace, scratch string) error {
	set, err := sandbox.NewExecutorSet(profile,
		sandbox.WithScratchRoot(scratch),
		sandbox.WithMaxExecutors(8),
		sandbox.WithGrantTTL(15*time.Minute),
	)
	if err != nil {
		return err
	}
	defer set.Close()

	first, err := set.For("agent-a")
	if err != nil {
		return err
	}
	second, err := set.For("agent-a")
	if err != nil {
		return err
	}
	if first != second {
		return fmt.Errorf("ExecutorSet.For did not memoize the key")
	}
	_, _, err = first.RunArgv(context.Background(), workspace, []string{"printf", "ready\\n"})
	return err
}
```

The key is trimmed-sensitive and cannot contain a NUL. A repeated key returns the same pointer, which means the same grant key and isolated `HOME`/`TMPDIR`. Use a distinct key when the authority identity should be distinct. `WithMaxExecutors` is a hard count of memoized identities, not a worker-pool size. Once the count is reached, `For` returns `ErrExecutorLimit`.

## Ownership and memoization

For each key, the set creates an isolated `HOME` unless the profile explicitly requests `RealHome`, and always creates a private `TMPDIR` under the set-owned child. The directories are mode `0700`. With an egress route, the set can share one authenticated loopback proxy across its executors while keeping execution authorizations distinct.

`WithGrantTTL` caps the expiry of grants minted by every executor. The default is 15 minutes. An explicitly supplied non-positive duration is invalid. `WithEgressRoute` installs the route used by target-scoped grants. Windows options select the requested sandbox mode or state root, but Windows setup can still reject construction when the host is not ready.

## Close is a lifecycle barrier

`ExecutorSet.Close` is idempotent. The first close:

- stops new `For`, prepare, and start admissions;
- cancels the shared lifecycle context;
- closes abandoned `PreparedProcess` handles;
- waits for active processes and cleanup barriers;
- releases compiled backend specs, grants, path handles, proxies, and Windows runtime state; and
- removes only the set-owned scratch child.

After close, `For` returns `ErrExecutorSetClosed` and an executor run returns `ErrExecutorClosed`. A close can return cleanup errors. Callers should retain and report that error rather than assuming the owner was fully cleaned up.

## Source

- [ExecutorSet construction, For, and Close](https://github.com/looprig/sandbox/blob/v0.9.1/internal/exec/executor_set.go)
- [Public ExecutorSet options](https://github.com/looprig/sandbox/blob/v0.9.1/sandbox.go)

## Proof

- [ExecutorSet lifecycle and limit tests](https://github.com/looprig/sandbox/blob/v0.9.1/internal/exec/executor_set_test.go)
