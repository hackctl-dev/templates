# Next Supabase Template Guide

This file is specific to the `next-supabase` template.

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
