import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const goEnv = { ...process.env, GOWORK: "off", GOCACHE: process.env.GOCACHE || "/private/tmp/looprig-package-surface-cache" };

test("Go package surfaces preserve public declarations and alias reachability", () => {
  const input = {
    packages: [{
      id: "fixture",
      files: [{
        name: "fixture.go",
        source: `package fixture

type Embedded interface { Ready() bool }
type Contract[T any] interface {
  Embedded
  Apply(T) error
}
type Box[T any] struct {
  Value T
  secret string
}
type hidden struct{}
type Public = hidden

func Build[T any](
  value T,
  label string,
) (T, error) { return value, nil }
func (hidden) Reachable() string { return "" }
func (hidden) secret() {}
func (private) Leaked() {}
type private struct{}
type PublicError struct{}
func (PublicError) Error() string { return "" }
type PointerError struct{}
func (*PointerError) Error() string { return "" }
type FalseError struct{}
type WrongError struct{}
func (WrongError) Error() int { return 0 }

const Exported = 1
const privateConstant = 2
var Visible string
var hiddenVariable string
`,
      }],
    }],
  };
  const result = spawnSync("go", ["run", "./scripts/docs/package-surface-go/main.go"], {
    cwd: new URL("../..", import.meta.url),
    input: JSON.stringify(input),
    encoding: "utf8",
    env: goEnv,
  });
  assert.equal(result.status, 0, result.stderr);
  const surface = JSON.parse(result.stdout).packages[0];
  assert.deepEqual(surface.functions.map((value) => value.signature), [
    "func Build[T any](value T, label string) (T, error)",
  ]);
  assert.deepEqual(surface.methods.map((value) => value.signature).sort(), [
    "func (*PointerError) Error() string",
    "func (PublicError) Error() string",
    "func (WrongError) Error() int",
    "func (hidden) Reachable() string",
  ]);
  assert.deepEqual(surface.types.map((value) => value.name), ["Embedded", "Contract", "Box", "Public", "PublicError", "PointerError", "FalseError", "WrongError"]);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /type Contract\[T any\] interface/);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /Embedded/);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /Apply\(T\) error/);
  assert.match(surface.types.find((value) => value.name === "Box").declaration, /Value\s+T/);
  assert.doesNotMatch(surface.types.find((value) => value.name === "Box").declaration, /secret/);
  assert.match(surface.types.find((value) => value.name === "Box").declaration, /contains filtered or unexported fields/);
  assert.deepEqual(surface.constants.map((value) => value.name), ["Exported"]);
  assert.deepEqual(surface.variables.map((value) => value.name), ["Visible"]);
  assert.deepEqual(surface.errors, ["PointerError", "PublicError"]);
});

test("Go package surfaces keep a complete source package synopsis", () => {
  const synopsis = [
    "Package fixture coordinates a deliberately long package boundary sentence that remains complete when its source documentation exceeds the historical generator limit and continues through the final clause without inventing a lifecycle claim while preserving every source-qualified detail for readers.",
    "The next sentence must not be folded into the synopsis.",
  ].join(" ");
  const input = {
    packages: [{
      id: "fixture",
      files: [{
        name: "doc.go",
        source: `// ${synopsis}\npackage fixture\n`,
      }],
    }],
  };
  const result = spawnSync("go", ["run", "./scripts/docs/package-surface-go/main.go"], {
    cwd: new URL("../..", import.meta.url),
    input: JSON.stringify(input),
    encoding: "utf8",
    env: goEnv,
  });
  assert.equal(result.status, 0, result.stderr);
  const surface = JSON.parse(result.stdout).packages[0];
  assert.equal(surface.synopsis, synopsis.split(" The next")[0]);
  assert.ok(surface.synopsis.length > 260, "the synopsis must not be hard-cut");
  assert.doesNotMatch(surface.synopsis, /next sentence|principal handle|constructs/i);
});

test("Go package surfaces retain every exported name in grouped const and var declarations", () => {
  const input = {
    packages: [{
      id: "fixture",
      files: [{
        name: "fixture.go",
        source: `package fixture

const (
  First, Second = 1, 2
  Third = 3
  hidden = 4
)

var (
  VisibleOne, VisibleTwo = 1, 2
  hiddenValue = 3
)
`,
      }],
    }],
  };
  const result = spawnSync("go", ["run", "./scripts/docs/package-surface-go/main.go"], {
    cwd: new URL("../..", import.meta.url),
    input: JSON.stringify(input),
    encoding: "utf8",
    env: goEnv,
  });
  assert.equal(result.status, 0, result.stderr);
  const surface = JSON.parse(result.stdout).packages[0];
  assert.deepEqual(surface.constants.map((value) => value.name), ["First", "Second", "Third"]);
  assert.deepEqual(surface.variables.map((value) => value.name), ["VisibleOne", "VisibleTwo"]);
});
