---
id: guides/sandboxing/profiles/index
title: Profiles and Access Dimensions
description: Define filesystem, network, command, home, and isolation authority in an immutable sandbox Profile.
audience: developer
section: guides
order: 1
publication: released
proofs:
  the-dimensions: [release-github-com-looprig-sandbox]
  construct-a-profile: [release-github-com-looprig-sandbox]
  unconfined-is-explicit: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  profile-construction: [release-github-com-looprig-sandbox]
  validation: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Profiles and Access Dimensions

`sandbox.Profile` is the normalized authority description. Construct it with `sandbox.NewProfile(ProfileConfig)`, not by trying to fill internal fields. Construction canonicalizes roots, rejects contradictory additional roots, validates every enum, derives required guarantees, and computes a deterministic fingerprint. The returned profile is immutable.

## The dimensions

| Field | Values | Meaning |
| --- | --- | --- |
| `WorkspaceRead`, `WorkspaceWrite` | `Deny`, `Gated`, `Allow` | Authority under `WorkspaceRoot`. Read and write are independent axes. |
| `HostRead`, `HostWrite` | `Deny`, `Gated`, `Allow` | The rest of the host filesystem, subject to platform compilation. |
| `Network` | `Deny`, `Gated`, `Allow` | Egress authority. Target-scoped grants can narrow a gated request. |
| `Command` | `Deny`, `Gated`, `Allow` | Whether command admission is refused, requires a grant, or can proceed. |
| `AdditionalRoots` | `[]RootAccess` | Extra canonical roots with their own read/write pair. |
| `Home` | `IsolatedHome`, `RealHome` | The child `HOME`. Isolated homes are owned below the ExecutorSet scratch child. |
| `Isolation` | `Sandboxed`, `Unconfined` | Whether the OS boundary is required. `Unconfined` needs an explicit acknowledgement. |

The access enum is deliberately ordered as `Deny < Gated < Allow`. That ordering is used by [restriction](/docs/guides/sandboxing/profiles/restriction/) to take the narrower value. It is not a claim that `Gated` itself is an operating-system restriction. It is an application admission state.

## Construct a profile

```go
package example

import (
	"fmt"

	"github.com/looprig/sandbox"
)

func profileFor(workspace, cache string) (*sandbox.Profile, error) {
	profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
		WorkspaceRoot:  workspace,
		WorkspaceRead:  sandbox.Allow,
		WorkspaceWrite: sandbox.Gated,
		HostRead:       sandbox.Deny,
		HostWrite:      sandbox.Deny,
		Network:        sandbox.Gated,
		Command:        sandbox.Gated,
		Home:           sandbox.IsolatedHome,
		Isolation:      sandbox.Sandboxed,
		AdditionalRoots: []sandbox.RootAccess{
			{Path: cache, Read: sandbox.Allow, Write: sandbox.Deny},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("profile: %w", err)
	}

	read, err := profile.AccessFor("filesystem.read", workspace)
	if err != nil {
		return nil, err
	}
	fmt.Println("workspace read authority", read == uint8(sandbox.Allow))
	return profile, nil
}
```

`AccessFor` accepts the stable access vocabulary `command.execute`, `network`, `filesystem.read`, and `filesystem.write`. Filesystem scopes are absolute paths, `tree:<configured-root>` for a configured recursive root, or `host:*` for the host axis. A tree scope that is not a configured root returns `Deny`; malformed scopes return `ErrInvalidProfile`.

## Unconfined is explicit

An `Unconfined` profile is not a fallback when a host lacks a backend. It requires `AckUnconfined: true`, `Allow` on filesystem and network axes, and `Allow` for every additional root. The null backend is selected only for that acknowledged shape. A `Sandboxed` profile remains a required OS boundary and fails with `ErrSandboxUnavailable` or another typed setup error if the host cannot compile it.

The `Home` choice is independent from the authority axes. `RealHome` gives the child the real user home, while `IsolatedHome` gives each Executor key a separate directory and adds it to the compiled writable policy. See [filesystem and environment](/docs/guides/sandboxing/enforcement/filesystem/) for the practical implications.

## Source

- [ProfileConfig, enum values, validation, and AccessFor](https://github.com/looprig/sandbox/blob/main/pkg/profile/profile.go)
- [Public profile aliases](https://github.com/looprig/sandbox/blob/main/sandbox.go)

## Proof

- [Profile construction and validation tests](https://github.com/looprig/sandbox/blob/main/pkg/profile/profile_test.go)
