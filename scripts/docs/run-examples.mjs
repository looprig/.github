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
    // Stage 20 (the Svelte web client) is retired: the browser libraries are npm-only and
    // no longer ship a runnable stage in this manifest.
    const retired = new Set([20]);
    const missing = Array.from({ length: 23 }, (_, index) => index + 1).filter((stage) => !retired.has(stage) && !seenStages.has(stage));
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

export function isolatedGoEnvironment(cacheRoot, baseEnvironment = process.env) {
  return {
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
}

// looprigRequirements lists every github.com/looprig/* module a go.mod
// requires, in file order, so a drift run can move each one to @latest.
export function looprigRequirements(goMod) {
  const modules = [];
  let inRequireBlock = false;
  for (const rawLine of goMod.split('\n')) {
    const line = rawLine.replace(/\/\/.*$/, '').trim();
    if (inRequireBlock) {
      if (line === ')') {
        inRequireBlock = false;
        continue;
      }
      const [module] = line.split(/\s+/);
      if (module?.startsWith('github.com/looprig/')) modules.push(module);
      continue;
    }
    if (/^require\s*\($/.test(line)) {
      inRequireBlock = true;
      continue;
    }
    const single = /^require\s+(\S+)\s+\S+$/.exec(line);
    if (single && single[1].startsWith('github.com/looprig/')) modules.push(single[1]);
  }
  return [...new Set(modules)];
}

function latestUpgradeCommand(goMod) {
  const modules = looprigRequirements(goMod);
  if (modules.length === 0) throw new Error('--latest found no github.com/looprig/* requirement to upgrade');
  return ['go', ['get', ...modules.map((module) => `${module}@latest`)]];
}

export function executeReleasedGoModule(moduleRoot, cacheRoot, {
  executeCommand = run,
  baseEnvironment = process.env,
  latest = false,
} = {}) {
  const goModPath = join(moduleRoot, 'go.mod');
  const generatedGoMod = readFileSync(goModPath, 'utf8');
  assertImmutableGoMod(generatedGoMod, generatedGoMod);
  const environment = isolatedGoEnvironment(cacheRoot, baseEnvironment);
  // A drift run moves every Looprig requirement to its newest release before
  // the usual normalization; the manifest pins are the baseline it departs from.
  if (latest) {
    const [command, args] = latestUpgradeCommand(generatedGoMod);
    executeCommand(command, args, moduleRoot, environment);
    assertNoReplace(readFileSync(goModPath, 'utf8'));
  }
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

export function runReleasedExample(plan, { repositoryRoot, latest = false }) {
  if (plan.kind !== 'released-go') throw new Error('clean-module runner accepts released Go stages only');
  return withTemporaryRoots(`looprig-docs-stage-${String(plan.example.stage).padStart(2, '0')}-`, (moduleRoot, cacheRoot) => {
    copyStageSources(plan.sourceDirectory, moduleRoot);
    const shared = join(repositoryRoot, 'examples/go/progressive/internal');
    if (!existsSync(shared)) throw new Error('shared progressive helpers not found');
    cpSync(shared, join(moduleRoot, 'internal'), { recursive: true });
    const goMod = buildGoMod(plan.example);
    writeFileSync(join(moduleRoot, 'go.mod'), goMod);
    executeReleasedGoModule(moduleRoot, cacheRoot, { latest });
  });
}

export const STANDALONE_ROOTS = ['examples/go/start', 'examples/go/guides'];

// findStandaloneModules returns every directory under the standalone roots
// that carries its own go.mod, as sorted repository-relative paths. A missing
// root contributes nothing; the caller decides whether an empty result fails.
export function findStandaloneModules(repositoryRoot, roots = STANDALONE_ROOTS) {
  const modules = [];
  const walk = (relativeDirectory) => {
    const directory = resolveInside(repositoryRoot, relativeDirectory);
    const entries = readdirSync(directory, { withFileTypes: true });
    if (entries.some((entry) => entry.isFile() && entry.name === 'go.mod')) modules.push(relativeDirectory);
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;
      walk(`${relativeDirectory}/${entry.name}`);
    }
  };
  for (const root of roots) {
    const directory = resolveInside(repositoryRoot, root);
    if (existsSync(directory) && statSync(directory).isDirectory()) walk(root);
  }
  return modules.sort();
}

// executeStandaloneGoModule checks a self-contained module as a reader would
// run it: its own go.mod and go.sum, no workspace, public proxy and checksum
// database. Pinned runs never let a command rewrite go.mod; a --latest run
// first moves every Looprig requirement to @latest and re-tidies.
export function executeStandaloneGoModule(moduleRoot, cacheRoot, {
  executeCommand = run,
  baseEnvironment = process.env,
  latest = false,
} = {}) {
  const goModPath = join(moduleRoot, 'go.mod');
  const original = readFileSync(goModPath, 'utf8');
  assertNoReplace(original);
  const environment = isolatedGoEnvironment(cacheRoot, baseEnvironment);
  const commands = [];
  if (latest) commands.push(latestUpgradeCommand(original), ['go', ['mod', 'tidy']]);
  commands.push(
    ['go', ['mod', 'verify']],
    ['go', ['test', '-mod=readonly', './...']],
    ['go', ['run', '-mod=readonly', '.']],
  );
  let expected = original;
  for (const [command, args] of commands) {
    executeCommand(command, args, moduleRoot, environment);
    const current = readFileSync(goModPath, 'utf8');
    assertNoReplace(current);
    const mutating = args[0] === 'get' || (args[0] === 'mod' && args[1] === 'tidy');
    if (mutating) expected = current;
    else if (current !== expected) throw new Error('standalone go.mod changed during execution');
  }
}

export function runStandaloneModule(relativeDirectory, { repositoryRoot, latest = false }) {
  const sourceDirectory = resolveInside(repositoryRoot, relativeDirectory);
  const prefix = `looprig-docs-standalone-${relativeDirectory.replace(/[^A-Za-z0-9]+/g, '-')}-`;
  return withTemporaryRoots(prefix, (moduleRoot, cacheRoot) => {
    // Always run a copy: `go run .` may write state (for example ./agent-data)
    // next to the sources, and a --latest run rewrites go.mod.
    cpSync(sourceDirectory, moduleRoot, { recursive: true });
    executeStandaloneGoModule(moduleRoot, cacheRoot, { latest });
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

function assertNoReplace(goMod) {
  if (/^\s*replace\b/m.test(goMod)) throw new Error('go.mod contains a forbidden replace directive');
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

export function parseArguments(argv) {
  let manifestPath;
  let stage;
  let latest = false;
  let standalone = false;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--manifest') manifestPath = argv[++index];
    else if (argv[index] === '--stage') stage = Number(argv[++index]);
    else if (argv[index] === '--latest') latest = true;
    else if (argv[index] === '--standalone') standalone = true;
    else throw new Error(`unknown argument: ${argv[index]}`);
  }
  if (stage !== undefined && (!Number.isInteger(stage) || stage < 1 || stage > 23)) throw new Error('--stage must be an integer from 1 through 23');
  if (standalone && (stage !== undefined || manifestPath !== undefined)) {
    throw new Error('--standalone runs every module under examples/go/start and examples/go/guides; it takes no --stage or --manifest');
  }
  return { manifestPath, stage, latest, standalone };
}

function runStandalone({ repositoryRoot, latest }) {
  const modules = findStandaloneModules(repositoryRoot);
  if (modules.length === 0) throw new Error(`no standalone Go modules found under ${STANDALONE_ROOTS.join(', ')}`);
  for (const module of modules) {
    process.stdout.write(`standalone${latest ? ' (latest)' : ''}: ${module}\n`);
    runStandaloneModule(module, { repositoryRoot, latest });
  }
}

function main() {
  const scriptPath = fileURLToPath(import.meta.url);
  const repositoryRoot = resolve(dirname(scriptPath), '../..');
  const { manifestPath, stage, latest, standalone } = parseArguments(process.argv.slice(2));
  if (standalone) {
    runStandalone({ repositoryRoot, latest });
    return;
  }
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
    process.stdout.write(`stage ${example.stage}${latest ? ' (latest)' : ''}: ${example.id}\n`);
    runReleasedExample(plan, { repositoryRoot, latest });
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
