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

1. Copy `.env.example` to `.env` in `backend/`.
2. Install dependencies:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Start backend:
   - `cd backend && npm run dev`
4. Start frontend:
   - `cd frontend && npm run dev`

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
