export default defineNuxtConfig({
  compatibilityDate: "2026-04-14",
  modules: ["@nuxtjs/tailwindcss"],
  experimental: {
    serverAppConfig: false,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
  devtools: {
    enabled: false,
  },
});
