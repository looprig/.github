---
id: guides/evals/reporting/index
title: Reporting and FileSink
description: Persist canonical redacted reports and understand the report/v1 JSON contract.
audience: developer
section: guides
order: 7
publication: released
proofs:
  atomic-file-writes: [release-github-com-looprig-eval]
  report-v1-is-redacted-by-default: [release-github-com-looprig-eval]
  read-the-redacted-report: [release-github-com-looprig-eval]
  sink-composition: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Reporting and `FileSink`

Reporting is a boundary, not a side effect hidden inside `eval.Run`. The core
package exposes one small seam:

```go
type Sink interface {
	WriteReport(context.Context, eval.Report) error
}
```

`reportjson.FileSink` implements that seam for a local directory. It encodes a
validated report as canonical `report/v1` JSON and writes the final file as
`<report-id>.json`.

## Atomic file writes

`FileSink.WriteReport` follows this sequence inside the caller-provided
directory:

1. Check the context and validate the report ID as one safe path component.
2. Encode the report with the redacted `report/v1` codec.
3. Open a randomly named hidden temporary file with exclusive creation.
4. Write all bytes and call `fsync` on that temporary file.
5. Close it, then rename it over the final `.json` name.
6. Remove the temporary file when any write, close, or rename step fails.

The temporary file is in the same directory as the final file, so the rename is
atomic on the target filesystem. A crash can leave at most an obvious hidden
temporary artifact, not a partially visible final report. `os.Root` scopes the
open and rename to the sink directory. Empty IDs, separators, `.` and `..`, and
path escapes are rejected before a write can reach another location.

```go
func persist(ctx context.Context, report eval.Report, dir string) error {
	sink := reportjson.NewFileSink(dir)
	if err := sink.WriteReport(ctx, report); err != nil {
		var pathErr *reportjson.InvalidReportIDError
		if errors.As(err, &pathErr) {
			return fmt.Errorf("report id cannot be a file name: %w", err)
		}
		return err
	}
	return nil
}
```

The sink is safe for concurrent distinct reports because each write opens its
own root and chooses its own random temporary name. A report with an invalid
identity or failed validation writes no file.

## `report/v1` is redacted by default

The wire form is a versioned envelope. The payload shape is:

| JSON path | Fields | Meaning |
| --- | --- | --- |
| `version` | `"report/v1"` | Version discriminator checked before the payload is trusted. |
| `report.id`, `suite`, `target` | Strings | Report and observed revision identities. |
| `report.started_at`, `ended_at` | RFC 3339 timestamps | Run timing, when supplied. |
| `report.samples[]` | `scenario_id`, `trial_index`, optional `target_error`, `assessments` | One retained sample result. |
| `assessments[]` | `evaluator`, `revision`, `status`, `measurements`, `findings`, `evidence`, `duration_nanos` | Safe evaluator result. |
| `summary` | `samples`, `target_errors`, ordered status counts | Small roll-up that `Report.Validate` recomputes. |
| `provenance` | `suite`, `target`, evaluator name/revision pairs | Reproduction identities. |

`Encode` and `Decode` are canonical and strict. They reject unknown versions,
unknown fields, trailing JSON values, invalid UTF-8, non-finite measurements,
and reports that violate whole-report invariants. Collections are sorted by
stable identity for byte-stable output; summary status counts use a fixed status
order.

The codec is a projection, not an observation round trip:

| Raw report field | Wire behavior |
| --- | --- |
| `Observation.Conversation` | Omitted. Decoding returns a zero observation. |
| `Finding.Message` | Omitted. Finding code, severity, and references remain. |
| `TargetError.Cause` | Omitted. A closed class such as `timeout`, `cancelled`, `invalid_observation`, or `failed` remains. |
| Safe IDs, statuses, finite measurements, evidence classifications, counts, and timestamps | Retained and validated. |

This lets a report travel through storage or a CI artifact without accidentally
turning raw conversation, tool arguments, judge reasons, or provider errors
into a log field. Use a separately controlled trace store when raw interaction
data is required for debugging.

## Read the redacted report

```go
func readReport(ctx context.Context, dir, id string) (eval.Report, error) {
	raw, err := os.ReadFile(filepath.Join(dir, id+".json"))
	if err != nil {
		return eval.Report{}, err
	}
	report, err := reportjson.Decode(raw)
	if err != nil {
		return eval.Report{}, err
	}
	if err := report.Validate(); err != nil {
		return eval.Report{}, err
	}
	return report, nil
}
```

After decoding, inspect safe summary and assessment fields. Do not expect the
conversation to be present, and do not treat an empty `Finding.Message` as a
lost verdict explanation. The finding code and evidence references identify
which safe fact the evaluator used.

## Sink composition

The runner does not know whether a sink writes to disk, a database, or an
observability system. A caller can fan a completed report to multiple sinks:

```go
type multiSink []eval.Sink

func (s multiSink) WriteReport(ctx context.Context, r eval.Report) error {
	for _, sink := range s {
		if err := sink.WriteReport(ctx, r); err != nil {
			return err
		}
	}
	return nil
}
```

Run-level failures and sink-level failures remain different. A cancelled
`eval.Run` returns a partial report with a context error; a sink may still write
that partial report if the caller chooses. A sink error does not rewrite any
assessment status.

The [run contract](/docs/guides/evals/cases-and-runs/runs-and-results) explains how `Summary` and
`Provenance` are produced. The [model judge guide](/docs/guides/evals/evaluators/judge) calls
out why raw judge reasons are not safe wire fields.

## Source

The sink contract is implemented by
[reportjson/sink.go](https://github.com/looprig/eval/blob/v0.2.2/reportjson/sink.go),
and the redacted codec is in
[reportjson/codec.go](https://github.com/looprig/eval/blob/v0.2.2/reportjson/codec.go).

## Proof

The sink sequence and path boundary are implemented in
[reportjson/sink.go](https://github.com/looprig/eval/blob/v0.2.2/reportjson/sink.go).
The envelope, redaction projection, canonical ordering, strict decoder, and
target-error classes are implemented in
[reportjson/codec.go](https://github.com/looprig/eval/blob/v0.2.2/reportjson/codec.go).
Atomicity, redaction, canonical round trips, path rejection, and no-write-on-invalid
tests are in
[reportjson/codec_test.go](https://github.com/looprig/eval/blob/v0.2.2/reportjson/codec_test.go).
The complete runnable example is
[examples/report/example_test.go](https://github.com/looprig/eval/blob/v0.2.2/examples/report/example_test.go).
