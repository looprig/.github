# Progressive Go examples

These examples build one capability at a time. Every released stage is a small `main` package that runs without credentials. The source for stages 18 and 20 lives in `workflows` and `client` because those packages have not been released independently.

The documentation runner reads `docs/_data/examples.json`. For a released stage, it copies that stage and the shared `internal` helpers into a temporary directory, writes a `go.mod` from the exact versions in the manifest, and runs the program with `GOWORK=off` and isolated module and build caches. It never adds a `replace` directive or imports a sibling checkout. Source-workspace stages are reported as delegated work and are executed by their owning repositories.

Run the complete released suite from the `.github` repository:

```sh
node scripts/docs/run-examples.mjs
```

Run one stage while reading its source:

```sh
node scripts/docs/run-examples.mjs --stage 1
```

The `fakeinference` package supplies scripted `Invoke` and `Stream` responses for deterministic programs. The `assertoutput` package makes assumptions executable before a stage prints its short result. They are documentation fixtures, not public Looprig modules.
