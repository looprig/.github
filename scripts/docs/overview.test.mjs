import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const overview = readFileSync(path.join(root, "docs/index.md"), "utf8");

test("the documentation landing page is labeled Overview", () => {
  assert.match(overview, /^title: Overview$/m);
  assert.match(overview, /^# Overview$/m);
  assert.doesNotMatch(overview, /Looprig developer documentation/);
});

test("the landing page leads consumers into the product without publication mechanics", () => {
  assert.doesNotMatch(overview, /Publication labels|source-workspace|unavailable|immutable tag|coordinated source workspace|Kosa/i);
  assert.doesNotMatch(overview, /\]\(\/docs\/[^)#]+\/\)/, "overview links must use emitted canonical routes");
  for (const destination of [
    "/docs/start/choose-a-path",
    "/docs/guides/inference",
    "/docs/guides/harness",
    "/docs/guides/tools",
    "/docs/guides/sandboxing",
  ]) assert.match(overview, new RegExp(destination.replaceAll("/", "\\/")));
});
