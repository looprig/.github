---
id: agents/repositories/classifiers
title: Classifier packages
description: Add deterministic command-safety classification and bounded evidence collection to Harness gates.
audience: agent
section: agents/repositories
order: 2
publication: released
proofs:
  module:
    - release-github-com-looprig-classifiers
---
# classifiers

`github.com/looprig/classifiers@v0.1.4` currently provides `pkg/commandsafety` and an empty `pkg/catalog` package. The command-safety constructor requires a non-nil `inference.Client`, a validated model with tools and structured-output capabilities, a policy with its absolute-human category floor, and at least one evidence definition.

```go
c, err := commandsafety.New(commandsafety.Options{
    Inference: inferenceClient,
    Model: model.CustomModel("provider", "format", baseURL, "reviewer", model.WithStructuredOutputWithTools()),
    Policy: commandsafety.DefaultPolicy(),
    Evidence: commandsafety.StandardEvidence(commandsafety.ReadEvidencePolicy{}),
})
```

`StandardEvidence` supplies bounded filesystem and Git definitions. `Classifier` implements the Harness gate classifier surface and exposes a stable name and revision. Construction errors identify the rejected field without echoing input. The example uses an offline inference stub and tests typed construction and deterministic evaluation.

Proofs: [`pkg/commandsafety/commandsafety.go`](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/commandsafety.go), [`pkg/commandsafety/evaluation.go`](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/evaluation.go), [`examples/commandsafety/example_test.go`](https://github.com/looprig/classifiers/blob/d52423db4c89d0cf71f3228fcf2b795b307e7117/examples/commandsafety/example_test.go).
