# PERN Todo Template

This template provides a standardized Todo app using React + Vite frontend, Express backend, and PostgreSQL.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + PostgreSQL (`pg`)
- Database: PostgreSQL

## Ports

- Frontend: `3000`
- Backend: `5000`

Frontend requests use `/api/*`. During development, Vite proxies `/api` to the backend.

## Prerequisites

- Node.js `20+`
- npm `10+`
- PostgreSQL (local or hosted)

## Setup

1. Provision a PostgreSQL database.
   - Create a database named `hackctl_pern` (or any name you prefer).
   - Example local connection string: `postgres://postgres:postgres@127.0.0.1:5432/hackctl_pern`
2. Configure environment variables.
   - Copy `backend/.env.example` to `backend/.env`.
   - Set `DATABASE_URL` in `backend/.env`.
   - Optional: copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_PROXY_TARGET` if backend is not `http://localhost:5000`.
3. Install dependencies.
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Run the app.
   - From the project root: `hackctl start`
   - Or manually in two terminals:
     - `cd backend && npm run dev`
     - `cd frontend && npm run dev`

Runtime state written to `.hackctl/` is local-only and should stay untracked.

## Deploy

This template ships with:

- `deploy.runtime: pm2`
- `deploy.mode: dev`

Current remote deploy behavior:

- `hackctl deploy` uploads the current project to an Ubuntu or Debian VPS over SSH
- the frontend and backend both run with `npm run dev` under PM2
- the remote Cloudflare tunnel points at the frontend on port `3000`
- Vite continues proxying `/api` to the backend on port `5000`
- `.hackctl/deploy.json` stores the saved deploy target and key path locally for later `hackctl status` and `hackctl destroy` runs

## Environment

- `backend/.env`
  - `DATABASE_URL`: PostgreSQL connection string.
  - `PORT`: backend port (default `5000`).
- `frontend/.env` (optional)
  - `VITE_API_PROXY_TARGET`: Vite proxy target for `/api` (default `http://localhost:5000`).

## Database Notes

- No manual SQL migrations are required for initial setup.
- The backend creates the `todos` table automatically on startup if it does not exist.

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
