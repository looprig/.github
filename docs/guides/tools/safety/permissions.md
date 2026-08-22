---
id: guides/tools/safety/permissions
title: Permission Rules and Stores
description: Persist exact capability approvals with the Tools permission package.
audience: developer
section: guides
order: 6
publication: released
proofs:
  schema-and-rule-shape: [release-github-com-looprig-tools]
  interactive-and-headless-stores: [release-github-com-looprig-tools]
  matching-and-candidates: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Permission Rules and Stores

`github.com/looprig/tools/permission` owns the durable rule model and its hardened file store. It does not parse tool arguments and it does not choose Deny, Gated, or Allow. Harness consumes the store as a rule matcher and writer, then applies deny-before-allow precedence.

## Schema and Rule Shape

The only supported file schema is version 2 with normalization version 1: `SchemaVersion == 2` and `NormalizationVersion == 1`. A `permission.Rule` has an effect, capability, enforcement class, and exactly the fields that class permits. The strict JSON codec rejects unknown fields and rejects a match object that carries fields from another class. The exported effects are `EffectAllow` and `EffectDeny`.

The supported capability families and enforcement classes are:

- `command.execute`: `command.invoke.v1`, wildcard, or token-prefix family rules;
- `network`: `network.target.v1` or command-bound broad egress rules;
- `filesystem.read`: `filesystem.path.read.v1`, `filesystem.tree.read.v1`, or command-bound host-read rules; and
- `filesystem.write`: `filesystem.path.write.v1`, `filesystem.tree.write.v1`, or command-bound host-write rules.

The canonical match helpers are `NetworkTargetMatch`, `BroadEgressMatch`, `HostAccessMatch`, and `TreeMatch`. A tree rule matches a canonical path at or below its root. A target rule compares normalized transport, host, and port constraints. A command family is parsed into literal tokens and checked per shell segment, so `Bash(git log:*)` cannot cover `git log; rm -rf output`.

```go
// The candidate records the exact command and the grant class that the
// Harness gate will use if this reusable approval is selected.
candidate := tool.RuleCandidate{
	Kind:        permission.CapabilityCommandExecute,
	Match:       "go test ./...",
	GrantClass:  permission.GrantClassCommandStart,
	GrantTarget: "go test ./...",
	Description: "run the repository tests",
}
if err := store.WriteRules(context.Background(), []tool.RuleCandidate{candidate}); err != nil {
	panic(err)
}
```

The full executable fixture is [the exact permission example](https://github.com/looprig/tools/blob/main/examples/permissions/example_test.go). It proves that an exact command rule allows `go test ./...` but does not allow `go test ./private/...`.

## Interactive and Headless Stores

`NewWorkspaceStore(permission.Config{Path: absolutePath})` creates an interactive read/write store. A missing file means an empty rule set. Queries reload the explicit path, so atomic updates from another process become visible without a watcher. `WriteRules` validates the entire candidate batch, acquires the sibling interprocess lock, merges without dropping foreign rules or denies, writes an owner-only temporary file, syncs, atomically renames, and syncs the directory. Any failure leaves the previous complete file in place.

`NewReadOnlyStore` creates a headless snapshot. A configured file must exist, be regular, owner-only with mode `0o600`, owned by the expected user, single-linked, within the size limit, and free of final-component symlink traversal. An empty path gives an empty rule set. Every write against a read-only store fails with a typed `FileError`.

The store uses an explicit absolute path. It never discovers `HOME` or another implicit location. The default file bound is 1 MiB. Non-fatal diagnostics report an allow family that is outside the injected automatic eligibility catalog, but diagnostics do not change matching.

## Matching and Candidates

`MatchesDeny` and `MatchesAllow` answer one requirement independently. A load failure is an error and therefore fails the caller closed. For command requirements, allow coverage requires every shell segment to be covered, while a deny rule matching any segment rejects the command. Deny-before-allow is the gate's precedence rule. The store persists structured records, not raw `Bash(...)` prefixes.

The store refuses ambiguous candidate syntax. It will not persist a literal command that collides with the `Bash(...)` display namespace as a wildcard or family rule, and it refuses a bare wildcard candidate. This keeps an exact approval from becoming a broad command approval after reload.

Pair this page with [Safety, Permissions, and Gates](/docs/guides/tools/safety) and the separate [Sandboxing and Interfaces](/docs/start/sandbox-and-interfaces) guide. A permission rule is the durable approval record; the sandbox grant remains the runtime enforcement boundary.

## Source

- [Rule model and canonical match encodings](https://github.com/looprig/tools/blob/main/permission/rule.go)
- [Hardened Store](https://github.com/looprig/tools/blob/main/permission/store.go)
- [Strict JSON codec](https://github.com/looprig/tools/blob/main/permission/rule_json.go)

## Proof

- [Permission store tests](https://github.com/looprig/tools/blob/main/permission/store_test.go)
- [Permission contract tests](https://github.com/looprig/tools/blob/main/permission/contract_test.go)
- [Executable permission fixture](https://github.com/looprig/tools/blob/main/examples/permissions/example_test.go)
