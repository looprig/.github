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

Package packfile is the strict, versioned trust boundary between the YAML pack corpus and qual.

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

```go
type PackFile struct {
	Pack     string   `yaml:"pack"`
	Revision string   `yaml:"revision"`
	Tables   []string `yaml:"tables"`
}
```

```go
type TableFile struct {
	Table       string                `yaml:"table"`
	Revision    string                `yaml:"revision"`
	Dimension   string                `yaml:"dimension"`
	Requires    []string              `yaml:"requires"`
	Environment *Environment          `yaml:"environment"`
	Rubrics     []RubricSpec          `yaml:"rubrics"`
	Evaluators  []EvaluatorSpec       `yaml:"evaluators"`
	Run         *RunSpec              `yaml:"run"`
	Scenarios   []ScenarioSpec        `yaml:"scenarios"`
	Script      map[string]ScriptSpec `yaml:"script"`
}
```

```go
type Environment struct {
	System       string            `yaml:"system"`
	Tools        []ToolSpec        `yaml:"tools"`
	ToolChoice   string            `yaml:"tool-choice"`
	OutputSchema *OutputSchemaSpec `yaml:"output-schema"`
}
```

```go
type ToolSpec struct {
	Name        string    `yaml:"name"`
	Description string    `yaml:"description"`
	Schema      yaml.Node `yaml:"schema"`
}
```

```go
type OutputSchemaSpec struct {
	Name        string    `yaml:"name"`
	Description string    `yaml:"description"`
	Schema      yaml.Node `yaml:"schema"`
	Strict      bool      `yaml:"strict"`
}
```

```go
type RubricSpec struct {
	Name       string          `yaml:"name"`
	Revision   string          `yaml:"revision"`
	Scope      string          `yaml:"scope"`
	Definition string          `yaml:"definition"`
	Criteria   []CriterionSpec `yaml:"criteria"`
	Anchors    []AnchorSpec    `yaml:"anchors"`
}
```

```go
type CriterionSpec struct {
	ID          string  `yaml:"id"`
	Description string  `yaml:"description"`
	MinScore    float64 `yaml:"min-score"`
	MaxScore    float64 `yaml:"max-score"`
}
```

```go
type AnchorSpec struct {
	Score       float64 `yaml:"score"`
	Label       string  `yaml:"label"`
	Description string  `yaml:"description"`
}
```

```go
type EvaluatorSpec struct {
	Kind    string
	Options yaml.Node
}
```

```go
type RunSpec struct {
	Trials           int    `yaml:"trials"`
	Concurrency      int    `yaml:"concurrency"`
	TargetTimeout    string `yaml:"target-timeout"`
	EvaluatorTimeout string `yaml:"evaluator-timeout"`
}
```

```go
type ScenarioSpec struct {
	ID     string            `yaml:"id"`
	Name   string            `yaml:"name"`
	Input  []MessageSpec     `yaml:"input"`
	Expect *ExpectSpec       `yaml:"expect"`
	Labels map[string]string `yaml:"labels"`
}
```

```go
type MessageSpec struct {
	Role string `yaml:"role"`
	Text string `yaml:"text"`
}
```

```go
type ExpectSpec struct {
	RequiredFacts     []string              `yaml:"required-facts"`
	ForbiddenActions  []string              `yaml:"forbidden-actions"`
	ExpectedToolCalls []ToolCallExpectSpec  `yaml:"expected-tool-calls"`
	StructuredOutput  *StructuredExpectSpec `yaml:"structured-output"`
	ReferenceAnswers  []string              `yaml:"reference-answers"`
	PolicyRef         string                `yaml:"policy-ref"`
}
```

```go
type ToolCallExpectSpec struct {
	Tool string `yaml:"tool"`
	Min  int    `yaml:"min"`
	Max  *int   `yaml:"max"`
}
```

```go
type StructuredExpectSpec struct {
	Schema string `yaml:"schema"`
	Strict bool   `yaml:"strict"`
}
```

```go
type ScriptSpec struct {
	Reply         string             `yaml:"reply"`
	Duration      string             `yaml:"duration"`
	ToolCalls     []ScriptToolCall   `yaml:"tool-calls"`
	Structured    *StructuredSpec    `yaml:"structured"`
	StructuredErr *StructuredErrSpec `yaml:"structured-err"`
}
```

```go
type ScriptToolCall struct {
	Name    string `yaml:"name"`
	ID      string `yaml:"id"`
	IsError bool   `yaml:"is-error"`
}
```

```go
type StructuredSpec struct {
	SchemaName     string `yaml:"schema-name"`
	SchemaRevision string `yaml:"schema-revision"`
}
```

```go
type StructuredErrSpec struct {
	Schema string `yaml:"schema"`
	Reason string `yaml:"reason"`
}
```

```go
type Error struct {
	Path   string
	Reason string
	Err    error
}
```

```go
type Document struct {
	Dir    string
	Pack   PackFile
	Raw    map[string][]byte
	Tables []TableFile
	// contains filtered or unexported fields
}
```

```go
type BuildContext struct {
	Rubrics       map[string]rubric.Rubric
	JudgeClient   inference.Client
	JudgeTemplate inference.Request
}
```

```go
type Kind struct {
	Name          string
	Doc           string
	Evidence      string
	OptionsSchema json.RawMessage
	Build         func(opts *yaml.Node, bc BuildContext) (eval.Evaluator, error)
}
```

```go
type Registry struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`MaxFileBytes`

### Variables {#variables}

`ErrJudgeUnconfigured`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
