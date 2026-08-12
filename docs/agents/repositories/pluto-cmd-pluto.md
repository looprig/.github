---
id: agents/repositories/pluto-cmd-pluto
title: Pluto command module
description: Build the Pluto CLI from its nested command module and keep its release boundary separate.
audience: agent
section: agents/repositories
order: 17
publication: released
proofs:
  module:
    - release-github-com-looprig-pluto-cmd-pluto
---
# pluto/cmd/pluto

`pluto/cmd/pluto` is the nested command module released as `cmd/pluto/v0.1.2`. It imports the root Pluto packages and owns the executable entry point, command schema, run, compare, generation, and validation behavior. Consumers needing the library use the root `github.com/looprig/pluto` module; consumers building the binary use this nested module and its own tag.

The command reads explicit manifests, packs, profiles, and target configuration. Treat nonzero command errors, invalid input, preflight failures, and report encoding errors as boundary failures. Proofs: [`main.go`](https://github.com/looprig/pluto/blob/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto/main.go), [`counter.go`](https://github.com/looprig/pluto/blob/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto/counter.go), [`counter_test.go`](https://github.com/looprig/pluto/blob/8ffaa725ece6b937e4852b23bbb3fa57a1e5dd03/cmd/pluto/counter_test.go).
