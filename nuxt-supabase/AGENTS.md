# Nuxt Supabase Template Guide

This file is specific to the `nuxt-supabase` template.

## hackctl Context

- This template is scaffolded by `hackctl create --template nuxt-supabase`.
- `hackctl start` reads service definitions from `hackctl.config.json`.
- `hackctl share` uses `share.defaultService` and `share.defaultPort` from `hackctl.config.json`.
- `hackctl deploy` reads the template `deploy` block and currently expects `runtime: pm2` with `mode: dev`.
- `hackctl status` and `hackctl destroy` read saved deploy metadata from `.hackctl/deploy.json`.

## hackctl.config.json Contract

- Keep the schema URL as `https://hackctl.dev/schemas/hackctl.config.v1.json`.
- Keep the app service aligned with the real runtime contract:
  - `name: app`
  - `cwd: .`
  - `run: npm run dev`
  - `port: 3000`
- Keep the deploy block aligned with the current remote contract:
  - `runtime: pm2`
  - `mode: dev`
- If service names, ports, or folder layout change, update `hackctl.config.json` and `README.md` together.

## Runtime State

- `hackctl start` and `hackctl share` write local runtime data to `.hackctl/state.json`.
- `hackctl deploy` writes remote deploy metadata to `.hackctl/deploy.json`.
- `.hackctl/` must stay gitignored.
- Never commit `.hackctl/state.json`, `.hackctl/deploy.json`, or other local runtime artifacts.

## AI Guidance Files

- `AGENTS.md` is the canonical guidance file.
- `CLAUDE.md` and `GEMINI.md` should remain lightweight pointers to this file.
- Keep guidance grounded in shipped behavior for this template.

## Supabase Schema Changes

- Keep schema changes in `supabase/migrations/`.
- Do not edit old migration files after they ship; add a new timestamped migration instead.
- For new tables/columns/policies:
  1. Create a new migration: `npx supabase migration new <change_name>`
  2. Add SQL in `supabase/migrations/<timestamp>_<change_name>.sql`
  3. Link and apply: `npx supabase link --project-ref <ref>` then `npx supabase db push`
  4. Update API routes and UI to match new schema
  5. Update `README.md` setup/migration docs when workflow or required env changes

## Safety Rules

- Never commit secrets.
- Keep `supabase/config.toml` and `supabase/migrations` tracked.
