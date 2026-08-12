import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { normalizeProofMappings } from "./refresh-package-references.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const packageRoot = path.join(root, "docs/reference/packages");
const evidence = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/evidence.json"), "utf8"));
const sourceProofIds = new Set(evidence.proofs.filter((proof) => ["source", "exported-declaration", "test", "module-file", "release-record"].includes(proof.type)).map((proof) => proof.id));

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function frontmatter(markdown) {
  const block = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(block, "package page must have frontmatter");
  const proofs = {};
  let inProofs = false;
  for (const line of block[1].split("\n")) {
    if (line === "proofs:") {
      inProofs = true;
      continue;
    }
    if (inProofs && !line.startsWith("  ")) break;
    const match = inProofs && line.match(/^  ([a-z0-9-]+):\s*(.+)$/);
    if (match) proofs[match[1]] = match[2].replace(/^\[|\]$/g, "").split(",").map((value) => value.trim()).filter(Boolean);
  }
  return proofs;
}

test("generated package pages map every generated subsection to an existing source proof", () => {
  const generatedSections = ["exported-surface", "functions", "methods", "types", "constants", "variables", "ownership-and-errors", "source-and-runnable-proof"];
  const pages = markdownFiles(packageRoot).filter((file) => /### Functions\s/.test(fs.readFileSync(file, "utf8")));
  assert.ok(pages.length > 0, "the generated package corpus must contain Go package pages");
  for (const file of pages) {
    const proofs = frontmatter(fs.readFileSync(file, "utf8"));
    for (const section of generatedSections) {
      assert.ok(proofs[section]?.length, `${path.relative(root, file)} is missing proof mapping for ${section}`);
      for (const proofId of proofs[section]) assert.ok(sourceProofIds.has(proofId), `${path.relative(root, file)} maps ${section} to unknown proof ${proofId}`);
    }
    assert.equal(proofs["functions-and-methods"], undefined, `${path.relative(root, file)} retains a stale functions-and-methods mapping`);
    assert.equal(proofs["constants-and-variables"], undefined, `${path.relative(root, file)} retains a stale constants-and-variables mapping`);
  }
});

test("the package generator normalizes legacy proof keys without inventing a proof id", () => {
  const page = [
    "---",
    "id: reference/packages/example",
    "proofs:",
    "  package-role: release-github-com-looprig-core",
    "  exported-surface: release-github-com-looprig-core",
    "  functions-and-methods: release-github-com-looprig-core",
    "  types: release-github-com-looprig-core",
    "  constants-and-variables: release-github-com-looprig-core",
    "  ownership-and-errors: release-github-com-looprig-core",
    "  source-and-runnable-proof: release-github-com-looprig-core",
    "---",
    "",
    "## Exported surface {#exported-surface}",
    "",
    "### Functions {#functions}",
    "",
    "### Methods {#methods}",
    "",
    "### Types {#types}",
    "",
    "### Constants {#constants}",
    "",
    "### Variables {#variables}",
    "",
    "## Ownership and errors {#ownership-and-errors}",
    "",
    "## Source and runnable proof {#source-and-runnable-proof}",
    "",
  ].join("\n");
  const proofs = frontmatter(normalizeProofMappings(page));
  for (const section of ["exported-surface", "functions", "methods", "types", "constants", "variables", "ownership-and-errors", "source-and-runnable-proof"]) {
    assert.deepEqual(proofs[section], ["release-github-com-looprig-core"]);
  }
  assert.equal(proofs["functions-and-methods"], undefined);
  assert.equal(proofs["constants-and-variables"], undefined);
});
