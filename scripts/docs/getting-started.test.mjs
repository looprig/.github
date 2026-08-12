import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const read = (name) => readFileSync(path.join(root, 'docs/start', name), 'utf8');

test('Getting Started follows the consumer path from inference through UI', () => {
  const pages = [
    'choose-a-path.md',
    'installation.md',
    'first-run.md',
    'tools-and-gates.md',
    'sessions.md',
    'workspaces.md',
    'sandbox-and-interfaces.md',
  ].map(read);
  const corpus = pages.join('\n');

  for (const term of [
    'inference.Client', 'Client.Invoke', 'loop.Define', 'rig.Define', 'NewSession',
    'ToolUseBlock', 'gate', 'fsstore', 'workspace', 'sandbox', 'TUI', 'browser',
  ]) assert.match(corpus, new RegExp(term, 'i'));

  for (const page of pages.slice(1)) {
    assert.match(page, /```(?:go|sh)[\s\S]+```/);
  }
});

test('Getting Started does not expose contributor verification mechanics', () => {
  const corpus = [
    'choose-a-path.md', 'installation.md', 'first-run.md',
    'tools-and-gates.md', 'sessions.md', 'workspaces.md', 'sandbox-and-interfaces.md',
  ].map(read).join('\n');

  assert.doesNotMatch(corpus, /GOWORK=off|source-workspace|proof IDs?|workflow job|release commit|replace directive|central manifest/i);
  assert.equal(readFileSync(path.join(root, 'docs/contributing/verification.md'), 'utf8').includes('GOWORK=off'), false);
});
