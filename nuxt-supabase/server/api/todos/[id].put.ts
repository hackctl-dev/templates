import { createSupabaseClient } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "invalid todo id" });
  }

  const body = await readBody<{ title?: string; completed?: boolean }>(event);
  const updates: { title?: string; completed?: boolean } = {};

  if (typeof body?.title !== "undefined") {
    const title = sanitizeTitle(body.title);
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: "title must be a non-empty string" });
    }
    updates.title = title;
  }

  if (typeof body?.completed !== "undefined") {
    if (typeof body.completed !== "boolean") {
      throw createError({ statusCode: 400, statusMessage: "completed must be a boolean" });
    }
    updates.completed = body.completed;
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: "no valid fields to update" });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select("id, title, completed, created_at")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw createError({ statusCode: 404, statusMessage: "todo not found" });
    }
    throw createError({ statusCode: 500, statusMessage: error.message || "could not update todo" });
  }

  return {
    todo: serializeTodo(data),
  };
});

function sanitizeTitle(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 140);
}

function serializeTodo(row: { id: string | number; title: string; completed: boolean; created_at: string }) {
  return {
    id: String(row.id),
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}
