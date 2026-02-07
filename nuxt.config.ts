// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    pusherAppId: process.env.PUSHER_APP_ID,
    pusherSecret: process.env.PUSHER_SECRET,
    public: {
      pusherKey: process.env.PUSHER_KEY,
      pusherCluster: process.env.PUSHER_CLUSTER,
    }
  }
})