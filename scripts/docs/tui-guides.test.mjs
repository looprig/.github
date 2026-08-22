import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { assertClaim, negated, refuteClaim } from "./claims.mjs";
import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspaceRoot = resolveWorkspaceRoot(root);
const tuiRoot = path.join(workspaceRoot, "tui");

const pages = [
  ["index", "TUI"],
  ["getting-started/index", "Getting Started"],
  ["getting-started/create", "Create a TUI Screen"],
  ["getting-started/run", "Run a TUI Entry Point"],
  ["runtime/index", "Runtime"],
  ["runtime/events", "Events and Projections"],
  ["runtime/commands", "Commands and Gates"],
  ["runtime/restore", "Restore and Replay"],
  ["runtime/lifecycle", "Lifecycle and Handoffs"],
  ["runtime/session-adapter", "Session Adapter"],
  ["components/index", "Components"],
  ["components/input", "InputBox"],
  ["components/completion", "Completion Trays"],
  ["components/sessions", "Session Completion"],
  ["styling/index", "Styling"],
  ["styling/styles", "Styles and Layout Tokens"],
  ["styling/markdown", "Markdown Rendering"],
  ["integration/index", "Integration"],
  ["integration/harness", "Harness Sessions and Gates"],
  ["integration/workspaces", "Workspaces and Session Presentation"],
  ["integration/session-stores", "Session Stores and Durable Replay"],
];

const sourceProof = {
  index: ["api.go", "api_test.go"],
  "getting-started/index": ["api.go", "api_test.go"],
  "getting-started/create": ["api.go", "internal/presentation/screen.go", "api_test.go"],
  "getting-started/run": ["runtime/run.go", "runtime/run_test.go", "examples/runtimehost/example_test.go"],
  "runtime/index": ["runtime/run.go", "internal/presentation/screen.go", "runtime/run_test.go"],
  "runtime/events": ["internal/presentation/agent.go", "internal/presentation/restore.go", "internal/presentation/commands.go", "internal/presentation/agent_test.go", "internal/presentation/restore_test.go"],
  "runtime/commands": ["internal/presentation/agent.go", "internal/presentation/commands.go", "internal/presentation/interaction.go", "internal/presentation/commands_test.go", "internal/presentation/interaction_test.go"],
  "runtime/restore": ["internal/presentation/restore.go", "internal/presentation/restore_test.go", "sessionadapter/adapter.go", "examples/restore/example_test.go"],
  "runtime/lifecycle": ["internal/presentation/status.go", "internal/presentation/agentholder.go", "internal/presentation/commands.go", "internal/presentation/screen.go", "runtime/run.go", "runtime/run_test.go"],
  "runtime/session-adapter": ["sessionadapter/adapter.go", "sessionadapter/replaying_subscription.go", "sessionadapter/adapter_test.go", "sessionadapter/replaying_subscription_test.go", "examples/sessionadapter/example_test.go"],
  "components/index": ["components/input.go", "components/slashcomplete.go", "components/valuecomplete.go", "components/filecomplete.go", "components/sessioncomplete.go"],
  "components/input": ["components/input.go", "components/input_test.go"],
  "components/completion": ["components/slashcomplete.go", "components/valuecomplete.go", "components/filecomplete.go", "components/slashcomplete_test.go", "components/valuecomplete_test.go", "components/filecomplete_test.go"],
  "components/sessions": ["components/sessioncomplete.go", "components/sessioncomplete_test.go"],
  "styling/index": ["styles/styles.go", "styles/card.go", "styles/styles_test.go"],
  "styling/styles": ["styles/styles.go", "styles/card.go", "styles/styles_test.go"],
  "styling/markdown": ["styles/styles.go", "styles/markdown_tables.go", "styles/markdown_tables_test.go"],
  "integration/index": ["api.go", "sessionadapter/adapter.go", "restore/decider.go", "examples/sessionadapter/example_test.go"],
  "integration/harness": ["sessionadapter/adapter.go", "restore/decider.go", "sessionadapter/adapter_test.go", "restore/decider_test.go"],
  "integration/workspaces": ["internal/presentation/sessionpresentation.go", "internal/presentation/screen.go", "sessionadapter/adapter.go"],
  "integration/session-stores": ["sessionadapter/adapter.go", "sessionadapter/replaying_subscription.go", "sessionadapter/replaying_subscription_test.go"],
};

