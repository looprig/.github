import assert from "node:assert/strict";
import test from "node:test";

import {
  PRIVATE_DETAIL_PATTERNS,
  assertClaim,
  assertNoPrivateDetails,
  fencedBlocks,
  matchingStatements,
  negated,
  orderedListItems,
  refuteClaim,
  section,
  statements,
} from "./claims.mjs";

test("statements rejoin wrapped lines and keep list items apart", () => {
  assert.deepEqual(statements("A cause survives every path,\nincluding restore.\n\n- One item.\n- Two items.\n"), [
    "A cause survives every path, including restore.",
    "One item.",
    "Two items.",
  ]);
});

test("statements exclude frontmatter, HTML comments, blockquotes, and indented code", () => {
  const markdown = [
    "---",
    "id: guides/example",
    "description: PATH always wins and the codec adds a prefix.",
    "---",
    "",
    "<!-- PATH always wins. -->",
    "",
    "> A quoted claim that PATH always wins.",
    "",
    "Example:",
    "",
    "    // PATH always wins.",
    "",
    "Real prose only.",
  ].join("\n");
  assert.deepEqual(statements(markdown), ["Example:", "Real prose only."]);
});

test("statements exclude fenced code, table rows, and headings", () => {
  const markdown = [
    "| Cause | foreground | background | preserved |",
    "| --- | --- | --- | --- |",
    "",
    "```go",
    "// the cause is preserved across foreground and background delivery",
    "```",
    "",
    "## Preserved causes",
    "",
    "Real prose only.",
  ].join("\n");
  assert.deepEqual(statements(markdown), ["Real prose only."]);
});

test("statements do not split a colon lead-in but do split sentences and clauses", () => {
  assert.deepEqual(statements("Precedence: the override is read first; PATH is last. Restart afterwards."), [
    "Precedence: the override is read first;",
    "PATH is last.",
    "Restart afterwards.",
  ]);
});

test("a longer inner fence cannot desynchronize fence tracking", () => {
  const markdown = ["## A", "", "````text", "```", "````", "", "## B", "", "Body of B.", ""].join("\n");
  assert.equal(section(markdown, "B"), "\nBody of B.\n");
  assert.deepEqual(statements(markdown), ["Body of B."]);
});

test("section is depth-aware, tolerates closed ATX headings, and rejects duplicates", () => {
  const markdown = ["## Install", "", "One.", "", "### Install notes", "", "Two.", "", "## Next ##", "", "Three."].join("\n");
  assert.match(section(markdown, "Install"), /One\./);
  assert.match(section(markdown, "Install"), /Two\./);
  assert.equal(section(markdown, "Install notes"), "\nTwo.\n");
  assert.equal(section(markdown, "Next"), "\nThree.");
  assert.equal(section(markdown, "Absent"), undefined);
  assert.throws(() => section("## A\n\nOne.\n\n## A\n\nTwo.\n", "A"), /appears 2 times/);
});

test("fencedBlocks accept info strings and language lists", () => {
  const markdown = ['```sh title="install"', "go install example.com/cmd@v1.0.0", "```", "", "```bash", "echo hi", "```"].join("\n");
  assert.deepEqual(fencedBlocks(markdown, "sh"), ["go install example.com/cmd@v1.0.0\n"]);
  assert.deepEqual(fencedBlocks(markdown, ["sh", "bash"]), ["go install example.com/cmd@v1.0.0\n", "echo hi\n"]);
  assert.deepEqual(fencedBlocks(markdown, "go"), []);
});

test("orderedListItems ignore fenced lists, fold continuations, and stop at a restarted list", () => {
  const markdown = [
    "```text",
    "1. not a real list",
    "```",
    "",
    "1. First item that wraps",
    "lazily onto another line.",
    "2. Second item",
    "   with an indented continuation.",
    "",
    "1. A different list.",
  ].join("\n");
  assert.deepEqual(orderedListItems(markdown), [
    "First item that wraps lazily onto another line.",
    "Second item with an indented continuation.",
  ]);
});

test("negated matches a denied claim verb and ignores an unrelated denial", () => {
  const pattern = negated("surviv", "preserv", "retain");
  assert.match("Child failure reasons are not preserved across restore.", pattern);
  assert.match("The cause is never silently retained.", pattern);
  // A denial of some other verb, with and without the comma that used to be
  // the only reason these passed, is not a denial of this claim.
  assert.doesNotMatch("A failed call is not dropped, and the cause survives restore.", pattern);
  assert.doesNotMatch("A failed call is not dropped and the cause survives restore.", pattern);
  assert.doesNotMatch("The cause is not dropped and survives restore.", pattern);
  assert.doesNotMatch("Details are preserved, not truncated, on the restore path.", pattern);
});

