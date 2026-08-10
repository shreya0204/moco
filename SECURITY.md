# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately via GitHub's security advisories:
**https://github.com/shreya0204/moco/security/advisories/new**

Do not open public issues for security reports. You'll get a response within a week.

## Scope

- `moco-mcp` (npm): a stateless, read-only stdio MCP server. It performs no network
  requests, no file writes, no shell execution — it only reads its own bundled
  registry JSON. All tool inputs are schema-validated; component names are
  constrained to an enum derived from the bundled files.
- The registry (`/r/*.json`) and docs site: static files and statically generated
  pages. Components are copy-source — audit what you install, as with any
  copy-source registry.

## Supported versions

Only the latest published version of `moco-mcp` is supported.
