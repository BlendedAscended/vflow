# Self contained prompt for Claude Desktop / Claude Code

Copy everything between the two `=====BEGIN PROMPT=====` and `=====END PROMPT=====` lines below. Paste as the first message in a new Claude Code session opened at `~/.claude/`. The prompt assumes no prior context.

---

=====BEGIN PROMPT=====

You are operating in `/Users/sandeep/.claude` as well as on six active project repos. Your job in this session is to transform the global Claude, OpenCode, and OpenClaw configuration so that multi session work stops losing progress, context token cost drops by an order of magnitude, the rule system learns from past incidents instead of waiting for me to teach it, and VerbaFlow becomes legible to any agent at any time through a queryable registry that scales with the company.

Read this entire prompt before taking any action. Then plan, then execute in 7 ordered tiers. Stop and ask me a clarifying question only when a decision is genuinely ambiguous; otherwise proceed using the defaults stated below. End each tier with a one line status line and a `git diff --stat` of files touched in that tier.

## Operator profile

I am Sandeep Ghotra, used name San. Founder, CTO, and acting CEO of VerbaFlow LLC. Until role specific peers are hired, every founder responsibility (orchestration, frontend, product direction, data layer, GTM, design) is owned by me or delegated to a role scoped AI agent. New humans joining within weeks: designer, data engineer, sales and GTM lead, and CEO. Each human role currently maps to an AI agent peer that the human replaces on hire. The plan must scale to that org, not freeze the solo founder model.

Company stack:
- Orchestration: n8n at agent.verbaflowllc.com (company nervous system)
- Generation: DeepSeek V3 for cost sensitive work, Claude for judging and high stakes
- Voice and video: ElevenLabs, Creatomate
- Data: Supabase (operational), BigQuery (analytical)
- Infra: Hetzner plus Docker plus Cloudflare Tunnels
- Pattern: Karpathy Loop (DeepSeek generates, Claude judges, system self improves)

Current product portfolio (seven products in active development):
- Aegis: CDS Hooks denial prevention, FHIR R4 native, healthcare IT
- PriorZap: prior auth automation (scope overlap with Aegis to be reconciled in Tier 7 seed)
- Tensei: Twin Engine Pipeline, resume tailoring via Skeleton Injection and Dream Refiner
- Prometheus v2.0: content pipeline with Discord HITL gate
- Titan: outreach via Hunter and Farmer archetype pipelines
- Guardian: self healing agent, auto patches above 0.85 confidence, logs to Supabase
- Lighthouse: confirm scope with operator at session start
- Samurai: Chrome extension plus Rex front page (delivery vehicle, may roll under a parent product)

Six active code repos (operator works in parallel sessions across all six):
- `~/Desktop/Project26/Agents/samurai`
- `~/Desktop/Project26/Agents/priorzap`
- `~/Desktop/Project26/Agents/mllc` and `/Users/sandeep/Local Sites/mllc-revamp`
- `~/Desktop/Project26/Agents/galaxy`
- `~/Desktop/Project25/verbaflow_projects/vflow1.0`
- `~/Desktop/Project26/Agents/TrustOneServices`

Voice rules at `~/.claude/skills/sandeep-universal-style/SKILL.md` apply to every output. Hard stops: no em dashes, no compound modifier hyphens, no filler adverbs, no preamble, no closing summary, active voice, end every response with a concrete next step.

Global config sources of truth:
- `~/.claude/CLAUDE.md`: global instructions, auto loaded every session
- `~/.config/opencode/AGENTS.md`: OpenCode mirror of the same rules
- `~/.claude/context/{projects,engineering,pipelines,business}.md`: scoped imports
- `~/.claude/memory/MEMORY.md`: session persistent memory index
- `~/.claude/skills/`: skill definitions (sandeep-universal-style, agent-coordination, update-config, simplify, etc.)
- `~/.claude/settings.json`: Claude Code settings (currently zero hooks configured, that is a problem to fix)

## Why this is happening now

Recent history (verified in `/Users/sandeep/Local Sites/mllc-revamp/CHANGES.md`):

