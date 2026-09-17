#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASED_VERSION = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/;
const SOURCE_WORKSPACE_STAGES = new Map([
  [18, { owner: 'workflows', ecosystem: 'go' }],
  [20, { owner: 'client', ecosystem: 'npm' }],
]);
const MODULE_PATH = 'github.com/looprig/.github/examples/go/progressive';

export function validateAgainstSchema(value, schema, path = '$') {
  if (Array.isArray(schema.oneOf)) {
    if (!schema.oneOf.some((candidate) => validateAgainstSchema(value, candidate, path).length === 0)) return [`${path} does not match any allowed schema`];
    return [];
  }
  const errors = [];
  const type = schema.type;
  const matchesType = type === undefined
    || (type === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value))
    || (type === 'array' && Array.isArray(value))
    || (type === 'string' && typeof value === 'string')
    || (type === 'integer' && Number.isInteger(value))
    || (type === 'boolean' && typeof value === 'boolean')
    || (type === 'null' && value === null);
  if (!matchesType) return [`${path} must be ${type}`];
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) errors.push(`${path} must be one of ${schema.enum.join(', ')}`);
  if (typeof value === 'string' && schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path} must not be empty`);
  if (Number.isInteger(value) && schema.minimum !== undefined && value < schema.minimum) errors.push(`${path} must be at least ${schema.minimum}`);
  if (Number.isInteger(value) && schema.maximum !== undefined && value > schema.maximum) errors.push(`${path} must be at most ${schema.maximum}`);
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path} must contain at least ${schema.minItems} items`);
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) errors.push(`${path} items must be unique`);
    if (schema.items) value.forEach((item, index) => errors.push(...validateAgainstSchema(item, schema.items, `${path}[${index}]`)));
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required ?? []) if (!(required in value)) errors.push(`${path}.${required} is required`);
    if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties) errors.push(`${path} must contain at least ${schema.minProperties} properties`);
    for (const [key, child] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...validateAgainstSchema(child, schema.properties[key], `${path}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${path}.${key} is not allowed`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') errors.push(...validateAgainstSchema(child, schema.additionalProperties, `${path}.${key}`));
    }
  }
  return errors;
}

export function validateProgressiveManifest(manifest, { requireAll = true } = {}) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return ['manifest must be an object'];
  if (manifest.progressive !== true) errors.push('manifest progressive must be true');
  if (!Array.isArray(manifest.examples)) return [...errors, 'manifest examples must be an array'];

  const seenStages = new Set();
  for (const [index, example] of manifest.examples.entries()) {
    const label = `examples[${index}]`;
    if (!example || typeof example !== 'object' || Array.isArray(example)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (!Number.isInteger(example.stage) || example.stage < 1 || example.stage > 23) {
      errors.push(`${label}.stage must be an integer from 1 through 23`);
    } else if (seenStages.has(example.stage)) {
      errors.push(`${label}.stage duplicates stage ${example.stage}`);
    } else {
      seenStages.add(example.stage);
    }
    for (const field of ['id', 'owner', 'ecosystem', 'sourcePath', 'availability']) {
      if (typeof example[field] !== 'string' || example[field].length === 0) errors.push(`${label}.${field} must be a non-empty string`);
    }
    if (!safeRelativePath(example.sourcePath)) errors.push(`${label}.sourcePath must be a safe repository-relative path`);
    if (!example.versions || typeof example.versions !== 'object' || Array.isArray(example.versions) || Object.keys(example.versions).length === 0) {
      errors.push(`${label}.versions must be a non-empty object`);
      continue;
    }
    if (example.availability === 'released') {
      if (example.ecosystem !== 'go') errors.push(`${label}: released progressive stages must use the go ecosystem`);
      for (const [module, version] of Object.entries(example.versions)) {
        if (module === 'replace' || /^replace\b/i.test(String(version))) errors.push(`${label}: replace directives are forbidden`);
        if (!RELEASED_VERSION.test(String(version))) errors.push(`${label}.versions.${module} must be an immutable semantic version`);
      }
    } else if (example.availability === 'source-workspace') {
      const sourceContract = SOURCE_WORKSPACE_STAGES.get(example.stage);
      if (!sourceContract) errors.push(`${label}: source-workspace is reserved for stages 18 and 20`);
      else {
        if (example.owner !== sourceContract.owner) errors.push(`${label}: stage ${example.stage} source-workspace owner must be ${sourceContract.owner}`);
        if (example.ecosystem !== sourceContract.ecosystem) errors.push(`${label}: stage ${example.stage} source-workspace ecosystem must be ${sourceContract.ecosystem}`);
      }
      if (!Object.values(example.versions).includes('source-workspace')) {
        errors.push(`${label}: source-workspace availability requires a source-workspace version marker`);
      }
      for (const [module, version] of Object.entries(example.versions)) {
        if (version !== 'source-workspace' && !RELEASED_VERSION.test(String(version))) {
          errors.push(`${label}.versions.${module} must be source-workspace or an immutable semantic version`);
        }
      }
    } else {
      errors.push(`${label}.availability must be released or source-workspace`);
    }
  }

  if (requireAll) {
    const missing = Array.from({ length: 23 }, (_, index) => index + 1).filter((stage) => !seenStages.has(stage));
    if (missing.length > 0) errors.push(`missing progressive stages: ${missing.join(', ')}`);
  }
  return errors;
}

