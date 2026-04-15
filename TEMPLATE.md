# Template Contract

This document defines the merge contract for official templates in this repository.

If a template does not meet these requirements, it should not be merged.

## Scope

- Official templates are currently web-first.
- Official templates must support the shipped CLI workflow: `hackctl create`, `hackctl start`, and `hackctl share`.
- Near-term official templates are Node and npm based.
- Official templates in this phase implement the same Todo app shape.

## Required Files

Each template must include:

- root `hackctl.config.json`
- root `.gitignore` with `.hackctl/`
- `.env.example` coverage for required environment variables
- template-local `README.md`
- root `AGENTS.md` as canonical agent instructions
- root `CLAUDE.md` that points to `AGENTS.md`
- root `GEMINI.md` that points to `AGENTS.md`
- curated skills in `.agents/skills/*/SKILL.md`

## hackctl.config.json Requirements

- Must be valid JSON and use this schema URL:
  - `https://hackctl.dev/schemas/hackctl.config.v1.json`
- Must include `name`, `template`, `services`, and `share`.
- `services` must be an ordered array with valid service definitions:
  - `name`, `cwd`, `run`, `port` (optional `envFile`)
- `share.defaultService` must point to an existing service.
- `share.defaultPort` must be valid and align with the intended public entrypoint.

## Runtime Requirements

- Service run commands must be npm based (`npm run ...`).
- Template must run on Node 20+ and npm 10+.
- Do not require pnpm, yarn, bun, or Docker for the default local path.

## Supabase Template Requirements

For templates that use Supabase:

- Include `supabase/config.toml` at the template root.
- Include tracked SQL migrations under `supabase/migrations/`.
- README must document the login/link/migration/push flow and reference the migration path.

## AI-Ready Template Requirements

- `AGENTS.md` is the single source of truth for agent workflow and project constraints.
- `CLAUDE.md` and `GEMINI.md` must stay thin pointer files that direct tools to `AGENTS.md`.
- Curated skills must be committed in `.agents/skills/*/SKILL.md`.
- Skill selection should be stack-aware (for example, `*-supabase` templates include at least one Supabase-focused skill).
- Skills should come from reputable, maintained sources and stay intentionally small.

## Networking and API Requirements

- Frontend API calls should use relative `/api/*` paths.
- Frontend development proxy target must be env driven, not hardcoded.
- Do not require `/api/health` for merge.

## Todo App Contract

- Templates must implement CRUD for a Todo entity.
- Todo entity contract:
  - `id`, `title`, `completed`, `createdAt`
- Shared API route contract:
  - `GET /api/todos`
  - `POST /api/todos`
  - `PUT /api/todos/:id`
  - `DELETE /api/todos/:id`
- Due dates are out of scope for the standardized Todo templates.

## UI and Styling Contract

- Tailwind CSS is required for all official templates.
- The Todo page layout and visual structure should remain consistent across templates.

## Security and Repository Hygiene

- Never commit secrets.
- Never commit generated dependency directories (for example `node_modules/`).
- Local testing artifacts are allowed only when ignored and untracked.

## Documentation Requirements

- README must include quick start steps.
- README must list service ports and basic run commands.
- README must explain env setup and API routing expectations.
- `.env.example` should include clear variable names and usable example values.

## PR Merge Checklist

Template PRs should confirm all of the following:

- [ ] Template meets every requirement in `TEMPLATE.md`.
- [ ] `hackctl.config.json` matches the schema URL and structure.
- [ ] `.gitignore` includes `.hackctl/`.
- [ ] Template includes `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` with `AGENTS.md` as source of truth.
- [ ] Template includes curated `.agents/skills/*/SKILL.md` entries; `*-supabase` templates include a Supabase-focused skill.
- [ ] Frontend `/api` routing and env-driven proxy behavior are in place.
- [ ] Supabase templates include `supabase/migrations` and a documented `db push` workflow.
- [ ] No secrets or generated artifacts are included in the diff.
- [ ] Template README and env examples are updated.
