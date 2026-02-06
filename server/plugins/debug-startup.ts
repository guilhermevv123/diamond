export default defineNitroPlugin((nitroApp) => {
  console.log('--- SERVER STARTUP DEBUG ---')
  console.log('Node Env:', process.env.NODE_ENV)
  console.log('Supabase URL Present:', !!process.env.SUPABASE_URL)
  console.log('Supabase Key Present:', !!process.env.SUPABASE_KEY)
  console.log('Pusher Key:', process.env.PUSHER_KEY ? 'Has Value' : 'Missing')
  console.log('Pusher App ID:', process.env.PUSHER_APP_ID ? 'Has Value' : 'Missing')
  
  const config = useRuntimeConfig()
  console.log('Runtime Config Supabase URL:', config.public?.supabase?.url)
  console.log('--- END DEBUG ---')
})
