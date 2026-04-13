# MERN Template

This template provides a beginner-friendly MERN starter with a React frontend, Express backend, and MongoDB via Mongoose.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express + Mongoose
- Database: MongoDB

## Ports

- Frontend: `3000`
- Backend: `5000`

Frontend requests should use `/api/*`. During development, Vite proxies `/api` to the backend.

## Quick Start

1. Copy `backend/.env.example` to `backend/.env`.
2. Optional: copy `frontend/.env.example` to `frontend/.env` if you need a non-default API proxy target.
3. Install dependencies:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
4. Start backend:
   - `cd backend && npm run dev`
5. Start frontend:
   - `cd frontend && npm run dev`

Runtime state written to `.hackctl/` is local-only and should stay untracked.

## Environment

- `backend/.env`
  - `MONGODB_URI`: local MongoDB connection string.
  - `PORT`: backend port (default `5000`).
- `frontend/.env` (optional)
  - `VITE_API_PROXY_TARGET`: Vite dev proxy target for `/api` (default `http://localhost:5000`).

## API Endpoints

- `GET /api/health`
- `GET /api/users`
- `POST /api/users`

Example request body for `POST /api/users`:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```
