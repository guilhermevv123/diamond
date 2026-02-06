export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  
  return {
    environmentCheck: {
      hasSupabaseUrlEnv: !!process.env.SUPABASE_URL,
      hasSupabaseKeyEnv: !!process.env.SUPABASE_KEY,
      hasSupabaseUrlRuntime: !!config.public?.supabase?.url, // Checks if module populated it
      
      // Check other vars just in case
      hasUazapiUrl: !!process.env.UAZAPI_URL,
      hasPusherKey: !!process.env.PUSHER_KEY,
    },
    // Safe to show non-secret values for debugging if needed, but booleans are safer
    nodeEnv: process.env.NODE_ENV
  }
})
