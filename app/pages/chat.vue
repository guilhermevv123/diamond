<template>
  <div class="h-[calc(100vh-theme('spacing.32'))] flex overflow-hidden bg-[#f0f9ff] dark:bg-navy-950 relative rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm mx-auto max-w-full">
    <!-- 1. Lista de Conversas (Esquerda) -->
    <div class="w-80 flex flex-col border-r border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shrink-0 z-20">
      <div class="p-4 border-b border-slate-100 dark:border-navy-800 space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-black text-navy-900 dark:text-white">Conversas</h3>
          <div class="flex gap-1">
            <button @click="showQRCode = true" class="text-slate-400 hover:text-navy-900 dark:hover:text-white p-1 rounded transition-colors" title="Conectar WhatsApp">
              <span class="material-symbols-outlined">qr_code_scanner</span>
            </button>
            <button class="text-primary hover:bg-primary/10 p-1 rounded transition-colors"><span class="material-symbols-outlined">add_comment</span></button>
          </div>
        </div>
        
        <!-- Filtros -->
        <div>
          <select 
            v-model="filterUser" 
            class="w-full px-3 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-100 outline-none focus:border-primary transition-colors"
          >
            <option value="Todos">Todos os Chats</option>
            <option value="Meus">Meus Chats</option>
            <option v-for="u in users" :key="u.id" :value="u.name">{{ u.name }}</option>
          </select>
        </div>

        <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">search</span>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Buscar..." 
            class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-800 border-none rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <button
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="selectedChatId = chat.id"
          class="w-full flex items-center gap-3 p-4 transition-all border-l-4"
          :class="selectedChatId === chat.id 
            ? 'bg-primary/5 dark:bg-primary/10 border-primary' 
            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-navy-800'"
        >
          <div class="relative">
            <div class="size-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm" 
              :class="selectedChatId === chat.id ? 'bg-primary text-white shadow-primary/30' : 'bg-slate-100 dark:bg-navy-700 text-slate-500 dark:text-slate-300'">
              {{ chat.avatar }}
            </div>
            <span class="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-navy-900 flex items-center justify-center text-[10px] shadow-sm"
              :class="chat.channel === 'WhatsApp' ? 'bg-[#25D366] text-white' : chat.channel === 'Email' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'">
              <span class="material-symbols-outlined text-[10px]">
                {{ chat.channel === 'WhatsApp' ? 'chat' : chat.channel === 'Email' ? 'mail' : 'photo_camera' }}
              </span>
            </span>
            <!-- Indicador de IA -->
            <span v-if="chat.mode === 'ia'" class="absolute -top-1 -right-1 size-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm z-10" title="IA Ativa">
              <span class="material-symbols-outlined text-[10px]">smart_toy</span>
            </span>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <div class="flex justify-between items-center mb-1">
              <p class="text-sm font-black truncate" :class="selectedChatId === chat.id ? 'text-primary' : 'text-navy-900 dark:text-slate-100'">{{ chat.name }}</p>
              <span class="text-[10px] text-slate-400 font-bold">{{ chat.time }}</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate font-medium flex items-center gap-1">
              <span v-if="chat.mode === 'ia'" class="text-purple-500 font-bold text-[10px]">[IA]</span>
              {{ chat.lastMsg }}
            </p>
          </div>
          <span v-if="chat.unread > 0" class="size-2 bg-primary rounded-full shadow-[0_0_10px_#00b4d8]"></span>
        </button>
      </div>
    </div>

    <!-- 2. Área Central - Chat -->
    <div v-if="activeChat" class="flex-1 min-w-0 flex flex-col relative z-10 transition-all duration-300">
      <!-- Header -->
      <div class="h-16 px-6 border-b border-slate-200 dark:border-navy-800 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3 cursor-pointer" @click="linkedLead && (isLeadModalOpen = true)">
          <div class="size-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-xs text-white shadow-lg shadow-primary/20">
            {{ activeChat.avatar }}
          </div>
          <div>
            <p class="text-sm font-black text-navy-900 dark:text-white hover:text-primary transition-colors flex items-center gap-2">
              {{ activeChat.name }}
              <span class="material-symbols-outlined text-xs text-primary filled">verified</span>
            </p>
            <p class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <span class="size-1.5 rounded-full bg-[#25D366]"></span>
              Online no {{ activeChat.channel }}
            </p>
          </div>
        </div>
        
        <!-- Switch de IA -->
        <div class="bg-slate-100 dark:bg-navy-800 p-1 rounded-xl flex items-center gap-1">
          <button 
            @click="toggleChatMode('ia')"
            class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2"
            :class="activeChat.mode === 'ia' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' : 'text-slate-500 hover:text-purple-600'"
          >
            <span class="material-symbols-outlined text-base">smart_toy</span>
            Modo IA
          </button>
          <button 
            @click="toggleChatMode('human')"
            class="px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2"
            :class="activeChat.mode === 'human' ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-navy-900'"
          >
            <span class="material-symbols-outlined text-base">person</span>
            Atendente
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="isQuickPanelOpen = !isQuickPanelOpen"
            class="p-2 rounded-xl transition-all"
            :class="isQuickPanelOpen ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-navy-800 text-slate-400 hover:text-primary'"
            :title="isQuickPanelOpen ? 'Recolher Painel' : 'Expandir Painel'"
          >
            <span class="material-symbols-outlined">{{ isQuickPanelOpen ? 'dock_to_right' : 'splitscreen_right' }}</span>
          </button>
          <div class="h-6 w-px bg-slate-200 dark:bg-navy-700 mx-2"></div>
          <button class="p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl text-slate-400 dark:text-slate-300 transition-colors">
            <span class="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      <!-- Mensagens -->
      <div id="messages-container" class="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#efe7dd] dark:bg-navy-950 relative">
        <div class="absolute inset-0 opacity-[0.06] dark:opacity-[0.02] pointer-events-none" style="background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-size: 400px;"></div>

        <div v-for="msg in activeChat.messages" :key="msg.id" class="flex flex-col relative z-10" :class="msg.sender === 'me' ? 'items-end' : msg.sender === 'note' ? 'items-center' : 'items-start'">
          <div v-if="msg.sender === 'note'" class="max-w-[80%] px-4 py-2 bg-yellow-100/80 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 rounded-lg mb-2 flex items-center gap-2 backdrop-blur-sm shadow-sm">
            <span class="material-symbols-outlined text-sm">lock</span>
            <div class="text-xs font-bold italic">{{ msg.text }}</div>
          </div>
          <div v-else class="flex flex-col" :class="msg.sender === 'me' ? 'items-end' : 'items-start'">
            <span v-if="msg.sender === 'me'" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 mr-1">Wellington Santos</span>
            
            <div class="max-w-[85%] p-3 rounded-lg shadow-sm border relative" 
              :class="msg.sender === 'me' ? 'bg-[#d9fdd3] dark:bg-primary/20 text-navy-900 dark:text-white border-transparent rounded-tr-none' : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-white border-transparent rounded-tl-none'">
                
                <p v-if="msg.type === 'text'" class="text-sm font-medium leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>

                <div v-if="msg.type === 'audio'" class="flex items-center gap-3 min-w-[200px]">
                  <button class="size-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 transition-colors text-slate-600 dark:text-white">
                    <span class="material-symbols-outlined text-lg filled">play_arrow</span>
                  </button>
                  <div class="flex-1 space-y-1">
                    <div class="h-1 bg-slate-300 dark:bg-white/10 rounded-full w-full relative overflow-hidden">
                      <div class="absolute left-0 top-0 h-full w-1/3 bg-slate-500 dark:bg-white/50 rounded-full"></div>
                    </div>
                    <div class="flex justify-between text-[9px] font-bold opacity-60">
                      <span>0:12</span><span>0:35</span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end items-center gap-1 mt-1">
                  <span class="text-[10px]" :class="msg.sender === 'me' ? 'text-slate-500' : 'text-slate-400'">{{ msg.time }}</span>
                  <span v-if="msg.sender === 'me'" class="material-symbols-outlined text-[14px] text-blue-500">done_all</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Chat -->
      <div class="p-4 bg-[#f0f2f5] dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 relative z-20">
        <div class="max-w-4xl mx-auto space-y-2">
           <div class="flex items-center gap-2 px-2">
            <label class="flex items-center gap-2 cursor-pointer group">
               <div class="w-8 h-4 rounded-full p-0.5 transition-colors" :class="isInternalNote ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-navy-700'">
                 <div class="w-3 h-3 bg-white rounded-full shadow-sm transition-transform" :class="isInternalNote ? 'translate-x-4' : 'translate-x-0'"></div>
               </div>
               <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600" :class="{'text-yellow-600': isInternalNote}">Nota Interna</span>
            </label>
             <input type="checkbox" class="hidden" v-model="isInternalNote" />
           </div>

          <div class="relative rounded-lg border transition-all flex items-center bg-white dark:bg-navy-800" 
            :class="isInternalNote ? 'border-yellow-300 ring-2 ring-yellow-100 dark:ring-yellow-900/20' : 'border-slate-200 dark:border-navy-700'">
            <button class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-symbols-outlined">sentiment_satisfied</span></button>
            <button class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-symbols-outlined">attach_file</span></button>
            <input 
              type="text" 
              v-model="inputText"
              @keydown.enter="sendMessage(inputText)"
              :placeholder="isInternalNote ? 'Adicionar observação interna...' : 'Digite uma mensagem'"
              class="flex-1 py-3 bg-transparent border-none outline-none font-medium text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button 
              v-if="inputText"
              @click="sendMessage(inputText)"
              class="mr-2 p-2 rounded-lg flex items-center justify-center transition-all shadow-sm"
              :class="isInternalNote ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-slate-500 hover:text-primary'"
            >
              <span class="material-symbols-outlined">send</span>
            </button>
            <button v-else class="mr-2 p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors">
              <span class="material-symbols-outlined">mic</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center bg-[#f0f9ff] dark:bg-navy-950 text-slate-400 relative z-10 text-center p-8">
      <div class="size-24 bg-white dark:bg-navy-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/10 mb-6 animate-pulse">
        <span class="material-symbols-outlined text-6xl text-primary">diamond</span>
      </div>
      <p class="text-xl font-black text-navy-900 dark:text-white">DIAMOND CRM</p>
      <p class="text-sm font-medium mt-1">Selecione uma conversa para começar</p>
    </div>

    <!-- 3. Painel Lateral -->
    <div 
      class="bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-800 flex flex-col transition-all duration-300 ease-in-out z-20 shrink-0"
      :class="isQuickPanelOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-l-0'"
    >
      <div class="p-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 flex flex-col gap-4 min-w-[320px]">
         <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">bolt</span>
                <h3 class="text-sm font-black text-navy-900 dark:text-white uppercase tracking-wider">Ações</h3>
            </div>
            <button @click="isQuickPanelOpen = false" class="text-slate-400 hover:text-red-500">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="flex p-1 bg-slate-100 dark:bg-navy-800 rounded-lg">
           <button @click="rightPanelTab = 'monvoice'" class="flex-1 py-1.5 text-[10px] font-black uppercase rounded-md transition-all" :class="rightPanelTab === 'monvoice' ? 'bg-purple-600 text-white shadow' : 'text-slate-500'">Mon Voice IA</button>
           <button @click="rightPanelTab = 'templates'" class="flex-1 py-1.5 text-[10px] font-black uppercase rounded-md transition-all" :class="rightPanelTab === 'templates' ? 'bg-white dark:bg-navy-700 text-primary shadow' : 'text-slate-500'">Templates</button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar min-w-[320px]">
         <!-- MON VOICE TAB -->
         <div v-if="rightPanelTab === 'monvoice'" class="p-4 space-y-6">
            <div v-if="activeChat" class="p-4 rounded-xl border" :class="activeChat.mode === 'ia' ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status da Sessão</p>
                <div class="flex items-center gap-3">
                    <div class="size-3 rounded-full" :class="activeChat.mode === 'ia' ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'"></div>
                    <span class="text-sm font-bold text-navy-900 dark:text-white">{{ activeChat.mode === 'ia' ? 'IA Controlando' : 'Controle Manual' }}</span>
                </div>
            </div>

            <div>
               <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Agentes Disponíveis</p>
               <div class="space-y-2">
                  <button v-for="agent in mockAiAgents" :key="agent.id" @click="setChatAgent(agent.id)" class="w-full flex items-center justify-between p-3 rounded-xl border transition-all" :class="activeChat?.activeAgentId === agent.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 hover:bg-slate-50'">
                      <div class="flex items-center gap-3">
                          <div class="size-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><span class="material-symbols-outlined text-sm">smart_toy</span></div>
                          <div class="text-left"><p class="text-xs font-black text-navy-900 dark:text-white">{{ agent.name }}</p><p class="text-[9px] text-slate-500 font-bold">{{ agent.role }}</p></div>
                      </div>
                      <span v-if="activeChat?.activeAgentId === agent.id" class="material-symbols-outlined text-purple-500 text-sm">check_circle</span>
                  </button>
               </div>
            </div>
         </div>

         <!-- TEMPLATES TAB -->
         <div v-else class="p-4 space-y-3">
            <div class="p-2 flex gap-2 overflow-x-auto custom-scrollbar border-b border-slate-100 dark:border-navy-800 mb-4">
              <button v-for="f in folders" :key="f" @click="activeFolder = f" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors" :class="activeFolder === f ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400'">{{ f }}</button>
            </div>
            <button v-for="t in filteredTemplates" :key="t.id" @click="sendMessage(t.content, t.type)" class="w-full text-left bg-slate-50 dark:bg-navy-800 hover:bg-white dark:hover:bg-navy-700 p-3 rounded-xl border border-slate-100 dark:border-navy-700 hover:border-primary/30 transition-all group">
                <div class="flex justify-between items-center mb-1">
                    <p class="text-xs font-black text-navy-900 dark:text-white group-hover:text-primary transition-colors">{{ t.title }}</p>
                    <span class="material-symbols-outlined text-sm text-slate-400">{{ t.type === 'text' ? 'chat_bubble' : t.type === 'audio' ? 'mic' : 'videocam' }}</span>
                </div>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{{ t.content }}</p>
            </button>
         </div>
      </div>
    </div>

    <!-- Modals -->
    <LeadModal v-if="linkedLead && isLeadModalOpen" :lead="linkedLead" @close="isLeadModalOpen = false" initial-mode="preview" />
    <QRCodeModal v-if="showQRCode" @close="showQRCode = false" instance-name="crm-diamond" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useMockData } from '~/composables/useMockData'
