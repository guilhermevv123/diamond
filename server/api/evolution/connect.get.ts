import { getAuthenticatedUser } from '../../utils/auth'
import { createInstance, fetchInstance } from '../../utils/evolution'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const instanceName = `user_${user.id}`
  const config = useRuntimeConfig()
  const webhookUrl = `${config.public.siteUrl}/api/webhooks/whatsapp`

  try {
      // 1. Tentar conectar (pegar QR)
      const connectData: any = await fetchInstance(instanceName)
      return connectData

  } catch (e: any) {
      // 2. Se falhar (provavelmente 404), criar instância
      if (e.statusCode === 404 || e.data?.error?.includes('not found')) {
          console.log(`Instância ${instanceName} não encontrada. Criando...`)
          const created = await createInstance(instanceName, webhookUrl)
          return created
      }
      
      throw e
  }
})
