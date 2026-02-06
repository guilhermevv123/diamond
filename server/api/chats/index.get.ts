import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false })

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
