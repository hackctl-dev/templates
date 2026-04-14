import { createSupabaseClient } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "invalid todo id" });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw createError({ statusCode: 404, statusMessage: "todo not found" });
    }
    throw createError({ statusCode: 500, statusMessage: error.message || "could not delete todo" });
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "todo not found" });
  }

  return { success: true };
});
