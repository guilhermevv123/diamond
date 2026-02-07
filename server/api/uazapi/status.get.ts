import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Usuário não autenticado' })
  }

  const instanceName = `user_${user.id.replace(/-/g, '')}`
  const uazapiUrl = process.env.UAZAPI_URL
  const adminToken = process.env.UAZAPI_TOKEN

  if (!uazapiUrl || !adminToken) {
    throw createError({ statusCode: 500, message: 'UAZAPI credentials missing' })
  }

  try {
      // 1. Get Token (via Init)
      const initResponse: any = await $fetch(`${uazapiUrl}/instance/init`, {
         method: 'POST',
         headers: { 'admintoken': adminToken, 'Content-Type': 'application/json' },
         body: { name: instanceName }
      })
      
      const instanceToken = initResponse.token || initResponse.instance?.token || initResponse.hash?.token || initResponse.Auth?.token
      
      if (!instanceToken) {
           // If we can't get a token, maybe it's not created yet
           return { status: 'disconnected' }
      }

      // 2. Check Status
      // Many UAZAPI versions return status directly in init, but let's be sure with explicit status call
      try {
          const statusResponse: any = await $fetch(`${uazapiUrl}/instance/status`, {
              headers: { 'token': instanceToken }
          })
          
          // UAZAPI often returns { instance: { state: 'open' } } or just { status: 'CONNECTED' }
          // Let's normalize
          const rawStatus = statusResponse.instance?.state || statusResponse.status || statusResponse.state || 'unknown'
          
          return { 
              status: rawStatus, // open, connecting, connected
              original: statusResponse 
          }
      } catch (statusErr) {
          return { status: 'error', error: statusErr }
      }

  } catch (error: any) {
      console.error('Status Check Failed:', error)
      return { status: 'error', message: error.message }
  }
})
