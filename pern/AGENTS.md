# PERN Template Guide

This file is specific to the `pern` template.

## hackctl Context

- This template is scaffolded by `hackctl create --template pern`.
- `hackctl start` reads service definitions from `hackctl.config.json`.
- `hackctl share` uses `share.defaultService` and `share.defaultPort` from `hackctl.config.json`.
- `hackctl deploy` reads the template `deploy` block and currently expects `runtime: pm2` with `mode: dev`.
- `hackctl status` and `hackctl destroy` read saved deploy metadata from `.hackctl/deploy.json`.

## hackctl.config.json Contract

- Keep the schema URL as `https://hackctl.dev/schemas/hackctl.config.v1.json`.
- Keep both services aligned with real directories and commands:
  - `frontend` -> `cwd: frontend`, `run: npm run dev`, `port: 3000`
  - `backend` -> `cwd: backend`, `run: npm run dev`, `port: 5000`, `envFile: backend/.env`
- Keep the deploy block aligned with the current remote contract:
  - `runtime: pm2`
  - `mode: dev`
- If service names, ports, or folder layout change, update `hackctl.config.json` and `README.md` together.
- Frontend API calls should remain on relative `/api/*` paths, with proxy target controlled by env.

## Runtime State

- `hackctl start` and `hackctl share` write local runtime data to `.hackctl/state.json`.
- `hackctl deploy` writes remote deploy metadata to `.hackctl/deploy.json`.
- `.hackctl/` must stay gitignored.
- Never commit `.hackctl/state.json`, `.hackctl/deploy.json`, or other local runtime artifacts.

## AI Guidance Files

- `AGENTS.md` is the canonical guidance file.
- `CLAUDE.md` and `GEMINI.md` should remain lightweight pointers to this file.
- Keep guidance grounded in shipped behavior for this template.
