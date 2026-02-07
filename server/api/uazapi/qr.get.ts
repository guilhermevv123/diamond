import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
const user = await serverSupabaseUser(event)
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Usuário não autenticado' })
  }

  // Nome da instância baseado no ID do usuário (ex: user_12345)
  // Removemos hífens para garantir compatibilidade com nomes de instância
  const instanceName = `user_${user.id.replace(/-/g, '')}`
  
  const uazapiUrl = process.env.UAZAPI_URL
  const adminToken = process.env.UAZAPI_TOKEN

  if (!uazapiUrl || !adminToken) {
    throw createError({
        statusCode: 500,
        message: 'UAZAPI credentials not configured on server.'
    })
  }

  // Helper to standardise error handling
  const handleError = (stage: string, err: any) => {
      console.error(`Error during ${stage}:`, err.data || err)
      return { 
        error: `Failed to ${stage}`, 
        details: err.data || err.message || err,
        stage
      }
  }

  try {
     let instanceToken = ''

     // STEP 1: Garantir que a instância existe e pegar o Token dela (INIT)
     try {
         const initResponse: any = await $fetch(`${uazapiUrl}/instance/init`, {
            method: 'POST',
            headers: {
                'admintoken': adminToken,
                'Content-Type': 'application/json'
            },
            body: {
                name: instanceName,
                systemName: 'apilocal'
            }
         })
         
         // Tenta extrair o token de vários lugares possíveis
         instanceToken = initResponse.token || initResponse.instance?.token || initResponse.hash?.token || initResponse.Auth?.token
         
         if (!instanceToken) {
             throw new Error('Instância iniciada mas nenhum token retornado.')
         }
         console.log('Step 1 (Init) Success. Token acquired.')

     } catch (initErr: any) {
         // Se der erro de "Já existe" (conflito), tentamos conectar assumindo que o adminToken serve, 
         // ou falhamos pedindo para o usuário verificar. 
         // Mas na UAZAPI, geralmente Init retorna os dados mesmo se já existe.
         
         // Se o erro for 401/403 aqui, é o Admin Token errado.
         if (initErr.response?.status === 401 || initErr.response?.status === 403) {
             return handleError('Init Instance', 'Admin Token Inválido. Verifique o UAZAPI_TOKEN no .env')
         }
         
         // Se falhou o init, retornamos o erro para debug
         return handleError('Init Instance', initErr)
     }

     // STEP 2: Conectar usando o token específico da instância (CONNECT)
     try {
         // Docs dizem POST em /instance/connect com header 'token'
         const connectResponse: any = await $fetch(`${uazapiUrl}/instance/connect`, {
             method: 'POST',
             headers: {
                 'token': instanceToken,
                 'Content-Type': 'application/json'
             }
         })
         return connectResponse

     } catch (connectErr: any) {
         // Fallbacks para variações de API
         
         // 1. Tentar com nome na URL (POST)
         try {
            console.log('Tentando Connect com nome na URL...')
            return await $fetch(`${uazapiUrl}/instance/connect/${instanceName}`, {
                method: 'POST',
                headers: { 'token': instanceToken }
            })
         } catch (e1) {}

         // 2. Tentar GET (como último recurso)
         try {
            console.log('Tentando Connect via GET...')
            return await $fetch(`${uazapiUrl}/instance/connect/${instanceName}`, {
                method: 'GET',
                headers: { 'token': instanceToken }
            })
         } catch (e2) {}

         return handleError('Connect Instance', connectErr)
     }

  } catch (error: any) {
    return handleError('Process Request', error)
  }
})
