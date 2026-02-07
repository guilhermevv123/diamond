import { serverSupabaseClient } from '#supabase/server'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  
  const supabase = await serverSupabaseClient(event)

  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
      console.error('Chats API Error:', error)
  } else {
      console.log(`Chats API: Retornando ${chats?.length || 0} chats.`)
  }

  if (error) {
    throw createError({
        statusCode: 500,
        message: 'Error fetching chats',
        data: error
    })
  }

  // Format data for frontend if necessary, or return as is
  return chats.map(chat => ({
      id: chat.id,
      name: chat.contact_name || chat.contact_phone,
      phone: chat.contact_phone,
      channel: chat.channel || 'WhatsApp',
      status: chat.status,
      // Mock fields for UI compatibility until real data is available
      avatar: (chat.contact_name || chat.contact_phone || '??').substring(0,2).toUpperCase(),
      time: new Date(chat.created_at).toLocaleDateString(),
      unread: 0, 
      lastMsg: 'Nova conversa iniciada',
      mode: 'human'
  }))
})
