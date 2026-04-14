import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "invalid todo id" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const updates = {};
  if (typeof body?.title !== "undefined") {
    const title = sanitizeTitle(body.title);
    if (!title) {
      return NextResponse.json({ error: "title must be a non-empty string" }, { status: 400 });
    }
    updates.title = title;
  }

  if (typeof body?.completed !== "undefined") {
    if (typeof body.completed !== "boolean") {
      return NextResponse.json({ error: "completed must be a boolean" }, { status: 400 });
    }
    updates.completed = body.completed;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no valid fields to update" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", id)
      .select("id, title, completed, created_at")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "todo not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ todo: serializeTodo(data) });
  } catch (error) {
    return NextResponse.json({ error: toMessage(error, "could not update todo") }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "invalid todo id" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "todo not found" }, { status: 404 });
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: toMessage(error, "could not delete todo") }, { status: 500 });
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
