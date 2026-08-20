import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { assertClaim, negated, refuteClaim } from "./claims.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const topics = ["rig", "loop", "turn", "step", "hustles", "compaction"];

test("Harness runtime concepts have dedicated consumer guides", () => {
  const landing = fs.readFileSync(path.join(root, "docs/guides/harness.md"), "utf8");

  for (const topic of topics) {
    const page = path.join(root, `docs/guides/harness/${topic}/index.md`);
    assert.equal(fs.existsSync(page), true, `${topic} guide must exist`);
    assert.match(landing, new RegExp(`/docs/guides/harness/${topic}`));
  }
});

test("Harness runtime guides explain APIs with source-backed Go examples", () => {
  for (const topic of topics) {
    const guide = fs.readFileSync(path.join(root, `docs/guides/harness/${topic}/index.md`), "utf8");
    assert.match(guide, /```go[\s\S]+?```/, `${topic} needs a Go example`);
    assert.match(guide, /^## (How it works|Lifecycle|Configure|Run|Observe|When to use)/m, `${topic} needs an operational section`);
    assert.doesNotMatch(guide, /GOWORK=off|source-workspace|proof ID|workflow job/i);
  }
});

test("Turn and Step explain their different execution boundaries", () => {
  const turn = fs.readFileSync(path.join(root, "docs/guides/harness/turn/index.md"), "utf8");
  const step = fs.readFileSync(path.join(root, "docs/guides/harness/step/index.md"), "utf8");

  assert.match(turn, /one user input/i);
  assert.match(turn, /one or more steps/i);
  assert.match(step, /model request/i);
  assert.match(step, /tool call/i);
  assert.match(step, /StepDone/);
});

test("Hustles and compaction stay inside the Harness hierarchy", () => {
  const hustles = fs.readFileSync(path.join(root, "docs/guides/harness/hustles/index.md"), "utf8");
  const compaction = fs.readFileSync(path.join(root, "docs/guides/harness/compaction/index.md"), "utf8");

  assert.match(hustles, /hustle\.Define/);
  assert.match(hustles, /rig\.WithHustles/);
  assert.match(compaction, /loop\.WithCompaction/);
  assert.match(compaction, /context counter/i);
});

const delegationPage = () => fs.readFileSync(path.join(root, "docs/guides/harness/delegation/start-and-message.md"), "utf8");
const toolResultsPage = () => fs.readFileSync(path.join(root, "docs/guides/harness/step/tool-calls-and-results.md"), "utf8");

test("AgentTools failures distinguish preparation from execution", () => {
  const guides = `${delegationPage()}\n\n${toolResultsPage()}`;

  // Each phase needs its own sentence: a sentence about execution that merely
  // mentions the word "preparation" must not satisfy the preparation contract.
  for (const [phase, pattern, exclude] of [
    ["preparation", /\bpreparation failure\b|\bprepar\w*\b/i, /\bexecution\b/i],
    ["execution", /\bexecution failure\b|\bwhile running\b/i, /\bpreparation failure\b/i],
  ]) {
    assertClaim(guides, {
      all: [/\bAgentTools\b|\bdelegat\w*\b/i, pattern, /\b(?:fail|error)\w*\b/i],
      none: [negated("fail", "error"), exclude],
    }, `AgentTools documentation must describe ${phase} failures in their own statement`);
  }
});

test("AgentTools preparation failures name the rejected field and value", () => {
  const guide = delegationPage();

  for (const [label, rejection, named] of [
    ["invalid", /\binvalid\b|\bunknown\b|\bmalformed\b/i, /\bfield\b/i],
    ["unavailable", /\bunavailable\b|\bnot configured\b|\bunconfigured\b/i, /\bselector\b/i],
  ]) {
    assertClaim(guide, {
      all: [/\bruntime\b/i, /\bselect\w*\b/i, rejection, named, /\bvalue\b/i, /\b(?:reject|error|fail)\w*\b/i],
      none: [negated("name", "identif", "report", "includ")],
    }, `a ${label} runtime selector error must name what it rejected and its value`);
  }

  refuteClaim(guide, {
    all: [/\bruntime\b/i, /\bselect\w*\b/i, /\b(?:field|value)\b/i, /\b(?:omit|hide|withhold|redact|suppress)\w*\b/i],
    none: [/\bdoes not\b[^.;!?]{0,20}\b(?:omit|hide|withhold|redact|suppress)\w*|\bnever\b[^.;!?]{0,20}\b(?:omit|hide|withhold|redact|suppress)\w*/i],
  }, "runtime selector errors must not be documented as hiding the field or value");
});

test("failed AgentTools calls return error-marked tool results to model history", () => {
  const guides = `${delegationPage()}\n\n${toolResultsPage()}`;

  assertClaim(guides, {
    all: [
      /\bAgentTools\b/,
      /\b(?:fail|error)\w*\b/i,
      /\btool results?\b|\bToolResultMessage\b/i,
      /\berror-marked\b|\bIsError\b/i,
      /\bmodel history\b|\bnext model request\b/i,
    ],
    none: [negated("deliver", "reach", "becom", "mark", "return", "carr")],
  }, "failed AgentTools calls must become error-marked tool results in model history");

  refuteClaim(guides, {
    all: [
      /\bAgentTools\b|\bdelegat\w*\b/i,
      /\b(?:fail|error)\w*\b/i,
      /\bmodel history\b|\bmodel request\b|\bmodel\b/i,
      /\b(?:drop|dropped|discard|discarded|swallow|swallowed|hidden|hide|suppress|suppressed|lost)\w*\b/i,
    ],
    none: [/\b(?:does not|never|is not|are not)\b[^.;!?]{0,20}\b(?:drop|discard|swallow|hide|suppress|lose|lost)\w*/i, /\bnever reaches\b/i],
  }, "failed AgentTools calls must not be documented as dropped before model history");

  refuteClaim(guides, {
    all: [/\bAgentTools\b|\bdelegat\w*\b/i, /\b(?:fail|error)\w*\b/i, /\bnever reaches\b|\bdoes not reach\b/i, /\bmodel history\b/i],
  }, "a failed AgentTools call must not be documented as never reaching model history");
});

test("child failure causes survive foreground, background, native, foreign, ACP, and restore paths", () => {
  const guide = delegationPage();

  assertClaim(guide, {
    all: [
      /\bchild\b/i,
      /\b(?:failure|cause|reason|detail)s?\b/i,
      /\bforeground\b/i,
      /\bbackground\b/i,
      /\bnative\b/i,
      /\bforeign\b/i,
      /\brestor\w*\b/i,
      /\b(?:surviv|preserv|retain|carr|reach)\w*\b/i,
    ],
    none: [negated("surviv", "preserv", "retain", "carr", "reach")],
  }, "child failure causes must survive every documented delivery and restore path");

  refuteClaim(guide, {
    all: [
      /\bchild\b/i,
      /\b(?:failure|cause|reason|detail)s?\b/i,
      new RegExp([
        // passive: "the cause is ... lost"
        String.raw`\b(?:is|are|was|were|gets?|becomes?)\b(?:(?!\b(?:not|never|no|nothing)\b)[^.;!?]){0,60}\b(?:lost|dropped|discarded|cleared|erased|omitted|suppressed|truncated away|gone|missing|disappears?)\b`,
        // active: "Harness discards the child failure cause"
        String.raw`\b(?:discard|drop|lose|loses|clear|erase|omit|suppress|forget)\w*\b(?:(?!\b(?:not|never|no|nothing)\b)[^.;!?]){0,40}\b(?:cause|reason|detail|failure)s?\b`,
        // intransitive: "the cause disappears after restore"
        String.raw`\b(?:cause|reason|detail|failure)s?\b(?:(?!\b(?:not|never|no|nothing)\b)[^.;!?]){0,40}\b(?:disappears?|vanish\w*|goes missing|is gone)\b`,
        negated("surviv", "preserv", "retain", "carr", "reach").source,
      ].join("|"), "i"),
    ],
    none: [/\btombston\w*\b/i],
  }, "child failure causes must not be documented as lost on any path");

  // An ACP child is a foreign loop; Harness has no separate ACP failure route.
  assertClaim(guide, {
    all: [/\bACP\b[^.;!?]{0,40}\bchild\b[^.;!?]{0,80}\bforeign\b/i,
      /\bis a foreign\b|\bis the foreign\b|\buses the foreign\b|\btakes the foreign\b|\bruns as a foreign\b/i],
    none: [negated("use", "take"), /\bunlike\b|\bneither\b|\bdifferent\b|\bnot the same\b|\bown\b/i],
  }, "an ACP child must be documented as using the foreign path");

  // The one documented gap: a tombstoned child restores as failed with no cause.
  assertClaim(guide, {
    all: [/\btombston\w*\b/i, /\brestor\w*\b/i, /\bfailed\b/i, /\bno (?:cause|detail|reason)\b/i],
  }, "the tombstoned-child exception must be documented");
});

test("background delegation hands back a failure without an error marker", () => {
  const guide = delegationPage();

  assertClaim(guide, {
    all: [
      /\bbackground\b/i,
      /\bhand-?back\b|\bresult\b/i,
      /\barrives as a user(?:-| )(?:role )?message\b|\bis a user(?:-| )(?:role )?message\b/i,
      /\b(?:is not|never)\b[^.;!?]{0,40}\berror-marked\b|\bno `?IsError`?\b|\bcarries no\b[^.;!?]{0,20}\bIsError\b/i,
    ],
  }, "background delegation must be documented as handing back a user message rather than an error-marked tool result");

  refuteClaim(guide, {
    all: [/\bbackground\b/i, /\bhand-?back\b|\bresult\b/i, /\barrives as an error-marked\b|\bis an error-marked\b/i],
  }, "a background hand-back must not be documented as error-marked");
});

test("failure details are bounded, UTF-8 normalized, and not classification-filtered", () => {
  const guides = `${delegationPage()}\n\n${toolResultsPage()}`;

  assertClaim(guides, {
    all: [/\b(?:detail|cause|reason)s?\b/i, /\bbound\w*\b/i, /UTF-?8/i, /\bnormaliz\w*\b/i],
    none: [negated("bound", "normaliz")],
  }, "failure details must be bounded and UTF-8 normalized");

  assertClaim(guides, {
    all: [
      /\b(?:detail|cause|reason)s?\b/i,
      /\b(?:preserv|pass|reach|surviv|kept|keeps|deliver)\w*\b/i,
      /\bcredential\w*\b|\bmodel-facing\b/i,
      new RegExp(String.raw`\b(?:regardless of|independent of|without regard to)\b[^.;!?]{0,40}\b(?:filter|classif)\w*|${negated("filter", "classif", "redact", "suppress").source}`, "i"),
    ],
  }, "failure details must not depend on credential or model-facing classification");

  refuteClaim(guides, {
    all: [
      /\b(?:detail|cause|reason)s?\b/i,
      /\b(?:filter|classif)\w*\b/i,
      /\bcredential\w*\b|\bmodel-facing\b/i,
    ],
    none: [/\bregardless\b|\bindependent\b/i, negated("filter", "classif", "redact", "suppress")],
  }, "failure details must not be documented as credential- or model-facing-classified");
});
