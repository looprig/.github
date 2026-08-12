import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const guidePath = path.join(root, 'docs/concepts/composition.md');
const fixturePath = path.join(root, 'examples/go/guides/harness-quickstart/main.go');
const fixtureTestPath = path.join(root, 'examples/go/guides/harness-quickstart/main_test.go');

test('composition guide teaches a runnable module composition', () => {
  const guide = readFileSync(guidePath, 'utf8');

  assert.match(guide, /```go[\s\S]+loop\.Define[\s\S]+rig\.Define[\s\S]+NewSession[\s\S]+```/);
  assert.match(guide, /```sh[\s\S]+go get github\.com\/looprig\/harness@v0\.24\.2[\s\S]+```/);
  assert.match(guide, /\ngo run \./);
  assert.doesNotMatch(guide, /GOWORK=off|Looprig workspace/);
  assert.match(guide, /Expected output:[\s\S]+```text\s+ready\s+```/);
  assert.match(guide, /examples\/go\/guides\/harness-quickstart\/main\.go/);
  assert.match(guide, /examples\/go\/guides\/harness-quickstart\/main_test\.go/);
  assert.match(guide, /OpenAI GPT/i);
  assert.match(guide, /Anthropic Claude/i);
  assert.match(guide, /Ollama/i);
  assert.doesNotMatch(guide, /The first two progressive entries/);
});

test('composition guide runnable source exists beside an exact-output test', () => {
  assert.match(readFileSync(fixturePath, 'utf8'), /func run\(/);
  assert.match(readFileSync(fixtureTestPath, 'utf8'), /ready\\n/);
});
