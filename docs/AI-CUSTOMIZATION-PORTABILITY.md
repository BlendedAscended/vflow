# AI Customization Portability Guide

This document explains how to move your Claude instruction system, skills, MCP servers, and plugin-style customizations into GitHub Copilot and Antigravity without creating conflicting sources of truth.

## Core Rule

Do not treat every customization surface as an equal always-on instruction dump.

Different customization types solve different problems:
- Instructions: always-on guidance
- Skills: task-specific workflows
- Agents: specialized personas with task routing
- Hooks: deterministic automation
- MCP servers / connectors: actual tool capability
- Plugins: a bundle of agents, skills, hooks, and MCP

If you put everything into every always-on instruction file, the model does not "choose one." It combines them. That can create token bloat, contradictory guidance, or weak signal.

## What GitHub Copilot Actually Loads

GitHub Copilot in VS Code can load multiple instruction sources at the same time, including:
- user-level instructions
- repository-wide instructions from `.github/copilot-instructions.md`
- path-specific instructions from `.github/instructions/*.instructions.md`
- agent instructions such as `AGENTS.md`
- for some agent flows, `CLAUDE.md`
- built-in instructions
- extension-contributed instructions
- organization-level instructions if enabled

In your current workspace UI, Copilot is already seeing multiple instruction files:
- `~/.claude/CLAUDE.md`
- repo `CLAUDE.md`
- repo `.github/copilot-instructions.md`

That means Copilot is not choosing one. It is combining them.

## Recommended Layering

Use one source of truth per layer.

### Layer 1: user-wide personal rules

Use for rules that should follow you across projects:
- personal writing style
- universal coding preferences
- memory workflow
- recurring execution discipline

Recommended file:
- `~/.claude/CLAUDE.md`

Keep this file personal and cross-project. Do not put repo-specific paths, client workflows, or project registry details here unless they are truly universal.

### Layer 2: repo-wide always-on rules

Use for rules that should always apply inside this repository:
- architecture context
- repo-specific directories
- deployment patterns
- coding conventions that are genuinely always relevant here

Recommended files:
- `CLAUDE.md` for Claude-aligned tools
- `.github/copilot-instructions.md` for Copilot
- `ANTIGRAVITY.md` for Antigravity if it supports repo files or for manual import

These files can be mirrored if you want consistency, but the ideal long-term model is:
- personal rules stay in the user file
- repo rules stay in the repo file
- task-specific workflows move out into skills

### Layer 3: task-specific workflows

Use skills instead of always-on instructions when the workflow is only relevant sometimes:
- resume tailoring
- design direction
- outreach writing
- document generation
- interview scripting
- domain-specific analysis

For Copilot, recommended project skill location:
- `.github/skills/<skill-name>/SKILL.md`

Alternative project locations supported by the ecosystem:
- `.claude/skills/<skill-name>/SKILL.md`
- `.agents/skills/<skill-name>/SKILL.md`

For personal Copilot skills:
- `~/.copilot/skills/<skill-name>/SKILL.md`

### Layer 4: tool capabilities

Use actual tools instead of prompt text whenever the agent needs to do something, not just think differently.

Examples:
- CRM access
- Apollo or sales data lookups
- Google Sheets writes
- Notion sync
- Supabase inspection
- deployment control

Use:
- MCP servers
- connectors
- plugins
- API-backed agents

Do not encode tool behavior as giant instructions if the agent really needs callable capabilities.

## How To Port Claude Skills To GitHub Copilot

### What transfers cleanly

Claude skills transfer well into Copilot skills because Copilot supports `SKILL.md`-based skills.

Recommended process for each Claude skill:
1. Create a folder under `.github/skills/<skill-name>/`
2. Add `SKILL.md`
3. Preserve the high-value parts:
   - when to trigger
   - what the skill does
   - output format
   - examples
   - tool assumptions
4. Remove Claude-only wording that depends on unavailable tools or UI
5. Add `allowed-tools` in frontmatter if the skill needs tool pre-approval

### Skills that should stay skills

Based on your current working set, good candidates are:
- `ai-video-director`
- `capture-design`
- `resume-alignment`
- `frontend-blueprint`
- `design-director`
- `design-variations`
- `finance`
- `tech`
- `aiml`
- `cloud`
- `health`
- `intro-interview`
- `opt-compliant`
- `referral`
- `opt-email`

### Skills that should not stay skills

Some Claude customizations are better as always-on instructions, not skills:
- `sandeep-universal-style`

Reason:
- style should apply broadly
- skills should be loaded only when relevant
- making style a skill weakens consistency unless invoked every time

### Copilot skill template

Use this structure:

```md
---
name: resume-alignment
description: Align a candidate resume to a target job description without fabricating facts. Use when the user provides both a resume and a JD.
allowed-tools:
  - read_file
  - search
---

# Resume Alignment

## Use This When
- The user provides a resume and a job description
- The task is tailoring, rewriting, or aligning bullets

## Rules
- Never fabricate hard facts
- Use JD duty actions, not org context, as the source of bullet actions
- Rewrite mirrored job-posting phrasing into practitioner language

## Output
- Updated bullets only
- Optional summary of alignment strategy
```

## How To Port Claude Plugins And Custom Sales Customizations To Copilot

### First classify what the "plugin" really is

