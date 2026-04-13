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
- `.env.example` when environment variables are required
- a local `README.md`

## Verification

Verify only what you touch. For app-level changes, run the smallest relevant commands inside the template you changed.

If you change template structure or config, check whether `../cli/` assumptions need to change too.
