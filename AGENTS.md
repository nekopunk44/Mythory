# AGENTS.md

This file is the vendor-neutral operating contract for AI coding agents working on Mythory.
OpenCode, Kilo Code, Cline and GitHub Copilot all read it. Tool-specific files
(`.clinerules`, `.kilocode/rules/`, `.github/copilot-instructions.md`, `opencode.json`)
only add to it and must not contradict it.

## Scope

- Mythory is a React 19 and Vite frontend for a story-reading platform, using JavaScript/JSX and Sass.
- The project is currently primarily static demo content.
- Work in the smallest relevant set of files.
- Reuse components and index exports under `src/components`, `src/layouts`, and `src/sections`.
- Keep component styles colocated: `Component/Component.jsx` and `Component/Component.scss`.
- Import shared modules through the `@` alias.
- Use existing Sass variables, mixins, and helpers.
- Do not introduce TypeScript.
- Do not add dependencies when existing code or packages provide the required functionality.
- Use semantic HTML and accessible names for interactive controls.

## Roles

Role prompts live in `.github/agents/` and are shared by every tool:

| Role           | File                                   | Edits code |
| -------------- | -------------------------------------- | ---------- |
| `orchestrator` | `.github/agents/orchestrator.agent.md` | no         |
| `frontend`     | `.github/agents/frontend.agent.md`     | yes        |
| `ux-reviewer`  | `.github/agents/ux-reviewer.agent.md`  | no         |
| `qa`           | `.github/agents/qa.agent.md`           | no         |

## Workspace: one agent, one worktree, one branch

Agents working in parallel must never share a working directory.

```bash
npm run agent:new -- <task>      # creates ../Mythory-agents/<task> on branch agent/<task>
npm run agent:list               # shows all active worktrees
npm run agent:remove -- <task>   # removes the worktree after the PR is merged
```

- `<task>` is kebab-case and describes the outcome, for example `genre-card-hover`.
- Open the agent inside its worktree folder, not in the main checkout.
- The main checkout stays on `main` and is used only for review and merging.

## Mandatory workflow

1. Read the relevant files and this contract before editing.
2. Confirm you are in your own worktree on an `agent/<task>` branch (`git status`).
3. Make only task-scoped changes.
4. Run `npm run format`.
5. Run `npm run check` (format check, lint, production build). It must pass.
6. Review the final diff.
7. Commit, push the branch, and open a pull request into `main` using the template.
8. Report the exact changes and any unverified behavior.

## Commits

- Small, focused commits with an imperative subject, for example `Add hover state to GenreCard`.
- Commits are authored by the repository owner's configured Git identity. Do not change
  `user.name` or `user.email`, and do not add `Co-Authored-By` or other AI attribution
  trailers to commits or pull requests.
- Never force-push to `main` or rewrite history that is already pushed.

## Conflict handling

- Never reset or overwrite another agent's changes.
- If your task needs a file that another open `agent/*` branch already changes, stop and
  report it instead of editing that file.
- Rebases and merges between agent branches are done by the human or orchestrator.
- Do not claim success if `npm run check` fails.

## Handoff summary

Every agent finishes with:

- task and acceptance criteria
- files changed
- validation commands and results
- known limitations
- suggested reviewer role

## Commands

- Install: `npm ci`
- Development: `npm run dev`
- Format: `npm run format` (check only: `npm run format:check`)
- Lint: `npm run lint`
- Production build: `npm run build`
- Everything CI runs: `npm run check`
- Preview: `npm run preview`

CI (`.github/workflows/ci.yml`) runs format check, lint and build on every pull request into `main`.
