import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const customId = getRouterParam(event, 'id')
  const supabase = await serverSupabaseClient(event)

  if (!customId) {
      throw createError({ statusCode: 400, message: 'Chat ID required' })
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', customId)
    .order('created_at', { ascending: true })

  if (error) {
    throw createError({
        statusCode: 500,
        message: 'Error fetching messages',
        data: error
    })
  }

  return messages.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.sender === 'client' ? 'client' : 'me',
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msg.type || 'text'
  }))
})