function slug(heading) {
  return heading
    .replace(/`/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pageMarkdown(relative) {
  const file = path.join(root, "docs/guides/tui", `${relative}.md`);
  assert.equal(fs.existsSync(file), true, `missing TUI page ${relative}`);
  return fs.readFileSync(file, "utf8");
}

function sourceUrl(relative) {
  return `https://github.com/looprig/tui/blob/main/${relative}`;
}

function proofMappings(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(frontmatter, "TUI page must have frontmatter");
  const proofs = {};
  let inProofs = false;
  for (const line of frontmatter[1].split("\n")) {
    if (line === "proofs:") {
      inProofs = true;
      continue;
    }
    if (!inProofs || !line.startsWith("  ")) continue;
    const match = line.match(/^  ([a-z0-9-]+):\s*(.+)$/);
    if (match) proofs[match[1]] = match[2];
  }
  return proofs;
}

test("TUI guides use the nested human developer hierarchy", () => {
  assert.equal(pages[0][0], "index", "overview must be first");
  assert.ok(pages.some(([relative]) => relative.startsWith("runtime/")), "runtime must be nested");
  assert.ok(pages.some(([relative]) => relative.startsWith("components/")), "components must be nested");
  assert.ok(pages.some(([relative]) => relative.startsWith("styling/")), "styling must be nested");
  assert.ok(pages.some(([relative]) => relative.startsWith("integration/")), "integration must be nested");

  for (const [relative, title] of pages) {
    const markdown = pageMarkdown(relative);
    const escapedID = `guides/tui/${relative}`.replaceAll("/", "\\/");
    const escapedTitle = title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    assert.match(markdown, new RegExp(`^id: ${escapedID}$`, "m"));
    assert.match(markdown, new RegExp(`^title: ${escapedTitle}$`, "m"));
    assert.match(markdown, /^description: .+$/m);
    assert.match(markdown, /^audience: developer$/m);
    assert.match(markdown, /^section: guides$/m);
    assert.match(markdown, /^order: \d+$/m);
    assert.match(markdown, /^publication: released$/m);
    assert.match(markdown, /^proofs:\n(?:  .+\n)+/m);
    assert.match(markdown, /^## Source$/m);
    assert.match(markdown, /^## Proof$/m);
    assert.match(markdown, /```go\n|```mermaid\n|^\| .+ \|$/m, `${relative} needs technical content`);
    assert.doesNotMatch(markdown, /GOWORK|README|docs\/plans|policy53|Kosa|—/i, `${relative} contains forbidden prose`);
    assert.doesNotMatch(markdown, /\]\(\.\.?\//, `${relative} uses a relative internal link`);

    const proofs = proofMappings(markdown);
    for (const heading of markdown.matchAll(/^#{2,6} (.+)$/gm)) {
      const headingSlug = slug(heading[1]);
      assert.ok(proofs[headingSlug], `${relative} is missing proof mapping for ${heading[1]}`);
      assert.match(proofs[headingSlug], /release-github-com-looprig-tui/);
    }
  }
});

test("every TUI guide links source and test proof that exists locally", () => {
  for (const [relative, files] of Object.entries(sourceProof)) {
    const markdown = pageMarkdown(relative);
    for (const source of files) {
      assert.equal(fs.existsSync(path.join(tuiRoot, source)), true, `missing TUI source ${source}`);
      assert.match(markdown, new RegExp(sourceUrl(source).replaceAll("/", "\\/")), `${relative} does not link ${source}`);
    }
  }
});

test("the TUI overview names its public boundary and canonical neighbors", () => {
  const index = pageMarkdown("index");
  for (const phrase of ["Agent", "Screen", "runtime.Run", "sessionadapter", "FoldDisplay", "components", "styles", "restore"]) {
    assert.match(index, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `overview omits ${phrase}`);
  }
  for (const destination of [
    "/docs/guides/harness",
    "/docs/guides/tools",
  ]) {
    assert.match(index, new RegExp(destination.replaceAll("/", "\\/")), `overview omits ${destination}`);
  }
  assert.match(index, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
});

test("public component and integration pages cover the source-backed seams", () => {
  const all = pages.map(([relative]) => pageMarkdown(relative)).join("\n");
  for (const phrase of [
    "NewInputBox",
    "NewSlashCompleteWithCommands",
    "NewFileComplete",
    "NewValueComplete",
    "NewSessionComplete",
    "NewMarkdownRenderer",
    "RenderMarkdown",
    "NewWithReplay",
    "Restore",
    "ReplayOpener",
    "WithSessionPresentation",
    "SessionPresentation",
    "DecideRestore",
  ]) {
    assert.match(all, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")), `TUI guides omit ${phrase}`);
  }
  assert.match(all, /StatusIdle[\s\S]*StatusRunning[\s\S]*StatusInterrupting[\s\S]*StatusResetting/);
  assert.match(all, /```mermaid[\s\S]*sequenceDiagram/);
});

test("every TUI page cites the released TUI tag", () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));
  const release = inventory.modules.find((record) => record.module === "github.com/looprig/tui");
  assert.equal(release?.publication?.status, "released");

  for (const [relative] of pages) {
    const markdown = pageMarkdown(relative);
    const tags = [...markdown.matchAll(/looprig\/tui\/releases\/tag\/(\S+?)\)/g)].map((match) => match[1]);
    assert.notDeepEqual(tags, [], `${relative} omits the TUI release record`);
    for (const tag of tags) {
      assert.equal(tag, release.publication.tag, `${relative} cites a stale TUI release record`);
    }
  }
});

test("failed child cards show a bounded terminal failure reason", () => {
  const events = pageMarkdown("runtime/events");

  assertClaim(events, {
    all: [
      /\bfail(?:ed|ure)\b/i,
      /\bchild\b/i,
      /\bcard\b/i,
      /\breason\b\s+(?:is|are|gets?|stays?|remains?)\s+(?:\w+\s+){0,2}(?:bound|truncat|capp|limit)\w*|\b(?:bounded|truncated|capped|limited)\s+(?:\w+\s+){0,1}reason\b/i,
    ],
    none: [negated("bound", "truncat", "cap", "limit")],
  }, "failed child cards must document a bounded failure reason");

  refuteClaim(events, {
    all: [/\breason\b[^.;!?]{0,60}\b(?:unbounded|unlimited|untruncated)\b|\b(?:unbounded|unlimited|untruncated)\b[^.;!?]{0,60}\breason\b/i],
  }, "a child failure reason must not be documented as unbounded");
});

test("a nil child failure reason preserves the parent fallback", () => {
  const events = pageMarkdown("runtime/events");

  const NIL = /(?<![\w-])nil\b/i;

  assertClaim(events, {
    all: [NIL, /\breason\b/i, /\bparent\b/i, /\bfallback\b/i, /\b(?:preserv|retain|keep|unchanged)\w*\b/i],
    none: [negated("preserv", "retain", "keep")],
  }, "a nil child failure reason must preserve the parent fallback");

  const OVERWRITES = String.raw`(?:overwrit|replac|clear|blank|erase|discard|drop|remov)\w*`;
  refuteClaim(events, {
    all: [new RegExp(String.raw`(?<![\w-])nil\b[^.;!?]{0,80}\b${OVERWRITES}|\b${OVERWRITES}[^.;!?]{0,80}(?<![\w-])nil\b`, "i")],
    none: [negated("overwrit", "replac", "clear", "blank", "erase", "discard", "drop", "remov")],
  }, "a nil child failure reason must not be documented as overwriting the parent fallback");
});

test("live and restored child cards render the same persisted message", () => {
  const events = pageMarkdown("runtime/events");

  assertClaim(events, {
    all: [/\blive\b/i, /\brestor\w*\b/i, /\bsame\b/i, /\bpersisted\b/i, /\bmessage\b/i],
    none: [
      negated("use", "render", "show", "share", "displa", "replay"),
      /\bwould\b|\bonly if\b|\bunless\b|\bdiffer\w*\b|\binstead of\b|\brather than\b/i,
    ],
  }, "live and restored child cards must render the same persisted message");

  assertClaim(events, {
    all: [/\bcodec\b\s+(?:itself\s+)?(?:adds no|add no|does not add|do not add|never adds?|adds nothing|writes no)\b[^.;!?]{0,40}\bprefix/i],
    none: [/\bsuffix\b/i, /\bthough\b|\bbut it does\b/i, /\bunlike\b|\bexcept\b/i],
  }, "the codec must be documented as adding no prefix to the persisted message");

  refuteClaim(events, {
    all: [/\b(?:codec|restore|replay)\b[^.;!?]{0,60}\b(?:adds|prepends|inserts|attaches|wraps)\b\s+(?:an?|the|its|another)\b[^.;!?]{0,30}\bprefix/i],
  }, "the codec must not be documented as adding a prefix");

  refuteClaim(events, {
    all: [/\b(?:codec|restore|replay)\b[^.;!?]{0,60}\b(?:prefixes|prepends)\b/i],
    none: [negated("prefix", "prepend")],
  }, "the codec must not be documented as prefixing the persisted message");

  refuteClaim(events, {
    all: [/\bin front of\b[^.;!?]{0,60}\b(?:persisted )?message\b/i],
  }, "nothing may be documented as placed in front of the persisted message");
});
