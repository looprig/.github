---
id: guides/web-ui/client-sdk/validation
title: Validation and errors
description: Treat response JSON as unknown until the SDK validates it against the shared JSON Schema contract and reports typed failures.
audience: developer
section: guides
order: 6
publication: released
proofs:
  validate-at-the-boundary: [release-github-com-looprig-client]
  inspect-contract-errors: [release-github-com-looprig-client]
  contract-tests: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Validation and errors

## Validate at the boundary

The transport parses a response body as `unknown` and calls the validator for the expected DTO. `validate` compiles the schema set with Ajv 2020 and returns a typed value only after the check succeeds. There is no public path that hands an unvalidated response body to a UI.

```ts
import {
  ContractValidationError,
  validateSessionStatus,
} from "@looprig/client";

try {
  const status = validateSessionStatus(await response.json());
  renderStatus(status);
} catch (error) {
  if (error instanceof ContractValidationError) {
    console.error(error.schemaName, error.errors);
  }
  throw error;
}
```

The exported helpers cover capabilities, create and restore responses, event envelopes and frames, journal pages, gate and input responses, session lists and status, and UUID values. The static DTOs in `types.ts` and the runtime validators are derived from the same schema literals.

## Inspect contract errors

`ContractValidationError` carries the `schemaName` and Ajv `errors` array in addition to a readable message. Use the schema name for a stable diagnostic category and the error objects for telemetry or a developer-facing failure panel. A malformed error body is handled by the shared transport as `MalformedResponseError`, while a valid error envelope is mapped to its typed HTTP error.

Do not recover by casting a failed payload. A contract failure means the data cannot safely be rendered or folded; keep the old view, surface the error, and decide whether a fresh request is appropriate.

## Source

Ajv setup, `ContractValidationError`, the generic `validate` function, and each schema-specific helper are implemented in [`sdk/core/src/validate.ts`](https://github.com/looprig/client/blob/main/sdk/core/src/validate.ts). Schema drift, valid fixtures, and negative cases are checked in [`sdk/core/test/contract.test.ts`](https://github.com/looprig/client/blob/main/sdk/core/test/contract.test.ts).

## Proof

The contract tests validate the fixture set and deliberately reject missing required fields, wrong types, invalid enums, bad UUIDs, extra properties, and malformed top-level values. This is the runtime guard behind the types used by every web UI guide.

