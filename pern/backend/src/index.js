import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Pool } from "pg";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

app.get("/api/todos", async (_req, res) => {
  const result = await pool.query(
    "select id, title, completed, created_at from todos order by created_at desc"
  );
  return res.json({ todos: result.rows.map(serializeTodo) });
});

app.post("/api/todos", async (req, res) => {
  const title = sanitizeTitle(req.body?.title);
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const result = await pool.query(
    "insert into todos (title, completed) values ($1, false) returning id, title, completed, created_at",
    [title]
  );
  return res.status(201).json({ todo: serializeTodo(result.rows[0]) });
});

app.put("/api/todos/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "invalid todo id" });
  }

  const existingResult = await pool.query(
    "select id, title, completed, created_at from todos where id = $1",
    [id]
  );

  if (existingResult.rowCount === 0) {
    return res.status(404).json({ error: "todo not found" });
  }

  const existing = existingResult.rows[0];

  let nextTitle = existing.title;
  if (typeof req.body?.title !== "undefined") {
    nextTitle = sanitizeTitle(req.body.title);
    if (!nextTitle) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
  }

  let nextCompleted = existing.completed;
  if (typeof req.body?.completed !== "undefined") {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean" });
    }
    nextCompleted = req.body.completed;
  }

  if (nextTitle === existing.title && nextCompleted === existing.completed) {
    return res.status(400).json({ error: "no valid fields to update" });
  }

  const result = await pool.query(
    "update todos set title = $2, completed = $3 where id = $1 returning id, title, completed, created_at",
    [id, nextTitle, nextCompleted]
  );

  return res.json({ todo: serializeTodo(result.rows[0]) });
});

app.delete("/api/todos/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "invalid todo id" });
  }

  const result = await pool.query("delete from todos where id = $1 returning id", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "todo not found" });
  }

  return res.json({ success: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ error: "internal server error" });
});

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  await pool.query(`
    create table if not exists todos (
      id serial primary key,
      title text not null,
      completed boolean not null default false,
      created_at timestamptz not null default now()
    )
  `);

  app.listen(port, () => {
    console.log(`[backend] listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("[backend] startup failed", error);
  process.exit(1);
});

function sanitizeTitle(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 140);
}

function serializeTodo(todo) {
  return {
    id: String(todo.id),
    title: todo.title,
    completed: Boolean(todo.completed),
    createdAt: todo.created_at,
  };
}
