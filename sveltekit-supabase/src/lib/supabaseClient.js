import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";

export function createSupabaseClient() {
  const url = env.PUBLIC_SUPABASE_URL;
  const publishableKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("supabase environment variables are required");
  }

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
