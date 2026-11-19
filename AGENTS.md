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

## Design

The design source is the Figma file linked in `README.md`, but agents never call Figma:
free Figma plans allow only a few API calls a month. The owner exports it once with
`npm run design:export`, and agents work from the copy in `design/`.

- `design/README.md` lists every frame. Start there.
- `design/frames/<frame>.jpg` shows how the frame looks; open it if your model can read images.
- `design/frames/<frame>.json` gives exact sizes, gaps, paddings, colors, radii and text styles.
  When a color has a `variable`, use that CSS variable instead of the raw value.
- `design/images/` holds the original pictures (covers, avatars, backgrounds). A layer whose
  fill has `"image": "images/<ref>.jpg"` uses that file; copy it into `src/assets/images/`
  instead of cropping frame screenshots.
- `design/tokens.json` lists all colors and text styles. A value that is used in the design
  but missing from `src/styles/_variables.scss` should be added there, not hard-coded.
- Match the existing implemented sections (`Header`, `HeroSection`, `GenresSection`) for how
  design values become Sass.
- If a frame needed for the task is missing from `design/`, comment on the issue and stop.

## Where tasks come from

Work comes only from GitHub issues labeled `agent-ready`, written with the "Agent task" template.

```bash
gh issue list --label agent-ready   # available tasks
gh issue view <number>              # full task, acceptance criteria, design notes
```

- One issue = one worktree = one pull request. Name the worktree `<number>-<slug>`,
  for example `npm run agent:new -- 12-story-card`.
- Treat the acceptance criteria as the definition of done. If they are ambiguous or the
  design reference is missing, comment on the issue and stop instead of guessing.
- An issue that starts with `Depends on #N` is not ready while issue `#N` is open
  (`gh issue view N`). Pick another one.
- Before starting, check that no open pull request already references the issue
  (`gh pr list --search "<number>"`), so two agents never take the same task.
- Do not start work that has no issue. Put `Closes #<number>` in the pull request.

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
   Keep every file you create inside your worktree: tools cannot write outside it. Put
   temporary files in `.tmp/` (git-ignored) and delete them when done.
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
