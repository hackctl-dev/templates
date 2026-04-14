import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  const config = useRuntimeConfig();
  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishableKey;

  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: "supabase environment variables are required" });
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
