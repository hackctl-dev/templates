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

## Verification

Verify only what you touch. For app-level changes, run the smallest relevant commands inside the template you changed.

If you change template structure or config, check whether `../cli/` assumptions need to change too.

## AI Template Authoring

When using AI tools to create or update templates, treat `TEMPLATE.md` as the source-of-truth merge contract.

Recommended implementation order:

1. Build `hackctl.config.json` first.
2. Align folder layout with `services[].cwd` and `share` settings.
3. Ensure `.gitignore` includes `.hackctl/`.
4. For official templates, keep service run commands npm based (`npm run ...`) and ensure each service has a `package.json`.
5. Add or update `.env.example` coverage.
6. Ensure frontend API routing uses `/api` and env-driven proxy behavior.
7. Update template-local README with setup and runtime details.

Contributor output expectations:

- list changed files
- list which `TEMPLATE.md` checklist items are satisfied
- list any remaining gaps before merge
