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