test("negated covers bare negators, punctuation, and a multi-word gap", () => {
  assert.match("No restart is needed when the launcher changes.", negated("restart", "need"));
  assert.match("Carbon does not, in this release, need a restart.", negated("restart", "need"));
  assert.match("An unavailable launcher is never a reason to drop a harness.", negated("drop", "remov"));
  assert.match("Neither path is preserved.", negated("preserv"));
  assert.match("The detail is no longer retained.", negated("retain"));
});

test("orderedListItems keep fenced blocks, nested bullets, and loose continuations inside an item", () => {
  assert.deepEqual(
    orderedListItems("1. Export the override:\n\n   ```sh\n   export X=1\n   ```\n\n2. Restart Carbon.\n3. Check PATH."),
    ["Export the override:", "Restart Carbon.", "Check PATH."],
  );
  assert.equal(orderedListItems("1. First:\n   - a\n   - b\n2. Second\n3. Third").length, 3);
  assert.equal(orderedListItems("1. First\n\n   more about first\n2. Second\n3. Third").length, 3);
});

test("statements keep an abbreviation inside its sentence", () => {
  assert.deepEqual(statements("The override wins, e.g. when the variable is set."), [
    "The override wins, e.g. when the variable is set.",
  ]);
});

test("assertClaim names the none-guard that rejected the closest statement", () => {
  assert.throws(
    () => assertClaim("A child failure cause is not preserved across restore.", {
      all: [/\bchild\b/, /\bcause\b/],
      none: [negated("preserv")],
    }, "causes must survive"),
    /rejected by: /,
  );
});

test("assertNoPrivateDetails reports the leaking category", () => {
  assert.throws(() => assertNoPrivateDetails("Run /Users/example/bin/carbon.", "Carbon"), /personal home path/);
  assertNoPrivateDetails("Run `<absolute-path-to-launcher>`.", "Carbon");
});

test("fencedBlocks return nothing for an unclosed block", () => {
  assert.deepEqual(fencedBlocks("```sh\ngo install example.com/cmd@v1.0.0\n", "sh"), []);
});

test("claim objects are validated so a typo cannot pass vacuously", () => {
  assert.throws(() => matchingStatements("Text.", { alls: [/Text/] }), /unknown claim key/);
  assert.throws(() => matchingStatements("Text.", {}), /at least one required pattern/);
});

test("assertClaim reports the closest statement and its missing patterns", () => {
  assert.throws(
    () => assertClaim("The cause survives restore.", { all: [/\bcause\b/, /\bforeground\b/] }, "needs foreground"),
    /closest statement: The cause survives restore\.[\s\S]*missing: .*foreground/,
  );
});

test("refuteClaim names the counterexample it found", () => {
  assert.throws(
    () => refuteClaim("PATH always wins.", { all: [/\bPATH\b[^.;!?]{0,40}\bwins\b/] }, "PATH must not win"),
    /PATH must not win: PATH always wins\./,
  );
});

test("private-detail patterns catch machine-local values", () => {
  const flagged = (sample) => PRIVATE_DETAIL_PATTERNS.filter(([, pattern]) => pattern.test(sample)).map(([label]) => label);

  for (const leak of [
    "/Users/example/.nvm/versions/node/v22.14.0/bin/claude",
    "/home/example/bin/claude",
    '"session_id": "01HZX9K2QF8RT4"',
    "session-4f3a9b81c2d7e5f0",
    "The transcript id is 01HZX9K2QF8RT4.",
    "~/.looprig/carbon/sessions/01HZX9K2QF8RT4/transcript.jsonl",
    "2026-08-20T06:38:34Z",
    "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
  ]) {
    assert.notDeepEqual(flagged(leak), [], `unflagged leak: ${leak}`);
  }

  for (const legitimate of [
    '"session_timeout_seconds": 900',
    "`session_timeout_seconds` bounds an idle session.",
    "CARBON_CLAUDE_ACP_EXECUTABLE",
    "`<absolute-path-to-launcher>`",
    "Session identifiers are never written to public documentation.",
    "acp_launchers maps a harness to its launcher command.",
    "Timestamps use Go's 2006-01-02T15:04:05Z07:00 reference layout.",
  ]) {
    assert.deepEqual(flagged(legitimate), [], `legitimate text flagged: ${legitimate}`);
  }
});