import { useApp } from '~/composables/useApp'
import { usePusher } from '~/composables/usePusher'

import QRCodeModal from '~/components/QRCodeModal.vue'

definePageMeta({
  layout: 'default'
})

const { users, leads } = useApp()
const { mockQuickTemplates, mockAiAgents } = useMockData()
const { pusher } = usePusher()

// --- State ---
const showQRCode = ref(false)
const selectedChatId = ref<string | null>(null)
const filterUser = ref('Todos')
const searchQuery = ref('')
const isQuickPanelOpen = ref(true)
const rightPanelTab = ref('monvoice')
const isLeadModalOpen = ref(false)
const inputText = ref('')
const isInternalNote = ref(false)
const activeFolder = ref('Todos')
const isLoadingMessages = ref(false)

// --- Real Data State ---
const chats = ref<any[]>([])

// Fetch Chats on Mount
const refreshChats = async () => {
  try {
    const data = await $fetch('/api/chats')
    chats.value = data.map((c: any) => ({
      ...c,
      messages: [] // Initialize empty messages array
    }))

    // --- AUTO IMPORT ---
    // Se a lista estiver vazia, tenta importar do WhatsApp automaticamente
    if (chats.value.length === 0) {
        console.log('Lista vazia. Iniciando importação automática...')
        try {
            const importResult: any = await $fetch('/api/uazapi/import-chats', { method: 'POST' })
            if (importResult.success && importResult.count > 0) {
                console.log(`Importados ${importResult.count} chats. Atualizando...`)
                // Chama refresh de novo para mostrar os novos chats
                const newData = await $fetch('/api/chats')
                chats.value = newData.map((c: any) => ({ ...c, messages: [] }))
            } else {
                console.log('Importação finalizada sem novos chats.', importResult)
            }
        } catch (importErr) {
            console.error('Erro na importação automática:', importErr)
        }
    }

  } catch (error) {
    console.error('Erro ao carregar chats:', error)
  }
}

