import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

/**
 * The website is built with Astro's `trailingSlash: 'never'` and
 * `build.format: 'file'`: a section page is written as `<name>.html` beside a
 * `<name>/` directory holding its children. A link written with a trailing
 * slash therefore addresses a directory with no index and used to reach the
 * 404 page. The origin now redirects those to the canonical path, but a link
 * that needs a redirect is still a link pointing at the wrong URL.
 */
test("local documentation links carry no trailing slash", () => {
  const offenders = [];
  for (const file of markdownFiles(docsRoot)) {
    const text = fs.readFileSync(file, "utf8");
    text.split(/\r?\n/).forEach((line, index) => {
      for (const match of line.matchAll(/\]\((\/docs\/[^)\s]*?\/)([)#?])/g)) {
        offenders.push(`${path.relative(root, file)}:${index + 1}: ${match[1]}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `non-canonical links:\n${offenders.join("\n")}`);
});

test("local documentation links address a published page", () => {
  const published = new Set();
  for (const file of markdownFiles(docsRoot)) {
    const id = path.relative(docsRoot, file).replace(/\.md$/, "").split(path.sep).join("/");
    const route = id === "index" ? "/docs" : `/docs/${id.replace(/\/index$/, "")}`;
    published.add(route);
  }

  const broken = [];
  for (const file of markdownFiles(docsRoot)) {
    const text = fs.readFileSync(file, "utf8");
    text.split(/\r?\n/).forEach((line, index) => {
      for (const match of line.matchAll(/\]\((\/docs\/[^)\s#?]*)/g)) {
        const target = match[1];
        if (target.startsWith("/docs/assets/")) continue;
        if (published.has(target) || published.has(target.replace(/\.md$/, ""))) continue;
        broken.push(`${path.relative(root, file)}:${index + 1}: ${target}`);
      }
    });
  }
  assert.deepEqual(broken, [], `links to unpublished pages:\n${broken.join("\n")}`);
});
