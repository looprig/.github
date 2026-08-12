---
id: agents/repositories/pluto
title: Pluto qualification and comparison
description: Run scripted or external targets against evaluation packs and emit scorecards and reports.
audience: agent
section: agents/repositories
order: 16
publication: released
proofs:
  module:
    - release-github-com-looprig-pluto
    - release-github-com-looprig-pluto-cmd-pluto
---
# pluto

`github.com/looprig/pluto@v0.1.2` provides qualification manifests, packfiles, profiles, target adapters, comparison, report JSON, rate limiting, and a CLI. Use `qual/target.NewScripted(name, scripts)` for deterministic targets, load a qualification manifest or packfile, run the qualification, and encode the scorecard with `reportjson.Encode`.

The root module contains reusable packages. The nested `cmd/pluto` module publishes the command at its own module boundary, so import and release it separately. Keep packfile and profile revisions explicit when comparing results. Invalid manifests, unknown pack entries, target errors, evaluator errors, and report codec failures stop a qualification.

Proofs: [`pkg/qual/target/scripted.go`](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/target/scripted.go), [`pkg/qual/manifest.go`](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/manifest.go), [`pkg/reportjson/codec.go`](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson/codec.go), [`examples/qualification/example_test.go`](https://github.com/looprig/pluto/blob/ee340b1bf73cdfa5748a9a23bfdff281b77e955b/examples/qualification/example_test.go).
