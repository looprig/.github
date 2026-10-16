# Progressive Go examples

These examples build one capability at a time. Every released stage is a small `main` package that runs without credentials. The source for stage 18 lives in `workflows`, which runs it in its own CI. Stage 20 (the web client) is retired: the browser libraries are published on npm as `@looprig/client` and `@looprig/react`.

Stage 19 (`harness/pkg/serve`) is **deprecated and frozen**. The package is a compatibility surface that still builds, but new public composition belongs in [Factory](https://looprig.dev/docs/modules/factory); start from the [quickstart](https://looprig.dev/docs/start/quickstart) instead.

The documentation runner reads `docs/_data/examples.json`. For a released stage, it copies that stage and the shared `internal` helpers into a temporary directory, writes a `go.mod` from the exact versions in the manifest, and runs `go mod tidy`, `go test -race` and `go run` with `GOWORK=off` and isolated module and build caches. It never adds a `replace` directive or imports a sibling checkout. Source-workspace stages are reported as delegated work and are executed by their owning repositories.

Run the complete released suite from the `.github` repository:

```sh
node scripts/docs/run-examples.mjs
```

Run one stage while reading its source:

```sh
node scripts/docs/run-examples.mjs --stage 1
```

The runner uses `GOTOOLCHAIN=local`, so the `go` on `PATH` must be the Go 1.26.9 baseline. If your installed Go is newer, put a 1.26.9 toolchain first:

```sh
PATH="$(GOTOOLCHAIN=go1.26.9 go env GOROOT)/bin:$PATH" node scripts/docs/run-examples.mjs
```

## Drift and standalone modules

`--latest` catches drift against the newest releases. For each released stage it writes the manifest `go.mod`, then runs `go get <module>@latest` for every `github.com/looprig/*` requirement before the usual tidy, test and run. The pinned manifest is not changed.

```sh
node scripts/docs/run-examples.mjs --latest
node scripts/docs/run-examples.mjs --latest --stage 8
```

`--standalone` runs every self-contained module under `examples/go/start/` and `examples/go/guides/` (any directory with its own `go.mod`). Each module is copied to a temporary directory first, then checked with `go mod verify`, `go test -mod=readonly ./...` and `go run -mod=readonly .` under the same isolated caches. Add `--latest` to upgrade every `github.com/looprig/*` requirement to `@latest` in the copy before testing.

```sh
node scripts/docs/run-examples.mjs --standalone
node scripts/docs/run-examples.mjs --standalone --latest
```

CI (`.github/workflows/docs-examples.yml`) runs the pinned suite and the standalone modules on every change, and runs both `--latest` modes weekly and on demand.

The stages script their model with the released `github.com/looprig/inference/inferencetest` client and its `inferencetest.Model()` descriptor. The internal `assertoutput` package makes assumptions executable before a stage prints its short result; it is a documentation fixture, not a public Looprig module.
