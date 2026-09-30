# cli-agent starter

A complete command-line coding assistant on Looprig, small enough to read in
one sitting. It is a starting point to copy and change, not a library.

- **Model:** any provider that `github.com/looprig/llm`'s `auto.New` can
  construct from a model and one key, chosen by environment variables
  (Bedrock and Phala need a code change; see below). With none set, a scripted model from
  `inference/inferencetest` runs it keyless and offline.
- **Tools:** the standard `Glob`, `Grep`, `ReadFile`, `EditFile` and
  `WriteFile` from `github.com/looprig/tools`. They work on your repository,
  which is the current directory or `--root`.
- **Access gate:** the agent can read inside the repository. Every write asks
  you first (`y` / `a` always this session / `N`) unless an earlier `a`
  answer in the same run already covers it; `a` stores allow rules in memory
  for the life of the process. Reads outside the
  repository, commands and network access are denied. `--read-only` drops the
  write tools and uses `loop.WithReadOnlyAccess(root)`, the one-option gate.
- **Durable sessions:** the journal lives on local disk (`fsstore`, through
  `storage.WithBoundedBlobReaders`). Each run prints its session id, and
  `--resume <id>` continues that conversation.
- **Terminal:** output streams as it is generated. A failed turn (bad key,
  provider outage) is reported and the session carries on. Ctrl-C shuts the
  session down cleanly.

## Get it

Copy this directory, or see [`docs/start/starters.md`](../../../docs/start/starters.md)
for the sparse Git checkout commands. Then rename the module in `go.mod`
(`example.com/cli-agent`).

## Run it without a key

```sh
go run .
> what is here?          # the scripted model lists the repository with Glob
> write notes.txt hello  # the scripted model asks to write; answer y or n
```

`go run . -p "what is here?"` runs one prompt and exits.

## Run it with a real model

| Variable | Meaning |
|---|---|
| `LOOPRIG_PROVIDER` | `openai`, `anthropic`, `ollama`, `llama.cpp`, `lmstudio`, or another provider that `llm`'s `auto.New` can construct from a model and one key (`openrouter`, `groq`, `google`, ...). Unset means `scripted`. |
| `LOOPRIG_MODEL` | The provider's model name. |
| `LOOPRIG_API_KEY` | The key. Local providers need none. |
| `LOOPRIG_BASE_URL` | Optional. Set it to point `openai` at any OpenAI-compatible server, or to use a non-default local port. |
| `LOOPRIG_API_FORMAT` | Optional: `openai`, `openai-responses`, `anthropic` or `gemini`. The default is `anthropic` for Anthropic and `openai` otherwise; set it for a provider that speaks something else (`gemini` for `google`, `openai-responses` for `azure`, `anthropic` for `minimax` and `google-vertex-anthropic`). |
| `LOOPRIG_CONTEXT_WINDOW` | Optional. The model's context window in tokens (default 128000). |

```sh
LOOPRIG_PROVIDER=anthropic LOOPRIG_MODEL=claude-sonnet-4-5 LOOPRIG_API_KEY=... go run .
LOOPRIG_PROVIDER=openai LOOPRIG_MODEL=gpt-4.1 LOOPRIG_API_KEY=... go run .
LOOPRIG_PROVIDER=ollama LOOPRIG_MODEL=qwen3 go run .           # http://localhost:11434
LOOPRIG_PROVIDER=llama.cpp LOOPRIG_MODEL=local go run .        # http://localhost:8080
LOOPRIG_PROVIDER=openai LOOPRIG_BASE_URL=https://my-gateway/v1 LOOPRIG_MODEL=... LOOPRIG_API_KEY=... go run .
LOOPRIG_PROVIDER=google LOOPRIG_API_FORMAT=gemini LOOPRIG_MODEL=gemini-2.5-flash LOOPRIG_API_KEY=... go run .
```

Two providers need a code change in `provider.go`: `auto.New` refuses
`bedrock`, which needs AWS SigV4 credentials (`bedrock.New`), and `phala`,
which needs an attestation acceptance policy (`phala.New`). Providers whose
credential is not a static API key (`google-vertex`, `github-copilot`,
`gitlab`, `sap-ai-core`, `snowflake-cortex`) receive `LOOPRIG_API_KEY` as an
already-issued token; the starter does not obtain or refresh it.

## Resume a session

```sh
go run . --root ~/src/myrepo
# session 6178c76c-... (model ...)
# resume with: --resume 6178c76c-...
go run . --root ~/src/myrepo --resume 6178c76c-...
```

State lives in `--data`, which defaults to `<user config dir>/cli-agent`. Only
one process can hold a session at a time.

Data directories use fsstore's v0.6.0 layout. An older directory is refused
with "move or delete it": there is no migration, so do not retry.

## Files

| File | What it does |
|---|---|
| `main.go` | Flags, signals, the prompt loop and the stdin approval prompt. |
| `provider.go` | Provider selection from the environment, and the keyless script. |
| `agent.go` | The loop and rig definitions, opening or resuming a session, and streaming one turn. |
| `access.go` | The access gate (reads allowed, writes gated) and the read guard. |
| `store.go` | fsstore with bounded blob readers, the session store and the workspace store. |
| `agent_test.go` | Scripted end-to-end tests covering a file read, a denied out-of-root read, write approval, resume, and legacy-directory refusal. |

## Test

```sh
GOWORK=off go test ./...
```

## Before you ship it

- **Approvals:** "always" lasts only for the process. Persist rules with
  `github.com/looprig/tools/permission`, which is also the `gate.RuleMatcher`
  and `RuleWriter`, so they survive restarts.
- **Read policy:** `readGuard` in `access.go` hides `.env*` and `.git/`.
  Extend it to cover your secrets.
- **Commands:** there is no Bash tool. Adding one means running it under
  `github.com/looprig/sandbox` and routing `command.execute` to the sandbox
  profile in the gate. Never allow commands unconfined.
- **Terminal UI:** `github.com/looprig/tui` gives you a full-screen interface
  with gate prompts, in place of the stdin loop.
- **Storage:** fsstore with bounded readers is for one local process. For
  several hosts, use a backend that implements `storage.BlobReaderLifecycle`
  natively, such as `natsstore` or `s3store` with `pgstore`.
- **Policy identity:** bump the revision string in `agent.go` whenever you
  change the gate. Restored sessions record it.
