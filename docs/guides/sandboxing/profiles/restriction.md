---
id: guides/sandboxing/profiles/restriction
title: Restriction and Least Authority
description: Intersect a base profile with a ceiling without accidentally widening any authority dimension.
audience: developer
section: guides
order: 2
publication: released
proofs:
  what-intersection-means: [release-github-com-looprig-sandbox]
  restrict-at-the-operation-boundary: [release-github-com-looprig-sandbox]
  restrictions-are-not-grants: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  intersection: [release-github-com-looprig-sandbox]
  invalid-inputs: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Restriction and Least Authority

`sandbox.Restrict(base, ceiling)` returns the component-wise intersection of two validated profiles. It is the useful handoff between a broad application policy and a narrower operation policy. If either profile is invalid, or their canonical workspace roots differ, restriction fails instead of guessing.

## What intersection means

For scalar access values, the smaller enum wins. The same minimum operation applies to `Home` and `Isolation`, so `IsolatedHome` and `Sandboxed` survive whenever either side requires them. Additional roots are considered by canonical path. A root present on only one side is compared with the other profile's host authority, then retained only when its resulting access differs from that host default.

| Base | Ceiling | Result |
| --- | --- | --- |
| `Allow` | `Allow` | `Allow` |
| `Allow` | `Gated` | `Gated` |
| `Gated` | `Deny` | `Deny` |
| `RealHome` | `IsolatedHome` | `IsolatedHome` |
| `Unconfined` | `Sandboxed` | `Sandboxed` |

The result is a new validated profile with its own fingerprint. Do not mutate or reuse `ProfileConfig.AdditionalRoots` as if it were live profile state. `NewProfile` owns a normalized copy, and `Settings` returns another defensive copy.

## Restrict at the operation boundary

```go
package example

import (
	"fmt"

	"github.com/looprig/sandbox"
)

func operationProfile(base, workspace string) (*sandbox.Profile, error) {
	ceiling, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot:  workspace,
		WorkspaceRead:  sandbox.Allow,
		WorkspaceWrite: sandbox.Deny,
		HostRead:       sandbox.Deny,
		HostWrite:      sandbox.Deny,
		Network:        sandbox.Deny,
		Command:        sandbox.Gated,
		Home:           sandbox.IsolatedHome,
		Isolation:      sandbox.Sandboxed,
	})
	if err != nil {
		return nil, err
	}
	restricted, err := sandbox.Restrict(base, ceiling)
	if err != nil {
		return nil, fmt.Errorf("restrict operation: %w", err)
	}
	return restricted, nil
}
```

This pattern keeps a ceiling in the caller that knows the operation. A Tool can derive a request-specific ceiling from its prepared target, then the Harness gate can decide whether to issue a grant. The sandbox still checks the final grant binding against the profile fingerprint, route fingerprint, command, execution ID, and canonical working directory. See [Harness gates and prepared Tools](/docs/guides/sandboxing/integration) and [Tools safety and gates](/docs/guides/tools/safety) for the division of responsibility.

## Restrictions are not grants

Restriction answers, “What may this executor ever be allowed to do?” A grant answers, “May this one execution use this narrow gated capability now?” A restricted profile with `Command: Gated` still refuses `RunArgv` without a command grant. Conversely, a command grant cannot widen a `Deny` axis or change the profile fingerprint embedded in the token.

## Source

- [Restrict implementation and profile fingerprinting](https://github.com/looprig/sandbox/blob/v0.9.1/pkg/profile/profile.go)

## Proof

- [Restriction and fingerprint tests](https://github.com/looprig/sandbox/blob/v0.9.1/pkg/profile/profile_test.go)
