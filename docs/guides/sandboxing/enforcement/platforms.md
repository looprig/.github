---
id: guides/sandboxing/enforcement/platforms
title: Platform Levels and Guarantees
description: Read achieved isolation levels and per-property guarantees without making false cross-platform promises.
audience: developer
section: guides
order: 4
publication: released
proofs:
  levels-are-coarse: [release-github-com-looprig-sandbox]
  guarantees-are-independent-bits: [release-github-com-looprig-sandbox]
  native-backends-differ: [release-github-com-looprig-sandbox]
  inspect-before-choosing-a-policy: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  linux-selection: [release-github-com-looprig-sandbox]
  platform-selection: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Platform Levels and Guarantees

Sandboxing has two capability reports. `Executor.Level()` is a coarse achieved tier. `Executor.Guarantees()` and `Executor.GuaranteeBits()` are the per-property facts that matter when a caller needs a specific boundary. Both are observations from compilation, not the values requested in the profile.

## Levels are coarse

| Value | Interpretation |
| --- | --- |
| `LevelNone` | No OS isolation level is claimed. This is the honest level for acknowledged `Unconfined` execution and the zero value. |
| `LevelDegraded` | A backend enforces a sound subset of the requested policy, but one or more features are narrowed or unavailable. |
| `LevelFull` | The selected backend reaches the supported full policy shape for that host and still reports any individual limitations. |

The word “full” is scoped to the backend's policy vocabulary. It does not mean identical primitives on Linux, macOS, and Windows, nor does it override `CompileReport` details.

## Guarantees are independent bits

`Guarantees` expands the bitmask into named booleans:

| Guarantee | What it claims |
| --- | --- |
| `GuaranteeProcessBoundary` (`ProcessBoundary`) | A process boundary is enforced by the backend. |
| `GuaranteeWriteBoundary` (`WriteBoundary`) | Writes are limited to the compiled writable authority. |
| `GuaranteeReadBoundary` (`ReadBoundary`) | Reads and execution are limited on the relevant axes. |
| `GuaranteeEnvScrub` (`EnvScrub`) | The child receives the assembled allowlisted environment rather than the parent environment. |
| `GuaranteeNetworkBoundary` (`NetworkBoundary`) | Egress is restricted by an enforcement mechanism. |
| `GuaranteeAddressNetwork` (`AddressNetwork`) | Address classes such as loopback/private/metadata are enforced, not merely ports. |
| `GuaranteeResourceLimits` (`ResourceLimits`) | The compiled resource limits are attached to an enforcing scope. |
| `GuaranteeTargetNetwork` (`TargetNetwork`) | A route/proxy can enforce the authenticated target set. |

The profile stores `RequiredGuarantees` for restricted axes. Executor construction compares that mask with the backend's achieved bits and fails closed if a required bit is missing. A backend may also report a narrowed feature through its report without a guarantee bit.

## Native backends differ

| Host/backend | Boundary shape | Honest limitation to keep in mind |
| --- | --- | --- |
| Linux Rung 1 | Re-exec plus user, mount, PID, and network namespaces, mount view, nftables, Landlock, Seccomp, and cgroup where available. | Requires `sandbox.Init()` before any other main work. Host probing decides whether Rung 1 is available. |
| Linux Rung 2 | Re-exec, Landlock filesystem rules, Seccomp, TCP-port network rules, and optional cgroup limits. | It is `LevelDegraded`; port rules cannot express address-scoped policy, and DNS-over-TCP is resolver-dependent. |
| macOS | `/usr/bin/sandbox-exec` Seatbelt profiles. | A supervised process may report `LifetimeContainmentBestEffort`; do not infer a kernel process-tree proof from Seatbelt alone. |
| Windows | The selected restricted-token or elevated/broker backend, depending on setup and `WindowsSandboxMode`. | Setup state, host version, runtime baseline, and backend mode affect which guarantees can be claimed. A TTY request can be rejected when a selected backend has no terminal wiring. |
| Other hosts | No production OS backend is selected for `Sandboxed`. | Construction returns `ErrSandboxUnavailable`; acknowledged `Unconfined` remains a separate explicit choice. |

Linux's Rung 2 port boundary is intentionally not described as an address boundary. Linux Rung 1's in-namespace nftables can enforce address predicates. macOS and Windows do not inherit either description just because they also have a `Network` field.

## Inspect before choosing a policy

```go
package example

import (
	"fmt"

	"github.com/looprig/sandbox"
)

func explain(executor *sandbox.Executor) error {
	if executor.Level() == sandbox.LevelNone {
		return fmt.Errorf("no isolation level claimed")
	}
	guarantees := executor.Guarantees()
	fmt.Printf("level=%d read=%t write=%t network=%t limits=%t\\n",
		executor.Level(), guarantees.ReadBoundary, guarantees.WriteBoundary,
		guarantees.NetworkBoundary, guarantees.ResourceLimits)
	for _, entry := range executor.Report().Entries {
		fmt.Printf("%s: %s (%s)\\n", entry.Feature, entry.Status, entry.Detail)
	}
	return nil
}
```

Use this report to decide whether your operation can proceed, not merely to decorate logs. For example, a caller requiring address-scoped egress should require `GuaranteeAddressNetwork` and reject a `LevelDegraded` executor that only has `GuaranteeNetworkBoundary`.

## Source

- [Public level and guarantee aliases](https://github.com/looprig/sandbox/blob/v0.9.1/sandbox.go)
- [Linux backend selection](https://github.com/looprig/sandbox/blob/v0.9.1/internal/linux/select.go)
- [Linux compilation levels and guarantees](https://github.com/looprig/sandbox/blob/v0.9.1/internal/linux/backend.go)

## Proof

- [Linux Rung and Init selection tests](https://github.com/looprig/sandbox/blob/v0.9.1/internal/platform/platform_linux_test.go)