- Multiple parallel agent sessions caused intentional fixes to be silently reverted (nav layout, hero gap, page loader). Recovery took an entire session of forensic git work (worktree diffs, reflogs, unreachable blob sweeps).
- The lock protocol exists in writing in `~/.claude/CLAUDE.md`, `~/.config/opencode/AGENTS.md`, the project level `AGENTS.md`, and the `agent-coordination` skill. It is never enforced. `grep -c "hooks" ~/.claude/settings.json` returns 0. Every "MUST" in those files is purely advisory.
- `CHANGES.md` contains 1300+ lines of incident records but no agent ever reads it back to extract rule candidates. The same failure modes repeat.
- I have already accepted decisions on 15 verification questions captured in `/Users/sandeep/Local Sites/mllc-revamp/docs/plan-verification-2026-04-27.md` plus a 6 stream cleanup plan. That is queued for execution but not part of this session unless the changes here unblock it.

## What to deliver in this session

Seven tiers, in order. Each tier is one or more commits in the relevant repo. Snapshot `~/.claude/settings.json`, `~/.claude/CLAUDE.md`, and `~/.config/opencode/AGENTS.md` to `~/.claude-backup-2026-04-27.tgz` before any edit.

### Tier 1 — Graphify keystone (highest leverage, do first)

Goal: cut input token cost roughly 10x by replacing raw file reads with a queryable code knowledge graph.

1. Install: `uv tool install graphifyy && graphify install` (PyPI package is `graphifyy` with double y; CLI is `graphify`).
2. Build graphs for all six active repos with `/graphify <path>` for each. Mark in `~/.claude/context/projects.md` which repos are graphified and the date.
3. Wire Claude integration: `graphify claude install` from each repo. This adds a `PreToolUse` entry to `~/.claude/settings.json` that injects `GRAPH_REPORT.md` before search and read tools.
4. Install per repo git hook: `graphify hook install` so the graph rebuilds on commit and never goes stale.
5. Start watch mode in the active MLLC repo: `cd "/Users/sandeep/Local Sites/mllc-revamp" && graphify . --watch &`.
6. Confirm in `~/.claude/settings.json` that the new PreToolUse block exists. If Tier 2 (lock hook) is already in place, merge into one shell script that runs both checks in sequence rather than two separate hook entries.

Verification: open a new Claude Code session in MLLC; ask any code question; confirm the assistant references graph context (look for "GRAPH_REPORT" in tool calls) and that input token count drops measurably vs the prior session.

### Tier 2 — Settings level lock enforcement plus fix protection guard

Goal: make the `WORKING.lock` protocol a hard guard instead of an advisory rule, and make AGENTS.md rules #8 and #9 (no reverting fixes without approval) actually binding.

The project level `AGENTS.md` at `/Users/sandeep/Local Sites/mllc-revamp/AGENTS.md` was just amended with two meta rules:

> 8. Never revert or undo an existing fix without explicit human approval.
> 9. When in doubt about whether a code pattern is intentional, read CHANGES.md first, then ask.

Those rules are correct but purely advisory. This tier makes them binding via hooks.

