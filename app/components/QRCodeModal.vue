<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-navy-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 dark:border-navy-800 flex justify-between items-center bg-slate-50 dark:bg-navy-800">
        <h3 class="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">qr_code_2</span>
          Conexão WhatsApp
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-8 flex flex-col items-center justify-center flex-1">
        
        <div v-if="status === 'open'" class="text-center space-y-6">
           <div class="relative mx-auto">
             <div class="size-64 bg-white p-2 rounded-xl shadow-inner border border-slate-200">
                <img v-if="qrCode" :src="qrCode" alt="QR Code" class="w-full h-full object-contain" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 flex-col gap-2">
                    <span v-if="!error" class="material-symbols-outlined text-4xl animate-spin">sync</span>
                    <span v-if="!error" class="text-xs font-bold">Gerando QR Code...</span>
                    
                    <span v-if="error" class="material-symbols-outlined text-4xl text-red-500">error</span>
                    <span v-if="error" class="text-xs font-bold text-red-500 text-center px-4">{{ error }}</span>
                    <button v-if="error" @click="fetchQRCode" class="text-xs text-primary underline mt-2">Tentar novamente</button>
                </div>
             </div>
             <div class="absolute -bottom-3 -right-3 size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                <span class="material-symbols-outlined">smartphone</span>
             </div>
           </div>
           
           <div>
             <p class="text-navy-900 dark:text-white font-bold mb-1">Escaneie com seu WhatsApp</p>
             <p class="text-xs text-slate-500 dark:text-slate-400">Abra o WhatsApp > Configurações > Aparelhos Conectados > Conectar Aparelho</p>
           </div>
        </div>

        <div v-else-if="status === 'connecting'" class="text-center py-10">
            <span class="material-symbols-outlined text-5xl text-blue-500 animate-spin mb-4">refresh</span>
            <p class="font-bold text-navy-900 dark:text-white">Conectando...</p>
        </div>

        <div v-else class="text-center py-6 space-y-4">
            <div class="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mx-auto">
                <span class="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <div>
                <h4 class="text-xl font-black text-navy-900 dark:text-white">Conectado!</h4>
                <p class="text-sm text-slate-500">Sua instância está pronta para enviar e receber mensagens.</p>
            </div>
            <button @click="disconnect" class="text-red-500 text-xs font-bold hover:underline">Desconectar instância</button>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-800 flex justify-between items-center text-xs font-mono text-slate-400">
        <span>Instance: {{ instanceName }}</span>
        <span class="flex items-center gap-1.5">
            <span class="size-2 rounded-full" :class="status === 'open' ? 'bg-red-500' : 'bg-green-500'"></span>
            {{ status === 'open' ? 'Disconnected' : 'Active' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  instanceName?: string
}>()

const emit = defineEmits(['close'])

const status = ref('open') // open (qr), connecting, connected
const qrCode = ref('')
const error = ref('')


let statusInterval: any = null

onMounted(async () => {
    fetchQRCode()
    startStatusPolling()
})

onUnmounted(() => {
    stopStatusPolling()
})

const startStatusPolling = () => {
    stopStatusPolling()
    statusInterval = setInterval(checkConnectionStatus, 3000)
}

const stopStatusPolling = () => {
    if (statusInterval) clearInterval(statusInterval)
}

const checkConnectionStatus = async () => {
    try {
        const headers = useRequestHeaders(['cookie'])
        const res: any = await $fetch('/api/uazapi/status', { headers })
        console.log('Status Check:', res)
        
        // Status possíveis da UAZAPI/Baileys: 'open', 'connecting', 'connected', 'close'
        // 'open' geralmente é conectado/pronto nas versoes antigas, mas nas novas:
        // 'open' = QR, 'connecting' = conectando, 'close' = conectado (as vezes confunde)
        // Vamos checar o que vier. Se for 'connected' ou 'open' com QR null...
        
        const state = res.status || res.state
        
        if (state === 'connected' || state === 'open') {
             // Se estiver open, precisamos garantir que não é open DE QR CODE
             // Geralmente 'open' no Baileys significa conexão aberta (sucesso).
             // Vamos checar se o QR sumiu ou se mudou o status visual
             
             // Se vier explicitamente 'connected' ou se já tiver token e não erro
             status.value = 'connected'
             stopStatusPolling()
             
             // Espera 2s para o usuário ver o sucesso e fecha
             setTimeout(() => {
                 emit('close')
                 // Recarrega a página ou chats para pegar o histórico que chegou
                 window.location.reload() 
             }, 2000)
        }
    } catch (e) {
        console.error('Erro ao checar status:', e)
    }
}

const fetchQRCode = async () => {
    try {
        qrCode.value = ''
        error.value = ''
        status.value = 'open' // Reset status visual
        
        // Usar useRequestHeaders para garantir que o cookie do Supabase seja enviado
        const headers = useRequestHeaders(['cookie'])
        const data: any = await $fetch('/api/uazapi/qr', { headers })
        console.log('QR Data:', data)

        // Tenta encontrar o QR em vários formatos possíveis
        if (data.base64) qrCode.value = data.base64
        else if (data.qrcode) qrCode.value = data.qrcode
        else if (data.instance?.qrcode) qrCode.value = data.instance.qrcode 
        else if (data.code) qrCode.value = data.code
        else if (data.urlCode) qrCode.value = data.urlCode
        else if (data.qr) qrCode.value = data.qr
        else if (data.data?.qrcode) qrCode.value = data.data.qrcode
        else if (data.data?.base64) qrCode.value = data.data.base64
        else {
            // Se não veio QR, pode estar conectado já?
            if (data.instance?.state === 'open' || data.instance?.state === 'connected') {
                 status.value = 'connected'
                 stopStatusPolling()
                 setTimeout(() => emit('close'), 1500)
                 return
            }
            
            console.warn('Formato de QR não reconhecido', data)
            error.value = 'Aguardando QR Code...'
        }
    } catch (e) {
        console.error('Erro ao carregar QR:', e)
        error.value = 'Erro ao carregar QR Code. Verifique as credenciais.'
    }
}

const disconnect = () => {
    status.value = 'open'
    qrCode.value = ''
    fetchQRCode()
    startStatusPolling()
}
</script>
