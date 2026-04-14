import { createSupabaseClient } from "../utils/supabase";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event);
  const title = sanitizeTitle(body?.title);
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "title is required" });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .insert({ title, completed: false })
    .select("id, title, completed, created_at")
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "could not create todo" });
  }

  setResponseStatus(event, 201);
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
