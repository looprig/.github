---
id: modules/sandbox
title: OS-level command confinement
description: Turn an explicit access profile into the strongest confinement a supported host can prove.
audience: developer
section: modules
order: 8
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  profile:
    - release-github-com-looprig-sandbox
  execution:
    - release-github-com-looprig-sandbox
  platform-limits:
    - release-github-com-looprig-sandbox
  runnable-proof:
    - release-github-com-looprig-sandbox
---

# OS-level command confinement

Sandbox `v0.8.1` enforces access after a caller has chosen authority. Install `github.com/looprig/sandbox@v0.8.1`; it does not import a permission gate or read a policy file.

## Profile {#profile}

Call `sandbox.Init` as the first line of `main`. On Linux it handles the re-exec dispatch used by the confinement helper; on other supported platforms it is a no-op, but calling it unconditionally keeps the application wiring portable. `NewProfile` validates and owns a normalized copy of `ProfileConfig`. The profile names workspace, host, command, home, network, isolation, and additional roots. `Restrict` intersects two profiles component by component.

The profile is a request, not a promise. A `CompileReport` and `Guarantees` value report what the selected backend actually enforced, narrowed, or could not provide. Do not claim a write or network boundary merely because the request asked for one.

## Execution {#execution}

`NewExecutorSet` creates a bounded owner-only child under an explicit scratch root. It can select an egress route, grant TTL, maximum executor count, and Windows mode. An Executor compiles policy once. A prepared process is single-use: the authority decision and target are bound before spawn, then the process reports output, exit, activity, and lifetime containment through its typed result. Close the set and running processes at shutdown.

## Platform limits {#platform-limits}

macOS uses Seatbelt for access confinement and reports best-effort teardown for some supervised process trees. Linux combines namespaces, Landlock, seccomp, and nftables where available. Windows has restricted-token and installed-broker tiers, and elevated mode remains unavailable until setup inspection proves the required live evidence. Unsupported or unavailable production backends return `ErrSandboxUnavailable` rather than running a requested Sandboxed profile without its authority.

Sandbox is not tenancy, approval, or a credential store. Keep gate decisions and profile enforcement as separate steps, and pass only the grants needed for the one spawn.

## Runnable proof {#runnable-proof}

`stage-11-sandbox-process` calls `Init`, builds a profile with denied network and host writes, runs `echo confined`, and asserts both exit code zero and a non-none enforcement level. Run it with `node scripts/docs/run-examples.mjs`. Native sandbox tests cover profile normalization, grants, network targets, process lifecycle, and platform builds.
