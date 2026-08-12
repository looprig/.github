---
id: guides/tools/safety/index
title: Safety, Permissions, and Gates
description: Understand capability requirements, gates, grants, and workspace safety.
audience: developer
section: guides
order: 5
publication: released
proofs:
  requirement-candidate-and-grant: [release-github-com-looprig-tools]
  validate-before-the-gate: [release-github-com-looprig-tools]
  workspace-coordination: [release-github-com-looprig-tools]
  audit-and-error-shape: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Safety, Permissions, and Gates

Tools use a capability request model. Preparation describes the operation the tool intends to perform. A Harness gate combines those requirements with the consumer's access source and returns an allow, deny, or gated outcome. The request is evidence for a decision, not a grant by itself.

## Requirement, Candidate, and Grant

Each `tool.Requirement` has a capability kind such as `command.execute`, `network`, `filesystem.read`, or `filesystem.write`. It also carries the canonical match and a human-facing description. A requirement may offer `tool.RuleCandidate` values for a durable "always allow for this workspace" action.

The distinction matters:

- A candidate is a reusable approval proposal. It does not authorize this call until the permission store accepts it.
- A grant is an execution token issued after the combined gate decision. A command-backed grant identifies the exact command and target the runner must enforce.
- A direct tool such as `Fetch`, `ReadFile`, or `WriteFile` enforces its approved target itself and therefore has an empty grant pair in its direct requirement.
- Bash always requests a command requirement. Its explicit `access` deltas join the same decision, but omitted deltas remain blocked by the runtime access source.

Deny is authoritative. A durable deny rule must never be dropped when an allow candidate is merged. A family command rule is token-aware and does not authorize a compound command merely because its text starts with the same characters.

## Validate Before the Gate

Preparation rejects malformed JSON, empty required fields, unsupported URL schemes, invalid regular expressions, path escapes, invalid process handles, and invalid process options. This keeps bad input out of gate prompts and prevents an execution path from having to reinterpret the request.

For workspace paths, the implementation resolves the canonical target during preparation, then checks that the same resolution still holds at invocation. Final-component symlinks are opened with no-follow behavior. A changed parent symlink or an unapproved resolution fails closed instead of redirecting the effect.

The [Sandboxing and Interfaces](/docs/start/sandbox-and-interfaces/) guide explains the runtime access boundary. Tools supply its request vocabulary. The Harness [gate guide](/docs/guides/harness/gates/) explains how a consumer applies the decision.

## Workspace Coordination

Structured file mutation uses the shared workspace coordinator when one is bound. A write or edit acquires a shared session-mutation permit and a canonical path permit, checks lease health, and then enters its observation critical section. Bash acquires the exclusive whole-workspace permit because a shell command can change paths that structured tools cannot predict. It invalidates the shared observations after the run.

The read, write, and edit tools use optimistic concurrency for contained paths. A complete `ReadFile` records a private hash observation. `WriteFile` refuses an existing target without a current observation or when the on-disk hash changed. `EditFile` reads a current file and refuses stale observations before applying its anchor rule. These checks prevent a model from overwriting unseen external changes.

`WithHostReads` and `WithHostWrites` widen only the explicitly supported absolute-path behavior. They do not make a relative `../` escape valid. Host reads and writes do not populate the workspace observation map. Host writes are not covered by workspace checkpoint or undo, so enabling those options is a composition-root decision. A read-only consumer can omit mutation services and expose only the read definitions it intends to register.

## Audit and Error Shape

Audit summaries are intentionally narrow. File tools include a path but not content, `Fetch` includes method and host but not query, headers, or body, `Bash` includes the command the user is already approving, and process handles remain opaque. Execution failures are safe tool-result strings or stable process error codes.

For the model-facing request and response envelope, connect this page to Inference's [tool requests](/docs/guides/inference/requests/tools/), [tool-use blocks](/docs/guides/inference/content-blocks/tool-use/), and [streaming tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas/).

## Source

- [Bash preparation and access declarations](https://github.com/looprig/tools/blob/main/bash/prepare.go)
- [Canonical workspace mutation definitions](https://github.com/looprig/tools/blob/main/definitions.go)
- [Permission matching](https://github.com/looprig/tools/blob/main/permission/match.go)

## Proof

- [Bash preparation tests](https://github.com/looprig/tools/blob/main/bash/preparecall_test.go)
- [Workspace permit tests](https://github.com/looprig/tools/blob/main/internal/filemutation/workspace_permit_test.go)
- [Host read and write boundary tests](https://github.com/looprig/tools/blob/main/internal/filemutation/hostwrites_test.go)
