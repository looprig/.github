---
id: reference/packages/tools/permission
title: permission package · permission
description: Reference for durable command and filesystem permission rules.
audience: developer
section: reference
order: 167
publication: released
examples:
  - stage-12-gate-rules
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# permission package · permission

Import path: `github.com/looprig/tools/permission`. Permission stores match candidates and diagnostics for a consumer-owned gate rule matcher.

## Package role {#package-role}

`Store` reads and writes normalized rules under a caller-selected configuration. It supplies match helpers for exact command, family, workspace tree, host access, broad egress, and network target. It does not decide the final gate resolution.

## Exported surface {#exported-surface}

The public surface includes `Config`, `Store`, `Rule`, `Diagnostic`, `DiagnosticCode`, `Effect`, `FamilyEligibility`, `FileError`, `FileErrorReason`, `RuleError`, and constructors `NewReadOnlyStore` and `NewWorkspaceStore`. Helpers include `TreeMatch`, `HostAccessMatch`, `BroadEgressMatch`, `NetworkTargetMatch`, and `ProposeCommandCandidate`.

### Functions and methods {#functions-and-methods}

Store methods load, match, propose, and persist rules; constructors return diagnostics for recoverable file conditions.

### Types {#types}

`RuleError` and `FileError` preserve validation and persistence reasons. A diagnostic can explain a rule but does not grant authority by itself.

### Constants and variables {#constants-and-variables}

Schema and normalization versions, maximum file bytes, and diagnostic codes are stable persistence labels.

## Ownership and errors {#ownership-and-errors}

The consumer owns the rule path, store lifetime, and integration with Harness `RuleMatcher` and `RuleWriter`. Treat malformed or stale rules as errors and preserve deny precedence.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned permission package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/permission/). Gate and classifier examples prove that rule evidence and recommendations remain below the trusted decision.
