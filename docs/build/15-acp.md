---
id: build/15-acp
title: Build 15: ACP child and host
description: Drive an ACP child or expose a Harness session as an ACP host with explicit wire, process, gate, and shutdown boundaries.
audience: developer
section: build
order: 15
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  child-driving:
    - release-github-com-looprig-acp
  host-exposure:
    - release-github-com-looprig-acp
    - release-github-com-looprig-harness
  native-and-proxy:
    - release-github-com-looprig-acp
  lifecycle:
    - release-github-com-looprig-acp
  errors-and-limits:
    - release-github-com-looprig-acp
  runnable-proof:
    - release-github-com-looprig-acp
---

# Build 15: ACP child and host

ACP has two directions. `acp/client` drives a foreign child over a supervised stdio process; `acp/agent` exposes a host that answers ACP requests from a client. The protocol package is shared wire vocabulary, while launch owns adapter and model-proxy composition.

## Child driving {#child-driving}

Construct a `stdio.Command`, create an `acp/client.Client` with the handlers the child may call, and create a session with `NewSession`, `LoadSession`, or `ResumeSession`. `Prompt` permits one in-flight prompt per session. ACP client handlers validate session IDs, paths, terminal IDs, and offered permission options before calling host-owned handlers. Cancellation resolves as a protocol stop result; it is not an arbitrary transport error.

## Host exposure {#host-exposure}

Create `agent.Options` with a host implementing the session catalog, live session, optional closer, deleter, compactor, authenticator, and runtime configuration interfaces. `agent.New` registers initialize, authentication, session lifecycle, prompt, permission, filesystem, and terminal handlers that the options advertise. The host owns the session and gate decisions; ACP translates protocol requests and notifications without handing the client a Harness controller.

## Native and proxy {#native-and-proxy}

`launch.Codex`, `launch.ClaudeCode`, and `launch.Gemini` describe adapter-specific command and environment wiring. Gemini is an environment adapter only, not a proven ACP connector. `launch.Dial` manages a child and an optional model proxy; `DialNative` uses a native harness configuration. A caller must run `ProbeCodexVersion` explicitly before constructing a command that relies on a supported Codex version.

## Lifecycle {#lifecycle}

Close an ACP client or agent connection only after prompts and gate responses have drained. The host close sequence marks the session closing, cancels in-flight work, resolves pending permission calls, waits for the prompt drain, invokes optional shutdown, and removes the live session. Durable deletion is a separate operation and is rejected while a session remains live. Launch closes the proxy and process in the reverse order of construction.

## Errors and limits {#errors-and-limits}

The protocol layer bounds frames, messages, nesting depth, handler concurrency, and notify queues. Use typed errors for invalid frames, closed connections, unsupported configuration, missing host capabilities, authentication, duplicate sessions, and child exit. ACP is a wire and lifecycle bridge; it does not make an untrusted child trusted and it does not replace the host's gate or Sandbox policy.

## Runnable proof {#runnable-proof}

`stage-15-acp-foreign` constructs a Codex ACP child profile with a forwarded MCP server, registers both live and restored foreign builders, and asserts that both are available with scoped services. Run it with `node scripts/docs/run-examples.mjs`. See the [pinned ACP client](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/), [agent facade](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/), and [launch lifecycle](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/).
