import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  assertClaim,
  assertNoPrivateDetails,
  fencedBlocks,
  orderedListItems,
  negated,
  refuteClaim,
  section,
} from "./claims.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const read = (name) => readFileSync(path.join(root, "docs/products", name), "utf8");

const TROUBLESHOOTING = "ACP launcher troubleshooting";

function troubleshooting() {
  const body = section(read("carbon.md"), TROUBLESHOOTING);
  assert.ok(body, `Carbon is missing its "${TROUBLESHOOTING}" section`);
  return body;
}

test("Products contains only Overview, Carbon, and Pluto", () => {
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  assert.deepEqual(
    navigation.pages.filter(({ path: page }) => page.startsWith("products/")).map(({ path: page }) => page),
    ["products/index.md", "products/carbon.md", "products/pluto.md"],
  );
});

test("Carbon is one practical coding-agent page with concise feature coverage", () => {
  const page = read("carbon.md");
  assert.match(page, /Carbon is a coding agent/i);
  assert.match(page, /```json[\s\S]*"models"[\s\S]*```/);
  for (const feature of ["Coding tools", "Permission gates and classifiers", "Subagents", "Claude Code and Codex through ACP", "MCP", "Compaction", "Sessions and restore", "Workspaces", "Model proxy", "TUI and browser clients"]) {
    assert.match(page, new RegExp(`^### ${feature}`, "m"), `Carbon omits ${feature}`);
  }
});

test("the Carbon Install command pins v0.23.0", () => {
  const install = section(read("carbon.md"), "Install");
  assert.ok(install, "Carbon is missing its Install section");
  const [command] = fencedBlocks(install, ["sh", "bash", "shell"]);
  assert.ok(command, "Carbon Install needs a shell block");

  const pins = [...command.matchAll(/go install (\S+?)@(v\S+)/g)].map(([, module, version]) => [module, version]);
  assert.deepEqual(pins, [["github.com/looprig/carbon/cmd/carbon", "v0.23.0"]]);
});

test("Carbon resolves ACP launchers as an ordered override, configuration, PATH list", () => {
  const body = troubleshooting();
  const steps = orderedListItems(body);
  assert.ok(steps.length >= 3, "launcher resolution must be an ordered list");

  const [override, configured, discovered] = steps;
  assert.match(override, /\bnon-?empty\b/i, "the first launcher source must require a nonempty value");
  assert.match(override, /\benvironment\b/i, "the first launcher source must be an environment override");
  assert.match(override, /\bharness\b|_ACP_[A-Z_]*\b/, "the environment override must be harness-specific");
  assert.match(configured, /\bacp_launchers\b/, "the second launcher source must be configured acp_launchers");
  assert.match(configured, /\bconfigur\w*\b/i, "the second launcher source must be configuration");
  assert.match(discovered, /\bPATH\b/, "the third launcher source must be PATH");

  assert.match(override, /\bfirst\b/i, "the environment override must be named as the first source");
  assert.match(discovered, /\blast\b|\bfinally\b|\bfall(?:s|ing)?[ -]?back\b|\bfallback\b/i, "PATH must be named as the last source");

  assertClaim(body, {
    all: [
      /\blauncher\b/i,
      /\bresolv\w*\b/i,
      /\b(?:fixed|this|the following) order\b|\bin order\b|\bfirst source\b/i,
    ],
    none: [negated("resolv", "decid", "yield")],
  }, "the troubleshooting section must state that launcher sources are tried in a fixed order");
});

test("Carbon never claims PATH outranks the override or configured launchers", () => {
  const body = troubleshooting();
  // The precedence verb must follow its subject: co-occurrence alone cannot tell
  // "PATH wins over the override" from "the override wins over PATH".
  const OUTRANKS = String.raw`[^.;!?]{0,60}\b(?:wins|outranks|shadows|supersedes|overrides|beats|takes precedence|takes priority|has priority|is preferred|is used instead|comes first|is checked first|is consulted first|is searched first|is consulted before|is checked before)\b`;

  refuteClaim(body, {
    all: [new RegExp(String.raw`\bPATH\b${OUTRANKS}`, "i")],
  }, "PATH must not be documented as outranking an earlier launcher source");
  refuteClaim(body, {
    all: [new RegExp(String.raw`\bacp_launchers\b${OUTRANKS}[^.;!?]{0,60}\benvironment\b`, "i")],
  }, "configured acp_launchers must not be documented as outranking the environment override");
  // The same inversion stated as a condition rather than a verb.
  refuteClaim(body, {
    all: [/\b(?:environment override|acp_launchers)\b[^.;!?]{0,80}\bonly\b[^.;!?]{0,80}\bPATH\b/i],
  }, "an earlier launcher source must not be documented as conditional on PATH");
});