export function loadManifest(path, { schemaPath, ...options } = {}) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`cannot read manifest ${path}: ${error.message}`, { cause: error });
  }
  if (schemaPath) {
    let schema;
    try {
      schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    } catch (error) {
      throw new Error(`cannot read schema ${schemaPath}: ${error.message}`, { cause: error });
    }
    const schemaErrors = validateAgainstSchema(manifest, schema);
    if (schemaErrors.length > 0) throw new Error(schemaErrors.join('\n'));
  }
  const errors = validateProgressiveManifest(manifest, options);
  if (errors.length > 0) throw new Error(errors.join('\n'));
  return manifest;
}

export function buildGoMod(example) {
  if (example.availability !== 'released') throw new Error(`stage ${example.stage} is not a released example`);
  const requirements = Object.entries(example.versions)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([module, version]) => `\t${module} ${version}`)
    .join('\n');
  const goMod = `module ${MODULE_PATH}\n\ngo 1.26.8\n\nrequire (\n${requirements}\n)\n`;
  if (/^\s*replace\b/m.test(goMod)) throw new Error('generated go.mod contains a forbidden replace directive');
  return goMod;
}

export function planExample(example, { repositoryRoot }) {
  if (example.availability === 'source-workspace') return { kind: 'source-workspace', example };
  if (example.availability !== 'released' || example.ecosystem !== 'go') {
    throw new Error(`stage ${example.stage} is not a released Go example`);
  }
  const sourceDirectory = resolveInside(repositoryRoot, example.sourcePath);
  if (!existsSync(sourceDirectory) || !statSync(sourceDirectory).isDirectory()) {
    throw new Error(`stage ${example.stage} source directory not found: ${example.sourcePath}`);
  }
  if (!existsSync(join(sourceDirectory, 'main.go'))) {
    throw new Error(`stage ${example.stage} source directory has no main.go: ${example.sourcePath}`);
  }
  return { kind: 'released-go', example, sourceDirectory };
}

