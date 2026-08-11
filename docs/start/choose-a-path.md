---
id: start/choose-a-path
title: Choose a Looprig starting point
description: Pick the smallest released layer that matches the system you want to build.
audience: human
section: start
order: 1
publication: released
proofs:
  paths:
    - release-github-com-looprig-core
  availability:
    - release-github-com-looprig-inference
    - module-flow-store
  first-run:
    - release-github-com-looprig-inference
---

# Choose a Looprig starting point

Looprig is a set of reusable Go modules, not one mandatory application framework. Start with the smallest boundary that gives you a useful result, then add storage, credentials, tools, or orchestration as the system earns those needs.

## Paths {#paths}

For content and provider-neutral requests, start with Core and Inference. For a model-backed application, add LLM and Credentials, then assemble those clients in your own loop or runtime. For durable history, add Storage and choose Fsstore for one machine, Natsstore for JetStream, or another backend that satisfies the same interfaces. For OS-level process confinement, add Sandbox after your application has decided what authority a process should receive.

For durable graph execution, start with released Flow. Its nested `flow/store` module is a separate source-workspace adapter and is not an installable release. For evaluation, use Eval with a deterministic target and exact evaluator first; use the judge path only when model-based scoring is an intentional part of the test.

## Availability {#availability}

The module guides label each boundary `released` or `source-workspace`. A released module has an immutable tag recorded in the current snapshot. Source-workspace code may be useful in the coordinated checkout but must not be named as a public `go get` path. Kosa is unavailable and Policy53 is outside this foundation set.

## First run {#first-run}

The progressive examples are the shortest route to a working mental model. Run `stage-01-inference` for one deterministic invocation, `stage-02-streaming` for chunks and a terminal result, and `stage-08-session-store` when you need a durable local path. Each manifest entry records its source directory, pinned module versions, assertion, workflow job, and cleanup behavior.
