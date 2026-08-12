import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const repositoryRoot = join(import.meta.dirname, '../..');
const carbonDocsRoot = join(repositoryRoot, 'docs/carbon');

function markdownFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.isFile() && path.endsWith('.md')) files.push(path);
  }
  return files.sort();
}

function carbonDocuments() {
  return markdownFiles(carbonDocsRoot).map((path) => ({
    path,
    relativePath: relative(repositoryRoot, path),
    text: readFileSync(path, 'utf8'),
  }));
}

function jsonFences(document) {
  const fences = [];
  const fencePattern = /```([^\r\n]*)\r?\n([\s\S]*?)\r?\n```/g;
  for (const match of document.text.matchAll(fencePattern)) {
    const language = match[1].trim().toLowerCase();
    if (language === 'jsonc' || language === 'json5') {
      throw new Error(`${document.relativePath} uses non-JSON fence language ${language}`);
    }
    if (language !== 'json') continue;
    fences.push({ body: match[2], offset: match.index ?? 0 });
  }
  return fences;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('every Carbon JSON fence is complete JSON without pseudo-JSON', () => {
  const documents = carbonDocuments();
  const fences = documents.flatMap((document) => jsonFences(document).map((fence) => ({ ...fence, document })));
  assert.ok(fences.length >= 7, `expected the Carbon configuration examples, found ${fences.length} JSON fences`);

  for (const { body, document, offset } of fences) {
    assert.doesNotMatch(body, /(^|\n)\s*(?:\/\/|\/\*|\*\/)/, `${document.relativePath}:${offset} contains a JSON comment`);
    assert.doesNotMatch(body, /\.\.\./, `${document.relativePath}:${offset} contains an ellipsis placeholder`);
    assert.doesNotMatch(body, /<[^>]+>/, `${document.relativePath}:${offset} contains angle-bracket pseudo-JSON`);
    assert.doesNotMatch(body, /test-secret-do-not-log/, `${document.relativePath}:${offset} copied a test secret sentinel`);
    const parsed = JSON.parse(body);
    assert.equal(typeof parsed, 'object', `${document.relativePath}:${offset} must contain a JSON object`);
    assert.notEqual(parsed, null, `${document.relativePath}:${offset} must not contain JSON null`);
  }
});

test('Carbon configuration examples cover the released source fixtures and tests', () => {
  const documents = carbonDocuments();
  const byPath = new Map(documents.map((document) => [document.relativePath, document.text]));
  const required = [
    {
      file: 'docs/carbon/models-json.md',
      terms: [
        'validLMStudioModelConfig',
        'TestModelConfigWithoutDelegateDefaultsIsValid',
        'TestDecodeModelConfig',
        'TestDecodeModelConfigAcceptsSchemaV3CredentialReference',
        'TestNormalizeModelConfigV3AuthModes',
        'TestModelConfigNativeACPProfilesDistinguishAbsentManagedAndExplicit',
        'TestDecodeModelConfigAcceptsNullNativeACPModelsAsManaged',
        'TestModelConfigNativeACPModelsAcceptLegacyAndStructuredEntries',
        'TestDecodeModelConfigACPLaunchers',
        'TestNormalizeModelConfigACPLaunchers',
        'TestCompileProductionModelsCarriesACPLaunchers',
        'modelConfigJSONWithUnusedClassifier',
        'TestNormalizeModelConfigPermissionReviewSection',
        'TestProductionModelsResolvesUnusedClassifierPermissionReview',
      ],
    },
    {
      file: 'docs/carbon/mcp.md',
      terms: [
        'validMCPConfigJSON',
        'TestNormalizeMCPConfigHappyPath',
        'TestNormalizeMCPConfigSSEExplicitType',
        'TestLoadMCPConfig',
      ],
    },
  ];

  for (const { file, terms } of required) {
    const document = byPath.get(file);
    assert.ok(document, `missing required Carbon documentation file ${file}`);
    for (const term of terms) {
      assert.match(document, new RegExp(escapeRegExp(term)), `${file} does not identify source proof ${term}`);
    }
  }
});

test('Carbon operational pages carry complete JSON examples for their config boundaries', () => {
  const documents = carbonDocuments();
  const byPath = new Map(documents.map((document) => [document.relativePath, document.text]));
  const required = [
    {
      file: 'docs/carbon/classifiers.md',
      terms: ['permission_review', 'structured_output_with_tools', '"models"'],
    },
    {
      file: 'docs/carbon/acp.md',
      terms: ['native_acp', 'acp_launchers', '"codex"'],
    },
    {
      file: 'docs/carbon/model-proxy.md',
      terms: ['"uses": ["delegate"]', 'credential_ref', '"primer_default"'],
    },
    {
      file: 'docs/carbon/credentials.md',
      terms: ['"version": 3', 'credential_ref', '"models"'],
    },
    {
      file: 'docs/carbon/workspaces.md',
      terms: ['"normalization_version": 1', '"rules"', 'command.invoke.v1'],
    },
    {
      file: 'docs/carbon/sessions-and-stores.md',
      terms: ['"normalization_version": 1', '"rules"'],
    },
    {
      file: 'docs/carbon/architecture/configuration.md',
      terms: ['"primer_default"', '"mcpServers"', '"models"'],
    },
  ];

  for (const { file, terms } of required) {
    const document = byPath.get(file);
    assert.ok(document, `missing required Carbon documentation file ${file}`);
    const fences = jsonFences({ text: document });
    assert.ok(fences.length > 0, `${file} needs at least one complete JSON fence`);
    for (const term of terms) assert.match(document, new RegExp(escapeRegExp(term)), `${file} omits ${term}`);
    for (const { body } of fences) {
      const parsed = JSON.parse(body);
      assert.equal(typeof parsed, 'object', `${file} JSON example must be an object`);
      assert.notEqual(parsed, null, `${file} JSON example must not be null`);
    }
  }
});

test('Carbon configuration docs do not cite plan files or secret sentinels', () => {
  const allText = carbonDocuments().map(({ text }) => text).join('\n');
  assert.doesNotMatch(allText, /docs\/plans\//, 'Carbon docs must use code and test sources, not plan documents');
  assert.doesNotMatch(allText, /test-secret-do-not-log/, 'Carbon docs must not publish test secret sentinels');
});
