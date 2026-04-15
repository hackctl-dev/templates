# hackctl Templates

This repo contains the official project templates used by `hackctl create`.

## Purpose

Templates in this repo are the source of truth for scaffolded hackctl projects. Each template should be runnable by the CLI with as little manual setup as possible and should stay beginner-friendly.

## Repository Layout

Templates live in their own top-level directories:

- `mern/`
- `pern/`
- `next-supabase/`
- `sveltekit-supabase/`
- `nuxt-supabase/`

Each template is expected to carry its own local documentation and runtime files.

## Template Contract

Official templates should align with the current hackctl workflow:

- `hackctl create`
- `hackctl start`
- `hackctl share`

Near-term official templates are Node and npm based web templates.

Current standardized app target is a Todo app with shared `/api/todos` CRUD route behavior and Tailwind-based UI consistency across templates.

Official templates are also AI-ready by default. Each template should include:

- root `AGENTS.md` as the canonical AI coding guide
- root `CLAUDE.md` and `GEMINI.md` files that point to `AGENTS.md`
- curated stack-aware skills under `.agents/skills/*/SKILL.md`

Merge requirements are defined in `TEMPLATE.md` and should be treated as the source of truth for template PR review.

At a minimum, a template should include:

- a root `hackctl.config.json`
- `.env.example` coverage for required environment variables
- a template-local `README.md`
- root `AGENTS.md` plus `CLAUDE.md` and `GEMINI.md` pointer files
- curated skills in `.agents/skills/*/SKILL.md`
- the service directories referenced by `hackctl.config.json`
- a `.gitignore` rule for `.hackctl/` runtime state

## Working In This Repo

Changes here affect newly scaffolded projects even if the CLI code does not change. When updating a template:

- keep the scaffold simple and beginner-friendly
- preserve the `hackctl.config.json` contract expected by the CLI
- avoid committing secrets or machine-specific files
- avoid committing dependency directories unless there is a specific reason
- local test files like `backend/.env` and `*/node_modules/` are fine only when they stay untracked and covered by the template `.gitignore`

## Current Status

The repo currently ships five official templates:

- `mern`
- `pern`
- `next-supabase`
- `sveltekit-supabase`
- `nuxt-supabase`
