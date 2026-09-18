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

Static, dependency-free build — no framework, no `node_modules`, no build step.

**Files:** `index.html`, `assets/css/style.css`, `assets/js/main.js`, `favicon.svg`,
`robots.txt`, `vercel.json`.

**Design direction:** telemetry / systems. Near-black base, a single signal-blue accent,
monospace for anything that is data, medal colours reserved for the 2026 record. The hero
runs a slow oscilloscope trace — an event spike sweeping across a noisy baseline, echoing
the failure-countdown work in Autopilot. Dark and light themes, `prefers-reduced-motion`
respected, and the canvas pauses when off-screen or when the tab is hidden.

**Preview locally:**

```bash
cd ../worktrees/claude
python3 -m http.server 8137
# open http://127.0.0.1:8137
```

**Deploy:** Vercel serves the repo root as-is. `vercel.json` adds cache and security headers.
No build command or output directory needed.
