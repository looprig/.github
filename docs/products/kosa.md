---
id: products/kosa
title: Kosa, a local knowledge workspace product
description: Explore Kosa as the repository-backed knowledge product assembled from the Looprig workspace, with strict Git, indexing, HTTP, and read-only MCP boundaries.
audience: [human, operator, developer]
section: products
order: 30
publication: unavailable
proofs:
  module:
    - module-kosa
  source-and-tests:
    - module-kosa
---

# Kosa, a local knowledge workspace product

Kosa is a repository-backed knowledge workspace in the coordinated source
workspace. It treats Markdown, schema, provenance, and Git history as the
source of truth, then maintains derived RDF, lexical search, and optional
structured extraction consumers. It exposes a local HTTP API and a deliberately
read-only MCP bridge for querying that workspace.

Kosa is currently source-only in this documentation snapshot. Its module is
`github.com/looprig/kosa` at source commit
`867bb33686fa2b3f4325b503d033c6a0d1ada08b`, with local replaces for the
coordinated core, inference, and llm modules and a development version of
`0.0.0-dev`. There is no supported public install command or release tag to
give an operator. The path below is a product showcase for the source
workspace, not a production-readiness claim.

## The product in one view

```text
Git checkout and Markdown
  -> strict candidate and schema validation
  -> canonical HEAD snapshot
  -> RDF, search, and extraction consumers
  -> local authenticated HTTP API
  -> read-only MCP bridge for search, entities, and SPARQL
```

The canonical Git snapshot can advance before a derived consumer does. Kosa
keeps a watermark for each consumer and attaches a revision envelope to query
results. A stale result is visible as stale; it is not silently presented as
current.

## Create a workspace

In a source checkout with the Kosa command available, the product path begins:

```sh
kosa init ./knowledge
```

`init` creates a Git repository when needed, refuses a non-empty target unless
`--existing` is explicit, and never overwrites existing bytes. It creates the
managed `People` and `Projects` roots, `_schema`, `_provenance`, and private
`.kosa` state directories. The generated `kosa.yaml` is the exact fixture
embedded in `internal/cli/init.go`:

```yaml
version: 0
workspace:
  managed_roots:
    - People
    - Projects
  schema_root: _schema
  provenance_root: _provenance
```

The initializer stages and creates its initial commit with a Kosa identity. It
sanitizes the Git environment, bypasses hooks and filters for this initialization
commit, and does not replace a pre-existing staged index. If you initialize a
non-empty repository, inspect the result before adding managed content.

## Edit, validate, and commit

Managed Markdown roots are the editable source. Schema and provenance roots
are separate and cannot overlap a managed root. Kosa resolves paths as clean
repository-relative names, rejects absolute paths, `..`, `.git`, and `.kosa`,
and applies configured file, candidate, and document bounds.

Use the status and validation commands before committing:

```sh
kosa status --repo ./knowledge
kosa validate --repo ./knowledge
kosa commit --repo ./knowledge -m "Add people notes"
```

`status` reports canonical HEAD, branch, managed dirt, unmanaged dirt, staged
state, and unmerged state. `validate` checks the complete working candidate and
does not mutate the index. `commit` uses an optimistic BaseHEAD check, commits
managed source changes, and then schedules the derived consumers. It does not
silently reset unrelated or unmanaged files. `kosa doctor --repo ./knowledge`
reports repository readiness and staged-index recovery requirements.

## Index consumers and revision truth

Kosa has three independent consumers:

- RDF and reasoning, served by a managed local Oxigraph process;
- lexical search, persisted under `.kosa/search`;
- structured extraction, optional when inference is enabled, with proposals and
  fingerprints in `.kosa/state`.

The worker starts by recovering running jobs and reconciling each consumer's
watermark with canonical HEAD. It enqueues only mismatched consumers. A
one-shot rebuild is available while the long-running service uses durable jobs:

```sh
kosa index status --repo ./knowledge
kosa index rebuild --repo ./knowledge
```

The status output identifies canonical, RDF, search, and extraction revisions
and a stale flag. Search responses carry cited ranked hits. Semantic queries
are read-only SPARQL. Entity, statement, predicate, and predicate-suggestion
operations use the same revision envelope.

## Configure optional inference

Kosa's strict version-0 configuration supports provider and API-format pairs
implemented by the source composition: LM Studio (`openai` or `anthropic`),
Phala, Chutes, and OpenRouter (`openai`), Google (`gemini`), and Bedrock
(`anthropic`). The inference base URL must be HTTP or HTTPS without URL
credentials. The API-key setting is an environment-variable name, fixed by the
current schema as `KOSA_MODEL_API_KEY`; the credential value is never written
to `kosa.yaml`.

Inference is optional. When enabled, Kosa configures a structured extraction
consumer with bounded prompt, model-output, document, and reasoning limits. A
failed extraction does not make RDF or lexical indexing pretend to be current;
the extraction watermark and durable job state show the difference.

## Serve the local API

Start the source-workspace service with:

```sh
export KOSA_API_TOKEN="use-a-private-token-at-least-32-bytes-long"
kosa serve --repo ./knowledge
```

Kosa requires a token even on loopback. The configured HTTP bind defaults to
`127.0.0.1:7331`; the Oxigraph bind defaults to `127.0.0.1:7878`. Both are
loopback-only. The Oxigraph binary must be the configured `oxigraph` name,
unless the trusted launcher environment override `KOSA_OXIGRAPH_BIN` resolves
it. The service owns the repository lease, state store, Oxigraph process,
workers, HTTP server, and close order.

The v0 API includes health and readiness, status and diff, validation and
commits, document operations, index status, entities and statements,
predicates, search, SPARQL, and extraction proposal routes. Readiness reports a
staged or unmerged repository as not ready; health is only a process check.
Requests have bounded bodies, responses, headers, handler time, and server
timeouts.

Shutdown is reverse construction: HTTP server shutdown with a five-second
bound, worker stop, Oxigraph close, state close, and repository close. Failure
paths close resources already acquired, including when Oxigraph cannot start.

## Use the read-only MCP bridge

The Kosa MCP command is a single-session stdio bridge to the already-running
loopback API:

```sh
kosa mcp serve --api http://127.0.0.1:7331
```

It reads `KOSA_API_TOKEN`, requires at least 32 bytes, validates a loopback HTTP
origin, denies redirects, bounds frames at 1 MiB and responses at 16 MiB, and
uses a 30-second request timeout. It registers exactly three read-only tools:
`kosa_search`, `kosa_get_entity`, and `kosa_sparql`. The bridge owns no
repository state and cannot mutate documents, commits, indexes, or proposals.

## When to choose Kosa

Kosa is useful when a team wants a Git-reviewed Markdown workspace with
searchable and queryable derived views, explicit schema/provenance roots, and
an MCP read surface for an existing local service. It is not a hosted
knowledge service, a general-purpose graph editor, or a replacement for a
repository's review process. Its current source-only status also means an
operator should pin the coordinated workspace and run its own tests before
using it beyond an experiment.

## Evidence

The source-only module and local replacement posture are recorded in
[`go.mod` at the Kosa source commit](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/go.mod).
The CLI path and exact initialization fixture are in
[`internal/cli/run.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/cli/run.go)
and [`internal/cli/init.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/cli/init.go).
Strict configuration is implemented in
[`internal/config/config.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/config/config.go).
Service lifecycle, indexing, API, and MCP proof points are
[`internal/cli/serve.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/cli/serve.go),
[`internal/app/indexing.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/app/indexing.go),
[`internal/transport/httpapi/server.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/transport/httpapi/server.go),
and [`internal/transport/mcpserver/server.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/transport/mcpserver/server.go).
The module proof marker in this page's frontmatter is `module-kosa`.