export function withTemporaryRoots(prefix, body, {
  makeTemporaryDirectory = mkdtempSync,
  removeTemporaryPath = rmSync,
  temporaryRoot = tmpdir(),
} = {}) {
  let moduleRoot;
  let cacheRoot;
  let bodyFailed = false;
  let primaryError;
  let result;
  try {
    moduleRoot = makeTemporaryDirectory(join(temporaryRoot, `${prefix}module-`));
    cacheRoot = makeTemporaryDirectory(join(temporaryRoot, `${prefix}cache-`));
    result = body(moduleRoot, cacheRoot);
  } catch (error) {
    bodyFailed = true;
    primaryError = error;
  }
  const cleanupErrors = [];
  const cleanupPaths = [];
  if (moduleRoot) cleanupPaths.push(moduleRoot);
  if (cacheRoot) cleanupPaths.push(join(cacheRoot, 'gobuild'), join(cacheRoot, 'gomod'), cacheRoot);
  for (const path of cleanupPaths) {
    try {
      removeTemporaryPath(path, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      });
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  const cleanupError = combinedCleanupError(cleanupErrors);
  if (bodyFailed) {
    if (cleanupError) {
      Object.defineProperty(primaryError, 'cleanupError', {
        value: cleanupError,
        configurable: true,
      });
    }
    throw primaryError;
  }
  if (cleanupError) throw cleanupError;
  return result;
}

export function executeReleasedGoModule(moduleRoot, cacheRoot, {
  executeCommand = run,
  baseEnvironment = process.env,
} = {}) {
  const goModPath = join(moduleRoot, 'go.mod');
  const generatedGoMod = readFileSync(goModPath, 'utf8');
  assertImmutableGoMod(generatedGoMod, generatedGoMod);
  const environment = {
    ...baseEnvironment,
    GOWORK: 'off',
    GOMODCACHE: join(cacheRoot, 'gomod'),
    GOCACHE: join(cacheRoot, 'gobuild'),
    GOTOOLCHAIN: 'local',
    GOENV: 'off',
    // Go module-cache directories are read-only by default. This cache lives
    // under our disposable root, so make downloaded modules writable and let
    // the ordinary recursive cleanup remove the complete tree reliably.
    GOFLAGS: '-modcacherw',
    GOPROXY: 'https://proxy.golang.org',
    GOSUMDB: 'sum.golang.org',
    GOPRIVATE: '',
    GONOPROXY: '',
    GONOSUMDB: '',
    GOINSECURE: '',
  };
  // Normalize the generated consumer module once before freezing it. Modern Go
  // versions require explicit indirect requirements for several released
  // dependency graphs; tidy derives those versions from the immutable direct
  // requirements above. Every subsequent command must leave go.mod unchanged.
  executeCommand('go', ['mod', 'tidy'], moduleRoot, environment);
  const expectedGoMod = readFileSync(goModPath, 'utf8');
  assertImmutableGoMod(expectedGoMod, expectedGoMod);

  const commands = [
    ['go', ['mod', 'download', 'all']],
    ['go', ['mod', 'verify']],
    ['go', ['test', '-mod=readonly', '-race', './...']],
    ['go', ['run', '-mod=readonly', '.']],
  ];
  for (const [command, args] of commands) {
    executeCommand(command, args, moduleRoot, environment);
    assertImmutableGoMod(readFileSync(goModPath, 'utf8'), expectedGoMod);
  }
}

export function runReleasedExample(plan, { repositoryRoot }) {
  if (plan.kind !== 'released-go') throw new Error('clean-module runner accepts released Go stages only');
  return withTemporaryRoots(`looprig-docs-stage-${String(plan.example.stage).padStart(2, '0')}-`, (moduleRoot, cacheRoot) => {
    copyStageSources(plan.sourceDirectory, moduleRoot);
    const shared = join(repositoryRoot, 'examples/go/progressive/internal');
    if (!existsSync(shared)) throw new Error('shared progressive helpers not found');
    cpSync(shared, join(moduleRoot, 'internal'), { recursive: true });
    const goMod = buildGoMod(plan.example);
    writeFileSync(join(moduleRoot, 'go.mod'), goMod);
    executeReleasedGoModule(moduleRoot, cacheRoot);
  });
}

function combinedCleanupError(errors) {
  if (errors.length === 0) return null;
  if (errors.length === 1) return errors[0];
  return new AggregateError(errors, 'temporary cleanup failed');
}

export function formatRunnerFailure(error) {
  const lines = [`docs examples: ${error.message}`];
  const cleanup = error.cleanupError ?? (error instanceof AggregateError ? error : null);
  if (cleanup instanceof AggregateError) {
    for (const failure of cleanup.errors) lines.push(`docs examples cleanup: ${failure.message}`);
  } else if (cleanup) {
    lines.push(`docs examples cleanup: ${cleanup.message}`);
  }
  return lines;
}

function assertImmutableGoMod(actual, expected) {
  if (/^\s*replace\b/m.test(actual)) throw new Error('generated go.mod contains a forbidden replace directive');
  if (actual !== expected) throw new Error('generated go.mod changed during released example execution');
}

function safeRelativePath(path) {
  return typeof path === 'string' && path.length > 0 && !isAbsolute(path) && !path.includes('\\')
    && !path.split('/').includes('..') && !/[?*\[\]{}!]/.test(path);
}

function resolveInside(root, path) {
  if (!safeRelativePath(path)) throw new Error(`unsafe source path: ${path}`);
  const target = resolve(root, path);
  const fromRoot = relative(resolve(root), target);
  if (fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) throw new Error(`source path escapes repository: ${path}`);
  return target;
}

function copyStageSources(source, destination) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === 'go.mod' || entry.name === 'go.work' || entry.name === 'go.work.sum') {
      throw new Error(`stage source contains forbidden module file: ${entry.name}`);
    }
    cpSync(join(source, entry.name), join(destination, entry.name), { recursive: true });
  }
}

function run(command, args, cwd, env) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `:\n${detail}` : ''}`);
  }
  if (result.stdout) process.stdout.write(result.stdout);
}

function parseArguments(argv) {
  let manifestPath;
  let stage;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--manifest') manifestPath = argv[++index];
    else if (argv[index] === '--stage') stage = Number(argv[++index]);
    else throw new Error(`unknown argument: ${argv[index]}`);
  }
  if (stage !== undefined && (!Number.isInteger(stage) || stage < 1 || stage > 23)) throw new Error('--stage must be an integer from 1 through 23');
  return { manifestPath, stage };
}

function main() {
  const scriptPath = fileURLToPath(import.meta.url);
  const repositoryRoot = resolve(dirname(scriptPath), '../..');
  const { manifestPath, stage } = parseArguments(process.argv.slice(2));
  const manifest = loadManifest(resolve(repositoryRoot, manifestPath ?? 'docs/_data/examples.json'), {
    schemaPath: join(repositoryRoot, 'docs/_schema/examples.schema.json'),
  });
  const selected = stage === undefined ? manifest.examples : manifest.examples.filter((example) => example.stage === stage);
  if (selected.length === 0) throw new Error(`stage ${stage} not found in manifest`);
  for (const example of selected.sort((left, right) => left.stage - right.stage)) {
    const plan = planExample(example, { repositoryRoot });
    if (plan.kind === 'source-workspace') {
      process.stdout.write(`stage ${example.stage}: delegated to ${example.owner} (${example.offlineCommand})\n`);
      continue;
    }
    process.stdout.write(`stage ${example.stage}: ${example.id}\n`);
    runReleasedExample(plan, { repositoryRoot });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    for (const line of formatRunnerFailure(error)) process.stderr.write(`${line}\n`);
    process.exitCode = 1;
  }
}
