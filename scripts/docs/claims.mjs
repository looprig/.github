import assert from "node:assert/strict";

// Documentation contracts are asserted against individual statements rather than
// whole paragraphs. Paragraph-wide keyword co-occurrence accepts the negation of
// the claim it is meant to require, so every claim here is scoped to one prose
// statement, and fenced code and table rows — which reintroduce co-occurrence a
// cell or a comment at a time — are excluded from prose entirely.

const FENCE = /^(\s*)(`{3,}|~{3,})[ \t]*(.*?)[ \t]*$/;
const LIST_MARKER = /^\s*(?:[-*+]|(\d+)[.)])\s+/;
const TABLE_ROW = /^\s*\|/;
const HEADING = /^(#{1,6})\s+(.*?)\s*$/;
const SETEXT_RULE = /^\s*(?:=+|-{2,})\s*$/;
const BLOCKQUOTE = /^\s*>/;
const INDENTED_CODE = /^(?: {4}|\t)\S/;
const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;

// scan classifies every line once, tracking fenced blocks by their opening
// marker so that a longer inner fence cannot desynchronize the state.
function scan(markdown) {
  const scanned = [];
  let fence = null;
  for (const [index, raw] of markdown.replace(/\r\n/g, "\n").split("\n").entries()) {
    const marker = raw.match(FENCE);
    if (fence) {
      const closes = marker && marker[2][0] === fence.char && marker[2].length >= fence.length && marker[3] === "";
      scanned.push({ index, raw, kind: closes ? "fence-close" : "code", info: fence.info });
      if (closes) fence = null;
      continue;
    }
    if (marker) {
      fence = { char: marker[2][0], length: marker[2].length, info: marker[3].trim() };
      scanned.push({ index, raw, kind: "fence-open", info: fence.info });
      continue;
    }
    scanned.push({ index, raw, kind: "text", info: "" });
  }
  return scanned;
}

// prose() drops everything a reader does not read as a sentence of the page:
// YAML frontmatter, HTML comments, fenced and indented code, table rows,
// headings and their setext rules, and blockquoted excerpts. Each of these
// otherwise reintroduces the keyword co-occurrence this module prevents.
function prose(markdown) {
  const body = markdown.replace(/\r\n/g, "\n").replace(FRONTMATTER, "").replace(HTML_COMMENT, "");
  return scan(body).filter((line) => line.kind === "text"
    && !TABLE_ROW.test(line.raw)
    && !HEADING.test(line.raw)
    && !SETEXT_RULE.test(line.raw)
    && !BLOCKQUOTE.test(line.raw)
    && !INDENTED_CODE.test(line.raw));
}

const ABBREVIATION = /(?:^|\s)(?:e\.g|i\.e|cf|vs|etc|approx|Fig|No)\.$/i;

// statements returns prose statements. Wrapped source lines are rejoined first,
// so a hard-wrapped sentence is still one statement; a list item, a blank line,
// and any excluded block each end the current statement.
export function statements(markdown) {
  const logical = [];
  let joining = false;
  for (const line of prose(markdown)) {
    if (line.raw.trim() === "") {
      joining = false;
      continue;
    }
    const text = line.raw.replace(LIST_MARKER, "").trim();
    if (LIST_MARKER.test(line.raw) || !joining) {
      logical.push(text);
      joining = true;
      continue;
    }
    logical[logical.length - 1] += ` ${text}`;
  }

  const split = [];
  for (const line of logical) {
    let current = "";
    for (const piece of line.split(/(?<=[.!?;])\s+/)) {
      current = current ? `${current} ${piece}` : piece;
      if (ABBREVIATION.test(current)) continue;
      split.push(current);
      current = "";
    }
    if (current) split.push(current);
  }
  return split.map((statement) => statement.replace(/\s+/g, " ").trim()).filter(Boolean);
}

// negated matches a denial of the claim's own verb: the negator, then up to
// three words, then one of the claim's verb stems. A coordinating conjunction
// ends the scan, so "is not dropped and survives restore" is an affirmative
// sentence about surviving rather than a denial of it.
const NEGATOR = String.raw`\b(?:not|never|no|none|neither|nor|nothing|no longer|cannot|can.t|isn.t|aren.t|doesn.t|don.t|won.t|fails? to|without)\b`;
const CLAUSE_BREAK = String.raw`(?!(?:and|but|so|yet|or|because|while|though|although|however)\b)`;
const GAP = String.raw`[\s,;:()\u2014-]+`;

export function negated(...stems) {
  const alternatives = stems.join("|");
  return new RegExp(
    `${NEGATOR}(?:${GAP}${CLAUSE_BREAK}\\w+){0,3}${GAP}\\b(?:${alternatives})\\w*`,
    "i",
  );
}

const CLAIM_KEYS = new Set(["all", "none"]);

export function matchingStatements(markdown, claim) {
  for (const key of Object.keys(claim)) {
    assert.ok(CLAIM_KEYS.has(key), `unknown claim key "${key}"; use all and none`);
  }
  const { all = [], none = [] } = claim;
  assert.ok(all.length > 0, "a claim needs at least one required pattern");
  return statements(markdown).filter((statement) =>
    all.every((pattern) => pattern.test(statement))
    && none.every((pattern) => !pattern.test(statement)));
}

export function assertClaim(markdown, claim, message) {
  const matches = matchingStatements(markdown, claim);
  if (matches.length > 0) return;

  const { all = [], none = [] } = claim;
  // Report the closest statement so an unmet conjunction names its own gap, and
  // say when a none-guard, rather than a missing pattern, did the rejecting.
  const [closest] = statements(markdown)
    .map((statement) => ({
      statement,
      missing: all.filter((pattern) => !pattern.test(statement)),
      rejected: none.filter((pattern) => pattern.test(statement)),
    }))
    .filter(({ missing }) => missing.length < all.length)
    .sort((left, right) => (left.missing.length - right.missing.length)
      || (left.rejected.length - right.rejected.length));
  if (!closest) assert.fail(message);
  const reason = closest.missing.length > 0
    ? `missing: ${closest.missing.join(", ")}`
    : `rejected by: ${closest.rejected.join(", ")}`;
  assert.fail(`${message}\nclosest statement: ${closest.statement}\n${reason}`);
}

export function refuteClaim(markdown, claim, message) {
  const [counter] = matchingStatements(markdown, claim);
  assert.equal(counter, undefined, counter ? `${message}: ${counter}` : message);
}

// section returns the body of the named heading. A duplicated title is an error
// rather than a silent first-match, because the wrong body would be asserted.
export function section(markdown, heading) {
  const headings = [];
  const lines = scan(markdown);
  for (const line of lines) {
    if (line.kind !== "text") continue;
    const match = line.raw.match(HEADING);
    if (!match) continue;
    headings.push({ index: line.index, depth: match[1].length, title: match[2].replace(/\s*#+\s*$/, "").trim() });
  }

  const matches = headings.filter((entry) => entry.title === heading);
  assert.ok(matches.length <= 1, `heading "${heading}" appears ${matches.length} times`);
  const [start] = matches;
  if (!start) return undefined;
  const next = headings.filter((entry) => entry.index > start.index).find((entry) => entry.depth <= start.depth);
  return lines.slice(start.index + 1, next ? next.index : lines.length).map((line) => line.raw).join("\n");
}

// fencedBlocks returns the bodies of fenced blocks whose info string names one
// of the given languages. An info string may carry attributes after the
// language, as ```sh title="install" does.
export function fencedBlocks(markdown, languages) {
  const wanted = new Set([languages].flat().map((language) => language.toLowerCase()));
  const blocks = [];
  let body = null;
  for (const line of scan(markdown)) {
    if (line.kind === "fence-open") {
      const language = line.info.split(/[\s,{]/)[0].toLowerCase();
      body = wanted.has(language) ? [] : null;
      continue;
    }
    if (line.kind === "fence-close") {
      if (body) blocks.push(`${body.join("\n")}\n`);
      body = null;
      continue;
    }
    if (line.kind === "code" && body) body.push(line.raw);
  }
  return blocks;
}

// orderedListItems returns the first ordered list outside fenced code, one entry
// per item. Indented, lazy, fenced, and nested-bullet continuations fold into
// their item; a heading, a table, or a list that restarts numbering ends it.
export function orderedListItems(markdown) {
  const items = [];
  let blank = false;
  let fenced = false;
  for (const line of scan(markdown.replace(/\r\n/g, "\n").replace(FRONTMATTER, ""))) {
    if (line.kind === "fence-open") fenced = true;
    if (line.kind === "fence-close") {
      fenced = false;
      continue;
    }
    if (fenced || line.kind === "code") continue;
    if (line.raw.trim() === "") {
      blank = true;
      continue;
    }
    const marker = line.raw.match(LIST_MARKER);
    const ordered = marker?.[1] !== undefined;
    const indented = /^\s/.test(line.raw);
    if (ordered && !indented) {
      if (items.length > 0 && blank && marker[1] === "1") break;
      items.push(line.raw.replace(LIST_MARKER, "").trim());
      blank = false;
      continue;
    }
    if (items.length === 0) {
      blank = false;
      continue;
    }
    if (HEADING.test(line.raw) || TABLE_ROW.test(line.raw)) break;
    if (!indented && blank && !marker) break;
    items[items.length - 1] += ` ${line.raw.replace(LIST_MARKER, "").trim()}`;
    blank = false;
  }
  return items.map((item) => item.replace(/\s+/g, " ").trim());
}

// Public documentation must never carry machine-local or personal detail.
// Angle-bracket placeholders such as <absolute-path-to-launcher> stay allowed,
// and so does Go's reference time layout.
const OPAQUE = String.raw`(?=[A-Za-z0-9_-]*\d)[A-Za-z0-9][A-Za-z0-9_-]{7,}`;

export const PRIVATE_DETAIL_PATTERNS = [
  ["personal home path", /\/(?:Users|home)\/(?!<)[A-Za-z0-9._-]+/],
  ["Windows profile path", /[A-Za-z]:\\Users\\(?!<)[A-Za-z0-9._-]+/],
  ["concrete nvm version path", /\.nvm\/versions\/(?!<)[A-Za-z0-9._-]+/i],
  ["UUID identifier", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
  ["labelled session identifier", new RegExp(String.raw`\b(?:session|transcript|conversation)[ _-]?(?:id|uuid)?["'\`]?\s*[:=]\s*["'\`]?${OPAQUE}`, "i")],
  ["narrated session identifier", new RegExp(String.raw`\b(?:session|transcript|conversation)[ _-]?(?:id|identifier)\b[^.\n]{0,80}?\b(?=[A-Za-z0-9-]*\d)[A-Za-z0-9](?:[A-Za-z0-9-]{9,})\b`, "i")],
  ["session identifier path segment", new RegExp(String.raw`\b(?:sessions?|transcripts?|conversations?)/${OPAQUE}`, "i")],
  ["opaque session identifier", new RegExp(String.raw`\b(?:session|transcript|conversation)[ _-](?=[A-Za-z0-9]*\d)[A-Za-z0-9]{8,}\b`, "i")],
  ["machine timestamp", /(?!2006-01-02[T ]15:04:05)\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/],
];

export function assertNoPrivateDetails(markdown, subject) {
  for (const [label, pattern] of PRIVATE_DETAIL_PATTERNS) {
    assert.doesNotMatch(markdown, pattern, `${subject} exposes a ${label}`);
  }
}
