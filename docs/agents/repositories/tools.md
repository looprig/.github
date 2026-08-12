---
id: agents/repositories/tools
title: Standard Harness tools
description: Bind workspace, process, task, web, and user interaction tools to attenuated session services.
audience: agent
section: agents/repositories
order: 23
publication: released
proofs:
  module:
    - release-github-com-looprig-tools
---
# tools

`github.com/looprig/tools@v0.10.0` supplies standard `tool.Definition` factories for `Bash`, `ReadFile`, `WriteFile`, `EditFile`, `Glob`, `Grep`, `Fetch`, `WebSearch`, `AskUser`, Tasks, and supervised process input, output, and stop. Definitions are bound by Harness; they do not create authority by themselves.

Use `tools.BashDefinition(resolver, options...)` when process calls must use the session supervisor. Use `ReadFileDefinition`, `WriteFileDefinition`, and `EditFileDefinition` with a read guard and the workspace bindings. `TaskDefinitions` creates a Loop-local task store. A definition returns a typed build error when a required guard, resolver, provider, coordinator, or process service is absent.

Keep the workspace root and coordinator session-bound. Let sandbox executors and gate policy decide effects. Proofs: [`definitions.go`](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions.go), [`bash/bash.go`](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/bash.go), [`task/tool.go`](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/task/tool.go), [`definitions_test.go`](https://github.com/looprig/tools/blob/9439c2a89b87559874fce3f71889b695013a1f1c/definitions_test.go).