A Claude "plugin" or customized workflow usually contains one or more of these:
- instructions
- skills
- prompts
- hooks
- MCP servers
- external API auth and actions

Do not migrate it as one blob until you classify it.

### Decision table

If the customization is:
- mostly behavior or output rules: move it into instructions or a skill
- a repeatable task workflow: move it into a skill or custom agent
- a new tool capability: move it into MCP
- a reusable packaged bundle: move it into a Copilot plugin

### Recommended structure for a Copilot plugin

```text
my-sales-plugin/
├── plugin.json
├── agents/
│   └── sales.agent.md
├── skills/
│   ├── sales-outreach/SKILL.md
│   └── lead-research/SKILL.md
├── hooks.json
└── .mcp.json
```

Use this when your customized sales plugin includes:
- lead research workflow
- structured outreach writing
- CRM or sheet tools
- tool guardrails
- a specialized sales persona or agent

### Recommended split for your sales plugin

For a customized sales stack, split it into:
- always-on repo instructions: broad sales conventions only if they apply to this repo
- `sales-outreach` skill: message generation workflow
- `lead-research` skill: enrichment and qualification workflow
- `sales.agent.md`: specialized agent for sales tasks
- `.mcp.json`: Apollo, CRM, Sheets, or internal API tool configuration
- `hooks.json`: logging, approvals, or pre-send checks if supported

## How To Port Claude Customizations To Antigravity

I do not have a verified official Antigravity file-format standard for skills and plugins, so treat this section as the practical portability plan rather than a guaranteed product-specific spec.

### Safe approach

Use Antigravity in three layers:
- `ANTIGRAVITY.md` for always-on project instructions
- saved prompts or custom agents for Claude-style skills
- connectors or API tools for plugin and MCP behavior

### Recommended mapping

Claude concept to Antigravity equivalent:
- `CLAUDE.md` rules -> `ANTIGRAVITY.md` or system/project instructions
- skills -> saved prompts or custom task agents
- plugins -> tool bundles, connectors, or agent packages if supported
- MCP servers -> external tool integrations or APIs
- hooks -> only if Antigravity supports lifecycle automation

### Important constraint

Do not try to port Claude-specific trigger language or file paths blindly into Antigravity. Only move:
- intent
- workflow
- output format
- tool requirements

## Current Recommendation For This Repo

### If you want the least confusion in Copilot

Use this model:
- `~/.claude/CLAUDE.md`: personal cross-project rules only
- `.github/copilot-instructions.md`: Copilot repo-wide rules only
- `CLAUDE.md`: Claude-oriented repo rules or cloud-agent-compatible rules
- `.github/instructions/*.instructions.md`: narrow path-specific rules
- `.github/skills/`: task-specific workflows

### If you keep mirrored giant files

This works only if:
- the files stay semantically identical
- you accept larger prompt overhead
- you understand Copilot may combine all of them

That means:
- less contradiction
- more token waste
- slower, blurrier guidance than a layered setup

So the current mirror setup is safe for consistency, but not ideal for efficiency.

## Migration Plan

### Phase 1: reduce instruction conflict

1. Keep `~/.claude/CLAUDE.md` for personal rules only
2. Keep repo `.github/copilot-instructions.md` for Copilot repo rules
3. Keep `CLAUDE.md` for Claude-compatible repo rules
4. Move specialized workflows out of always-on files

### Phase 2: port high-value Claude skills

Create `.github/skills/` and port the highest-ROI skills first:
1. `resume-alignment`
2. `frontend-blueprint`
3. `design-director`
4. `ai-video-director`
5. `opt-email`

### Phase 3: port your sales customization

1. Write down the sales workflow components
2. Separate instructions, skills, agents, and tools
3. Build a Copilot plugin or repo-local bundle
4. Recreate the same workflow in Antigravity using saved prompts plus tool connections

### Phase 4: validate in each tool

For Copilot in VS Code:
- open Chat Customizations
- confirm loaded instructions
- test a repo-wide request
- test a skill-triggered request
- test any MCP-backed task

For Antigravity:
- verify the project instruction file is loaded
- verify one saved prompt or agent per migrated skill
- verify external tools are callable before relying on them

## Immediate Next Files To Add

If you want to move forward cleanly, add these next:
- `.github/skills/resume-alignment/SKILL.md`
- `.github/skills/frontend-blueprint/SKILL.md`
- `.github/skills/design-director/SKILL.md`
- `.github/skills/ai-video-director/SKILL.md`
- `.github/skills/opt-email/SKILL.md`
- `.github/agents/sales.agent.md`
- `.github/mcp.json` or `.vscode/mcp.json` for tool integrations

## Official References

- GitHub Copilot repository instructions:
  https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot
- GitHub Copilot custom instruction support matrix:
  https://docs.github.com/en/copilot/reference/custom-instructions-support
- VS Code custom instructions:
  https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- VS Code agent skills:
  https://code.visualstudio.com/docs/copilot/customization/agent-skills
- GitHub Copilot skills locations:
  https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/add-skills
- VS Code custom agents:
  https://code.visualstudio.com/docs/copilot/customization/custom-agents
- VS Code agent plugins:
  https://code.visualstudio.com/docs/copilot/customization/agent-plugins
- GitHub Copilot plugins:
  https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating
