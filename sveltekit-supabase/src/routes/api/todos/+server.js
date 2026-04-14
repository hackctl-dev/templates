import { json } from "@sveltejs/kit";
import { createSupabaseClient } from "$lib/supabaseClient";

export async function GET() {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, completed, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return json({ todos: (data || []).map(serializeTodo) });
  } catch (error) {
    return json({ error: toMessage(error, "could not load todos") }, { status: 500 });
  }
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const title = sanitizeTitle(body?.title);
  if (!title) {
    return json({ error: "title is required" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("todos")
      .insert({ title, completed: false })
      .select("id, title, completed, created_at")
      .single();

    if (error) {
      throw error;
    }

    return json({ todo: serializeTodo(data) }, { status: 201 });
  } catch (error) {
    return json({ error: toMessage(error, "could not create todo") }, { status: 500 });
  }
}

function sanitizeTitle(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 140);
}

function serializeTodo(row) {
  return {
    id: String(row.id),
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}

function toMessage(error, fallback) {
  if (error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