1. Create `~/.claude/hooks/check-working-lock.sh`. The script receives the tool input on stdin (Claude Code hook convention), parses out the file path being edited, walks upward until it finds a `.git` directory, then reads `WORKING.lock` at that root. If the lock exists, was written by a different `agent` field, and `expires_at` is in the future, exit 2 with a JSON error `{"decision":"block","message":"<other agent> is editing <files>; wait or run /override"}`. If the lock is stale (expires_at in the past), delete it and exit 0. If no lock exists and the current edit is inside a project repo (`.git` found), exit 2 with `{"decision":"block","message":"Write WORKING.lock first; template at <path>"}` plus the JSON template inline.
2. Create `~/.claude/hooks/clear-own-lock.sh`. On `Stop` event, remove `WORKING.lock` files whose `agent` field matches this session.
3. Create `~/.claude/hooks/inject-graph-context.sh` if `graphify claude install` did not already produce one. It should call `graphify query "<recent-tool-input>"` and inject the result.
4. Create `~/.claude/hooks/fix-protection.sh`. Three protection sources, checked in order. Any one match blocks the edit. The hook is repo agnostic, walking upward from the edited file to find `.git` and operating on whatever repo it finds, so the same script protects MLLC, Samurai, PriorZap, Galaxy, VFlow, and TrustOneServices identically.

   **Source A: `CHANGES.md` (committed history).** Open `CHANGES.md` at the repo root if it exists. Extract identifiers of length 5 or more from `old_string`. Grep each against the file. Any match blocks and quotes the matching entry.

   **Source B: recent git history (last 7 days, plus wip refs).** `git -C $REPO_ROOT log -p --since="7 days ago" -- "$FILE_PATH" refs/wip/*`. If any line being deleted today appears as an *added* line in any commit within the lookback window, block and surface the commit subject and author. Performance: cache the per file `git log -p` output once per session per file in `~/.claude/sessions/$SESSION_ID/.git-cache/<sha1-of-path>` keyed on `git rev-parse HEAD`. Invalidate when HEAD moves. Drops repeat checks from hundreds of milliseconds to single digit milliseconds on hot files like `functions.php`.

   **Source C: session journal (last 4 sessions across all agents).** Each Claude Code session writes successful Edit, Write, and NotebookEdit tool calls to `~/.claude/sessions/<session-id>/journal.jsonl` (one JSON line per edit: timestamp, file, lines_added array, lines_removed array, agent, session_id). The fix protection hook reads the journals of the current session plus the 3 most recent prior sessions across all agents (Claude Code, OpenCode, OpenClaw, Hermes). If any line being deleted today matches a `lines_added` entry from a journal in the lookback window, block. This is the seconds apart cross session protection.

   The hook does not block edits that purely *add* code; it only blocks edits that delete, replace, or modify lines covered by Sources A, B, or C. Override is `/approve-revert <identifier-or-sha>` issued in the same session. The hook caches approvals in `~/.claude/sessions/<session-id>/approvals.txt`.

   Pseudocode:
   ```bash
   # Inputs from Claude Code hook stdin
   PAYLOAD=$(cat)
   FILE_PATH=$(echo "$PAYLOAD" | jq -r .tool_input.file_path)
   OLD=$(echo "$PAYLOAD" | jq -r .tool_input.old_string)
   SESSION_ID=$(echo "$PAYLOAD" | jq -r .session_id)
   REPO_ROOT=$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null) || exit 0
   APPROVALS="$HOME/.claude/sessions/$SESSION_ID/approvals.txt"
   CACHE_DIR="$HOME/.claude/sessions/$SESSION_ID/.git-cache"
   mkdir -p "$CACHE_DIR"

   # Source A: CHANGES.md
   if [ -f "$REPO_ROOT/CHANGES.md" ]; then
     IDENTS=$(echo "$OLD" | grep -oE '[a-zA-Z_][a-zA-Z0-9_]{4,}' | sort -u)
     for ident in $IDENTS; do
       grep -qx "$ident" "$APPROVALS" 2>/dev/null && continue
       if grep -q "$ident" "$REPO_ROOT/CHANGES.md"; then
         MATCH=$(grep -B1 -A2 "$ident" "$REPO_ROOT/CHANGES.md" | head -20)
         echo "{\"decision\":\"block\",\"message\":\"Edit touches '$ident' which CHANGES.md documents as a fix:\\n\\n$MATCH\\n\\nRun /approve-revert $ident first.\"}"
         exit 2
       fi
     done
   fi

   # Source B: recent git history (last 7 days plus wip refs), cached per HEAD
   HEAD_SHA=$(git -C "$REPO_ROOT" rev-parse HEAD)
   CACHE_KEY=$(echo -n "$FILE_PATH:$HEAD_SHA" | shasum | awk '{print $1}')
   CACHE_FILE="$CACHE_DIR/$CACHE_KEY"
   if [ ! -f "$CACHE_FILE" ]; then
     git -C "$REPO_ROOT" log -p --since="7 days ago" -- "$FILE_PATH" refs/wip/* > "$CACHE_FILE" 2>/dev/null
   fi
   while IFS= read -r line; do
     [ -z "$line" ] && continue
     if grep -F "+$line" "$CACHE_FILE" >/dev/null 2>&1; then
       SHA=$(git -C "$REPO_ROOT" log --since="7 days ago" -p -S "$line" --format=%H -1 -- "$FILE_PATH")
       SUBJECT=$(git -C "$REPO_ROOT" log -1 --format=%s "$SHA" 2>/dev/null)
       echo "{\"decision\":\"block\",\"message\":\"Deleting line added in $SHA ($SUBJECT). Run /approve-revert $SHA.\"}"
       exit 2
     fi
   done < <(echo "$OLD")

   # Source C: session journal (current plus 3 prior sessions across all agents)
   JOURNALS=$(ls -t ~/.claude/sessions/*/journal.jsonl 2>/dev/null | head -4)
   for jrnl in $JOURNALS; do
     while IFS= read -r line; do
       [ -z "$line" ] && continue
       if grep -F "\"$line\"" "$jrnl" >/dev/null 2>&1; then
         AGENT=$(jq -r 'select(.lines_added[]? | contains("'"$line"'")) | .agent' "$jrnl" 2>/dev/null | head -1)
         echo "{\"decision\":\"block\",\"message\":\"Line was added by $AGENT in another session minutes ago. Confirm with /approve-revert seconds-ago.\"}"
         exit 2
       fi
     done < <(echo "$OLD")
   done

   exit 0
   ```

   Companion `~/.claude/hooks/journal-edit.sh` runs on `PostToolUse` for `Edit|Write|NotebookEdit` and appends a JSONL entry to `~/.claude/sessions/$SESSION_ID/journal.jsonl`. The hook normalizes payload shape across tools so Source C consumes a single schema:

   ```bash
   PAYLOAD=$(cat)
   TOOL=$(echo "$PAYLOAD" | jq -r .tool_name)
   FILE_PATH=$(echo "$PAYLOAD" | jq -r .tool_input.file_path // .tool_input.notebook_path)
   SESSION_ID=$(echo "$PAYLOAD" | jq -r .session_id)
   AGENT=$(echo "$PAYLOAD" | jq -r .agent // "claude-code")
   TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
   case "$TOOL" in
     Edit)
       ADDED=$(echo "$PAYLOAD" | jq -r '.tool_input.new_string' | jq -R -s 'split("\n")')
       REMOVED=$(echo "$PAYLOAD" | jq -r '.tool_input.old_string' | jq -R -s 'split("\n")')
       ;;
     Write)
       ADDED=$(echo "$PAYLOAD" | jq -r '.tool_input.content' | jq -R -s 'split("\n")')
       REMOVED='[]'
       ;;
     NotebookEdit)
       ADDED=$(echo "$PAYLOAD" | jq -r '.tool_input.new_source // .tool_input.cell_source' | jq -R -s 'split("\n")')
       REMOVED=$(echo "$PAYLOAD" | jq -r '.tool_input.old_source // ""' | jq -R -s 'split("\n")')
       ;;
   esac
   mkdir -p "$HOME/.claude/sessions/$SESSION_ID"
   jq -nc --arg ts "$TS" --arg file "$FILE_PATH" --arg agent "$AGENT" \
          --arg session "$SESSION_ID" --argjson added "$ADDED" --argjson removed "$REMOVED" \
          '{ts: $ts, file: $file, agent: $agent, session_id: $session, lines_added: $added, lines_removed: $removed}' \
     >> "$HOME/.claude/sessions/$SESSION_ID/journal.jsonl"
   ```

   Sidecar WIP checkpoint closes the "tool errored mid way, no journal" sliver. Add `~/.claude/hooks/wip-checkpoint.sh` on the `Stop` event. If the working tree is dirty, create a commit on a non branch ref `refs/wip/<session-id>` with subject `wip(checkpoint): <session-id> <UTC>`. The ref is invisible to `git log` on real branches but visible to `git log refs/wip/* --since="7 days ago"`. Source B already includes `refs/wip/*` in its lookback. Wip refs get pruned after 30 days by a cron entry: `find $REPO_ROOT/.git/refs/wip -type f -mtime +30 -delete`. Zero impact on real commit history; zero workflow change.

   Smart commit guard closes the cross session contamination gap. When two sessions share one working tree and either runs `git add .`, `git add -A`, `git commit -a`, or `git commit -am`, the bulk add captures the *other* session's uncommitted edits and ships them under the wrong commit message. Add `~/.claude/hooks/smart-commit-guard.sh` as a `PreToolUse` hook on `Bash` (matcher: `Bash`):

   ```bash
   PAYLOAD=$(cat)
   CMD=$(echo "$PAYLOAD" | jq -r .tool_input.command)
   SESSION_ID=$(echo "$PAYLOAD" | jq -r .session_id)
   echo "$CMD" | grep -qE 'git\s+add\s+(\.|-A|--all)|git\s+commit\s+-[aA]|git\s+commit\s+-[a-zA-Z]*a' || exit 0
   CWD=$(echo "$PAYLOAD" | jq -r .cwd)
   REPO_ROOT=$(git -C "$CWD" rev-parse --show-toplevel 2>/dev/null) || exit 0
   MY_FILES=$(jq -r 'select(.session_id=="'"$SESSION_ID"'") | .file' \
     "$HOME/.claude/sessions/$SESSION_ID/journal.jsonl" 2>/dev/null | sort -u)
   OTHER_FILES=$(find "$HOME/.claude/sessions" -name journal.jsonl -mmin -30 -not -path "*/$SESSION_ID/*" \
     -exec jq -r '.file' {} \; 2>/dev/null | sort -u)
   DIRTY=$(git -C "$REPO_ROOT" diff --name-only HEAD)
   FOREIGN=$(comm -23 <(echo "$DIRTY") <(echo "$MY_FILES"))
   if [ -n "$FOREIGN" ]; then
     SUGGESTED="git add $(echo "$MY_FILES" | xargs)"
     echo "{\"decision\":\"block\",\"message\":\"Bulk add would commit files this session did not touch:\\n$FOREIGN\\n\\nOther active sessions have edits in:\\n$OTHER_FILES\\n\\nUse instead: $SUGGESTED\"}"
     exit 2
   fi
   exit 0
   ```

   Worktree default for heavy parallel sessions. Update `~/.claude/skills/agent-coordination/SKILL.md` to require `isolation: "worktree"` on any subagent spawn that is expected to write to files larger than 500 lines or touch any file in the project's exclusive lock list (`functions.php`, `app.js`, `package.json`, `.htaccess`). Add a pre session advisor: at the start of every Claude Code session in a project repo, the agent runs `find .claude/worktrees -mmin -60 -name HEAD` (and `.kilo/worktrees/`, `.opencode/worktrees/`). If another session's worktree is fresh, the agent surfaces it before the first edit so the operator decides shared working tree (light edits) or isolated worktree (heavy work).

