# Looprig documentation instructions

This repository owns the public documentation corpus consumed by the website in
the sibling `www` repository. These rules apply to `docs/`, documentation
fixtures, evidence records, navigation data, and documentation scripts.

## Source of truth

- Treat implementation code, tests, module files, package manifests, and Git
  tags as the source of truth.
- Do not use planning documents as evidence for current behavior.
- Do not turn roadmap language, TODOs, or design proposals into product claims.
- Verify exported names, signatures, defaults, limits, lifecycle behavior, and
  errors against code before documenting them.
- Derive module dependencies from direct module requirements. Compute
  dependents by reversing those direct edges.
- Use immutable released versions when a tag exists. Write `Not released` when
  no supported immutable version exists.
- Do not document Policy53 or Kosa in the public corpus.

## Audiences

The human documentation teaches developers how to use the system. It should
read like careful developer documentation, not a journal, generated catalog, or
internal architecture report.

The machine-readable Markdown interface is separate. Keep it compact,
token-efficient, explicit about repository boundaries, and linked to source.
Do not make human pages terse merely to optimize automated consumption.

## Public information architecture

The public sidebar has these top-level sections:

1. Overview
2. Getting Started
3. Guides
4. Products
5. Modules

Do not restore archived Concepts, Examples, API Reference, Agent Reference,
Integrations, or Contributing sections without an explicit product decision.
Move retired material to the workspace `zarchive` instead of leaving it in the
published manifest.

Every guide category starts with a page labeled `Overview`. Current guide
categories are Inference, Harness, Tools, Workflows, Sandboxing, Evals,
Protocols, TUI, and Web UI. Keep each concept under its owning category. For
example, commands, events, steps, turns, loops, Rigs, sessions, journals,
workspaces, gates, hooks, hustles, compaction, and HTTP serving belong under
Harness. Flow and workflow tools belong under Workflows.

## Human page conventions

- Lead with the user outcome and the public boundary.
- Explain concepts in plain language before introducing implementation detail.
- Use headings, tables, lists, callouts, code blocks, and diagrams when they
  improve comprehension. Avoid pages made only of headings and paragraphs.
- Show public structs and interfaces when their fields or methods are necessary
  to use the module correctly.
- Put comments in example code where ownership, safety, or lifecycle is not
  obvious.
- Every published example must be runnable as shown. Use exact versions and
  commands, and test deterministic behavior where practical.
- Use familiar provider language such as hosted model, local model, OpenAI,
  Anthropic, or Ollama. Do not invent terms such as `offline model`.
- Do not tell consumers to run commands relative to the Looprig development
  workspace. Present a standalone consumer directory and explain any unusual
  environment variable.
- Link related concepts at the point where they matter. Prefer canonical guide
  pages over duplicated explanations.
- Use Mermaid for sequences and flows when relationships are clearer visually.
  Mermaid diagrams must use the documentation dark theme and remain readable
  with a visible source fallback.
- Use SVG only when a durable, carefully aligned architecture visual adds more
  value than Mermaid or prose. SVGs require accessible `title` and `desc`
  elements and must not contain active or remote content.

## Writing style

- Write concise, humane technical prose.
- Use industry-standard terms and define Looprig-specific terms on first use.
- Do not use unnecessary em dashes, emojis, slogans, or anthropomorphic
  language.
- Avoid repetitive templates and filler transitions.
- Keep paragraphs cohesive. Do not insert a blank line after every sentence.
- Use sentence case for page headings. Preserve established acronyms such as
  ACP, API, HTTP, JSON, LLM, MCP, TUI, and UI.
- Capitalize Looprig when naming the ecosystem, Harness when naming the module,
  Loop and Rig when naming their public runtime concepts, and Session when a
  type-level distinction matters.
- Do not display release or publication badges in the sidebar or article chrome.

## Products

Products are complete experiences assembled from Looprig modules, not reusable
modules themselves.

- Products has only Overview, Carbon, and Pluto unless explicitly expanded.
- Carbon is presented as a coding agent. Cover installation, model
  configuration, execution, coding tools, gates and classifiers, subagents, ACP
  children, MCP, compaction, sessions, workspaces, model proxying, and clients.
- Pluto is presented as a model profiler and evaluation framework. Cover
  installation, packs, runs, profiles, comparisons, reports, and CI use.
- Keep one practical page per product unless the product information
  architecture is deliberately expanded.

## Modules

There is one page for every public Module entry. Each page contains exactly:

1. Repository
2. Description
3. Where it fits
4. Dependencies
5. Dependents

Repository is a table containing the module path, current version, and GitHub
link. Description states what the package provides. Where it fits explains how
the module can be used independently, how it composes inside Looprig, and which
boundary it owns. Dependencies and dependents are direct, code-derived Looprig
edges and link to the corresponding Module pages.

Regenerate Module pages with:

```sh
node scripts/docs/refresh-module-pages.mjs
```

Update the generator and its contract when the format changes. Do not hand-edit
generated dependency lists.

## Navigation, evidence, and links

- `docs/_data/navigation.json` is the checked publication inventory and order.
- Every published Markdown file must appear once in navigation.
- Every evidence-backed subsection needs a resolvable proof mapping.
- Keep local links canonical and verify that their published targets exist.
- Use direct GitHub links for repository and source locations.
- Retired routes must be removed from navigation, search, paging, and the home
  directory, not merely hidden with CSS.
- Keep Policy53 and Kosa out of page bodies, navigation, search, records, and
  dependency edges.

## Verification

Run these checks after documentation changes:

```sh
node --test scripts/docs/*.test.mjs
node /path/to/looprig/scripts/docs/verify.mjs \
  --workspace-root /path/to/looprig \
  --docs /path/to/this-worktree/docs \
  --offline
git diff --check
```

Run every exact example command affected by the change. When changing the
website contract, also run the sibling website tests and a production build
with `LOOPRIG_DOCS_ROOT` pointing at this `docs` directory.

## Repository boundaries

The Looprig workspace contains independent Git repositories. Commit this
repository separately from `www` and from component repositories. Never stage
nested repositories through the outer workspace.
