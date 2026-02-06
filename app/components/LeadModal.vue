<template>
  <div v-if="viewMode === 'preview'" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" @click="onClose"></div>
    <div class="bg-white dark:bg-navy-900 w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-navy-700">
      <!-- Header Compacto -->
      <div class="p-5 border-b border-slate-100 dark:border-navy-800 flex justify-between items-start bg-slate-50/50 dark:bg-navy-800/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm text-white" :class="lead.type === 'Empresa' ? 'bg-orange-500' : 'bg-primary'">
            {{ lead.name.substring(0,2).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-base font-black text-navy-900 dark:text-white leading-tight">{{ lead.name }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">{{ lead.location }}</p>
          </div>
        </div>
        <button @click="onClose" class="text-slate-400 hover:text-red-500"><span class="material-symbols-outlined">close</span></button>
      </div>

      <!-- Info Rápida -->
      <div class="p-5 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Status</p>
            <p class="text-xs font-black text-primary">{{ lead.status }}</p>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Interesse</p>
            <p class="text-xs font-black text-navy-900 dark:text-white truncate">{{ lead.details?.productInterest || 'N/A' }}</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span class="material-symbols-outlined text-slate-400">call</span>
            {{ lead.phone || 'Sem telefone' }}
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span class="material-symbols-outlined text-slate-400">mail</span>
            {{ lead.email || 'Sem e-mail' }}
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="p-4 bg-slate-50 dark:bg-navy-950 border-t border-slate-100 dark:border-navy-800">
        <button 
          @click="setViewMode('full')"
          class="w-full py-3 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-black text-navy-900 dark:text-white hover:bg-slate-50 dark:hover:bg-navy-700 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          Abrir Negócio Completo
          <span class="material-symbols-outlined text-base">open_in_new</span>
        </button>
      </div>
    </div>
  </div>

  <!-- FULL MODE -->
  <div v-else class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-navy-900/70 backdrop-blur-sm" @click="onClose"></div>
    
    <div class="bg-white dark:bg-navy-900 w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl relative flex overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-navy-700">
      
      <!-- Sidebar de Navegação (Esquerda) -->
      <div class="w-64 bg-slate-50 dark:bg-navy-950 border-r border-slate-200 dark:border-navy-800 flex flex-col shrink-0">
        <div class="p-6 border-b border-slate-200 dark:border-navy-800">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md" :class="lead.type === 'Empresa' ? 'bg-orange-500' : 'bg-primary'">
              {{ lead.name.substring(0,2).toUpperCase() }}
            </div>
            <div class="overflow-hidden">
              <h3 class="text-sm font-black text-navy-900 dark:text-white truncate" :title="lead.name">{{ lead.name }}</h3>
              <p class="text-[10px] text-slate-500 font-bold truncate">{{ lead.type }}</p>
            </div>
          </div>
          
          <button 
            @click="handleNavigateToChat"
            class="w-full py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-bold text-navy-900 dark:text-white hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span class="material-symbols-outlined text-lg">chat</span>
            Ver Conversa
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="setActiveSection(item.id)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left"
            :class="activeSection === item.id 
              ? 'bg-white dark:bg-navy-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-navy-700' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'"
          >
            <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>
        
        <div class="p-4 border-t border-slate-200 dark:border-navy-800">
          <button @click="onClose" class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 text-xs font-bold py-2 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
            Fechar Card
          </button>
        </div>
      </div>

      <!-- Conteúdo Principal (Direita) -->
      <div class="flex-1 flex flex-col bg-white dark:bg-navy-900 overflow-hidden">
        
        <!-- Topbar do Card -->
        <div class="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between px-8 shrink-0 z-20">
          <div class="flex items-center gap-4">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funil Atual</span>
              <div class="flex items-center gap-2">
                <div class="flex items-center bg-[#25D366] text-white px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm">
                  {{ lead.status }}
                </div>
                <button class="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>
            </div>
            
            <div class="h-8 w-px bg-slate-200 mx-2"></div>

            <!-- Etiquetas -->
            <div class="relative">
              <button 
                @click="isTagPopoverOpen = !isTagPopoverOpen"
                class="flex items-center gap-2 px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-sm">label</span>
                Etiquetas ({{ tags.length }})
              </button>
              
              <div v-if="isTagPopoverOpen" class="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in duration-200">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-black text-navy-900">Etiquetas</span>
                  <button @click="isTagPopoverOpen = false"><span class="material-symbols-outlined text-sm">close</span></button>
                </div>
                <!-- Tag creation logic simplified -->
                <div class="text-xs text-slate-500 italic">Funcionalidade de tags simulada</div>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-base">thumb_down</span> Perda
            </button>
            <button class="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-base">thumb_up</span> Ganho
            </button>
            <button class="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center gap-1">
              <span class="material-symbols-outlined text-base">save</span> Salvar
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#f8fafc] dark:bg-navy-950">
          
          <!-- ABA ATIVIDADES -->
          <div v-if="activeSection === 'atividades'" class="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 class="text-xl font-black text-navy-900 dark:text-white mb-6">Histórico do Cliente</h2>
            <div class="relative border-l-2 border-slate-200 dark:border-navy-700 ml-3 space-y-8 pb-8">
              <div v-for="act in (lead.activities || [])" :key="act.id" class="relative pl-8">
                <div class="absolute -left-[9px] top-0 size-4 bg-white dark:bg-navy-900 border-2 border-primary rounded-full"></div>
                <div class="bg-white dark:bg-navy-800 p-4 rounded-xl border border-slate-200 dark:border-navy-700 shadow-sm">
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-xs font-bold text-primary uppercase">{{ act.type }}</span>
                    <span class="text-[10px] text-slate-400 font-medium">{{ act.date }}</span>
                  </div>
                  <p class="text-sm text-navy-900 dark:text-white">{{ act.description }}</p>
                  <p class="text-[10px] text-slate-400 mt-2">Por: {{ act.author }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ABA CONTATO -->
          <div v-if="activeSection === 'contato'" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section class="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
              <h3 class="text-sm font-black text-navy-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">person</span> Pessoal / Empresa
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome / Razão Social</label>
                    <input type="text" :value="lead.name" class="w-full mt-1 p-2.5 bg-slate-50 dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-700 text-sm font-bold text-navy-900 dark:text-white outline-none" readonly />
                  </div>
              </div>
            </section>
          </div>

          <!-- Other sections can be added simply following the pattern -->
           <div v-if="activeSection === 'negocio'" class="text-center text-slate-400 mt-10">Dados do Negócio (Simulado)</div>
           <div v-if="activeSection === 'propostas'" class="text-center text-slate-400 mt-10">Propostas (Simulado)</div>
           <div v-if="activeSection === 'arquivos'" class="text-center text-slate-400 mt-10">Arquivos (Simulado)</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  },
  initialMode: {
    type: String,
    default: 'full'
  }
})

const emit = defineEmits(['close'])

const viewMode = ref(props.initialMode)
const activeSection = ref('atividades')
const isTagPopoverOpen = ref(false)
const tags = ref(props.lead.tags || [])

const navItems = [
  { id: 'atividades', label: 'Atividades', icon: 'history' },
  { id: 'contato', label: 'Contato', icon: 'person' },
  { id: 'negocio', label: 'Dados do Negócio', icon: 'work' },
  { id: 'propostas', label: 'Propostas e Contratos', icon: 'request_quote' },
  { id: 'arquivos', label: 'Arquivos', icon: 'folder' },
]

const setViewMode = (mode: string) => {
  viewMode.value = mode
}

const setActiveSection = (section: string) => {
  activeSection.value = section
}

const onClose = () => {
  emit('close')
}

const handleNavigateToChat = () => {
    emit('close')
    navigateTo('/chat')
}
</script>
