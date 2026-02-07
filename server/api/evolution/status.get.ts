import { getAuthenticatedUser } from '../../utils/auth'
import { getInstanceStatus } from '../../utils/evolution'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const instanceName = `user_${user.id}`

  try {
      const status = await getInstanceStatus(instanceName)
      return status // Retorna objeto com state: 'open' | 'connecting' | 'close'
  } catch (e: any) {
      return { instance: { state: 'close' }, error: e.message }
  }
})
