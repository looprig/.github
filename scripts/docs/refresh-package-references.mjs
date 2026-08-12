#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inventory } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const packageRoot = path.join(root, "docs/reference/packages");

function pagePathFor(item) {
  const repository = item.repository === "flow/store" ? "flow-store" : item.repository;
  const rel = item.relativePath || item.repository.split("/").at(-1);
  const visible = ["classifiers", "harness", "mcp"].includes(repository) && rel.startsWith("pkg/") ? rel.slice(4) : rel;
  return path.join(repository, visible + ".md");
}

function pageId(content) {
  return content.match(/^id: ([^\n]+)/m)?.[1] || "";
}

export function normalizeProofMappings(text) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) return text;
  const lines = frontmatter[1].split("\n");
  const start = lines.indexOf("proofs:");
  if (start < 0) return text;
  let end = start + 1;
  while (end < lines.length && (lines[end].startsWith("  ") || lines[end].trim() === "")) end += 1;
  const existing = new Map();
  for (const line of lines.slice(start + 1, end)) {
    const match = line.match(/^  ([a-z0-9-]+):\s*(.+)$/);
    if (match) existing.set(match[1], match[2]);
  }
  const fallback = existing.get("exported-surface") || existing.get("package-role") || existing.get("functions-and-methods") || existing.get("types") || existing.get("constants-and-variables");
  if (!fallback) return text;
  const proof = (key, ...fallbackKeys) => existing.get(key) || fallbackKeys.map((candidate) => existing.get(candidate)).find(Boolean) || fallback;
  const mappings = [
    ["package-role", proof("package-role")],
    ["exported-surface", proof("exported-surface")],
    ["functions", proof("functions", "functions-and-methods")],
    ["methods", proof("methods", "functions-and-methods")],
    ["types", proof("types")],
    ["constants", proof("constants", "constants-and-variables")],
    ["variables", proof("variables", "constants-and-variables")],
    ["ownership-and-errors", proof("ownership-and-errors")],
    ["source-and-runnable-proof", proof("source-and-runnable-proof", "source-proof")],
  ];
  const normalized = ["proofs:", ...mappings.map(([key, value]) => `  ${key}: ${value}`)];
  lines.splice(start, end - start, ...normalized);
  return text.replace(frontmatter[1], lines.join("\n"));
}