onMounted(() => {
  refreshChats()
  
  // Refresh a cada 30s para garantir (polling simples além do pusher)
  setInterval(refreshChats, 30000)
})

// --- Computed ---
const activeChat = computed(() => chats.value.find(c => c.id === selectedChatId.value))
const linkedLead = computed(() => activeChat.value ? leads.value.find(l => l.id === activeChat.value?.contactId) : null)

const filteredChats = computed(() => {
  return chats.value.filter(chat => {
    const matchesUser = filterUser.value === 'Todos' || 
                       (filterUser.value === 'Meus' && chat.assignedTo === 'Wellington Santos') || 
                       chat.assignedTo === filterUser.value
    
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesUser && matchesSearch
  })
})

const folders = computed(() => ['Todos', ...new Set(mockQuickTemplates.map(t => t.folder))])

const filteredTemplates = computed(() => {
  if (activeFolder.value === 'Todos') return mockQuickTemplates
  return mockQuickTemplates.filter(t => t.folder === activeFolder.value)
})

// --- Actions ---
const sendMessage = (content: string, type: string = 'text') => {
  if (!content.trim() && type === 'text') return

  const newMessage = {
    id: Date.now(),
    text: content,
    sender: isInternalNote.value ? 'note' : 'me',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: type
  }

  const chat = chats.value.find(c => c.id === selectedChatId.value)
  if (chat) {
    chat.messages.push(newMessage)
    chat.lastMsg = isInternalNote.value ? 'Nota Interna' : (type === 'text' ? content : `Enviou um ${type}`)
    chat.time = 'Agora'
    if (!isInternalNote.value) chat.mode = 'human'
  }

  inputText.value = ''
  isInternalNote.value = false
  scrollToBottom()
}