5. Edit `~/.claude/settings.json` to register lock plus graph plus fix protection. Stop hook order is critical: wip-checkpoint runs before clear-own-lock so the checkpoint commit completes against a stable working tree before the lock releases:

   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Edit|Write|NotebookEdit",
           "hooks": [
             { "type": "command", "command": "~/.claude/hooks/check-working-lock.sh" },
             { "type": "command", "command": "~/.claude/hooks/fix-protection.sh" }
           ]
         },
         {
           "matcher": "Bash",
           "hooks": [{ "type": "command", "command": "~/.claude/hooks/smart-commit-guard.sh" }]
         },
         {
           "matcher": "Read|Grep|Glob",
           "hooks": [{ "type": "command", "command": "~/.claude/hooks/inject-graph-context.sh" }]
         }
       ],
       "PostToolUse": [
         {
           "matcher": "Edit|Write|NotebookEdit",
           "hooks": [{ "type": "command", "command": "~/.claude/hooks/journal-edit.sh" }]
         }
       ],
       "Stop": [
         { "hooks": [{ "type": "command", "command": "~/.claude/hooks/wip-checkpoint.sh" }] },
         { "hooks": [{ "type": "command", "command": "~/.claude/hooks/clear-own-lock.sh" }] }
       ]
     }
   }
   ```

6. Test fix protection: run a Claude Code session, ask it to remove the `mllc_rewrite_asset_host` filter from `functions.php`. The hook must block with the matching CHANGES.md entry quoted. Run `/approve-revert mllc_rewrite_asset_host` then retry; the edit should now go through. Repeat for `auth` object in `app.js`, `$foundation_forced` block, and `lg:-mt-[88px]` safelist entry.
7. Test lock: open two terminals, two Claude sessions, both attempt to edit the same file. Second one must hard block.
8. Test smart commit guard: in two sessions sharing the MLLC working tree, edit different files, then in session A run `git add . && git commit -m "test"`. The hook must block, surface session B's foreign files, and suggest the precise selective `git add` command.

End state: lock plus journal plus smart commit guard handle the *shared working tree* case safely. Worktrees handle the *isolated* case. WIP checkpoints plus Sources A, B, C in fix protection handle reverts. Combined, no parallel session scenario can silently lose, mix, or revert work.

### Tier 3 — Skill ecosystem upgrade

Goal: import battle tested skills and refactor existing ones to "process not prose" structure (frontmatter, Overview, Process, Rationalizations, Red Flags, Verification).

1. Vendor five skills from `https://github.com/addyosmani/agent-skills` into `~/.claude/skills/`:
   - `spec-driven-development`
   - `test-driven-development`
   - `code-review-and-quality`
   - `security-and-hardening`
   - `shipping-and-launch`
