---
id: build/11-sandbox
title: Build 11: sandboxed effects
description: Put OS-enforced confinement behind an approved tool call and report the guarantees the platform actually achieved.
audience: developer
section: build
order: 11
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  boundary:
    - release-github-com-looprig-sandbox
  preparation-and-enforcement:
    - release-github-com-looprig-sandbox
  lifecycle:
    - release-github-com-looprig-sandbox
  errors-and-limits:
    - release-github-com-looprig-sandbox
  runnable-proof:
    - release-github-com-looprig-sandbox
---

# Build 11: sandboxed effects

Use Sandbox after the application has decided that an effect may run. A gate answers whether a prepared request is eligible; Sandbox answers what the process can touch once it starts. Keeping those decisions separate makes a successful gate insufficient to accidentally become unrestricted host access.

## Boundary {#boundary}

`sandbox.Profile` is an immutable, normalized description of workspace, host, network, command, home, and isolation authority. `sandbox.NewProfile` validates and canonicalizes a `ProfileConfig`; `sandbox.Restrict` intersects a profile with a ceiling. `sandbox.NewExecutorSet` owns per-key executors and grant keys, while an `Executor` runs a command under the compiled profile.

The module does not import Harness or a permission-file format. Its structural grant seam accepts the exact command, working directory, execution identity, and profile fingerprint. A grant that does not match those values fails before the process is created.

## Preparation and enforcement {#preparation-and-enforcement}

Preparation belongs to the tool and gate path. A tool decodes untrusted arguments, produces normalized requirements, and receives a gate resolution. Only after that resolution can the composition root mint a Sandbox grant and call `RunCommand` or prepare a `PreparedProcess`. Sandbox enforcement is the OS boundary, not a second policy evaluator.

`Access` values are `Deny`, `Gated`, and `Allow`; they are requests, not promises. The backend reports achieved `Level` and `Guarantees` separately. A platform can narrow a request or report a degraded guarantee, and callers must inspect the report rather than infer security from the requested profile.

## Lifecycle {#lifecycle}

Call `sandbox.Init()` as the first line of `main`. On Linux it dispatches the re-exec helper; on other platforms it is a no-op that preserves portable wiring. Create an executor set with an owner-controlled scratch root, reuse executors for the intended key, close the set after all processes and proxies have drained, and close each asynchronous `Process` after reading its terminal result.

The set owns grant keys and isolated homes. A prepared process is single-use. Supervised process teardown reports whether lifetime containment was enforced or best-effort, which is separate from filesystem and network access confinement.

## Errors and limits {#errors-and-limits}

Use `errors.Is` for `ErrSandboxUnavailable`, `ErrInvalidProfile`, grant mismatch sentinels, executor closure, output limits, and process lifecycle failures. A `Sandboxed` profile fails closed when no production backend is available; `Unconfined` execution requires the explicit acknowledgement in `ProfileConfig`. Darwin access confinement can be real while supervised lifetime containment is reported as best-effort. Unsupported platforms do not silently fall back to an unconfined process.

## Runnable proof {#runnable-proof}

`stage-11-sandbox-process` builds a denied-network, isolated-home profile, creates an executor set, runs `echo confined`, checks a non-empty enforcement level, and prints a zero exit status. Run it with `node scripts/docs/run-examples.mjs`. Read the [pinned profile implementation](https://github.com/looprig/sandbox/tree/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/) and [profile declaration](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/profile.go).
