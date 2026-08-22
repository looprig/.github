import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspaceRoot = resolveWorkspaceRoot(root);

const pages = [
  "index",
  "cases-and-runs/index",
  "cases-and-runs/cases-and-suites",
  "cases-and-runs/runs-and-results",
  "evaluators/index",
  "evaluators/exact",
  "evaluators/judge",
  "reporting/index",
  "integration/index",
  "integration/composition-and-testing",
  "integration/pluto",
];

const sourceProof = {
  index: ["run.go", "examples/exact/example_test.go"],
  "cases-and-runs/index": ["scenario.go", "suite.go", "run.go"],
  "cases-and-runs/cases-and-suites": ["scenario.go", "suite.go", "scenario_test.go"],
  "cases-and-runs/runs-and-results": ["run.go", "run_race_test.go", "report.go"],
  "evaluators/index": ["evaluator.go", "assessment.go", "evaltest/assert.go"],
  "evaluators/exact": ["exact/text.go", "exact/tool.go", "exact/text_test.go"],
  "evaluators/judge": ["judge/judge.go", "judge/schema.go", "examples/judge/example_test.go"],
  "reporting/index": ["reportjson/sink.go", "reportjson/codec.go"],
  "integration/index": ["target/inference/target.go", "target/inference/target_integration_test.go"],
  "integration/composition-and-testing": ["target/inference/target.go", "target/inference/target_integration_test.go", "evaltest/run.go"],
  "integration/pluto": ["pkg/run/run.go", "pkg/qual/scorecard.go", "pkg/profile/evaluate.go"],
};

function slug(heading) {
  return heading
    .replace(/`/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "Evals page must have frontmatter");
  return match[1];
}

function readPage(relative) {
  const file = path.join(root, "docs/guides/evals", `${relative}.md`);
  assert.equal(fs.existsSync(file), true, `missing Evals page ${relative}`);
  return fs.readFileSync(file, "utf8");
}

test("Evals guides exist in the approved developer-facing order", () => {
  for (const relative of pages) {
    const markdown = readPage(relative);
    assert.match(markdown, new RegExp(`^id: guides/evals/${relative.replaceAll("/", "\\/")}$`, "m"));
    assert.match(markdown, /^title: .+$/m, `missing title in ${relative}`);
    assert.match(markdown, /^order: \d+$/m, `missing order in ${relative}`);
    assert.match(markdown, /^proofs:\n(?:  .+\n)+/m, `missing proof mappings in ${relative}`);
    assert.match(markdown, /^## Source$/m, `missing source section in ${relative}`);
    assert.match(markdown, /^## Proof$/m, `missing proof section in ${relative}`);
    const fm = frontmatter(markdown);
    for (const heading of markdown.matchAll(/^#{2,6} (.+)$/gm)) {
      const headingSlug = slug(heading[1]);
      assert.match(fm, new RegExp(`^  ${headingSlug}:`, "m"), `${relative} missing proof mapping for ${heading[1]}`);
    }
    assert.match(markdown, /```go\n|```mermaid\n|^\| .+ \|$/m, `missing technical content in ${relative}`);
    assert.doesNotMatch(markdown, /<!-- scaffold|planned developer guide|content pass/i, relative);
    assert.doesNotMatch(markdown, /GOWORK|repository setup|workspace setup|repository instructions/i, relative);
    assert.doesNotMatch(markdown, /—/, `${relative} uses an em dash`);
    assert.doesNotMatch(markdown, /\]\(\.\.?\//, `${relative} uses a relative internal link`);
  }
});

test("Evals guides interlink the contracts and their runtime references", () => {
  const index = readPage("index");
  const cases = readPage("cases-and-runs/cases-and-suites");
  const runs = readPage("cases-and-runs/runs-and-results");
  const casesAndRuns = readPage("cases-and-runs/index");
  const gates = readPage("evaluators/index");
  const exact = readPage("evaluators/exact");
  const judge = readPage("evaluators/judge");
  const reporting = readPage("reporting/index");
  const integration = readPage("integration/index");
  const composition = readPage("integration/composition-and-testing");
  const pluto = readPage("integration/pluto");

  assert.match(index, /\/docs\/guides\/evals\/cases-and-runs/);
  assert.match(index, /\/docs\/guides\/evals\/cases-and-runs\/cases-and-suites/);
  assert.match(index, /\/docs\/guides\/evals\/cases-and-runs\/runs-and-results/);
  assert.match(index, /\/docs\/guides\/inference\/requests\/model-selection/);
  assert.match(casesAndRuns, /\/docs\/guides\/evals\/cases-and-runs\/cases-and-suites/);
  assert.match(casesAndRuns, /\/docs\/guides\/evals\/cases-and-runs\/runs-and-results/);
  assert.match(cases, /\/docs\/guides\/evals\/cases-and-runs\/runs-and-results/);
  assert.match(runs, /\/docs\/guides\/evals\/reporting/);
  assert.match(gates, /\/docs\/guides\/evals\/evaluators\/exact/);
  assert.match(gates, /\/docs\/guides\/evals\/evaluators\/judge/);
  assert.match(exact, /\/docs\/guides\/evals\/evaluators/);
  assert.match(judge, /\/docs\/guides\/inference\/structured-output/);
  assert.match(judge, /\/docs\/guides\/evals\/reporting/);
  assert.match(reporting, /\/docs\/guides\/evals\/cases-and-runs\/runs-and-results/);
  assert.match(integration, /\/docs\/guides\/evals\/integration\/composition-and-testing/);
  assert.match(integration, /\/docs\/guides\/evals\/integration\/pluto/);
  assert.match(composition, /\/docs\/guides\/inference\/requests\/model-selection/);
  assert.match(composition, /\/docs\/guides\/harness/);
  assert.match(composition, /\/docs\/guides\/evals\/evaluators\/judge/);
  assert.match(pluto, /\/docs\/guides\/evals\/cases-and-runs\/runs-and-results/);
  assert.doesNotMatch(`${index}${casesAndRuns}${cases}${runs}${gates}${exact}${judge}${reporting}${integration}${composition}${pluto}`, /policy53|kosa/i);
});

test("Evals guides link every proof claim to existing eval or Pluto source", () => {
  for (const [relative, files] of Object.entries(sourceProof)) {
    const markdown = readPage(relative);
    const owner = relative === "integration/pluto" ? "pluto" : "eval";
    for (const file of files) {
      const sourceUrl = `https://github.com/looprig/${owner}/blob/main/${file}`;
      assert.match(markdown, new RegExp(sourceUrl.replaceAll("/", "\\/")), `${relative} does not link ${file}`);
      const sourceRoot = path.join(workspaceRoot, owner);
      assert.equal(fs.existsSync(path.join(sourceRoot, file)), true, `missing source ${owner}/${file}`);
    }
  }
});

test("Evals guides prove the safety-critical output contracts", () => {
  const all = pages.map(readPage).join("\n");

  assert.match(all, /StatusUnverified|status=unverified/);
  assert.match(all, /TargetErr|target-stage/);
  assert.match(all, /Concurrency|concurrency/);
  assert.match(all, /RequiredText\("/);
  assert.match(all, /ForbiddenText\("/);
  assert.match(all, /ScoreSchemaV1|score\/v1/);
  assert.match(all, /Strict\s*:\s*true|strict structured/i);
  assert.match(all, /NewFileSink|FileSink/);
  assert.match(all, /report\/v1/);
  assert.match(all, /atomic|same directory/i);
  assert.match(all, /theme.*dark/i);
  assert.match(all, /```mermaid[\s\S]*sequenceDiagram/);
});
