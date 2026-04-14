import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Todo } from "../models/Todo.js";

const router = Router();

router.get("/", async (_req, res) => {
  const todos = await Todo.find({}).sort({ createdAt: -1 }).lean();
  return res.json({ todos: todos.map(serializeTodo) });
});

router.post("/", async (req, res) => {
  const title = sanitizeTitle(req.body?.title);
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const todo = await Todo.create({ title, completed: false });
  return res.status(201).json({ todo: serializeTodo(todo) });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "invalid todo id" });
  }

  const updates = {};
  if (typeof req.body?.title !== "undefined") {
    const title = sanitizeTitle(req.body.title);
    if (!title) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    updates.title = title;
  }
  if (typeof req.body?.completed !== "undefined") {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean" });
    }
    updates.completed = req.body.completed;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "no valid fields to update" });
  }

  const todo = await Todo.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  return res.json({ todo: serializeTodo(todo) });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "invalid todo id" });
  }

  const todo = await Todo.findByIdAndDelete(id).lean();
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  return res.json({ success: true });
});

function sanitizeTitle(value) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();
  return normalized.slice(0, 140);
}

function serializeTodo(todo) {
  return {
    id: String(todo._id),
    title: todo.title,
    completed: Boolean(todo.completed),
    createdAt: todo.createdAt,
  };
}

export default router;
