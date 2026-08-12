---
id: reference/packages/pluto/pkg/packfile
title: Pluto packfile package
description: Strict, bounded YAML pack and table loading for qualification runs.
audience: developer
section: reference
order: 258
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  functions: release-github-com-looprig-pluto
  methods: release-github-com-looprig-pluto
  types: release-github-com-looprig-pluto
  constants: release-github-com-looprig-pluto
  variables: release-github-com-looprig-pluto
  ownership-and-errors: release-github-com-looprig-pluto
  source-and-runnable-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/packfile`

Packfile boundary in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile).

## Package role {#package-role}

The package decodes and validates pack, rubric, scenario, table, and evaluator YAML before execution. It is a trusted-definition boundary, not a model or session store.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DigestLockfile(d *Document) []byte`
- `func VerifyDigest(d *Document, lockfile []byte) error`
- `func DecodeTable(r io.Reader) (TableFile, error)`
- `func DecodePack(r io.Reader) (PackFile, error)`
- `func StrictDecode(r io.Reader, out any) error`
- `func Load(fsys fs.FS, dir string) (*Document, error)`
- `func LoadDir(path string) (*Document, error)`
- `func NewRegistry() *Registry`
- `func Schema(reg *Registry) ([]byte, error)`

### Methods {#methods}

- `func (d *Document) Digest() string`
- `func (tf TableFile) UsesJudge() bool`
- `func (e *EvaluatorSpec) UnmarshalYAML(node *yaml.Node) error`
- `func (e *Environment) Template() (inference.Request, error)`
- `func (e *Error) Error() string`
- `func (e *Error) Unwrap() error`
- `func (d *Document) Build(reg *Registry, bc BuildContext) (qual.Pack, error)`
- `func (d *Document) Lint() []string`
- `func (r *Registry) Register(k Kind) error`
- `func (r *Registry) Kinds() []Kind`
- `func (r *Registry) Build(spec EvaluatorSpec, bc BuildContext) (eval.Evaluator, error)`
- `func (rs RubricSpec) Rubric() (rubric.Rubric, error)`
- `func (s ScenarioSpec) Scenario(defaultName, revision string) (eval.Scenario, error)`

### Types {#types}

`PackFile`, `TableFile`, `Environment`, `ToolSpec`, `OutputSchemaSpec`, `RubricSpec`, `CriterionSpec`, `AnchorSpec`, `EvaluatorSpec`, `RunSpec`, `ScenarioSpec`, `MessageSpec`, `ExpectSpec`, `ToolCallExpectSpec`, `StructuredExpectSpec`, `ScriptSpec`, `ScriptToolCall`, `StructuredSpec`, `StructuredErrSpec`, `Error`, `Document`, `BuildContext`, `Kind`, `Registry`

### Constants {#constants}

`MaxFileBytes`

### Variables {#variables}

`ErrJudgeUnconfigured`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/packfile/digest.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/digest.go)
- [pkg/packfile/doc.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/doc.go)
- [pkg/packfile/document.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/document.go)
- [pkg/packfile/environment.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/environment.go)
- [pkg/packfile/errors.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/errors.go)
- [pkg/packfile/load.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/load.go)
- [pkg/packfile/registry.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/registry.go)
- [pkg/packfile/scenario.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/scenario.go)
- [pkg/packfile/schema.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/schema.go)
- [pkg/packfile/yamljson.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/yamljson.go)

Adjacent tests at the same commit:

- [pkg/packfile/catalog_rubric_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/catalog_rubric_test.go)
- [pkg/packfile/corpus_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/corpus_test.go)
- [pkg/packfile/digest_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/digest_test.go)
- [pkg/packfile/document_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/document_test.go)
- [pkg/packfile/environment_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/environment_test.go)
- [pkg/packfile/errors_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/errors_test.go)
- [pkg/packfile/load_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/load_test.go)
- [pkg/packfile/registry_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/registry_test.go)
- [pkg/packfile/scenario_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/scenario_test.go)
- [pkg/packfile/schema_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/schema_test.go)
- [pkg/packfile/yamljson_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/packfile/yamljson_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
