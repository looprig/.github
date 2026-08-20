import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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

function assertSemanticParagraph(markdown, patterns, message) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim());
  assert.ok(
    paragraphs.some((paragraph) => patterns.every((pattern) => pattern.test(paragraph))),
    message,
  );
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
    "/docs/guides/harness/",
    "/docs/guides/tools/",
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

test("failed child cards show a bounded failure reason", () => {
  const events = pageMarkdown("runtime/events");

  assertSemanticParagraph(events, [
    /\bfailed\b/i,
    /\bchild\b/i,
    /\bcard\b/i,
    /\b(?:failure|terminal) reason\b/i,
    /\b(?:bound|truncat)\w*\b/i,
  ], "failed child cards must document their bounded failure reason");
});

test("a nil child failure reason preserves the parent fallback", () => {
  const events = pageMarkdown("runtime/events");

  assertSemanticParagraph(events, [
    /\bnil\b/i,
    /\breason\b/i,
    /\b(?:preserv|retain|keep)\w*\b/i,
    /\bparent\b/i,
    /\bfallback\b/i,
  ], "nil child reasons must preserve the parent fallback");
});

test("live and restored child cards use the same persisted message without a codec prefix", () => {
  const events = pageMarkdown("runtime/events");

  assertSemanticParagraph(events, [
    /\blive\b/i,
    /\brestor\w*\b/i,
    /\bsame\b/i,
    /\bpersisted message\b/i,
    /\bcodec\b/i,
    /\bprefix\w*\b/i,
    /\b(?:no|not|never|without)\b/i,
  ], "live and restored cards must share the persisted message without codec-added prefixes");
});
