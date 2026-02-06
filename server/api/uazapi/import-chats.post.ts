import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = await serverSupabaseClient(event)
  
  const uazapiUrl = process.env.UAZAPI_URL
  const adminToken = process.env.UAZAPI_TOKEN 
  const instanceName = process.env.UAZAPI_INSTANCE_NAME || 'crm-production'

  if (!uazapiUrl || !adminToken) {
    throw createError({ statusCode: 500, message: 'Server config missing' })
  }

  try {
     // 1. Recuperar o Token da Instância
     const initResponse: any = await $fetch(`${uazapiUrl}/instance/init`, {
        method: 'POST',
        headers: { 'admintoken': adminToken, 'Content-Type': 'application/json' },
        body: { name: instanceName, systemName: 'apilocal' }
     })
     
     const instanceToken = initResponse.token || initResponse.instance?.token || initResponse.hash?.token || initResponse.Auth?.token
     
     if (!instanceToken) {
         throw new Error('Não foi possível recuperar o token da instância para importar chats.')
     }

     // 2. Buscar chats da UAZAPI
     const chatsResponse: any = await $fetch(`${uazapiUrl}/chat/find`, {
         method: 'POST',
         headers: { 'token': instanceToken, 'Content-Type': 'application/json' },
         body: { limit: 50, offset: 0 }
     })

     const chats = Array.isArray(chatsResponse) ? chatsResponse : (chatsResponse.chats || [])

     // 3. Salvar no Supabase
     let importCount = 0
     for (const chat of chats) {
         // Mapear campos (ajuste conforme a resposta real da sua versão da UAZAPI)
         const phone = chat.id || chat.jid
         // Ignorar grupos ou status se necessário? Por enquanto importamos tudo.
         if (!phone) continue

         const name = chat.name || chat.pushName || chat.verifiedName || phone.split('@')[0]
         
         // Upsert no Supabase
         const { error } = await supabase.from('chats').upsert({
             contact_phone: phone,
             contact_name: name,
             status: 'open',
             channel: 'whatsapp',
             // Poderia salvar avatar, last_message_time etc se tiver colunas
         } as any, { onConflict: 'contact_phone' }) // Assumindo unique key no phone
         
         if (!error) importCount++
     }

     return { success: true, count: importCount }

  } catch (error: any) {
      console.error('Erro na importação de chats:', error)
      return { success: false, error: error.message || error }
  }
})
