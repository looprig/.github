#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { inventory } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const packageRoot = path.join(root, "docs/reference/packages");
const surfaces = inventory();
const files = fs.readdirSync(packageRoot, { recursive: true }).filter((name) => name.endsWith(".md"));
const failures = [];

function fail(message) { failures.push(message); }

function pagePathFor(item) {
  const repository = item.repository === "flow/store" ? "flow-store" : item.repository;
  const rel = item.relativePath || item.repository.split("/").at(-1);
  const visible = ["classifiers", "harness", "mcp"].includes(repository) && rel.startsWith("pkg/") ? rel.slice(4) : rel;
  return path.join(repository, visible + ".md");
}

function section(text, heading, nextHeading) {
  const start = text.indexOf(heading);
  if (start < 0) return "";
  const tail = text.slice(start + heading.length);
  const end = nextHeading ? tail.search(nextHeading) : -1;
  return end < 0 ? tail : tail.slice(0, end);
}

function listedSignatures(text) {
  return [...text.matchAll(/^- \x60([^\n\x60]+)\x60$/gm)].map((match) => match[1]);
}

function listedNames(text) {
  return [...text.matchAll(/\x60([A-Za-z_][A-Za-z0-9_]*)\x60/g)].map((match) => match[1]);
}

function sourceUrl(item, file) {
  const repository = item.repository === "flow/store" ? "flow" : item.repository;
  return "https://github.com/looprig/" + repository + "/blob/" + item.commit + "/" + file;
}

const byPage = new Map(surfaces.map((item) => [pagePathFor(item), item]));
let covered = 0;
for (const file of files) {
  const text = fs.readFileSync(path.join(packageRoot, file), "utf8");
  const item = byPage.get(file);
  if (!item) {
    if (!file.startsWith("client/sdk/")) fail(file + ": package page is not mapped to pinned source");
    continue;
  }
  covered += 1;
  if (!text.includes("Import path: \x60" + item.importPath + "\x60") && !text.includes("# \x60" + item.importPath + "\x60")) fail(file + ": import path does not match source inventory");
  if (!text.includes(item.commit)) fail(file + ": pinned commit is absent");
  const functions = section(text, "### Functions", /^### /m);
  const methods = section(text, "### Methods", /^### /m);
  const types = section(text, "### Types", /^### /m);
  const constants = section(text, "### Constants", /^### /m);
  const variables = section(text, "### Variables", /^## /m);
  for (const value of item.functions) if (!listedSignatures(functions).includes(value.signature)) fail(file + ": missing function " + value.signature);
  for (const value of item.methods) if (!listedSignatures(methods).includes(value.signature)) fail(file + ": missing method " + value.signature);
  for (const value of item.types) if (!listedNames(types).includes(value.name)) fail(file + ": missing type " + value.name);
  for (const value of item.constants) if (!listedNames(constants).includes(value.name)) fail(file + ": missing constant " + value.name);
  for (const value of item.variables) if (!listedNames(variables).includes(value.name)) fail(file + ": missing variable " + value.name);
  if (!item.functions.length && !/No exported functions are declared/.test(functions)) fail(file + ": false empty function section");
  if (!item.methods.length && !/No exported methods are declared/.test(methods)) fail(file + ": false empty method section");
  if (!item.types.length && !/No exported types are declared/.test(types)) fail(file + ": false empty type section");
  if (!item.constants.length && !/No exported constants are declared/.test(constants)) fail(file + ": false empty constant section");
  if (!item.variables.length && !/No exported variables are declared/.test(variables)) fail(file + ": false empty variable section");
  for (const source of item.files) {
    if (item.repository === "flow/store") {
      if (!text.includes("local source \x60" + item.repository + "/" + source + "\x60")) fail(file + ": missing local source proof " + source);
    } else if (!text.includes(sourceUrl(item, source))) fail(file + ": missing source proof " + source);
  }
  for (const test of item.tests) {
    if (item.repository === "flow/store") {
      if (!text.includes("local test \x60" + item.repository + "/" + test + "\x60")) fail(file + ": missing local test proof " + test);
    } else if (!text.includes(sourceUrl(item, test))) fail(file + ": missing test proof " + test);
  }
}

if (covered !== surfaces.length - 1) fail("expected all pinned Go packages except unavailable Kosa API to have reference pages; covered " + covered + " of " + surfaces.length);
const allDocs = files.map((file) => fs.readFileSync(path.join(packageRoot, file), "utf8")).join("\n");
const buildFiles = fs.readdirSync(path.join(root, "docs/build")).filter((file) => file.endsWith(".md"));
const buildDocs = buildFiles.map((file) => fs.readFileSync(path.join(root, "docs/build", file), "utf8")).join("\n");
const forbidden = /principal handle|typed failures|None reported|Draft proof|pending Task15|Task15 evidence|Task15 should|loadbearing|load-bearing|—|docs\/plans|policy53/i;
if (forbidden.test(allDocs + "\n" + buildDocs)) fail("forbidden mechanical, plan, excluded-product, or em-dash language remains");
if (/\n{3,}/.test(allDocs + "\n" + buildDocs)) fail("repeated blank lines remain");
for (const file of files) {
  const text = fs.readFileSync(path.join(packageRoot, file), "utf8");
  const description = text.match(/^description: ([^\n]+)$/m)?.[1] || "";
  if (!/[.!?]$/.test(description)) fail(file + ": synopsis does not end as a sentence");
}
const flowStore = fs.readFileSync(path.join(packageRoot, "flow-store/store.md"), "utf8");
if (/github\.com\/looprig\/flow\/tree\/(?:main|v[^/]+)\/store/.test(flowStore)) fail("flow/store reference uses an unverifiable remote source-workspace link");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("package reference verification passed: " + covered + " pages, " + surfaces.length + " pinned Go surfaces");
