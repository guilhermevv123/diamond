
const EVOLUTION_URL = process.env.EVOLUTION_API_URL
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY

export const evolutionFetch = async (endpoint: string, options: any = {}) => {
  const headers = {
    'apikey': EVOLUTION_KEY,
    'Content-Type': 'application/json',
    ...options.headers
  }

  try {
    const response = await $fetch(`${EVOLUTION_URL}${endpoint}`, {
      ...options,
      headers
    })
    return response
  } catch (error: any) {
    console.error(`Evolution API Error (${endpoint}):`, error.data || error.message)
    throw error
  }
}

export const createInstance = async (instanceName: string, webhookUrl: string) => {
  try {
    // Evolution v2 Instance Creation
    return await evolutionFetch('/instance/create', {
        method: 'POST',
        body: {
            instanceName,
            token: instanceName, // Usando o mesmo nome como token da instância
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS', // Padrão v2
            webhook: webhookUrl,
            events: [
                "QRCODE_UPDATED",
                "MESSAGES_UPSERT",
                "MESSAGES_UPDATE",
                "MESSAGES_DELETE",
                "SEND_MESSAGE",
                "CONNECTION_UPDATE",
                "TYPEBOT_START",
                "TYPEBOT_CHANGE_STATUS"
            ]
        }
    })
  } catch (e: any) {
      if (e.data?.error === 'Instance already exists') {
          return await fetchInstance(instanceName)
      }
      throw e
  }
}

export const fetchInstance = async (instanceName: string) => {
    // Tenta buscar info da instância (em v2 geralmente é /instance/fetchInstances ou connect)
    // Para simplificar, vamos tentar conectar/ver status
    return await evolutionFetch(`/instance/connect/${instanceName}`, { method: 'GET' })
}

export const getInstanceStatus = async (instanceName: string) => {
    return await evolutionFetch(`/instance/connectionState/${instanceName}`, { method: 'GET' })
}
