---
id: agents/repositories/foreignloops
title: Foreign loop drivers
description: Adapt external agent processes and ACP peers to Harness loop and restore contracts.
audience: agent
section: agents/repositories
order: 9
publication: released
proofs:
  module:
    - release-github-com-looprig-foreignloops
---
# foreignloops

`github.com/looprig/foreignloops@v0.2.3` provides `backend`, `driver`, `driver/acp`, `driver/claude`, and `driver/codex`. A backend owns the foreign loop lifecycle, turn mapping, steering, snapshots, and restore state. A driver supplies process or protocol-specific construction and transcript decoding.

Use the ACP driver when the peer speaks ACP. Use the Claude or Codex driver when launching those command-line processes. Keep the driver configuration explicit, pass workspace and environment through the supplied config, and retain the returned loop handle until close. Restored loops require the matching snapshot and driver state.

Invalid command configuration, unsupported platform, process exit, decode mismatch, steering deadline, lock conflict, and restore incompatibility are tested failure paths. Proofs: [`backend/loop.go`](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/loop.go), [`driver/acp/driver.go`](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/driver.go), [`driver/claude/claude.go`](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude.go), [`backend/restore_seed_test.go`](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/restore_seed_test.go).