test("Carbon admits only a clean absolute path to a regular executable file", () => {
  const body = troubleshooting();

  assertClaim(body, {
    all: [/\babsolute\b/i, /\bregular\b/i, /\bexecutable\b/i, /\b(?:requir|verif|admit|accept|must)\w*\b/i],
    none: [negated("requir", "verif", "admit", "accept", "must")],
  }, "Carbon must require an absolute path to a regular executable file");

  assertClaim(body, {
    all: [
      /\bsymlink\w*\b/i,
      /\b(?:reject|refus|decline)\w*\b/i,
      /\bpath component\b|\bpath segment\b|\bparent director\w*\b|\bancestor\b|\bevery (?:position|element)\b|\bany (?:part|element|position)\b/i,
    ],
    none: [/\bonly the executable\b/i, negated("reject", "refus", "decline")],
  }, "Carbon must reject symlinked path components, not merely a symlinked executable");

  refuteClaim(body, {
    all: [/\bsymlink\w*\b/i, /\b(?:allow|permit|accept|support|tolerat)\w*\b|\b(?:fine|okay|harmless|unaffected)\b/i],
    none: [negated("allow", "permit", "accept", "support", "tolerat")],
  }, "Carbon must not document any accepted symlink");
});

test("Carbon requires a restart or reopen after launcher changes", () => {
  assertClaim(troubleshooting(), {
    all: [/\b(?:restart|reopen)\w*\b/i, /\b(?:launcher|configuration)\b/i, /\bchang\w*\b/i],
    none: [negated("restart", "reopen", "need")],
  }, "Carbon must be restarted or reopened after launcher configuration changes");
});

test("Carbon explains that an unavailable launcher withdraws its harness", () => {
  assertClaim(troubleshooting(), {
    all: [
      /\bunavailable\b|\bunresolv\w*\b|\bmissing\b/i,
      /\blauncher\b/i,
      /\bharness\b/i,
      /\b(?:remov|withdraw|omit|exclud|drop|disappear)\w*\b/i,
      /\bruntime\b/i,
      /\bchoices?\b|\boptions?\b|\bcatalog\b|\badvertis\w*\b/i,
    ],
    none: [negated("remov", "withdraw", "omit", "exclud", "drop", "disappear")],
  }, "an unavailable launcher must be documented as removing its harness from the advertised runtime choices");
});

test("Carbon launcher examples use a neutral absolute-path placeholder", () => {
  assert.match(troubleshooting(), /<absolute-path-to-launcher>/, "Carbon needs a neutral launcher path placeholder");
});

test("Carbon carries no personal machine details", () => {
  assertNoPrivateDetails(read("carbon.md"), "Carbon");
  assert.doesNotMatch(read("carbon.md"), /\bipotter\b/i, "Carbon exposes an observed username");
});

test("the Pluto Install command pins the released nested command version", () => {
  const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));
  const record = inventory.modules.find((candidate) => candidate.module === "github.com/looprig/pluto/cmd/pluto");
  assert.equal(record?.publication?.status, "released");
  // A nested module is tagged <dir>/vX.Y.Z but installed at @vX.Y.Z.
  const version = record.publication.tag.split("/").at(-1);

  const install = section(read("pluto.md"), "Install");
  assert.ok(install, "Pluto is missing its Install section");
  const [command] = fencedBlocks(install, ["sh", "bash", "shell"]);
  assert.ok(command, "Pluto Install needs a shell block");

  const pins = [...command.matchAll(/go install (\S+?)@(v\S+)/g)].map(([, module, pinned]) => [module, pinned]);
  assert.deepEqual(pins, [["github.com/looprig/pluto/cmd/pluto", version]]);
});

test("Pluto is one practical evaluation-product page", () => {
  const page = read("pluto.md");
  assert.match(page, /evaluation and qualification/i);
  for (const feature of ["Capability packs", "Evaluation runs", "Qualification profiles", "Pricing and comparison", "Reports", "CI qualification"]) {
    assert.match(page, new RegExp(`^### ${feature}`, "m"), `Pluto omits ${feature}`);
  }
});