function sourcePathFor(id) {
  const relative = id.replace(/^reference\/packages\//, "");
  if (relative === "flow-store/store") return "github.com/looprig/flow/store";
  return "github.com/looprig/" + relative;
}

function sourceUrl(item, file) {
  const repository = item.repository === "flow/store" ? "flow" : item.repository;
  return "https://github.com/looprig/" + repository + "/blob/" + item.commit + "/" + file;
}

function sourceFileList(item) {
  return item.files.length ? item.files : [item.relativePath || "."];
}

function listNames(values) {
  return values.length ? values.map((value) => "\x60" + value + "\x60").join(", ") : "";
}

function codeList(values, format) {
  return values.length ? values.map((value) => "- \x60" + format(value) + "\x60").join("\n") : "";
}

function replaceBetween(text, startRe, endRe, replacement) {
  const start = text.search(startRe);
  if (start === -1) return text;
  const end = text.slice(start).search(endRe);
  if (end === -1) return text.slice(0, start) + replacement;
  return text.slice(0, start) + replacement + text.slice(start + end);
}

function importParagraph(item, id) {
  const importPath = item.importPath;
  if (item.repository === "flow/store") {
    return "Import path: \x60" + importPath + "\x60. This nested package is available from the coordinated local source workspace at commit \x60" + item.commit + "\x60.";
  }
  const release = item.tag ? " The source is pinned to " + item.module + "@" + item.tag + "." : " The source is pinned to commit \x60" + item.commit + "\x60.";
  return "Import path: \x60" + importPath + "\x60." + release;
}

function surfaceSection(item) {
  const functions = codeList(item.functions, (value) => value.signature);
  const methods = codeList(item.methods, (value) => value.signature);
  const types = listNames(item.types.map((value) => value.name));
  const constants = listNames(item.constants.map((value) => value.name));
  const variables = listNames(item.variables.map((value) => value.name));
  const functionBody = functions || "No exported functions are declared in this package.";
  const methodBody = methods || "No exported methods are declared in this package.";
  const typeBody = types || "No exported types are declared in this package.";
  const constantBody = constants || "No exported constants are declared in this package.";
  const variableBody = variables || "No exported variables are declared in this package.";
  return "## Exported surface {#exported-surface}\n\n" +
    "The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.\n\n" +
    "### Functions {#functions}\n\n" + functionBody + "\n\n" +
    "### Methods {#methods}\n\n" + methodBody + "\n\n" +
    "### Types {#types}\n\n" + typeBody + "\n\n" +
    "### Constants {#constants}\n\n" + constantBody + "\n\n" +
    "### Variables {#variables}\n\n" + variableBody + "\n\n";
}

function ownershipSection(item) {
  const errorSentence = item.errors.length
    ? "Exported named types with an explicit \x60Error() string\x60 method are " + listNames(item.errors) + "."
    : "No exported named type with an explicit \x60Error() string\x60 method was found in the pinned source package.";
  const ownership = item.repository === "flow/store"
    ? "\x60New\x60 receives a caller-provided \x60storage.Ledger\x60 and returns a \x60flow.CheckpointStore\x60. The linked source and tests define how that ledger is used; no additional ownership, lifecycle, or retry behavior is inferred here."
    : "The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.";
  return "## Ownership and errors {#ownership-and-errors}\n\n" + ownership + "\n\n" +
    errorSentence + " Use \x60errors.Is\x60 or \x60errors.As\x60 only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.\n\n";
}

function proofSection(item) {
  const isSourceWorkspace = item.repository === "flow/store";
  const sourceLines = sourceFileList(item).map((file) => isSourceWorkspace
    ? "- local source \x60" + item.repository + "/" + file + "\x60 at commit \x60" + item.commit + "\x60"
    : "- [" + file + "](" + sourceUrl(item, file) + ")").join("\n");
  const testLines = item.tests.length
    ? item.tests.map((file) => isSourceWorkspace
      ? "- local test \x60" + item.repository + "/" + file + "\x60 at commit \x60" + item.commit + "\x60"
      : "- [" + file + "](" + sourceUrl(item, file) + ")").join("\n")
    : "No \x60_test.go\x60 file is present in this package directory at the pinned commit.";
  const command = isSourceWorkspace
    ? "Run \x60GOWORK=off go test ./...\x60 from the local \x60flow/store\x60 directory after its source-workspace dependencies are available."
    : "Run \x60GOWORK=off go test ./...\x60 from the \x60" + item.repository + "\x60 repository.";
  return "## Source and runnable proof {#source-and-runnable-proof}\n\n" +
    "Source files at the pinned commit:\n\n" + sourceLines + "\n\n" +
    "Adjacent tests at the same commit:\n\n" + testLines + "\n\n" +
    command + " The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.\n";
}

function refreshPage(file, item) {
  const full = path.join(packageRoot, file);
  let text = fs.readFileSync(full, "utf8");
  const id = pageId(text);
  text = normalizeProofMappings(text);
  text = text.replace(/^Import path: .*$/m, importParagraph(item, id));
  text = replaceBetween(text, /^## Exported surface .*$/m, /^## (?:Ownership and errors|Lifecycle and errors|Source proof|Source and runnable proof) .*$/m, surfaceSection(item));
  text = replaceBetween(text, /^## (?:Ownership and errors|Lifecycle and errors) .*$/m, /^## (?:Source proof|Source and runnable proof) .*$/m, ownershipSection(item));
  text = replaceBetween(text, /^## Source proof .*$/m, /$^/, proofSection(item));
  text = replaceBetween(text, /^## Source and runnable proof .*$/m, /$^/, proofSection(item));
  text = text.replace(/\n{3,}/g, "\n\n").replace(/\s+$/g, "\n");
  fs.writeFileSync(full, text);
}

export function refreshPackageReferences() {
  const pages = fs.readdirSync(packageRoot, { recursive: true }).filter((name) => name.endsWith(".md"));
  const surfaces = inventory();
  const byPage = new Map(surfaces.map((item) => [pagePathFor(item), item]));
  let changed = 0;
  for (const file of pages) {
    const item = byPage.get(file);
    if (!item) continue;
    refreshPage(file, item);
    changed += 1;
  }
  return { changed, surfaces: surfaces.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { changed, surfaces } = refreshPackageReferences();
  console.error("refreshed " + changed + " package reference pages from " + surfaces + " pinned Go package surfaces");
}