const toggleChatMode = (mode: string) => {
  if (activeChat.value) activeChat.value.mode = mode
}

const setChatAgent = (agentId: string) => {
  if (activeChat.value) {
    activeChat.value.activeAgentId = agentId
    if (activeChat.value.mode === 'human') toggleChatMode('ia')
  }
}

// Scroll Handling
const scrollToBottom = () => {
    nextTick(() => {
        const container = document.getElementById('messages-container')
        if (container) container.scrollTop = container.scrollHeight
    })
}

// Watcher para carregar mensagens quando clica no chat
watch(selectedChatId, async (newId) => {
    if (!newId) return
    
    isLoadingMessages.value = true
    try {
        // 1. Carregar Histórico
        const messages = await $fetch(`/api/chats/${newId}/messages`)
        
        const chat = chats.value.find(c => c.id === newId)
        if (chat) {
            chat.messages = messages
            scrollToBottom()
        }

        // 2. Inscrever no Pusher
        const channelName = `chat-${newId}`
        
        // Cleanup old subscription if needed (pusher-js handles duplicated subs efficiently usually)
        const channel = pusher.subscribe(channelName)
        
        // Unbind old events to prevent duplicates if re-subscribing
        channel.unbind('new-message')
        
        channel.bind('new-message', (data: any) => {
            console.log('Evento Pusher Recebido:', data)
            const currentChat = chats.value.find(c => c.id === newId)
            if (currentChat) {
                currentChat.messages.push({
                    id: Date.now(), // Temp ID
                    text: data.content,
                    sender: 'client', // Assumindo webhook
                    time: new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                })
                currentChat.lastMsg = data.content
                currentChat.time = 'Agora'
                currentChat.unread++ // Opcional: increment logic
                scrollToBottom()
            }
        })

    } catch (e) {
        console.error('Erro ao carregar mensagens:', e)
    } finally {
        isLoadingMessages.value = false
    }
})
</script>
