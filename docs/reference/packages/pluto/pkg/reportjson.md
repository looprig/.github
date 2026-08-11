---
id: reference/packages/pluto/pkg/reportjson
title: Pluto report JSON package
description: Strict, size-capped, versioned JSON encoding for redacted Pluto scorecard reports.
audience: developer
section: reference
order: 265
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/reportjson`

Qualification report wire package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson).

## Package role {#package-role}

The package persists a redacted scorecard/result artifact with an explicit version. It is not a session event stream, checkpoint, or source model context.

## Exported surface {#exported-surface}

`Version` is `pluto-report/v1`; `MaxReportBytes` is 64 MiB. `Encode(card, result)` and `Decode(data)` cross the wire boundary. `Decoded` and `DecodedTable` expose decoded artifacts. `EncodeError`, `InvalidReportError`, `MalformedReportError`, `ReportTooLargeError`, and `UnknownVersionError` classify failures.

## Lifecycle and errors {#lifecycle-and-errors}

Decode checks size, UTF-8, exactly one JSON value, version, and domain validity. Skipped tables are retained. `Decode` never returns an unvalidated partial report. Callers should keep the encoded artifact under their own bounded sink and preserve the typed decode errors.

## Source proof {#source-proof}

See the pinned [report JSON implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson).