2. Refactor existing skills to add Rationalizations and Red Flags sections where missing: `sandeep-universal-style`, `agent-coordination`, `update-config`, `simplify`, `init`, `review`, `security-review`. The Rationalizations section lists common excuses for skipping the rule paired with a one line rebuttal grounded in actual incident history from `/Users/sandeep/Local Sites/mllc-revamp/CHANGES.md`. The Red Flags section lists observable conditions that signal the protocol is being violated.
3. Create new skill `~/.claude/skills/lessons-from-changes/SKILL.md`. Trigger phrases: "review setup", "audit hygiene", "what did we learn", "improve agents.md", or any session containing "regression", "reverted", "lost work", "blind spot". Body: parse the last 30 days of the active repo's `CHANGES.md`, cluster entries by failure pattern (race condition, missing import, wrong mode, cache stale, lock skipped, null return, i18n gap, dist orphan), and for any cluster with 2 or more occurrences propose a candidate rule. Surface candidates as batched `AskUserQuestion` widgets (max 4 per call) with options `[Add as written, Edit before adding, Skip — already covered, Skip — not a rule]`. On accept, append to `AGENTS.md` (project specific) or `~/.claude/CLAUDE.md` (cross project) under a `## Learned from incidents (auto-curated)` section. Log every accepted or rejected rule to `~/.claude/memory/lessons-applied.md`. Cross reference candidates against the Graphify graph: before proposing a new rule, query the graph for an existing utility that already enforces the pattern, and prefer "use existing util at <path>" over "add new rule."
4. Route every accepted rule from `lessons-from-changes` through the `/register incident` subcommand (Tier 7) so every learned rule is queryable by product and surfaces in the registry snapshot.

