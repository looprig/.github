import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const modulesRoot = path.join(root, "docs/modules");
const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));

const names = new Map([
  ["acp", "ACP"],
  ["classifiers", "Classifiers"],
  ["client", "Client"],
  ["core", "Core"],
  ["credentials", "Credentials"],
  ["eval", "Eval"],
  ["flow", "Flow"],
  ["flow-store", "Flow Store"],
  ["foreignloops", "Foreign Loops"],
  ["fsstore", "FSStore"],
  ["harness", "Harness"],
  ["inference", "Inference"],
  ["llm", "LLM"],
  ["mcp", "MCP"],
  ["natsstore", "NATSStore"],
  ["rclonestore", "RcloneStore"],
  ["sandbox", "Sandbox"],
  ["secrets", "Secrets"],
  ["storage", "Storage"],
  ["tools", "Tools"],
  ["tui", "TUI"],
  ["workflows", "Workflows"],
]);

const pages = readdirSync(modulesRoot).filter((name) => name.endsWith(".md")).sort();
const slugs = pages.map((name) => name.slice(0, -3));
const repositoryBySlug = new Map(slugs.map((slug) => [slug, slug === "flow-store" ? "flow/store" : slug]));
const recordBySlug = new Map(slugs.map((slug) => [
  slug,
  inventory.modules.find((record) => record.repository === repositoryBySlug.get(slug)),
]));
const slugByModule = new Map([...recordBySlug].map(([slug, record]) => [record.module, slug]));

function frontmatterValue(source, key) {
  return source.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1];
}

function proofId(source) {
  return source.match(/^  repository: (.+)$/m)?.[1];
}

function directDependencies(record) {
  return [...new Set((record.edges ?? [])
    .filter((edge) => edge.kind === "direct-require" && slugByModule.has(edge.to))
    .map((edge) => slugByModule.get(edge.to)))].sort((a, b) => names.get(a).localeCompare(names.get(b)));
}

function githubDetails(slug, record) {
  if (slug === "flow-store") {
    return { label: "looprig/flow", url: "https://github.com/looprig/flow" };
  }
  const repository = record.module.replace(/^github\.com\//, "");
  return { label: repository, url: `https://github.com/${repository}` };
}

function links(items) {
  if (items.length === 0) return "None.";
  return items.map((slug) => `- [${names.get(slug)}](/docs/modules/${slug})`).join("\n");
}

for (const file of pages) {
  const slug = file.slice(0, -3);
  const source = readFileSync(path.join(modulesRoot, file), "utf8");
  const record = recordBySlug.get(slug);
  if (!record) throw new Error(`No module inventory record for ${slug}`);

  const description = frontmatterValue(source, "description");
  const order = frontmatterValue(source, "order");
  const publication = frontmatterValue(source, "publication");
  const proof = proofId(source);
  if (!description || !order || !publication || !proof) {
    throw new Error(`Incomplete existing metadata for ${slug}`);
  }

  const dependencies = directDependencies(record);
  const dependents = slugs
    .filter((candidate) => directDependencies(recordBySlug.get(candidate)).includes(slug))
    .sort((a, b) => names.get(a).localeCompare(names.get(b)));
  const github = githubDetails(slug, record);
  const version = record.publication.tag ?? "Not released";

  const page = `---
id: modules/${slug}
title: ${names.get(slug)}
description: ${description}
audience: developer
section: modules
order: ${order}
publication: ${publication}
proofs:
  repository: ${proof}
  description: ${proof}
  dependencies: ${proof}
  dependents: ${proof}
---

# ${names.get(slug)}

## Repository

| Field | Value |
| --- | --- |
| Repository | \`${record.module}\` |
| Version | \`${version}\` |
| GitHub | [${github.label}](${github.url}) |

## Description

${description}

## Dependencies

${links(dependencies)}

## Dependents

${links(dependents)}
`;

  writeFileSync(path.join(modulesRoot, file), page);
}
