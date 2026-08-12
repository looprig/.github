import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");

function page(relative) {
  return fs.readFileSync(path.join(root, "docs", relative), "utf8");
}

test("Build 01 names the released inference model contract", () => {
  const content = page("build/01-model-access.md");

  assert.match(content, /`model\.Model`/);
  assert.match(content, /github\.com\/looprig\/inference\/blob\/v0\.9\.2\/model\/model\.go/);
  assert.doesNotMatch(content, /`inference\.Model`/);
});

test("Build 08 describes counters as preflight ContextCounters", () => {
  const content = page("build/08-providers-and-counters.md");

  assert.match(content, /contextcount\.ContextCounter/);
  assert.match(content, /CountContext/);
  assert.match(content, /input-context tokens as a preflight operation/i);
  assert.match(content, /fail(?:s|ure)? closed/i);
  assert.match(content, /github\.com\/looprig\/llm\/blob\/v0\.13\.3\/auto\/counter\.go/);
  assert.doesNotMatch(content, /counter (?:wraps|is a wrapper)|usage-accounting wrapper/i);
});

test("Carbon install documents flag help as an invalid invocation", () => {
  const content = page("carbon/install.md");

  assert.doesNotMatch(content, /carbon\s+--help/);
  assert.match(content, /flag\.ErrHelp/);
  assert.match(content, /invalid flags/);
  assert.match(content, /github\.com\/looprig\/carbon\/blob\/cac0608ae0bd873e35ee793bec5e4a56b02273bd\/cmd\/carbon\/main\.go/);
});
