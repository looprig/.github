---
id: guides/sandboxing/enforcement/reports
title: Compilation Reports
description: Use CompileReport entries to distinguish enforced, narrowed, and unavailable policy features.
audience: developer
section: guides
order: 5
publication: released
proofs:
  read-the-report-as-a-contract: [release-github-com-looprig-sandbox]
  compile-once-inspect-once: [release-github-com-looprig-sandbox]
  compile-reports-and-grants: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  report-shape: [release-github-com-looprig-sandbox]
  report-fixture: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Compilation Reports

The backend compiles a policy into a reusable spawn specification. The result carries a `sandbox.CompileReport` alongside the level and guarantee bits. Each `ReportEntry` has a `Feature`, `Status`, and `Detail`. The report is the explanation for why a feature was enforced, narrowed, or left unenforced.

## Read the report as a contract

| Status | Meaning | Caller response |
| --- | --- | --- |
| `Enforced` | The backend installed an enforcement mechanism for this feature. | The corresponding guarantee may be usable, subject to the feature's exact scope. |
| `narrowed` or `Narrowed` | The backend made a sound, narrower approximation. | Read `Detail`; decide whether the narrower behavior is acceptable. |
| `unenforced` | The requested feature is not enforced by this backend. | Do not claim the requested boundary. Require another backend/profile or stop. |

The status strings are backend report vocabulary rather than a new exported enum. Some native reports also use `widened` or `vacuous` to disclose a platform baseline or an axis with no applicable request. Treat those entries as a reason to read `Detail`, never as permission to widen the caller's policy. A report entry is not itself an admission grant. It describes the compiled executor after the profile and platform checks have run.

## Compile once, inspect once

```go
package example

import (
	"fmt"
	"strings"

	"github.com/looprig/sandbox"
)

func requireNetwork(executor *sandbox.Executor) error {
	for _, entry := range executor.Report().Entries {
		if entry.Feature == "address-network" &&
			strings.EqualFold(entry.Status, "unenforced") {
			return fmt.Errorf("address network is unavailable: %s", entry.Detail)
		}
	}
	if !executor.Guarantees().NetworkBoundary {
		return fmt.Errorf("network boundary was not achieved")
	}
	return nil
}
```

The profile's required mask catches mandatory missing bits during executor construction. The report remains useful for optional features and for diagnostics. A caller that wants to log the report should preserve the detail, because “narrowed” can mean materially different things: Linux Rung 2 can enforce TCP ports while leaving address scoping unenforced; DNS may be forced over TCP only for resolvers that honor `RES_OPTIONS=use-vc`.

## Compile reports and grants

Grant issuance and redemption bind tokens to the profile fingerprint and achieved guarantee bits. If a profile or route changes, the old token cannot be reused as if it were a grant for the new compiled authority. A target-scoped grant can also require `GuaranteeTargetNetwork` and `GuaranteeNetworkBoundary`; otherwise the executor refuses it with `ErrGrantGuaranteeMismatch` or `ErrGrantUnsupported`.

## Source

- [CompileReport and Guarantees definitions](https://github.com/looprig/sandbox/blob/v0.9.1/pkg/profile/report.go)
- [Executor report accessors](https://github.com/looprig/sandbox/blob/v0.9.1/internal/exec/executor.go)

## Proof

- [Policy and report fixture](https://github.com/looprig/sandbox/blob/v0.9.1/examples/policy-enforcement/example_test.go)
