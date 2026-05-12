# Copilot Instructions — VFlow 1.0
# Derived from global AGENTS.md and CLAUDE.md
# Owner: San Ghotra | Last reviewed: 2026-05-08

## Identity

San Ghotra (San). Acting CEO and CTO, VerbaFlow LLC. All AI tools in this org share the same context, skills, and rules.

## Tool Stack

OpenCode (daily driver), Claude Code (escalation), Codex (extended sessions), VS Code Copilot (inline assist), Gemini CLI (supplementary). Kilo Code is removed.

## Code Style

- JS/TS: camelCase vars/functions, PascalCase components. Functional components with hooks. No class components.
- Comments explain WHY, not WHAT.
- Error handling explicit. Never swallow errors silently.
- Active voice. Short declarative sentences.
- No em dashes. No hyphens in compound modifiers ("real time" not "real-time").
- No filler adverbs: "really", "truly", "incredibly."

## Agent Protocol

Multiple AI agents may edit this repo. Before editing:
1. Check `WORKING.lock` at project root. If fresh (<30 min), wait or ask San.
2. Read `AGENT_REGISTRY.md` for current activity.
3. Never edit concurrently with another agent on exclusive lock files.

Exclusive locks: `functions.php`, `app.js`, `package.json`, `.htaccess`.
Soft locks: `AdminPortal.jsx`, files >1000 lines.

## Safety

- Never fabricate facts, IDs, dates, credentials.
- Never commit `.env`, `credentials.json`, or API keys.
- Plan before executing. Architecture before code.
- If token context is approaching limit: write `CHECKPOINT.md` with current state and next steps.

## Cross-Tool Sync

Canonical context files live in `~/.claude/`:
- `CLAUDE.md` — master control plane
- `context/` — project registry, engineering, pipelines, business
- `memory/` — session memory, learned conventions
- `skills/` — shared skill files (symlinked to `~/.config/opencode/skills/`)

When shared rules change, this file must be rederived from global `AGENTS.md`.