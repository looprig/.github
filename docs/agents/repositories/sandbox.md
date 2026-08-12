---
id: agents/repositories/sandbox
title: Process and network sandbox
description: Define workspace, host, network, and process restrictions before binding tools.
audience: agent
section: agents/repositories
order: 19
publication: released
proofs:
  module:
    - release-github-com-looprig-sandbox
---
# sandbox

`github.com/looprig/sandbox@v0.8.1` provides platform-specific enforcement behind a small profile and executor API. Build a `sandbox.ProfileConfig`, call `sandbox.NewProfile`, then create an `sandbox.ExecutorSet` with `sandbox.NewExecutorSet(profile, options...)`. Choose scratch root, executor count, grant TTL, egress route, and platform mode explicitly.

A profile is immutable after validation. The executor is the capability passed to a command tool; selecting a profile alone does not run a process or grant a tool. Use `NewDirectEgressRoute` or `NewUpstreamEgressRoute` only when the network policy calls for it. Unconfined host execution requires the profile's explicit acknowledgement field.

Invalid roots, policy combinations, network routes, grants, platform support, process startup, timeout, denial, and cleanup errors fail closed. Proofs: [`sandbox.go`](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/sandbox.go), [`pkg/profile/profile.go`](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/profile.go), [`pkg/sandboxtest/sandboxtest.go`](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/sandboxtest.go).
