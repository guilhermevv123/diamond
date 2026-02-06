import { pusher } from '../../utils/pusher'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient(event)

  console.log('Webhook UAZAPI recebido:', JSON.stringify(body, null, 2))

  // Estrutura comum do Baileys/UAZAPI
  // body.data.message ou body.message
  // key: { remoteJid: '...', fromMe: boolean }
  
  const msgData = body.data || body
  const key = msgData.key || {}
  const isFromMe = key.fromMe === true

  // O "contato" da conversa é o remoteJid (quem está do outro lado)
  // Se for grupo, remoteJid é o ID do grupo.
  const remoteJid = key.remoteJid || msgData.from || msgData.to
  
  // Limpar o número (remover @s.whatsapp.net)
  const contactPhone = remoteJid ? remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') : 'desconhecido'
  
  // Tentar extrair o texto de várias formas possíveis
  const messageContent = 
    msgData.message?.conversation || 
    msgData.message?.extendedTextMessage?.text || 
    msgData.content || 
    msgData.text?.body || 
    (msgData.message?.imageMessage ? 'Imagem' : 'Mensagem sem texto')

  const senderName = msgData.pushName || (isFromMe ? 'Eu' : 'Cliente')

  const messagePayload = {
     content: messageContent,
     from: contactPhone,
     senderName: senderName,
     timestamp: new Date().toISOString(),
     isFromMe: isFromMe
  }

  // 1. Salvar no Supabase
  // Verifica se já existe um ticket/chat para este número
  const { data: chat } = await supabase
    .from('chats')
    .select('id')
    .eq('contact_phone', contactPhone)
    .single()
  
  let chatId = chat?.id

  // Se não existir, cria um novo chat
  if (!chatId) {
     const { data: newChat } = await supabase.from('chats').insert({ 
         contact_phone: contactPhone,
         contact_name: senderName !== 'Eu' ? senderName : contactPhone,
         status: 'open',
         channel: 'whatsapp'
     }).select().single()
     
     if (newChat) chatId = newChat.id
  }

  if (chatId) {
      // Salva a mensagem
      const { error } = await supabase.from('messages').insert({
          chat_id: chatId,
          content: messagePayload.content,
          sender: isFromMe ? 'me' : 'client',
          type: 'text', 
          created_at: new Date().toISOString()
      })

      if (error) console.error('Erro ao salvar mensagem no Supabase:', error)
      
      // 2. Disparar Pusher com o ID real do chat
      await pusher.trigger(`chat-${chatId}`, 'new-message', {
          ...messagePayload,
          sender: isFromMe ? 'me' : 'client'
      })
  }

  return { success: true }
})
