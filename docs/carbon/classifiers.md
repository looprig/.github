---
id: carbon/classifiers
title: Permission classifiers and review in Carbon
description: Decide when Carbon's command-safety classifier can recommend an approval and when a human must answer the gate.
audience: [operator, developer]
section: carbon
order: 9
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  review-tests:
    - release-github-com-looprig-carbon
  enablement-rules:
    - release-github-com-looprig-carbon
  what-a-review-means:
    - release-github-com-looprig-carbon
  relationship-to-command-families:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Permission classifiers and review in Carbon

Carbon's ordinary access gate is the authority boundary. A permission
classifier is an optional review signal inside that boundary. It can inspect a
command and the required read-only evidence, classify its risk and
authorization, and recommend an automatic approval or a human review. It
cannot turn a denied capability into an allowed one.

## Enablement rules

Permission review is off by default. A `permission_review` model must be
configured and must support tools and structured output with tools. Carbon only
activates the registration when the session uses `trusted`. On `readonly` and
`unconfined`, the registration is disabled even if the configuration requests
it. This keeps the feature from becoming an implicit write path in a restrictive
session and avoids presenting a classifier as a substitute for a sandbox.

The classifier uses Carbon's command-safety definition and its standard
read-only evidence tools. The default local policy permits automatic approval
only within its configured risk and authorization floors. The `strict` option
lowers the maximum automatically approved risk to low and raises the minimum
authorization floor for every tier. A medium- or high-risk decision therefore
stays human-answerable under strict mode.

## What a review means

When the classifier can safely support a decision, Carbon still rechecks the
evidence and containment at the approval boundary. The evidence tools use the
same selected security ceiling as the session. If the classifier returns
needs-human, times out, or cannot establish the required evidence, the gate
remains open for a human rather than resolving to allow.

This is a review posture, not a promise that a model understands every command.
Keep the human gate enabled for unfamiliar commands and use `readonly` while
exploring. The classifier's policy revision and evidence requirements are part
of the Carbon composition, so changing them is a configuration change for
restore purposes.

## Relationship to command families

Carbon has a separate interactive approval memory for a narrow set of safe
read-only Git command families: `git log`, `git status`, `git diff`, `git show`,
and `git push`. The classifier does not expand that family. Similar-looking
commands such as `git commit` and `git logs` are not family-approved by name.
Use the exact command and review the gate prompt.

## Evidence

Registration, policy selection, and the trusted-only rule are in
[`internal/app/permission_review.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/permission_review.go).
Access and approval behavior is tested in
[`internal/app/permission_review_integration_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/permission_review_integration_test.go)
and [`internal/app/access_acceptance_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access_acceptance_test.go).
The persisted command-family rules are implemented in
[`internal/app/permissions.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/permissions.go).
