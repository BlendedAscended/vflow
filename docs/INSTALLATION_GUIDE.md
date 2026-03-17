# VerbaFlow Design System Skill - Manual Installation Guide

## What You're Getting

A complete design system skill with:
- **SKILL.md** (main skill file with YAML frontmatter)
- **references/master-design-system.md** (extended knowledge base)
- Three rotating design matrices (Enterprise, Developer Dark, Consumer Conversion)
- Layout patterns and React/CSS implementations
- 6-step design process and psychological principles

## Folder Structure

```
verbaflow-design-system/
├── SKILL.md                          (Main skill file)
└── references/
    └── master-design-system.md       (Extended reference)
```

## How to Add It to Your Skills

### Option 1: Copy the Folder Directly (Recommended)

1. **Download or copy this entire `verbaflow-design-system/` folder**

2. **Navigate to your Claude skills directory:**
   - On your computer, find your Claude config/skills folder
   - This is typically in: `~/.claude/skills/user/` or wherever you keep custom skills

3. **Paste the `verbaflow-design-system/` folder there**

4. **Close and reopen Claude completely** (refresh isn't enough)

5. **Go to Customize > Skills**
   - You should now see `verbaflow-design-system` in "My skills"

### Option 2: Create Files Manually

1. **Create a new folder:** `verbaflow-design-system/`

2. **In that folder, create `SKILL.md`** (see the file provided)

3. **In that folder, create a subfolder:** `references/`

4. **In `references/`, create `master-design-system.md`** (see the file provided)

5. **Close and reopen Claude completely**

## Verification Checklist

- [ ] Folder named exactly `verbaflow-design-system` (with hyphen, not underscore)
- [ ] Inside: `SKILL.md` file present
- [ ] Inside: `references/` subfolder with `master-design-system.md`
- [ ] YAML frontmatter at top of SKILL.md:
  ```
  ---
  name: verbaflow-design-system
  description: "..."
  ---
  ```
- [ ] Claude completely closed (not just tab refresh)
- [ ] Claude reopened fresh

## Usage

After adding the skill, you can trigger it by:

**Typing directly:**
```
/verbaflow-design-system
```

**Asking design questions:**
```
Which design matrix should I use for Samurai?
Design this using Consumer Conversion principles
Build me a Bento Box grid
Show me glassmorphism patterns
```

**Referencing frameworks:**
```
Use Enterprise Authority for this dashboard
Developer Dark Mode for the CLI
Consumer Conversion for the mobile app
```

## Troubleshooting

**Skill doesn't appear in Customize > Skills:**
- Make sure Claude is **completely closed** (all tabs, all windows)
- Wait 30 seconds, then reopen Claude
- The skill discovery system needs a clean reload

**Skill appears but `/verbaflow-design-system` doesn't work:**
- Check the YAML frontmatter at the top of SKILL.md (must be exactly right)
- Make sure folder name has hyphen: `verbaflow-design-system` not `verbaflow_design_system`
- Try closing and reopening again

**Folder path questions:**
- Ask: "Where are my skill files stored?"
- They should be in the same directory as your other user skills (frontend-blueprint, health, tech, etc.)

## Integration with Frontend Blueprint

This skill complements your existing `/frontend-blueprint` skill:

- **frontend-blueprint** = Project architecture, scaffolding, tech decisions
- **verbaflow-design-system** = Visual matrices, components, psychology

Use them together for complete product design coverage.

## Questions?

If the skill isn't showing up after following these steps:
1. Verify the file structure exactly matches above
2. Confirm YAML frontmatter is present at top of SKILL.md
3. Make sure folder name has hyphen (not underscore)
4. Close Claude **completely** and reopen
5. Check if it appears in Customize > Skills

Good luck! Once it's in, you'll have instant access to all three design matrices and patterns.
