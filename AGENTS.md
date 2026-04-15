# Templates Agent Guide

This repo contains the source templates used by `hackctl create`.

## Scope

Changes here affect future scaffolded projects. Treat template edits as product changes, not just sample code edits.

## Working Rules

- Preserve the contract expected by the CLI in `../cli/`.
- Keep templates beginner-friendly and easy to run locally.
- Do not commit secrets, personal `.env` files, or machine-specific state.
- Avoid committing `node_modules` or other generated dependency directories unless the task explicitly requires it.
- Local testing artifacts like `backend/.env` or `node_modules/` are acceptable only as untracked files covered by the template `.gitignore`.
- Update the template-local `README.md` when setup or behavior changes.

## Template Expectations

Each official template should include:

- `hackctl.config.json`
- a clear service layout that matches the config
- `.env.example` coverage for required environment variables
- a local `README.md`
- a `.gitignore` entry for `.hackctl/`
- a root `AGENTS.md` file as canonical AI project guidance
- root `CLAUDE.md` and `GEMINI.md` files that point to `AGENTS.md`
- curated skills in `.agents/skills/*/SKILL.md` with stack-appropriate defaults

## Verification

Verify only what you touch. For app-level changes, run the smallest relevant commands inside the template you changed.

If you change template structure or config, check whether `../cli/` assumptions need to change too.

## AI Template Authoring

When using AI tools to create or update templates, treat `TEMPLATE.md` as the source-of-truth merge contract.

Recommended implementation order:

1. Build `hackctl.config.json` first.
2. Align folder layout with `services[].cwd` and `share` settings.
3. Add `AGENTS.md` plus `CLAUDE.md` and `GEMINI.md` pointers.
4. Add curated `.agents/skills/*/SKILL.md` entries for the template stack.
5. Ensure `.gitignore` includes `.hackctl/`.
6. For official templates, keep service run commands npm based (`npm run ...`) and ensure each service has a `package.json`.
7. Add or update `.env.example` coverage.
8. Ensure frontend API routing uses `/api` and the standardized Todo CRUD route contract.
9. Use Tailwind CSS and keep the shared Todo layout consistent with other official templates.
10. Update template-local README with setup and runtime details.
11. For Supabase templates, keep schema in `supabase/migrations` and document the `supabase db push` workflow.

Contributor output expectations:

- list changed files
- list which `TEMPLATE.md` checklist items are satisfied
- list any remaining gaps before merge
