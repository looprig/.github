#!/usr/bin/env node
// Keeps the Go programs shown in Getting Started identical to the runnable
// example modules under examples/go/start. A fenced block directly preceded by
//
//   <!-- example: examples/go/start/<step>/<file> -->
//
// must equal that file byte for byte. `node scripts/docs/start-examples.mjs`
// reports drift; `--write` rewrites the blocks from the files.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MARKER = /<!-- example: ([^ ]+) -->\n```([a-z]*)\n([\s\S]*?)```/g;

// embeddedExamples lists every marked block in a page.
export function embeddedExamples(page) {
  return [...page.matchAll(MARKER)].map(([, source, language, body]) => ({ source, language, body }));
}

// syncPage returns page with every marked block replaced by its source file.
export function syncPage(page, readSource) {
  return page.replace(MARKER, (_, source, language) => {
    const text = readSource(source);
    return `<!-- example: ${source} -->\n\`\`\`${language}\n${text.endsWith('\n') ? text : `${text}\n`}\`\`\``;
  });
}

export function startPages(root = repositoryRoot) {
  const directory = join(root, 'docs/start');
  return readdirSync(directory).filter((name) => name.endsWith('.md')).sort().map((name) => join(directory, name));
}

function main() {
  const write = process.argv.includes('--write');
  const readSource = (source) => readFileSync(join(repositoryRoot, source), 'utf8');
  let drift = 0;
  for (const file of startPages()) {
    const page = readFileSync(file, 'utf8');
    const synced = syncPage(page, readSource);
    if (synced === page) continue;
    if (write) writeFileSync(file, synced);
    else {
      drift += 1;
      process.stderr.write(`${file}: embedded example differs from its source\n`);
    }
  }
  if (drift > 0) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
