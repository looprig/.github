import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

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
    env: { ...process.env, GOWORK: "off" },
  });
  assert.equal(result.status, 0, result.stderr);
  const surface = JSON.parse(result.stdout).packages[0];
  assert.deepEqual(surface.functions.map((value) => value.signature), [
    "func Build[T any](value T, label string) (T, error)",
  ]);
  assert.deepEqual(surface.methods.map((value) => value.signature).sort(), [
    "func (PublicError) Error() string",
    "func (hidden) Reachable() string",
  ]);
  assert.deepEqual(surface.types.map((value) => value.name), ["Embedded", "Contract", "Box", "Public", "PublicError"]);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /type Contract\[T any\] interface/);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /Embedded/);
  assert.match(surface.types.find((value) => value.name === "Contract").declaration, /Apply\(T\) error/);
  assert.match(surface.types.find((value) => value.name === "Box").declaration, /Value\s+T/);
  assert.doesNotMatch(surface.types.find((value) => value.name === "Box").declaration, /secret/);
  assert.match(surface.types.find((value) => value.name === "Box").declaration, /contains filtered or unexported fields/);
  assert.deepEqual(surface.constants.map((value) => value.name), ["Exported"]);
  assert.deepEqual(surface.variables.map((value) => value.name), ["Visible"]);
  assert.deepEqual(surface.errors, ["PublicError"]);
});
