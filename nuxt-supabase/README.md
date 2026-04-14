# Nuxt + Supabase Todo Template

This template provides a standardized Todo app using Nuxt, Tailwind CSS, and Supabase.

## Stack

- Framework: Nuxt
- Styling: Tailwind CSS
- Data: Supabase Postgres (via server-side API routes)

## Port

- App: `3000`

The UI uses a shared API contract at `/api/todos`.

## Prerequisites

- Node.js `20+`
- npm `10+`
- A Supabase account and project

## Setup

1. Provision a Supabase project.
   - Create a new project in the Supabase dashboard.
   - Collect the following values from project settings:
     - Project ref (for CLI linking)
     - Project URL
     - Publishable key
2. Configure environment variables.
   - Copy `.env.example` to `.env`.
   - Set:
     - `SUPABASE_URL`
     - `SUPABASE_PUBLISHABLE_KEY`
3. Install dependencies and run the app.
   - `npm install`
   - `npm run dev`
4. Apply schema migrations to Supabase.

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Runtime state written to `.hackctl/` is local-only and should stay untracked.

## Supabase Migration Workflow

- This template keeps schema migrations in `supabase/migrations/`.
- Initial migration file: `supabase/migrations/20260414000000_create_todos.sql`.
- `npx supabase db push` applies migrations from `supabase/migrations` to the linked project.

Preview pending migrations without applying:

```bash
npx supabase db push --dry-run
```

Create and apply a new migration:

```bash
npx supabase migration new add_todo_notes
# edit supabase/migrations/<timestamp>_add_todo_notes.sql
npx supabase db push
```

## Environment

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.

## API Contract

- `GET /api/todos`
  - response: `{ "todos": [{ "id", "title", "completed", "createdAt" }] }`
- `POST /api/todos`
  - body: `{ "title": "Write docs" }`
  - response: `{ "todo": { ... } }`
- `PUT /api/todos/:id`
  - body: `{ "title": "Updated" }` or `{ "completed": true }`
  - response: `{ "todo": { ... } }`
- `DELETE /api/todos/:id`
  - response: `{ "success": true }`
