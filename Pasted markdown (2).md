# Wrote /Users/sandeep/Desktop/Project26/Verbaflow_lake/AI tool infrastructure config.md
# AI Tool Infrastructure Config
**Owner:** San Ghotra | VerbaFlow LLC
**Last updated:** 2026-05-08
**Purpose:** Single source of truth for every AI agent configuration file, its location, its role, and the sync strategy across machines.
---
## Architecture Overview
San runs a multi agent stack across two MacBooks. All agent configuration lives in a private GitHub repo (`ai-config-transfer`) so changes on one machine propagate to the other via `git push` / `git pull`.
**Tool stack:** OpenCode + Claude Code + Kilo Code + Gemini CLI + GitHub Copilot + OpenAI ChatGPT (VS Code extension)
**Model stack:**
| Use case | Model | Cost |
|---|---|---|
| Daily in repo coding (OpenCode) | Kimi K2.5 default, MiniMax M2.7 fallback | Low |
| Hard refactors (Claude Code) | Opus 4.6 escalation | High |
| Kilo Code | GLM 4.7 (via Z AI proxy) | Low |
| Automated pipelines | DeepSeek V3 | ~$0.10/day |
| Interactive / creative / judge | Claude | Medium |
---
## File Inventory
### Layer 1: OpenCode Global Config
| File | Path | Role |
|---|---|---|
| `AGENTS.md` | `~/.config/opencode/AGENTS.md` | Master rule file for OpenCode. Defines instruction hierarchy, concurrent agent protocol, automatic behaviors, skill activation, and agent modes. |
| `opencode.json` | `~/.config/opencode/opencode.json` | Model selection, permissions (edit, bash, webfetch), agent modes (build/plan), custom commands (ralph, ralph_isolated). Points to `~/.claude/CLAUDE.md` via relative path in `instructions` array. |
| `package.json` | `~/.config/opencode/package.json` | Declares `@opencode-ai/plugin` dependency. Reinstall via `npm install` after clone. |
### Layer 2: Skills (Shared Between OpenCode and Claude Code)
`~/.claude/skills` is a symlink to `~/.config/opencode/skills`. Both tools read from one source.
| Skill | File | Trigger |
|---|---|---|
| `sandeep-universal-style` | `~/.config/opencode/skills/sandeep-universal-style/SKILL.md` | Every response from San. Governs tone, formatting, banned patterns, output discipline. |
| `agent-coordination` | `~/.config/opencode/skills/agent-coordination/SKILL.md` | Multiple agents, concurrent editing, file locking, "another terminal." |
| `verbaflow-design-system` | `~/.config/opencode/skills/verbaflow-design-system/SKILL.md` | Design matrix selection, visual frameworks, CSS tokens, component patterns. |
| `design-director` | `~/.config/opencode/skills/design-director/SKILL.md` | Design communication, Figma workflow, spec extraction, handoff docs. |
| `design-variations` | `~/.config/opencode/skills/design-variations/SKILL.md` | Structured side by side design variations with concrete specs. |
| `frontend-blueprint` | `~/.config/opencode/skills/frontend-blueprint/SKILL.md` | Website architecture, Chrome extension, SaaS scaffolding, design systems. |
| `capture-design` | `~/.config/opencode/skills/capture-design/SKILL.md` | Extract design DNA from live websites, derive CSS tokens. |
| `ai-video-director` | `~/.config/opencode/skills/ai-video-director/SKILL.md` | Cinematic AI video prompting for Higgsfield, Seedance, Cinema Studio. |
### Layer 3: Claude Code Global Config
| File | Path | Role |
|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | Master control plane (178 lines). Identity, instruction hierarchy, agent orchestration stack, voice/style rules, memory protocol, scope routing, skill auto triggers, formatting hard stops, changelog rule. |
| `CLAUDE.local.md` | `~/.claude/CLAUDE.local.md` | Device specific overrides. Local paths, SSH aliases, preferred editor, environment notes. NEVER committed to git. Edit per machine. |
| `settings.json` | `~/.claude/settings.json` | Claude Code permissions (bash patterns, additional directories), effort level. |
| `settings.local.json` | `~/.claude/settings.local.json` | Local permission overrides. |
### Layer 4: Claude Context Files
Loaded at session start via `@import` in `CLAUDE.md`.
| File | Path | Content |
|---|---|---|
| `projects.md` | `~/.claude/context/projects.md` | Project registry: codenames, paths, routing rules, infrastructure, CTO/CEO delegation model. |
| `engineering.md` | `~/.claude/context/engineering.md` | Code style, type safety, parsing patterns, async integration, Chrome extension rules, MLLC specific rules, CI/CD, credential security, repo structure, LLM cost stack. |
| `pipelines.md` | `~/.claude/context/pipelines.md` | Resume generation pipeline, LinkedIn outreach (Titan v2.0), Prometheus content pipeline, workflow automation rules, task classification, interview scripts, referral letters, reusable architecture patterns. |
| `business.md` | `~/.claude/context/business.md` | Legal/compliance, pricing rules, career strategy, design system matrices, skill creation meta, cowork/dispatch rules, infrastructure benchmarks, GCP org policy. |
### Layer 5: Claude Memory Files
Living session context. Updated during sessions.
| File | Path | Content |
|---|---|---|
| `MEMORY.md` | `~/.claude/memory/MEMORY.md` | Index file (under 200 lines). Links to topic files with one line hooks. |
| `decisions.md` | `~/.claude/memory/decisions.md` | Architectural and strategic decisions with dates and rationale. |
| `conventions.md` | `~/.claude/memory/conventions.md` | Patterns observed in codebase/workflow, not yet in formal docs. |
| `style-corrections.md` | `~/.claude/memory/style-corrections.md` | Log of language and formatting corrections San has made. |
| `mllc-project-status.md` | `~/.claude/memory/mllc-project-status.md` | MLLC revamp deployment, plugins, media optimization, admin portal status. |
| `cloudways-hosting.md` | `~/.claude/memory/cloudways-hosting.md` | Cloudways server config, SSH, Cloudflare, MariaDB details. |
### Layer 6: Claude Project Specific Memory
Each project gets its own memory directory under `~/.claude/projects/<project-hash>/memory/`.
| Project | Hash Dir | Memory Files |
|---|---|---|
| MLLC | `-Users-sandeep-Local-Sites-mllc-revamp` | `MEMORY.md`, `design_option_e_community_board_lite.md`, `feedback_pantheon_deploy.md`, `project_mllc_infra.md` |
| Samurai | `-Users-sandeep-Desktop-Project26-Agents-samurai` | `MEMORY.md`, `project_testing_bypass.md` |
| Jack | `-Users-sandeep-Desktop-Project26-Agents-jack` | `MEMORY.md` (CBI implementation) |
| VFlow 1.0 | `-Users-sandeep-Desktop-Project25-verbaflow-projects-vflow1-0` | `MEMORY.md`, `project_agency_route.md` |
### Layer 7: Claude Plugins
| Plugin | Project | Install Path |
|---|---|---|
| `ralph-loop@claude-plugins-official` | PriorZap | `~/.claude/plugins/cache/claude-plugins-official/ralph-loop/` |
Plugin registry: `~/.claude/plugins/installed_plugins.json`
### Layer 8: Kilo Code Config
| File | Path | Role |
|---|---|---|
| `kilo.jsonc` | `~/.config/kilo/kilo.jsonc` | Permission rules for bash (php, node). Model routing via Z AI proxy. |
| `package.json` | `~/.config/kilo/package.json` | Declares `@kilocode/plugin` dependency. |
### Layer 9: Z AI Proxy Config
| File | Path | Role |
|---|---|---|
| `config.json` | `~/.config/zai/config.json` | API endpoint, model mapping (haiku → glm-4.5-air, sonnet/opus → glm-4.7). |
### Layer 10: Gemini CLI Config
| File | Path | Role |
|---|---|---|
| `settings.json` | `~/.gemini/settings.json` | API key. Contains secret. Do NOT commit. |
| `GEMINI.md` | `~/.gemini/GEMINI.md` | Project instructions for Gemini CLI. Currently empty. Populate with condensed `CLAUDE.md` rules. |
### Layer 11: GitHub CLI Config
| File | Path | Role |
|---|---|---|
| `config.yml` | `~/.config/gh/config.yml` | Git protocol, editor, aliases (`co: pr checkout`). Safe to commit. |
| `hosts.yml` | `~/.config/gh/hosts.yml` | Auth tokens. Contains secrets. Do NOT commit. Run `gh auth login` on new machine. |
### Layer 12: VS Code Settings
| File | Path | Role |
|---|---|---|
| `settings.json` | `~/Library/Application Support/Code/User/settings.json` | Editor config, terminal settings, Claude Code integration, MCP servers, chat settings. Contains Stitch MCP API key. |
| `keybindings.json` | `~/Library/Application Support/Code/User/keybindings.json` | Custom keybindings (shift+enter in terminal). |
### Layer 13: VS Code Extensions
```
anthropic.claude-code
chris-noring.node-snippets
docker.docker
github.vscode-github-actions
google.gemini-cli-vscode-ide-companion
google.geminicodeassist
kilocode.kilo-code
mechatroner.rainbow-csv
ms-azuretools.vscode-containers
ms-azuretools.vscode-docker
ms-python.debugpy
ms-python.python
ms-python.vscode-pylance
ms-python.vscode-python-envs
ms-toolsai.jupyter
ms-toolsai.jupyter-keymap
ms-toolsai.jupyter-renderers
ms-toolsai.vscode-jupyter-cell-tags
ms-toolsai.vscode-jupyter-slideshow
ms-vscode-remote.remote-containers
openai.chatgpt
sst-dev.opencode
```
### Layer 14: SSH Config
| File | Path | Role |
|---|---|---|
| `config` | `~/.ssh/config` | Host aliases: `claw` (204.168.140.51), `agent` (46.224.38.85), `github.com` (mllc_deploy_key). |
Private keys (`id_ed25519`, `cloudways_rsa`, `mllc_deploy_key`, `artofwar`) transfer separately. Never commit.
### Layer 15: Git Global Config
| File | Path | Role |
|---|---|---|
| `config` | `~/.config/git/config` | Global git settings. |
### Layer 16: Fish Shell Config
| File | Path | Role |
|---|---|---|
| `config.fish` | `~/.config/fish/config.fish` | Conda initialization. |
### Layer 17: Project Level AI Config Files (Per Repo)
| File | Purpose | Status |
|---|---|---|
| `AGENTS.md` (repo root) | Project specific agent behavior overrides | Not yet created for most repos. Create for Samurai, MLLC, VFlow. |
| `.github/copilot-instructions.md` | GitHub Copilot repo specific instructions | Not yet created. Worth creating for active repos. |
| `.cursorrules` | Cursor IDE instructions | Not present. Only needed if using Cursor. |
| `.windsurfrules` | Windsurf IDE instructions | Not present. Only needed if using Windsurf. |
| `.clinerules` | Cline extension instructions | Not present. Only needed if using Cline. |
| `.builder/rules/` | Generic AI agent rules directory | Referenced in engineering.md but not yet created. |
---
## Sync Strategy
### How It Works
```
Machine A (MacBook Pro)          Machine B (MacBook Air)
        │                                │
        │  edit file                     │
        │  git add .                     │
        │  git commit -m "update"        │
        │  git push ──────────────────►  │
        │                                │  git pull
        │                                │  files updated
        │                                │
        │                                │  edit file
        │                                │  git add .
        │                                │  git commit -m "update"
        │  ◄──────────────────────────  git push
        │  git pull                      │
        │  files updated                 │
```
### What Syncs (committed to repo)
* All skill files (`~/.config/opencode/skills/`)
* `AGENTS.md`, `opencode.json`, `package.json`
* `CLAUDE.md`, `CLAUDE.local.md` (template, edit paths per machine)
* `settings.json`, `settings.local.json`
* All context files (`~/.claude/context/`)
* All memory files (`~/.claude/memory/`)
* All project memory files (`~/.claude/projects/*/memory/`)
* `installed_plugins.json`
* Kilo Code config (`kilo.jsonc`)
* Z AI config (`config.json`)
* `GEMINI.md`
* `gh/config.yml`
* VS Code `settings.json` and `keybindings.json` (strip API keys first)
* SSH `config` (host aliases only, no private keys)
* VS Code extensions list (`extensions.txt`)
### What Does NOT Sync (excluded via .gitignore)
* `~/.claude/sessions/` — chat history, huge, not portable
* `~/.claude/cache/`, `telemetry/`, `stats-cache.json`, `statsig/` — runtime ephemera
* `~/.claude/history.jsonl` — session logs
* `~/.claude/downloads/`, `paste-cache/`, `shell-snapshots/`, `todos/`, `plans/` — session specific
* `~/.config/opencode/node_modules/` — reinstall via `npm install`
* `~/.gemini/settings.json` — contains API key
* `~/.config/gh/hosts.yml` — contains auth tokens
* `~/.ssh/id_*`, `~/.ssh/cloudways_rsa`, `~/.ssh/mllc_deploy_key`, `~/.ssh/artofwar` — private keys
* VS Code workspace storage, history, session data
### Manual Steps After Clone on New Machine
1. `cd ~/.config/opencode && npm install`
2. `cd ~/.config/kilo && npm install`
3. `ln -s ~/.config/opencode/skills ~/.claude/skills`
4. `gh auth login`
5. Add Gemini API key to `~/.gemini/settings.json`
6. Add Stitch MCP API key to VS Code `settings.json`
7. Transfer SSH private keys via `scp` or USB
8. Run `cat extensions.txt | xargs -L 1 code --install-extension`
9. Edit `~/.claude/CLAUDE.local.md` paths if username differs
10. Edit `~/.claude/context/projects.md` paths if directory structure differs
---
## Enhancement Roadmap
Files that exist but are empty or underutilized:
| File | Current State | Enhancement |
|---|---|---|
| `~/.gemini/GEMINI.md` | Empty (0 bytes) | Populate with condensed `CLAUDE.md` rules so Gemini CLI follows same conventions. |
| `~/.claude/memory/conventions.md` | Only a comment header | Start logging observed patterns. Claude auto adds entries but needs seeding. |
| Project level `AGENTS.md` | Does not exist for most repos | Create for Samurai, MLLC, VFlow 1.0 with project specific overrides. |
| `.github/copilot-instructions.md` | Does not exist | Create for active repos so GitHub Copilot follows conventions. |
| `~/.claude/projects/*/CLAUDE.md` | Does not exist for any project | Create project specific CLAUDE.md files for Samurai, MLLC, VFlow with project context. |
Tools not yet configured but available:
| Tool | Status | Action |
|---|---|---|
| OpenAI ChatGPT (VS Code) | Extension installed, no config | Configure if using Codex or ChatGPT agent features. |
| GitHub Copilot | Extension not installed separately | Install `github.copilot` if using inline suggestions beyond Copilot Chat. |
| Aider | Not installed | Consider if you want a terminal based AI coding tool beyond OpenCode. |
| Continue | Not installed | Consider for local model support in VS Code. |
---
## File Relationship Map
```
~/.config/opencode/
├── AGENTS.md ◄──────────────── reads from ──────┐
├── opencode.json ◄── instructions array points to ──► ~/.claude/CLAUDE.md
├── package.json                                    │
└── skills/ ◄── symlinked from ──► ~/.claude/skills/ │
    ├── sandeep-universal-style/                    │
    ├── agent-coordination/                         │
    ├── verbaflow-design-system/                    │
    ├── design-director/                            │
    ├── design-variations/                          │
    ├── frontend-blueprint/                         │
    ├── capture-design/                             │
    └── ai-video-director/                          │
                                                    │
~/.claude/                                          │
├── CLAUDE.md ◄── master control plane ────────────┘
│   ├── @imports ──► context/projects.md
│   ├── @imports ──► context/engineering.md
│   ├── @imports ──► context/pipelines.md
│   └── @imports ──► context/business.md
├── CLAUDE.local.md (device specific, never committed)
├── settings.json
├── settings.local.json
├── memory/
│   ├── MEMORY.md (index)
│   ├── decisions.md
│   ├── conventions.md
│   ├── style-corrections.md
│   └── project-specific files
├── plugins/
│   └── installed_plugins.json
└── projects/
    └── <project-hash>/
        └── memory/
            ├── MEMORY.md
            └── project-specific files
~/.config/kilo/
├── kilo.jsonc (permissions, model routing)
└── package.json (@kilocode/plugin)
~/.config/zai/
└── config.json (API endpoint, model mapping for Kilo Code)
~/.gemini/
├── settings.json (API key, secret)
└── GEMINI.md (instructions, currently empty)
~/.config/gh/
├── config.yml (safe to commit)
└── hosts.yml (auth tokens, secret)
~/Library/Application Support/Code/User/
├── settings.json (editor, MCP, Claude Code integration)
└── keybindings.json
~/.ssh/
├── config (host aliases, safe to commit)
└── id_*, cloudways_rsa, mllc_deploy_key, artofwar (NEVER commit)
```
---
## Version History
| Date | Change |
|---|---|
| 2026-05-08 | Initial creation. Full inventory of all AI tool config files across OpenCode, Claude Code, Kilo Code, Gemini CLI, GitHub CLI, VS Code, SSH. |