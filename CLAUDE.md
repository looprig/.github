# Repository instructions

This repository holds the public profile and shared documentation for the
looprig project.

## Documentation audiences

Write every technical document for one primary audience.

### Consumers

Consumer documentation lives in `docs/consumers/`. It helps people use looprig
to build agentic systems they own and can change.

- Start from a useful outcome and lead to a working example.
- Explain the smallest setup first, then add durability, tools, gates,
  workspaces, storage, and multiple agents as needed.
- Use public APIs and examples that can be copied and run.
- Show where users can choose models, prompts, tools, permissions, storage,
  interfaces, and deployment environments.
- Treat personal agents, team systems, and production deployments as equally
  valid uses.

### Contributors

Contributor documentation lives in `docs/contributors/`. It explains how
looprig works internally and how to change it safely.

- Describe architecture, package boundaries, control flow, state ownership,
  persistence, concurrency, and failure behavior.
- State the invariants a design protects and the reasons behind important
  tradeoffs.
- Link concepts to the relevant repositories, packages, types, and tests.
- Clearly separate current behavior from planned work.
- Include verification steps when documenting a development workflow.

## Shared terminology

- **looprig** is the overall project and ecosystem.
- **harness** is the runtime module that provides loops, sessions, tools, gates,
  journals, and storage integration.
- **Rig** is the agent system a user configures, owns, and runs.
- The harness provides the parts. The user assembles a Rig.

## Writing style

- Write in clear, concise, human language.
- Prefer concrete examples over abstract claims.
- Use `we` when speaking for the project.
- Do not use em dashes or emojis.
- Do not frame looprig as enterprise-only.
- Verify technical claims against the source repository before documenting them.
- Keep mission and brand material in `docs/mission/` focused on why looprig
  exists. Keep API and implementation detail in the audience-specific folders.
- Do not create planning documents for documentation-only edits unless asked.
