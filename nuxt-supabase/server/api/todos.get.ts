import { createSupabaseClient } from "../utils/supabase";

export default defineEventHandler(async () => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .select("id, title, completed, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "could not load todos" });
  }

  return {
    todos: (data || []).map(serializeTodo),
  };
});

function serializeTodo(row: { id: string | number; title: string; completed: boolean; created_at: string }) {
  return {
    id: String(row.id),
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}
