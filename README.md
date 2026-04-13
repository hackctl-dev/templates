# hackctl Templates

This repo contains the official project templates used by `hackctl create`.

## Purpose

Templates in this repo are the source of truth for scaffolded hackctl projects. Each template should be runnable by the CLI with as little manual setup as possible and should stay beginner-friendly.

## Repository Layout

Templates live in their own top-level directories:

- `mern/`

Each template is expected to carry its own local documentation and runtime files.

## Template Contract

Official templates should align with the current hackctl workflow:

- `hackctl create`
- `hackctl start`
- `hackctl share`

At a minimum, a template should include:

- a root `hackctl.config.json`
- a root `.env.example` when environment variables are required
- a template-local `README.md`
- the service directories referenced by `hackctl.config.json`

## Working In This Repo

Changes here affect newly scaffolded projects even if the CLI code does not change. When updating a template:

- keep the scaffold simple and beginner-friendly
- preserve the `hackctl.config.json` contract expected by the CLI
- avoid committing secrets or machine-specific files
- avoid committing dependency directories unless there is a specific reason
- local test files like `backend/.env` and `*/node_modules/` are fine only when they stay untracked and covered by the template `.gitignore`

## Current Status

The repo currently contains one official template, `mern`. Additional templates are planned, but they are not part of the shipped MVP yet.
