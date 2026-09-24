# looprig/.github

The Looprig GitHub organization repository. It holds the organization profile
and the public documentation corpus rendered at [looprig.com](https://looprig.com).
The website repository consumes it as a Git submodule pinned to a tagged release
of this repository.

## Contents

| Path | What it holds |
| --- | --- |
| `profile/README.md` | The organization landing page shown at [github.com/looprig](https://github.com/looprig). |
| `docs/` | The documentation corpus: Overview, Getting Started (`start/`), Examples, Guides, Products, and Modules, plus `build/` pages, `GLOSSARY.md`, and `mission/`. |
| `docs/_data/` | Checked data the site reads: `navigation.json` (publication inventory and order), module, package, dependency, example, and evidence records. |
| `docs/_schema/` | JSON Schemas for the `_data` records. |
| `examples/go/` | Runnable Go examples the docs cite: complete agents (`agents/`), guide programs (`guides/`), and the staged `progressive/` walkthrough. |
| `blog/` | Journal posts published at `looprig.com/blog`; see [`blog/README.md`](blog/README.md) for the post format. |
| `scripts/docs/` | Node scripts and tests that check the corpus, regenerate module pages, and run the examples. |
| `.github/workflows/docs-examples.yml` | CI that runs the progressive examples and the example-runner unit tests. |

## Working on the docs

Documentation claims are verified against module code, `go.mod` files, and
release tags. Run the corpus checks with Node:

```sh
node --test scripts/docs/*.test.mjs
```

Run the progressive examples the way CI does (needs Go 1.26.8 and network
access to fetch the pinned module versions):

```sh
node scripts/docs/run-examples.mjs
```

Module pages under `docs/modules/` are generated; regenerate them rather than
editing their dependency lists by hand:

```sh
node scripts/docs/refresh-module-pages.mjs
```

To preview changes on the site, point a `www` checkout at this `docs`
directory with `LOOPRIG_DOCS_ROOT`; see the `www` README.
