# VerbaFlow — Hermes Skills & Tools Reference

> Auto-generated snapshot of all 117 available skills + full `hermes-agent` skill content.
> Generated: 2026-05-15

---

## Table of Contents

1. [Skills Catalog (117 skills, 18 categories)](#skills-catalog)
2. [Hermes Agent Skill — Full Reference](#hermes-agent-skill)

---

<a name="skills-catalog"></a>
## 1. Skills Catalog

Total: **117 skills** across **18 categories**.

### apple (5)

| Skill | Description |
|-------|-------------|
| apple-notes | Manage Apple Notes via memo CLI: create, search, edit. |
| apple-reminders | Apple Reminders via remindctl: add, list, complete. |
| findmy | Track Apple devices/AirTags via FindMy.app on macOS. |
| imessage | Send and receive iMessages/SMS via the imsg CLI on macOS. |
| macos-computer-use | Drive the macOS desktop in the background — screenshots, mouse, keyboard, scroll, drag. |

### autonomous-ai-agents (5)

| Skill | Description |
|-------|-------------|
| claude-code | Delegate coding to Claude Code CLI (features, PRs). |
| codex | Delegate coding to OpenAI Codex CLI (features, PRs). |
| cross-tool-knowledge-integration | Integrate a centralized knowledge base (Obsidian, etc.) across multiple AI coding tools (Claude Code, OpenCode, Copilot, Gemini CLI). |
| hermes-agent | Configure, extend, or contribute to Hermes Agent. |
| opencode | Delegate coding to OpenCode CLI (features, PR review). |

### creative (21)

| Skill | Description |
|-------|-------------|
| architecture-diagram | Dark-themed SVG architecture/cloud/infra diagrams as HTML. |
| ascii-art | ASCII art: pyfiglet, cowsay, boxes, image-to-ascii. |
| ascii-video | ASCII video: convert video/audio to colored ASCII MP4/GIF. |
| baoyu-comic | Knowledge comics: educational, biography, tutorial. |
| baoyu-infographic | Infographics: 21 layouts x 21 styles. |
| claude-design | Design one-off HTML artifacts (landing, deck, prototype). |
| comfyui | Generate images, video, and audio with ComfyUI — install, launch, manage nodes/models, run workflows. |
| design-md | Author/validate/export Google's DESIGN.md token spec files. |
| excalidraw | Hand-drawn Excalidraw JSON diagrams (arch, flow, seq). |
| humanizer | Humanize text: strip AI-isms and add real voice. |
| ideation | Generate project ideas via creative constraints. |
| manim-video | Manim CE animations: 3Blue1Brown math/algo videos. |
| p5js | p5.js sketches: gen art, shaders, interactive, 3D. |
| pixel-art | Pixel art w/ era palettes (NES, Game Boy, PICO-8). |
| popular-web-designs | 54 real design systems (Stripe, Linear, Vercel) as HTML/CSS. |
| pretext | Creative browser demos with @chenglou/pretext — DOM-free text layout. |
| sketch | Throwaway HTML mockups: 2-3 design variants to compare. |
| songwriting-and-ai-music | Songwriting craft and Suno AI music prompts. |
| touchdesigner-mcp | Control a running TouchDesigner instance via twozero MCP — 36 native tools. |

### data-science (1)

| Skill | Description |
|-------|-------------|
| jupyter-live-kernel | Iterative Python via live Jupyter kernel (hamelnb). |

### devops (10)

| Skill | Description |
|-------|-------------|
| ai-config-sync | Audit and sync AI tool configs (MCP servers, skills, instructions, git hooks) across the 7-tool stack. |
| external-service-integration | Integrate third-party APIs and services into Next.js backends. Covers REST fallback, file asset pipelines, webhooks, rate limiting. |
| git-audit | Read-only git status scan across all project directories. Reports uncommitted changes, branch info, WORKING.lock status. |
| growth-plan-workflow | Process growth plan requests for VerbaFlow vflow2.0 — generate industry-specific wireframes and send email notifications. |
| kanban-orchestrator | Decomposition playbook + specialist-roster conventions + anti-temptation rules for an orchestrator profile routing work through Kanban. |
| kanban-worker | Pitfalls, examples, and edge cases for Hermes Kanban workers. |
| project-memory-setup | Initialize Graphify + MemPalace bi-directional memory for a new project. |
| stripe-payments | Stripe payment integration via CLI — products, prices, webhooks, checkout sessions, Next.js API route wiring. |
| telegram-capture-bot | Build and manage a Telegram bot that captures messages to the Obsidian vault Inbox and provides remote command execution. |
| webhook-subscriptions | Webhook subscriptions: event-driven agent runs. |

### email (1)

| Skill | Description |
|-------|-------------|
| himalaya | Himalaya CLI: IMAP/SMTP email from terminal. |

### gaming (2)

| Skill | Description |
|-------|-------------|
| minecraft-modpack-server | Host modded Minecraft servers (CurseForge, Modrinth). |
| pokemon-player | Play Pokemon via headless emulator + RAM reads. |

### github (6)

| Skill | Description |
|-------|-------------|
| codebase-inspection | Inspect codebases w/ pygount: LOC, languages, ratios. |
| github-auth | GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login. |
| github-code-review | Review PRs: diffs, inline comments via gh or REST. |
| github-issues | Create, triage, label, assign GitHub issues via gh or REST. |
| github-pr-workflow | GitHub PR lifecycle: branch, commit, open, CI, merge. |
| github-repo-management | Clone/create/fork repos; manage remotes, releases. |

### mcp (1)

| Skill | Description |
|-------|-------------|
| native-mcp | MCP client: connect servers, register tools (stdio/HTTP). |

### media (5)

| Skill | Description |
|-------|-------------|
| gif-search | Search/download GIFs from Tenor via curl + jq. |
| heartmula | HeartMuLa: Suno-like song generation from lyrics + tags. |
| songsee | Audio spectrograms/features (mel, chroma, MFCC) via CLI. |
| spotify | Spotify: play, search, queue, manage playlists and devices. |
| youtube-content | YouTube transcripts to summaries, threads, blogs. |

### mlops (10)

| Skill | Description |
|-------|-------------|
| audiocraft-audio-generation | AudioCraft: MusicGen text-to-music, AudioGen text-to-sound. |
| dspy | DSPy: declarative LM programs, auto-optimize prompts, RAG. |
| evaluating-llms-harness | lm-eval-harness: benchmark LLMs (MMLU, GSM8K, etc.). |
| huggingface-hub | HuggingFace hf CLI: search/download/upload models, datasets. |
| llama-cpp | llama.cpp local GGUF inference + HF Hub model discovery. |
| mlx-serving | Serve MLX-format LLMs on Apple Silicon — mlx_lm.server and oMLX. |
| obliteratus | OBLITERATUS: abliterate LLM refusals (diff-in-means). |
| segment-anything-model | SAM: zero-shot image segmentation via points, boxes, masks. |
| serving-llms-vllm | vLLM: high-throughput LLM serving, OpenAI API, quantization. |
| weights-and-biases | W&B: log ML experiments, sweeps, model registry, dashboards. |

### note-taking (1)

| Skill | Description |
|-------|-------------|
| obsidian | Read, search, create, and edit notes in the Obsidian vault. |

### productivity (10)

| Skill | Description |
|-------|-------------|
| airtable | Airtable REST API via curl. Records CRUD, filters, upserts. |
| google-workspace | Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python. |
| growth-plan-generation | Generate growth plan wireframes and email notifications for VerbaFlow. |
| linear | Linear: manage issues, projects, teams via GraphQL + curl. |
| maps | Geocode, POIs, routes, timezones via OpenStreetMap/OSRM. |
| nano-pdf | Edit PDF text/typos/titles via nano-pdf CLI (NL prompts). |
| notion | Notion API via curl: pages, databases, blocks, search. |
| ocr-and-documents | Extract text from PDFs/scans (pymupdf, marker-pdf). |
| pdf-generation | Generate PDF documents from markdown or plain text when standard tools are unavailable. |
| powerpoint | Create, read, edit .pptx decks, slides, notes, templates. |
| teams-meeting-pipeline | Operate the Teams meeting summary pipeline via Hermes CLI. |

### red-teaming (1)

| Skill | Description |
|-------|-------------|
| godmode | Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN. |

### research (5)

| Skill | Description |
|-------|-------------|
| arxiv | Search arXiv papers by keyword, author, category, or ID. |
| blogwatcher | Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool. |
| llm-wiki | Karpathy's LLM Wiki: build/query interlinked markdown KB. |
| polymarket | Query Polymarket: markets, prices, orderbooks, history. |
| research-paper-writing | Write ML papers for NeurIPS/ICML/ICLR: design→submit. |

### smart-home (1)

| Skill | Description |
|-------|-------------|
| openhue | Control Philips Hue lights, scenes, rooms via OpenHue CLI. |

### social-media (1)

| Skill | Description |
|-------|-------------|
| xurl | X/Twitter via xurl CLI: post, search, DM, media, v2 API. |

### software-development (15)

| Skill | Description |
|-------|-------------|
| debugging-hermes-tui-commands | Debug Hermes TUI slash commands: Python, gateway, Ink UI. |
| execute-implementation-handoff | Receive a large approved implementation handoff document, audit repo state, execute phases in order. |
| hermes-agent-skill-authoring | Author in-repo SKILL.md: frontmatter, validator, structure. |
| implementation-handoff-execution | Execute multi-phase implementation handoffs methodically. |
| integration-migration | Swap one backend integration for another across multi-codebase projects. |
| node-inspect-debugger | Debug Node.js via --inspect + Chrome DevTools Protocol CLI. |
| plan | Plan mode: write markdown plan to .hermes/plans/, no exec. |
| python-debugpy | Debug Python: pdb REPL + debugpy remote (DAP). |
| requesting-code-review | Pre-commit review: security scan, quality gates, auto-fix. |
| spike | Throwaway experiments to validate an idea before build. |
| subagent-driven-development | Execute plans via delegate_task subagents (2-stage review). |
| systematic-debugging | 4-phase root cause debugging: understand bugs before fixing. |
| test-driven-development | TDD: enforce RED-GREEN-REFACTOR, tests before code. |
| writing-plans | Write implementation plans: bite-sized tasks, paths, code. |

### Uncategorized / Core (17)

| Skill | Description |
|-------|-------------|
| agent-coordination | Multi-agent concurrency control for OpenCode + Claude Code sessions. Lock-file protocol to prevent silent overwrites. |
| ai-video-director | Sandeep's cinematic AI video and image prompting system. Generates ad packs, A/B test creatives, production-grade prompts for Higgsfield Soul 2, Cinema Studio 2.0, Seedance. |
| capture-design | Extract the complete design DNA from any live website and add it as a new framework to the verbaflow-design-system. |
| code-review-and-quality | Conducts multi-axis code review. Use before merging any change. |
| design-director | Master skill for design communication, Figma workflow, design audits, spec extraction, handoff documentation. |
| design-variations | Generate structured side by side design variations for any page section or component, with concrete specs and tradeoff analysis. |
| dogfood | Exploratory QA of web apps: find bugs, evidence, reports. |
| frontend-blueprint | Battle-tested best practices for building websites, Chrome extensions, SaaS products, web apps, and mobile apps. |
| graphify | Any input (code, docs, papers, images, videos) to knowledge graph. Use when user asks any question about a codebase. |
| lessons-from-changes | Auto-curate rules from incidents and fixes. Trigger when a bug is fixed or user says "learn from this." |
| prisma-database-setup | Prisma ORM setup, Supabase connection patterns, and migration workflows for Next.js projects. |
| sandeep-universal-style | Sandeep (San) Ghotra's universal communication and output style. Enforces voice, formatting, banned patterns, and agency-level output discipline. |
| security-and-hardening | Hardens code against vulnerabilities. Use when handling user input, auth, data storage, or external integrations. |
| shipping-and-launch | Prepares production launches. Pre-launch checklist, monitoring, staged rollout, rollback strategy. |
| spec-driven-development | Creates specs before coding. Use when starting a new project, feature, or significant change. |
| verbaflow-design-system | Visual design matrices, component patterns, and CSS for VerbaFlow products. Five frameworks: Enterprise Authority, Developer Dark Mode, Consumer Conversion, Studio White, VerbaFlow Command Centre. |
| verbaflow-ui-primitives | Reusable UI primitives for VerbaFlow marketing site — WebGL overlay effects, magnetic buttons, counter animations, scroll-driven hand choreography. |
| yuanbao | Yuanbao groups: @mention users, query info/members. |

---

<a name="hermes-agent-skill"></a>
## 2. Hermes Agent Skill — Full Reference

> Source: `skill_view(name='hermes-agent')`  
> Path: `~/.hermes/skills/autonomous-ai-agents/hermes-agent/SKILL.md`  
> Version: 2.1.0

---

# Hermes Agent

Hermes Agent is an open-source AI agent framework by Nous Research that runs in your terminal, messaging platforms, and IDEs. It belongs to the same category as Claude Code (Anthropic), Codex (OpenAI), and OpenClaw — autonomous coding and task-execution agents that use tool calling to interact with your system. Hermes works with any LLM provider (OpenRouter, Anthropic, OpenAI, DeepSeek, local models, and 15+ others) and runs on Linux, macOS, and WSL.

What makes Hermes different:

- **Self-improving through skills** — Hermes learns from experience by saving reusable procedures as skills. When it solves a complex problem, discovers a workflow, or gets corrected, it can persist that knowledge as a skill document that loads into future sessions. Skills accumulate over time, making the agent better at your specific tasks and environment.
- **Persistent memory across sessions** — remembers who you are, your preferences, environment details, and lessons learned. Pluggable memory backends (built-in, Honcho, Mem0, and more) let you choose how memory works.
- **Multi-platform gateway** — the same agent runs on Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email, and 10+ other platforms with full tool access, not just chat.
- **Provider-agnostic** — swap models and providers mid-workflow without changing anything else. Credential pools rotate across multiple API keys automatically.
- **Profiles** — run multiple independent Hermes instances with isolated configs, sessions, skills, and memory.
- **Extensible** — plugins, MCP servers, custom tools, webhook triggers, cron scheduling, and the full Python ecosystem.

People use Hermes for software development, research, system administration, data analysis, content creation, home automation, and anything else that benefits from an AI agent with persistent context and full system access.

**This skill helps you work with Hermes Agent effectively** — setting it up, configuring features, spawning additional agent instances, troubleshooting issues, finding the right commands and settings, and understanding how the system works when you need to extend or contribute to it.

**Docs:** https://hermes-agent.nousresearch.com/docs/

---

## Quick Start

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Interactive chat (default)
hermes

# Single query
hermes chat -q "What is the capital of France?"

# Setup wizard
hermes setup

# Change model/provider
hermes model

# Check health
hermes doctor
```

---

## CLI Reference

### Global Flags

```
hermes [flags] [command]

  --version, -V             Show version
  --resume, -r SESSION      Resume session by ID or title
  --continue, -c [NAME]     Resume by name, or most recent session
  --worktree, -w            Isolated git worktree mode (parallel agents)
  --skills, -s SKILL        Preload skills (comma-separate or repeat)
  --profile, -p NAME        Use a named profile
  --yolo                    Skip dangerous command approval
  --pass-session-id         Include session ID in system prompt
```

No subcommand defaults to `chat`.

### Chat

```
hermes chat [flags]
  -q, --query TEXT          Single query, non-interactive
  -m, --model MODEL         Model (e.g. anthropic/claude-sonnet-4)
  -t, --toolsets LIST       Comma-separated toolsets
  --provider PROVIDER       Force provider (openrouter, anthropic, nous, etc.)
  -v, --verbose             Verbose output
  -Q, --quiet               Suppress banner, spinner, tool previews
  --checkpoints             Enable filesystem checkpoints (/rollback)
  --source TAG              Session source tag (default: cli)
```

### Configuration

```
hermes setup [section]      Interactive wizard (model|terminal|gateway|tools|agent)
hermes model                Interactive model/provider picker
hermes config               View current config
hermes config edit          Open config.yaml in $EDITOR
hermes config set KEY VAL   Set a config value
hermes config path          Print config.yaml path
hermes config env-path      Print .env path
hermes config check         Check for missing/outdated config
hermes config migrate       Update config with new options
hermes login [--provider P] OAuth login (nous, openai-codex)
hermes logout               Clear stored auth
hermes doctor [--fix]       Check dependencies and config
hermes status [--all]       Show component status
```

### Tools & Skills

```
hermes tools                Interactive tool enable/disable (curses UI)
hermes tools list           Show all tools and status
hermes tools enable NAME    Enable a toolset
hermes tools disable NAME   Disable a toolset

hermes skills list          List installed skills
hermes skills search QUERY  Search the skills hub
hermes skills install ID    Install a skill (ID can be a hub identifier OR a direct https://…/SKILL.md URL; pass --name to override when frontmatter has no name)
hermes skills inspect ID    Preview without installing
hermes skills config        Enable/disable skills per platform
hermes skills check         Check for updates
hermes skills update        Update outdated skills
hermes skills uninstall N   Remove a hub skill
hermes skills publish PATH  Publish to registry
hermes skills browse        Browse all available skills
hermes skills tap add REPO  Add a GitHub repo as skill source
```

### MCP Servers

```
hermes mcp serve            Run Hermes as an MCP server
hermes mcp add NAME         Add an MCP server (--url or --command)
hermes mcp remove NAME      Remove an MCP server
hermes mcp list             List configured servers
hermes mcp test NAME        Test connection
hermes mcp configure NAME   Toggle tool selection
```

### Gateway (Messaging Platforms)

```
hermes gateway run          Start gateway foreground
hermes gateway install      Install as background service
hermes gateway start/stop   Control the service
hermes gateway restart      Restart the service
hermes gateway status       Check status
hermes gateway setup        Configure platforms
```

Supported platforms: Telegram, Discord, Slack, WhatsApp, Signal, Email, SMS, Matrix, Mattermost, Home Assistant, DingTalk, Feishu, WeCom, BlueBubbles (iMessage), Weixin (WeChat), API Server, Webhooks. Open WebUI connects via the API Server adapter.

Platform docs: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/

### Sessions

```
hermes sessions list        List recent sessions
hermes sessions browse      Interactive picker
hermes sessions export OUT  Export to JSONL
hermes sessions rename ID T Rename a session
hermes sessions delete ID   Delete a session
hermes sessions prune       Clean up old sessions (--older-than N days)
hermes sessions stats       Session store statistics
```

### Cron Jobs

```
hermes cron list            List jobs (--all for disabled)
hermes cron create SCHED    Create: '30m', 'every 2h', '0 9 * * *'
hermes cron edit ID         Edit schedule, prompt, delivery
hermes cron pause/resume ID Control job state
hermes cron run ID          Trigger on next tick
hermes cron remove ID       Delete a job
hermes cron status          Scheduler status
```

### Webhooks

```
hermes webhook subscribe N  Create route at /webhooks/<name>
hermes webhook list         List subscriptions
hermes webhook remove NAME  Remove a subscription
hermes webhook test NAME    Send a test POST
```

### Profiles

```
hermes profile list         List all profiles
hermes profile create NAME  Create (--clone, --clone-all, --clone-from)
hermes profile use NAME     Set sticky default
hermes profile delete NAME  Delete a profile
hermes profile show NAME    Show details
hermes profile alias NAME   Manage wrapper scripts
hermes profile rename A B   Rename a profile
hermes profile export NAME  Export to tar.gz
hermes profile import FILE  Import from archive
```

### Credential Pools

```
hermes auth add             Interactive credential wizard
hermes auth list [PROVIDER] List pooled credentials
hermes auth remove P INDEX  Remove by provider + index
hermes auth reset PROVIDER  Clear exhaustion status
```

### Other

```
hermes insights [--days N]  Usage analytics
hermes update               Update to latest version
hermes pairing list/approve/revoke  DM authorization
hermes plugins list/install/remove  Plugin management
hermes honcho setup/status  Honcho memory integration (requires honcho plugin)
hermes memory setup/status/off  Memory provider config
hermes completion bash|zsh  Shell completions
hermes acp                  ACP server (IDE integration)
hermes claw migrate         Migrate from OpenClaw
hermes uninstall            Uninstall Hermes
```

---

## Slash Commands (In-Session)

Type these during an interactive chat session. New commands land fairly often; if something below looks stale, run `/help` in-session for the authoritative list or see the live slash commands reference.

### Session Control
```
/new (/reset)        Fresh session
/clear               Clear screen + new session (CLI)
/retry               Resend last message
/undo                Remove last exchange
/title [name]        Name the session
/compress            Manually compress context
/stop                Kill background processes
/rollback [N]        Restore filesystem checkpoint
/snapshot [sub]      Create or restore state snapshots of Hermes config/state (CLI)
/background <prompt> Run prompt in background
/queue <prompt>      Queue for next turn
/steer <prompt>      Inject a message after the next tool call without interrupting
/agents (/tasks)     Show active agents and running tasks
/resume [name]       Resume a named session
/goal [text|sub]     Set a standing goal Hermes works on across turns until achieved
                     (subcommands: status, pause, resume, clear)
/redraw              Force a full UI repaint (CLI)
```

### Configuration
```
/config              Show config (CLI)
/model [name]        Show or change model
/personality [name]  Set personality
/reasoning [level]   Set reasoning (none|minimal|low|medium|high|xhigh|show|hide)
/verbose             Cycle: off -> new -> all -> verbose
/voice [on|off|tts]  Voice mode
/yolo                Toggle approval bypass
/busy [sub]          Control what Enter does while Hermes is working (CLI)
                     (subcommands: queue, steer, interrupt, status)
/indicator [style]   Pick the TUI busy-indicator style (CLI)
                     (styles: kaomoji, emoji, unicode, ascii)
/footer [on|off]     Toggle gateway runtime-metadata footer on final replies
/skin [name]         Change theme (CLI)
/statusbar           Toggle status bar (CLI)
```

### Tools & Skills
```
/tools               Manage tools (CLI)
/toolsets            List toolsets (CLI)
/skills              Search/install skills (CLI)
/skill <name>        Load a skill into session
/reload-skills       Re-scan ~/.hermes/skills/ for added/removed skills
/reload              Reload .env variables into the running session (CLI)
/reload-mcp          Reload MCP servers
/cron                Manage cron jobs (CLI)
/curator [sub]       Background skill maintenance (status, run, pin, archive, …)
/kanban [sub]        Multi-profile collaboration board (tasks, links, comments)
/plugins             List plugins (CLI)
```

### Gateway
```
/approve             Approve a pending command (gateway)
/deny                Deny a pending command (gateway)
/restart             Restart gateway (gateway)
/sethome             Set current chat as home channel (gateway)
/update              Update Hermes to latest (gateway)
/topic [sub]         Enable or inspect Telegram DM topic sessions (gateway)
/platforms (/gateway) Show platform connection status (gateway)
```

### Utility
```
/branch (/fork)      Branch the current session
/fast                Toggle priority/fast processing
/browser             Open CDP browser connection
/history             Show conversation history (CLI)
/save                Save conversation to file (CLI)
/copy [N]            Copy the last assistant response to clipboard (CLI)
/paste               Attach clipboard image (CLI)
/image               Attach local image file (CLI)
```

### Info
```
/help                Show commands
/commands [page]     Browse all commands (gateway)
/usage               Token usage
/insights [days]     Usage analytics
/gquota              Show Google Gemini Code Assist quota usage (CLI)
/status              Session info (gateway)
/profile             Active profile info
/debug               Upload debug report (system info + logs) and get shareable links
```

### Exit
```
/quit (/exit, /q)    Exit CLI
```

---

## Key Paths & Config

```
~/.hermes/config.yaml       Main configuration
~/.hermes/.env              API keys and secrets
$HERMES_HOME/skills/        Installed skills
~/.hermes/sessions/         Session transcripts
~/.hermes/logs/             Gateway and error logs
~/.hermes/auth.json         OAuth tokens and credential pools
~/.hermes/hermes-agent/     Source code (if git-installed)
```

Profiles use `~/.hermes/profiles/<name>/` with the same layout.

### Hermes WebUI (Browser Interface)

Hermes WebUI is a separate project providing a three-panel browser interface (sessions sidebar, chat center, file browser right) with full CLI parity. It connects to your existing Hermes config — no extra model setup needed.

**Install and start:**
```bash
git clone https://github.com/nesquena/hermes-webui.git
cd hermes-webui
python3 bootstrap.py --skip-agent-install --no-browser
# Opens on http://localhost:8787
```

**Daemon mode (for always-on):**
```bash
cd hermes-webui
./ctl.sh start      # background daemon, PID at ~/.hermes/webui.pid
./ctl.sh status      # PID, uptime, bound host/port, /health
./ctl.sh logs        # tail ~/.hermes/webui.log
./ctl.sh restart
./ctl.sh stop
```

**Docker quickstart** (single container):
```bash
git clone https://github.com/nesquena/hermes-webui
cd hermes-webui
# Edit .env with your HERMES_HOME path and API keys
docker compose up -d   # port 8787
```

**Environment variables:**
- `HERMES_WEBUI_HOST` — bind address (default `127.0.0.1`; use `0.0.0.0` for LAN access)
- `HERMES_WEBUI_PORT` — port override (default `8787`)
- `HERMES_HOME` — path to Hermes config directory (default `~/.hermes`)

The WebUI auto-detects your Hermes `config.yaml` and `.env`. If the default model's provider is unreachable (e.g., Ollama stopped), the UI shows red connection errors — fix this in `config.yaml` before starting.

**Troubleshooting WebUI:**
- Red errors on load -> default model provider is unreachable. Fix `model.default` and `model.provider` in `~/.hermes/config.yaml`, then `/new` or relaunch.
- Auxiliary client keeps using dead provider -> the `auxiliary_client.py` auto-detects from the current session's main model/provider. If the main provider was previously `ollama` and you removed it, **old sessions still cache the stale model as runtime override**. Fix: (1) set explicit `auxiliary.vision`, `auxiliary.title_generation`, and `auxiliary.session_search` in config.yaml with the working provider, and (2) start a **new session** (`/new`) — stale runtime overrides don't persist across `/new`.
- Blank page -> check if oMLX/local server is running: `curl -s http://127.0.0.1:8087/v1/models`
- Port conflict -> `lsof -i :8787` and `kill` or change port with `HERMES_WEBUI_PORT`
- Bootstrap fails -> check `~/.hermes/webui/bootstrap-<port>.log`
- Stale models in dropdown -> delete `~/.hermes/webui/models_cache.json` and refresh. The cache rebuilds from `config.yaml` on next request.
- Workspace not found -> update all **four** files in `~/.hermes/webui/`: (1) `settings.json` -> set `default_workspace`, (2) `projects.json` -> set `last_opened`, (3) `workspaces.json` -> update `last_opened` timestamp, (4) `last_workspace.txt` -> write the full project path as the sole line.
- WebUI workspace shows "inactive" in sidebar -> the `last_workspace.txt` file points to the wrong path. Fix: write the correct project path to `~/.hermes/webui/last_workspace.txt`, then restart the WebUI server or start a **new session**.
- Models cache has duplicate provider prefixes -> delete `~/.hermes/webui/models_cache.json`. Rebuild happens automatically on next `/api/models` request.

### Local Model Setup (Ollama / vLLM / llama.cpp / LM Studio)

`hermes model` works for cloud providers auto-detected from env vars, but local models need a provider override in config.yaml.

**Minimal change — 3 fields in `model:`:**

```yaml
model:
  default: "ollama-local/qwen2.5-coder:7b"
  provider: "ollama-local"
```

**Then add a `providers:` block** (at top level, sibling to `model:`):

```yaml
providers:
  ollama-local:
    base_url: "http://localhost:11434/v1"
    api_key: "ollama"
    request_timeout_seconds: 300
    stale_timeout_seconds: 900
    models:
      gemma3:12b:
        context_length: 131072
      qwen2.5-coder:7b:
        context_length: 65536
      qwen2.5:14b:
        context_length: 65536
```

**CRITICAL: Local models MUST support OpenAI tool/function calling.** Hermes is a tool-calling agent. If a model returns "does not support tools" from Ollama, Hermes errors with `Non-retryable client error: Error code: 400`.

**Verified tool-calling support (Ollama 0.23.2+):**

| Model | Tools | Size | Context | Notes |
|-------|-------|------|---------|-------|
| `gemma4:26b` | Yes | 17GB | 256K | Vision + thinking + tools; best local primary on >=24GB |
| `qwen3:30b` | Yes | 18GB | 256K | qwen3moe arch; thinking + tools; can't co-exist with gemma4 on 24GB |
| `qwen2.5:14b` | Yes | 9GB | 65K (YaRN) | Solid fallback primary for lower-RAM machines |
| `qwen3:14b` | Yes | 9.3GB | **40K** | Tools work but context < 64K — can't initialize Hermes |
| `qwen2.5:3b` | Yes | 1.7GB | **32K** | Tools work but context < 64K — can't initialize Hermes |
| `gemma3:12b` | No | 8.1GB | — | Dead for Hermes — tools NOT supported |
| `qwen2.5-coder:7b` | No | 4.7GB | — | Dead for Hermes — code fine-tune strips tool calling |

Important:
- Model name format: `<provider-label>/<model-name>` — the label in `model.default` must match a key in `providers:`.
- **For Ollama specifically, use the provider name `ollama`** (not `ollama-local` or another custom name). Hermes recognizes `ollama` as the built-in Ollama provider and strips the `ollama/` prefix before sending the model name to the Ollama API.
- `api_key: "ollama"` is required by the OpenAI-compatible client wrapper but ignored by Ollama.
- **Context length tips by model family:**
  - **Gemma 3**: 128K native (131072). Use the full value.
  - **Qwen 2.5**: Native is 32768, but Qwen 2.5 uses YaRN RoPE (freq_base 1,000,000) which extrapolates cleanly to 65536.
  - **Compression threshold vs compression model context**: The `compression.threshold` is multiplied by the primary model's `context_length`. Formula: `primary_model_context_length * threshold <= compression_model_context_length`. Example: Gemma 4 26B (256K) with threshold 0.30 -> compression at 76.8K tokens, but deepseek-chat only has 65K context -> overflow. Fix: lower threshold to 0.25.
  - **Adaptive per-model thresholds**: As of 2026-05-15, threshold policy is the single source of truth in `agent/context_compressor.py`. Priority chain: per-model override > adaptive tier > config override > fallback.
- **CRITICAL: global `base_url` overrides per-provider `base_url`.** If you have a top-level `base_url: "https://openrouter.ai/api/v1"` under `model:`, it silently redirects ALL providers to OpenRouter. Either comment out the global `base_url` or ensure each local provider explicitly sets its own in the `providers:` block.
- Restart required: config is read at session boot. `/reset` in CLI or relaunch `hermes`.

**One-shot override** (no config change, single invocation):
```bash
hermes -m 'qwen2.5:14b-4bit' --provider omlx chat -q 'your prompt'
```

### Removing a Provider Entirely

When switching away from a local provider (e.g., replacing Ollama with oMLX), you must update **four** places in `config.yaml`:

1. **`model.default`**: Change from dead provider to new provider
2. **`model.provider`**: Change the default provider key
3. **`providers:` block**: Remove the dead provider section entirely
4. **`model_aliases:`**: Remove or update any aliases referencing the dead provider

Then **clear the WebUI models cache**:
```bash
rm -f ~/.hermes/webui/models_cache.json
```

### Provider-Alias Consistency Pitfall

When a model alias uses `provider: <name>`, that name must EITHER be a key in the `providers:` block OR a built-in provider that Hermes auto-detects from env vars. If you set `provider: zai` but only have `ZAI_API_KEY` commented out, the alias fails at runtime. Check `.env` before choosing the provider name.

### OpenCode Go (`opencode-go`) Provider Pattern

`opencode-go` is a **built-in provider** that auto-detects from `OPENCODE_GO_API_KEY` in `.env`. It does NOT need a `providers:` block with a `models:` dict. Models are referenced through `model_aliases` entries only:

```yaml
model_aliases:
  mimo-v2-5-pro:
    model: mimo-v2.5-pro
    provider: opencode-go
  kimi-k2-5:
    model: kimi-k2.5
    provider: opencode-go
  glm:
    model: glm-5.1
    provider: opencode-go
```

**Key distinction:** `omlx` and `deepseek` require `providers:` blocks with `models:` dicts. `opencode-go`, `kimi-coding`, `zai`, and other built-in providers do NOT — they're fully configured by their env var + `model_aliases` entries.

### OpenCode Zen (`opencode-zen`) Provider Pattern

`opencode-zen` is a **separate provider** from `opencode-go` with its own API key and endpoint:

| | OpenCode Go | OpenCode Zen |
|---|---|---|
| Tier | Paid ($10/mo subscription) | Pay-as-you-go / Free models |
| Env var | `OPENCODE_GO_API_KEY` | `OPENCODE_ZEN_API_KEY` |
| Endpoint | `opencode.ai/zen/go/v1` | `opencode.ai/zen/v1` |
| Models | kimi-k2.5, glm-5.1, mimo-v2.5-pro | qwen3.6-plus-free, deepseek-v4-flash-free, etc. |

**CRITICAL: Keys are NOT interchangeable.**

When adding Zen to config.yaml:
```yaml
providers:
  opencode-zen:
    base_url: https://opencode.ai/zen/v1
    api_key_env: OPENCODE_ZEN_API_KEY
    request_timeout_seconds: 300
    models:
      qwen3.6-plus-free:
        context_length: 131072
      deepseek-v4-flash-free:
        context_length: 131072
```

**Pitfall: `.env` file is write-protected.** The `patch` and `write_file` tools cannot modify `~/.hermes/.env`. Use Python `open()` via `execute_code` to write to it.

### Config Sections

Edit with `hermes config edit` or `hermes config set section.key value`.

| Section | Key options |
|---------|-------------|
| `model` | `default`, `provider`, `base_url`, `api_key`, `context_length` |
| `agent` | `max_turns` (90), `tool_use_enforcement` |
| `terminal` | `backend` (local/docker/ssh/modal), `cwd`, `timeout` (180) |
| `compression` | `enabled`, `threshold` (0.50), `target_ratio` (0.20) |
| `display` | `skin`, `tool_progress`, `show_reasoning`, `show_cost` |
| `stt` | `enabled`, `provider` (local/groq/openai/mistral) |
| `tts` | `provider` (edge/elevenlabs/openai/minimax/mistral/neutts) |
| `memory` | `memory_enabled`, `user_profile_enabled`, `provider` |
| `security` | `tirith_enabled`, `website_blocklist` |
| `delegation` | `model`, `provider`, `base_url`, `api_key`, `max_iterations` (50), `reasoning_effort` |
| `checkpoints` | `enabled`, `max_snapshots` (50) |

**Memory char limits** are configurable via `config.yaml` under `memory:`:
- `memory_char_limit` — per-profile limit for agent notes (default: 2200, increased to 4400 on this machine for 32K+ context models)
- `user_char_limit` — per-profile limit for user profile notes (default: 1375)

Full config reference: https://hermes-agent.nousresearch.com/docs/user-guide/configuration

### Providers

20+ providers supported. Set via `hermes model` or `hermes setup`.

| Provider | Auth | Key env var |
|----------|------|-------------|
| OpenRouter | API key | `OPENROUTER_API_KEY` |
| Anthropic | API key | `ANTHROPIC_API_KEY` |
| Nous Portal | OAuth | `hermes auth` |
| OpenAI Codex | OAuth | `hermes auth` |
| GitHub Copilot | Token | `COPILOT_GITHUB_TOKEN` |
| Google Gemini | API key | `GOOGLE_API_KEY` or `GEMINI_API_KEY` |
| DeepSeek | API key | `DEEPSEEK_API_KEY` |
| xAI / Grok | API key | `XAI_API_KEY` |
| Hugging Face | Token | `HF_TOKEN` |
| Z.AI / GLM | API key | `GLM_API_KEY` |
| MiniMax | API key | `MINIMAX_API_KEY` |
| MiniMax CN | API key | `MINIMAX_CN_API_KEY` |
| Kimi / Moonshot | API key | `KIMI_API_KEY` |
| Alibaba / DashScope | API key | `DASHSCOPE_API_KEY` |
| Xiaomi MiMo | API key | `XIAOMI_API_KEY` |
| Kilo Code | API key | `KILOCODE_API_KEY` |
| AI Gateway (Vercel) | API key | `AI_GATEWAY_API_KEY` |
| OpenCode Zen | API key | `OPENCODE_ZEN_API_KEY` |
| OpenCode Go | API key | `OPENCODE_GO_API_KEY` |
| Qwen OAuth | OAuth | `hermes login --provider qwen-oauth` |
| Custom endpoint | Config | `model.base_url` + `model.api_key` in config.yaml |
| GitHub Copilot ACP | External | `COPILOT_CLI_PATH` or Copilot CLI |

Full provider docs: https://hermes-agent.nousresearch.com/docs/integrations/providers

### Toolsets

Enable/disable via `hermes tools` (interactive) or `hermes tools enable/disable NAME`.

| Toolset | What it provides |
|---------|-----------------|
| `web` | Web search and content extraction |
| `search` | Web search only (subset of `web`) |
| `browser` | Browser automation (Browserbase, Camofox, or local Chromium) |
| `terminal` | Shell commands and process management |
| `file` | File read/write/search/patch |
| `code_execution` | Sandboxed Python execution |
| `vision` | Image analysis |
| `image_gen` | AI image generation |
| `video` | Video analysis and generation |
| `tts` | Text-to-speech |
| `skills` | Skill browsing and management |
| `memory` | Persistent cross-session memory |
| `session_search` | Search past conversations |
| `delegation` | Subagent task delegation |
| `cronjob` | Scheduled task management |
| `clarify` | Ask user clarifying questions |
| `messaging` | Cross-platform message sending |
| `todo` | In-session task planning and tracking |
| `kanban` | Multi-agent work-queue tools (gated to workers) |
| `debugging` | Extra introspection/debug tools (off by default) |
| `safe` | Minimal, low-risk toolset for locked-down sessions |
| `spotify` | Spotify playback and playlist control |
| `homeassistant` | Smart home control (off by default) |
| `discord` | Discord integration tools |
| `discord_admin` | Discord admin/moderation tools |
| `feishu_doc` | Feishu (Lark) document tools |
| `feishu_drive` | Feishu (Lark) drive tools |
| `yuanbao` | Yuanbao integration tools |
| `rl` | Reinforcement learning tools (off by default) |
| `moa` | Mixture of Agents (off by default) |

Tool changes take effect on `/reset` (new session).

---

## Security & Privacy Toggles

### Secret redaction in tool output

Secret redaction is **off by default**.

```bash
hermes config set security.redact_secrets true       # enable globally
```

**Restart required.** `security.redact_secrets` is snapshotted at import time.

### PII redaction in gateway messages

```bash
hermes config set privacy.redact_pii true    # enable
hermes config set privacy.redact_pii false   # disable (default)
```

### Command approval prompts

Modes:
- `manual` — always prompt (default)
- `smart` — use an auxiliary LLM to auto-approve low-risk commands
- `off` — skip all approval prompts (equivalent to `--yolo`)

```bash
hermes config set approvals.mode smart
hermes config set approvals.mode off
```

Per-invocation bypass: `hermes --yolo ...` or `export HERMES_YOLO_MODE=1`

---

## Voice & Transcription

### STT (Voice -> Text)

Provider priority (auto-detected):
1. **Local faster-whisper** — free: `pip install faster-whisper`
2. **Groq Whisper** — free tier: set `GROQ_API_KEY`
3. **OpenAI Whisper** — paid: set `VOICE_TOOLS_OPENAI_KEY`
4. **Mistral Voxtral** — set `MISTRAL_API_KEY`

Config:
```yaml
stt:
  enabled: true
  provider: local
  local:
    model: base
```

### TTS (Text -> Voice)

| Provider | Env var | Free? |
|----------|---------|-------|
| Edge TTS | None | Yes (default) |
| ElevenLabs | `ELEVENLABS_API_KEY` | Free tier |
| OpenAI | `VOICE_TOOLS_OPENAI_KEY` | Paid |
| MiniMax | `MINIMAX_API_KEY` | Paid |
| Mistral (Voxtral) | `MISTRAL_API_KEY` | Paid |
| NeuTTS (local) | None | Free |

Voice commands: `/voice on`, `/voice tts`, `/voice off`.

---

## Spawning Additional Hermes Instances

### When to Use This Vs delegate_task

| | `delegate_task` | Spawning `hermes` process |
|-|-----------------|--------------------------|
| Isolation | Separate conversation, shared process | Fully independent process |
| Duration | Minutes (bounded by parent loop) | Hours/days |
| Tool access | Subset of parent's tools | Full tool access |
| Interactive | No | Yes (PTY mode) |
| Use case | Quick parallel subtasks | Long autonomous missions |

### One-Shot Mode

```bash
terminal(command="hermes chat -q 'Research GRPO papers and write summary to ~/research/grpo.md'", timeout=300)
```

### Interactive PTY Mode (via tmux)

```bash
# Start
terminal(command="tmux new-session -d -s agent1 -x 120 -y 40 'hermes'", timeout=10)

# Wait for startup, then send a message
terminal(command="sleep 8 && tmux send-keys -t agent1 'Build a FastAPI auth service' Enter", timeout=15)

# Read output
terminal(command="sleep 20 && tmux capture-pane -t agent1 -p", timeout=5)

# Send follow-up
terminal(command="tmux send-keys -t agent1 'Add rate limiting middleware' Enter", timeout=5)

# Exit
terminal(command="tmux send-keys -t agent1 '/exit' Enter && sleep 2 && tmux kill-session -t agent1", timeout=10)
```

### Multi-Agent Coordination

```bash
# Agent A: backend
terminal(command="tmux new-session -d -s backend -x 120 -y 40 'hermes -w'", timeout=10)
terminal(command="sleep 8 && tmux send-keys -t backend 'Build REST API for user management' Enter", timeout=15)

# Agent B: frontend
terminal(command="tmux new-session -d -s frontend -x 120 -y 40 'hermes -w'", timeout=10)
terminal(command="sleep 8 && tmux send-keys -t frontend 'Build React dashboard for user management' Enter", timeout=15)
```

---

## Durable & Background Systems

### Delegation (`delegate_task`)

Synchronous subagent spawn — the parent waits for the child's summary before continuing. Isolated context + terminal session.
- **Single:** `delegate_task(goal, context, toolsets)`
- **Batch:** `delegate_task(tasks=[{goal, ...}, ...])` runs children in parallel, capped by `delegation.max_concurrent_children` (default 3).
- **Roles:** `leaf` (default; cannot re-delegate) vs `orchestrator` (can spawn its own workers, bounded by `delegation.max_spawn_depth`).
- **Not durable.** If the parent is interrupted, the child is cancelled. For work that must outlive the turn, use `cronjob` or `terminal(background=True, notify_on_complete=True)`.

### Cron (scheduled jobs)

Durable scheduler. Drive it via the `cronjob` tool, the `hermes cron` CLI, or the `/cron` slash command.
- **Schedules:** duration (`"30m"`, `"2h"`), "every" phrase (`"every monday 9am"`), 5-field cron (`"0 9 * * *"`), or ISO timestamp.
- **Per-job knobs:** `skills`, `model`/`provider` override, `script` (pre-run data collection; `no_agent=True` makes the script the whole job), `context_from` (chain job A's output into job B), `workdir` (run in a specific dir with its `AGENTS.md` / `CLAUDE.md` loaded), multi-platform delivery.
- **Invariants:** 3-minute hard interrupt per run, `.tick.lock` file prevents duplicate ticks, cron sessions pass `skip_memory=True` by default.

**Cron job script field pitfall:** The `script` field in `cron/jobs.json` takes only the script filename (e.g., `"git-audit.py"`), NOT the filename plus arguments. Arguments appended to the script path cause "Script not found" errors. Pass arguments via the `prompt` field or use a wrapper script.

### Curator (skill lifecycle)

Background maintenance for agent-created skills. Tracks usage, marks idle skills stale, archives stale ones, keeps a pre-run tar.gz backup.
- **CLI:** `hermes curator <verb>` — `status`, `run`, `pause`, `resume`, `pin`, `unpin`, `archive`, `restore`, `prune`, `backup`, `rollback`.
- **Scope:** only touches skills with `created_by: "agent"` provenance. Bundled + hub-installed skills are off-limits. **Never deletes** — max destructive action is archive. Pinned skills are exempt.

### Kanban (multi-agent work queue)

Durable SQLite board for multi-profile / multi-worker collaboration.
- **CLI verbs:** `init`, `create`, `list`, `show`, `assign`, `link`, `unlink`, `comment`, `complete`, `block`, `unblock`, `archive`, `tail`, `watch`, `stats`, `runs`, `log`, `dispatch`, `daemon`, `gc`.
- **Worker toolset:** `kanban_show`, `kanban_complete`, `kanban_block`, `kanban_heartbeat`, `kanban_comment`, `kanban_create`, `kanban_link`.
- **Dispatcher** runs inside the gateway by default. Auto-blocks a task after ~5 consecutive spawn failures.

---

## Windows-Specific Quirks

Hermes runs natively on Windows. Key differences:

### Input / Keybindings
**Alt+Enter doesn't insert a newline.** Windows Terminal intercepts Alt+Enter to toggle fullscreen. Use **Ctrl+Enter** instead. Windows Terminal delivers Ctrl+Enter as LF (`c-j`), and the CLI binds `c-j` to newline insertion on `win32` only.

### Config / Files
**HTTP 400 "No models provided" on first run.** `config.yaml` was saved with a UTF-8 BOM. Re-save as UTF-8 without BOM. `hermes config edit` writes without BOM.

### `execute_code` / Sandbox
**WinError 10106** from the sandbox child process — it can't create an `AF_INET` socket. Root cause: Hermes's env scrubber drops `SYSTEMROOT` / `WINDIR` / `COMSPEC` from the child env. Python's `socket` module needs `SYSTEMROOT` to locate `mswsock.dll`. Fixed via the `_WINDOWS_ESSENTIAL_ENV_VARS` allowlist in `tools/code_execution_tool.py`.

### Testing / Contributing
**`scripts/run_tests.sh` doesn't work as-is on Windows** — it looks for POSIX venv layouts. Workaround: install `pytest + pytest-xdist + pyyaml` into a system Python 3.11 user site, then invoke pytest directly with `PYTHONPATH` set and `-n 0`.

**POSIX-only tests need skip guards.** Use existing skip-pattern style (`sys.platform == "win32"` or `sys.platform.startswith("win")`).

**Monkeypatching `sys.platform` is not enough** when the code under test also calls `platform.system()` / `platform.release()` / `platform.mac_ver()`. Patch all three together.

### Path / Filesystem
**Line endings.** Git may warn `LF will be replaced by CRLF`. Cosmetic — the repo's `.gitattributes` normalizes. Don't let editors auto-convert committed POSIX-newline files to CRLF.

**Forward slashes work almost everywhere.** `C:/Users/...` is accepted by every Hermes tool and most Windows APIs. Prefer forward slashes in code and logs.

---

## Troubleshooting

### Voice not working
1. Check `stt.enabled: true` in config.yaml
2. Verify provider: `pip install faster-whisper` or set API key
3. In gateway: `/restart`. In CLI: exit and relaunch.

### Tool not available
1. `hermes tools` — check if toolset is enabled
2. Some tools need env vars (check `.env`)
3. `/reset` after enabling tools

### Removing a Provider Entirely
When migrating away from a provider, update **four places** in `config.yaml`:
1. `model.default:` — change to the new provider/model
2. `model.provider:` — change to the new provider name
3. Remove the old provider block under `providers:`
4. Clean up `model_aliases` — remove or redirect aliases

### Model/provider issues
1. `hermes doctor` — check config and dependencies
2. `hermes login` — re-authenticate OAuth providers
3. Check `.env` has the right API key
4. **Copilot 403**: `gh auth login` tokens do NOT work for Copilot API. Use the Copilot-specific OAuth device code flow via `hermes model` -> GitHub Copilot.
5. **Ollama/local model connection failures**: check for a conflicting global `base_url` in config.yaml.
6. **Stale local provider in config**: Fix all four places (model.default, model.provider, providers block, model_aliases). See "Removing a Provider Entirely" above.
7. **Ollama model "does not support tools" (Error 400)**: the model lacks tool/function calling. Switch to a model that supports it (e.g., `qwen2.5:14b`).
8. **Model switch mid-session doesn't work**: Hermes binds to a provider at session boot. `/model` changes the label but won't rewire the transport. Use `/new` or restart the CLI.
9. **Provider-alias mismatch**: A `model_aliases` entry using `provider: zai` fails if `ZAI_API_KEY` isn't set, even if the model is reachable via `opencode-go`. Check `.env` for which provider credentials actually exist.
10. **WebUI models dropdown shows stale/removed providers**: Delete `~/.hermes/webui/models_cache.json` and refresh.

### CLI interaction bugs (silent cancellation, broken slash commands)
If `/new`, `/reset`, or confirmation prompts silently cancel, the cause may be `run_in_terminal()` returning an unawaited coroutine in prompt_toolkit 3.x. Fix: replace `run_in_terminal` wrapper with direct `input()` call.

### Changes not taking effect
- **Tools/skills:** `/reset` starts a new session
- **Config changes:** In gateway: `/restart`. In CLI: exit and relaunch.
- **Code changes:** Restart the CLI or gateway process

### Skills not showing
1. `hermes skills list` — verify installed
2. `hermes skills config` — check platform enablement
3. Load explicitly: `/skill name` or `hermes -s name`

### Gateway issues
Check logs first:
```bash
grep -i "failed to send\|error" ~/.hermes/logs/gateway.log | tail -20
```

Common gateway problems:
- **Gateway dies on SSH logout**: Enable linger: `sudo loginctl enable-linger $USER`
- **Gateway dies on WSL2 close**: WSL2 requires `systemd=true` in `/etc/wsl.conf`.
- **Gateway crash loop**: Reset the failed state: `systemctl --user reset-failed hermes-gateway`

### Platform-specific issues
- **Discord bot silent**: Must enable **Message Content Intent** in Bot -> Privileged Gateway Intents.
- **Slack bot only works in DMs**: Must subscribe to `message.channels` event.

### Auxiliary models not working
If `auxiliary` tasks fail silently, either set `OPENROUTER_API_KEY` or `GOOGLE_API_KEY`, or explicitly configure each auxiliary task's provider:
```bash
hermes config set auxiliary.vision.provider <your_provider>
hermes config set auxiliary.vision.model <model_name>
```

**Critical pitfall after changing providers:** The auxiliary client auto-detects the main model/provider from the *current session's runtime state*. Old sessions still cache the stale provider. Fix: set **explicit overrides** for all auxiliary tasks in config.yaml, then **start a new session** (`/new`).

---

## Where to Find Things

| Looking for... | Location |
|----------------|----------|
| Config options | `hermes config edit` or Configuration docs |
| Available tools | `hermes tools list` or Tools reference |
| Slash commands | `/help` in session or Slash commands reference |
| Skills catalog | `hermes skills browse` or Skills catalog |
| Provider setup | `hermes model` or Providers guide |
| Platform setup | `hermes gateway setup` or Messaging docs |
| MCP servers | `hermes mcp list` or MCP guide |
| Profiles | `hermes profile list` or Profiles docs |
| Cron jobs | `hermes cron list` or Cron docs |
| Memory | `hermes memory status` or Memory docs |
| Env variables | `hermes config env-path` or Env vars reference |
| Gateway logs | `~/.hermes/logs/gateway.log` |
| Session files | `~/.hermes/sessions/` or `hermes sessions browse` |
| Source code | `~/.hermes/hermes-agent/` |

---

## Contributor Quick Reference

### Project Layout

```
hermes-agent/
├── run_agent.py          # AIAgent — core conversation loop
├── model_tools.py        # Tool discovery and dispatch
├── toolsets.py           # Toolset definitions
├── cli.py                # Interactive CLI (HermesCLI)
├── hermes_state.py       # SQLite session store
├── agent/                # Prompt builder, context compression, memory, model routing, credential pooling, skill dispatch
├── hermes_cli/           # CLI subcommands, config, setup, commands
│   ├── commands.py       # Slash command registry (CommandDef)
│   ├── config.py         # DEFAULT_CONFIG, env var definitions
│   └── main.py           # CLI entry point and argparse
├── tools/                # One file per tool
│   └── registry.py       # Central tool registry
├── gateway/              # Messaging gateway
│   └── platforms/        # Platform adapters (telegram, discord, etc.)
├── cron/                 # Job scheduler
├── tests/                # ~3000 pytest tests
└── website/              # Docusaurus docs site
```

### Adding a Tool (3 files)

**1. Create `tools/your_tool.py`:**
```python
import json, os
from tools.registry import registry

def check_requirements() -> bool:
    return bool(os.getenv("EXAMPLE_API_KEY"))

def example_tool(param: str, task_id: str = None) -> str:
    return json.dumps({"success": True, "data": "..."})

registry.register(
    name="example_tool",
    toolset="example",
    schema={"name": "example_tool", "description": "...", "parameters": {...}},
    handler=lambda args, **kw: example_tool(
        param=args.get("param", ""), task_id=kw.get("task_id")),
    check_fn=check_requirements,
    requires_env=["EXAMPLE_API_KEY"],
)
```

**2. Add to `toolsets.py`** -> `_HERMES_CORE_TOOLS` list.

Auto-discovery: any `tools/*.py` file with a top-level `registry.register()` call is imported automatically.

All handlers must return JSON strings. Use `get_hermes_home()` for paths, never hardcode `~/.hermes`.

### Adding a Slash Command

1. Add `CommandDef` to `COMMAND_REGISTRY` in `hermes_cli/commands.py`
2. Add handler in `cli.py` -> `process_command()`
3. (Optional) Add gateway handler in `gateway/run.py`

All consumers derive from the central registry automatically.

### Agent Loop (High Level)

```
run_conversation():
  1. Build system prompt
  2. Loop while iterations < max:
     a. Call LLM (OpenAI-format messages + tool schemas)
     b. If tool_calls -> dispatch each via handle_function_call() -> append results -> continue
     c. If text response -> return
  3. Context compression triggers automatically near token limit
```

### Testing

```bash
python -m pytest tests/ -o 'addopts=' -q   # Full suite
python -m pytest tests/tools/ -q            # Specific area
```

- Tests auto-redirect `HERMES_HOME` to temp dirs — never touch real `~/.hermes/`
- Run full suite before pushing any change

**Windows contributors:** see the Windows-Specific Quirks section above for test suite workarounds.

### Extending the system prompt's execution-environment block

Factual guidance about the host OS, user home, cwd, terminal backend, and shell is emitted from `agent/prompt_builder.py::build_environment_hints()`.

- **Local terminal backend** -> emit host info + Windows-specific notes.
- **Remote terminal backend** (docker, singularity, modal, ssh, etc.) -> **suppress** host info entirely and describe only the backend.
- **Key fact:** when `TERMINAL_ENV != "local"`, *every* file tool runs inside the backend container, not on the host.

### Commit Conventions

```
type: concise subject line

Optional body.
```

Types: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`

### Key Rules

- **Never break prompt caching** — don't change context, tools, or system prompt mid-conversation
- **Message role alternation** — never two assistant or two user messages in a row
- Use `get_hermes_home()` from `hermes_constants` for all paths (profile-safe)
- Config values go in `config.yaml`, secrets go in `.env`
- New tools need a `check_fn` so they only appear when requirements are met
