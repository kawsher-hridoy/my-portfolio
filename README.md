# My Portfolio — Kawsher HRidoy

Personal portfolio website for **Kawsher HRidoy** (Team Lead, Cortex Crew · ML & Systems, Daffodil International University, Dhaka).

This repository is shared by three agents. Each agent builds its own version in a **git worktree** so they do not overwrite each other.

## Source of truth (bio)

Public profile: [cortexcrew.vercel.app/kawsher-hridoy](https://cortexcrew.vercel.app/kawsher-hridoy)

- Email: kawsher@hridoy.xyz
- Stack: Python, FastAPI, Next.js, PostgreSQL, LightGBM, Azure OpenAI
- 2026 Cortex Crew results: CSAD Champion (Darktrace3), IEEE ICADHI 1st Runners-up (Niro), plus finalist finishes (Autopilot, AI Mentor, Niro at Data Science Summit)

Full notes for implementers: `PROFILE.md`.

## Worktrees (agent isolation)

Main checkout (this folder) stays on `main`.

| Agent  | Directory (sibling of this repo) | Branch             |
|--------|----------------------------------|--------------------|
| Cursor | `../worktrees/cursor`            | `cursor/portfolio` |
| Claude | `../worktrees/claude`            | `claude/portfolio` |
| Codex  | `../worktrees/codex`             | `codex/portfolio`  |

Cursor worktree is already created. Claude / Codex:

```bash
cd /path/to/my-portfolio
git worktree add -b claude/portfolio ../worktrees/claude
git worktree add -b codex/portfolio ../worktrees/codex
```

## Variant: `claude/portfolio`

**Two files. No JavaScript. No build step. No dependencies.**

**Files:** `index.html`, `style.css`.

**Design:** one dark theme, system font stack (no web fonts, so nothing is fetched from a
third party), no JavaScript at all. The only external request the page makes is the GitHub
avatar, which sits behind a CSS monogram fallback — if it fails to load you see "KH", not a
broken image. The favicon is an inline `data:` URI so it costs no extra file.

**Content:** hero, the five 2026 competition results, the four systems, and contact links.
Sourced from `cortexcrew.vercel.app/kawsher-hridoy` and the `kawsher-hridoy` GitHub profile.

**Preview locally:**

```bash
cd ../worktrees/claude
python3 -m http.server 8137
# open http://localhost:8137
```

**Deploy:** a static host serves these two files as-is — no build command, no output
directory. On Vercel, set the framework preset to "Other" and leave the build command empty.

> An earlier, more elaborate variant of this branch (canvas hero, theme toggle, scroll
> animations, 7 files) is preserved at commit `ce1742b` if you want to compare.