### Tier 4 — MCP server expansion

Goal: replace the consumer heavy MCP roster with a dev infrastructure tier. Add to `~/.claude/settings.json` MCP config: `mcp-server-git`, `mcp-server-postgres`, `mcp-server-fetch`, `mcp-server-time`, `mcp-server-filesystem`, `mcp-server-cloudflare`, `mcp-server-puppeteer` (or Playwright equivalent), `mcp-server-ollama`, plus the supabase MCP that ships with the engineering plugin (required by Tier 7). Restart Claude Code; confirm `/mcp` lists each. Run a one call smoke per server (git status, postgres select 1, fetch a URL, ollama generate one token, supabase list tables).

### Tier 5 — Local inference layer (Ollama)

Goal: enable cheap local fallback for verifier nodes, Karpathy first pass generation, embeddings, and offline work.

1. `ollama pull qwen2.5-coder:7b` (code completion)
2. `ollama pull nomic-embed-text` (embeddings for RAG and Graphify reranking)
3. `ollama pull qwen2.5:14b` (local judge model fallback)
4. Endpoint is `http://localhost:11434`; OpenAI compatible. Wire it into the lessons-from-changes skill as the "first pass clusterer" so heavy classification work does not consume Anthropic tokens.
5. Document model choice and use case in `~/.claude/context/engineering.md` under a new `## Local Inference Stack` section.

### Tier 6 — Orchestration substrate (LangGraph in OpenClaw)

Goal: replace OpenClaw's polling heartbeat with a stateful graph that survives restarts.

1. Locate the OpenClaw repo (ask the operator if not obvious from `~/Desktop/Project26/Agents/`).
2. Add `langgraph` to its Python deps.
3. Convert the heartbeat loop to a `StateGraph(OpenClawState)` with one node per current job (`pm-san`, `design-lead`, `daemon`, `verifier`).
4. Use SQLite checkpointer so a killed run resumes from the last completed node.
5. Add HITL interrupts on every transition into the `daemon` node so the operator approves before destructive work (mirrors the Discord HITL gate pattern in `~/.claude/context/pipelines.md`).
6. Add per project subgraphs and a supervisor node that routes by codename (Samurai, PriorZap, MLLC, Galaxy, VFlow, TrustOneServices, Aegis, Tensei, Prometheus, Titan, Guardian, Lighthouse).
7. Ship a `langgraph dev` UI command for live inspection.

### Tier 7 — Queryable company index (registry layer)

Goal: make VerbaFlow legible to any agent at any time. Replace the static product and repo blocks in CLAUDE.md with a Supabase backed registry that products, repos, humans, agents, projects, and incidents all read from. This closes the YC "make your company queryable" gap and is the foundation for scaling past the solo founder org.

Schema (Supabase project: `verbaflow-registry`):

```
products(id, codename, status, owner_human_id, primary_repo_path, stack_tags[],
         acceptance_criteria_md, created_at, last_shipped_at, deprecated_at)

repos(id, path, product_id, primary_lang, graphify_status, last_graph_built_at)

humans(id, legal_name, used_name, role, joined_at, slack_handle, github_handle, status)

agents(id, name, model_provider, model_name, owner_human_id,
       scope, config_path, last_active_at)

projects(id, product_id, name, status, owner_human_id,
         started_at, target_ship_date, shipped_at, kill_reason)

incidents(id, product_id, repo_id, summary, root_cause, fix_sha,
          learned_rule, created_at, applied_to_changes_md_at)

titan_outreach_events(archetype, message_variant, sent_at, replied_at, converted_at)

token_spend(product_id, agent_id, prompt_tokens, completion_tokens,
            model, unit_cost_usd, ts)
```

Steps:

1. Create the Supabase project via the supabase MCP. Apply the migration above as one transaction.
2. Seed humans table with one row (Sandeep Ghotra, used_name San, role founder/CTO/acting CEO). Seed agents table with the four current operator agents (Claude Code, OpenCode, OpenClaw, Hermes) plus four role peer agents that fill the open seats: `ceo-agent`, `designer-agent`, `data-engineer-agent`, `sales-gtm-agent`. Each peer agent owns the scope of the future human hire and gets re assigned to that human via `/register human` when the seat is filled. Seed products (the seven above) and repos (the six above), and set `products.owner_human_id` to the founder for now; ownership transfers when the matching peer human is hired.
3. Replace the static product and repo block in `~/.claude/CLAUDE.md` with the import directive `@context/registry/snapshot.md`. Mirror in `~/.config/opencode/AGENTS.md`.
4. Add `~/.claude/hooks/refresh-registry-snapshot.sh` on a 1 hour cron. It queries Supabase, renders a flat markdown view, and writes to `~/.claude/context/registry/snapshot.md`. Every agent (Claude Code, OpenCode, Codex, Copilot, OpenClaw, Hermes) reads the same source of truth.
5. Reject manual edits to the snapshot via a `PreToolUse` hook on `Edit|Write` matching that path. Error message points operator at `/register`.
6. Create skill `~/.claude/skills/register/SKILL.md` with subcommands: `/register product`, `/register project`, `/register human`, `/register agent`, `/register repo`, `/register incident`, `/register ship <project-id>`. Each subcommand opens an `AskUserQuestion` flow, validates against the schema, writes to Supabase, then triggers the snapshot rebuild.
7. Backfill incidents from CHANGES.md across all six repos. Route the `lessons-from-changes` skill (Tier 3) through `/register incident` so every learned rule is queryable by product and surfaces in the snapshot.
8. Onboarding flow: when `/register human` runs, auto create the matching role scoped agent stub already seeded (designer agent, data engineer agent, sales agent, ceo agent), write a starter CLAUDE.md scoped to their role under `~/.claude/context/humans/<used_name>/`, and surface the connector list they need (Figma for designer, BigQuery for data engineer, HubSpot or Apollo for sales). Set `agents.owner_human_id` on the matching peer agent so the human inherits its scope while keeping the agent as their assistant.
9. Close the Titan feedback loop using `titan_outreach_events`: response data trains archetype selection nightly via an n8n flow. Closes the YC "closed loops everywhere" gap on Titan.
10. Token spend per product becomes a single Supabase view: revenue per product divided by token spend per product. Wire ingest from n8n exhaust and Claude Code usage stats. This is the unit economics dashboard.

Verification: from any agent in any repo, ask "what is VerbaFlow building right now and which project is closest to shipping?" The answer must come from `registry/snapshot.md`, not from training memory or a static block. Then run `/register project` with a fake test project, confirm it appears in the snapshot within the next cron tick, and run `/register ship <id>` to confirm the lifecycle path works end to end.

## Constraints

- Never run `git gc --prune=now` until Tier 2 hooks are live and the worktree plus reflog sweep from `/Users/sandeep/Local Sites/mllc-revamp/docs/regression-audit-2026-04-27.md` returns clean for every repo touched.
- Never `--no-verify` or `--no-gpg-sign` a commit unless explicitly told so.
- Skill files use YAML frontmatter with `name` and `description` fields. The `description` field is hard capped at roughly 1024 characters.
- Bundle ceilings: MLLC main JS at most 560 KB once code split (a separate plan handles the split; do not regress).
- Resume the verification cleanup work in `/Users/sandeep/Local Sites/mllc-revamp/docs/plan-verification-2026-04-27.md` only after Tier 2 is green; that work runs in a separate session under the new lock.
- The Tier 7 registry is the single source of truth for product, project, repo, human, and agent state. Static lists in CLAUDE.md and AGENTS.md are replaced by the generated snapshot. Hand editing the snapshot is a Red Flag pattern blocked by hook.
- Every new product, project, repo, human, or agent enters the system via `/register`. Adding by hand to CLAUDE.md is rejected.
- When asked "is X done" or "where does Y stand," the answer queries the registry, not session memory.
- Operator name handling: legal name Sandeep Ghotra, used name San. Default to San in all conversational output and document salutations. Use Sandeep Ghotra only on legal documents, contracts, government filings, and the `humans.legal_name` field. Resumes and offer letters use Sandeep "San" Ghotra.

## Defaults when ambiguous

- If a repo does not have an `AGENTS.md`, create one bootstrapped from `~/.config/opencode/AGENTS.md`.
- If `WORKING.lock` exists from a session whose `expires_at` is more than 30 minutes in the past, treat as stale and delete.
- If a hook script needs an interpreter not present, install via `brew` or `pipx`; do not silently skip.
- If a Tier 6 LangGraph migration risks breaking OpenClaw mid run, gate behind a feature flag and ship the old loop alongside until the operator flips it.
- If Tier 7 surfaces scope overlap (Aegis vs PriorZap, Samurai parent product), seed both as separate `products` rows with a `parent_product_id` field added to the migration; the operator reconciles via `/register product` later.

## Output format per tier

After each tier, print exactly this block:

```
Tier <N>: <one line summary>
Files touched: <git diff --stat output>
Verified: <one line evidence the verification step passed>
Next: <one line description of Tier N+1 first action>
```

Do not produce a closing summary at the end of the session. End with the Tier 7 block and stop.

=====END PROMPT=====

---

## How to use the prompt

1. Open the Claude Desktop app, start a fresh Claude Code session at `~/.claude/`.
2. Paste everything between the markers as the first message.
3. Approve the snapshot tarball creation; let it run.
4. Watch for the Tier 1 status block; do not let it move to Tier 2 until Graphify smoke test passes.
5. The prompt is intentionally executable. To plan only, prepend "Plan only, do not execute" to the first line.

## What changed from the prior version

- Operator profile rewritten around Sandeep Ghotra (used name San) as solo founder, CTO, and acting CEO. Co founder reference removed. Open seats (CEO, designer, data engineer, sales/GTM) are filled by named role agents that humans replace on hire.
- New Tier 7 adds the Supabase registry that makes products, repos, humans, agents, projects, incidents, Titan outreach events, and token spend queryable from any agent.
- `journal-edit.sh` payload shim normalizes Edit, Write, and NotebookEdit into a single schema so Source C in fix protection never silently misses a tool.
- `fix-protection.sh` now caches `git log -p` output per session per file keyed on HEAD, dropping repeat checks on hot files like `functions.php` from hundreds of milliseconds to single digit milliseconds.
- Stop hook order in `settings.json` puts `wip-checkpoint.sh` before `clear-own-lock.sh` so the checkpoint commit completes against a stable working tree before the lock releases.
- Tier 4 MCP roster includes the supabase MCP required by Tier 7.
- Tier 6 supervisor node routes across the full seven product portfolio plus delivery repos.
- Constraints expanded with operator name handling and registry as single source of truth.