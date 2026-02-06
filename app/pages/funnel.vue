<template>
  <div class="flex flex-col h-[calc(100vh-theme('spacing.16'))] bg-[#f6f7f8] dark:bg-navy-950 overflow-hidden relative" @click="quickMessageId = null">
    <!-- Header com Filtros e Contadores -->
    <div class="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 shrink-0">
      <div class="flex items-center gap-6">
           <!-- Seletor de Pipeline -->
           <div class="relative">
              <button 
                  @click.stop="isDropdownOpen = !isDropdownOpen"
                  class="flex items-center gap-3 px-4 py-2 bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 rounded-xl text-sm font-bold text-navy-900 dark:text-white hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors shadow-sm"
              >
                  <span class="material-symbols-outlined text-primary">view_kanban</span>
                  {{ activeGroup }}
                  <span class="material-symbols-outlined text-slate-400">expand_more</span>
              </button>
              
              <div v-if="isDropdownOpen" class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div class="p-2 border-b border-slate-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-800">
                    <p class="text-[10px] font-black uppercase text-slate-400">Seus Funis</p>
                </div>
                <div class="max-h-64 overflow-y-auto custom-scrollbar p-1">
                  <button
                    v-for="pipeline in pipelines"
                    :key="pipeline.id"
                    @click="handleGroupChange(pipeline.name)"
                    class="w-full text-left px-4 py-3 text-sm font-bold rounded-lg transition-colors"
                    :class="activeGroup === pipeline.name ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800'"
                  >
                  {{ pipeline.name }}
                  </button>
                </div>
                <button @click="isNewPipelineModalOpen = true" class="w-full text-left px-4 py-3 text-sm font-black text-primary hover:bg-slate-50 dark:hover:bg-navy-800 flex items-center gap-2 border-t border-slate-100 dark:border-navy-800">
                  <span class="material-symbols-outlined text-lg">add</span> Novo Funil
                </button>
              </div>
           </div>

           <!-- Divisor -->
           <div class="h-8 w-px bg-slate-200 dark:bg-navy-800 hidden md:block"></div>

           <!-- Contadores Gerais -->
           <div class="hidden md:flex items-center gap-6 text-xs">
               <div>
                   <p class="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Negócios</p>
                   <p class="text-base font-black text-navy-900 dark:text-white">{{ leadsInActiveGroup.length }}</p>
               </div>
               <div>
                   <p class="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Valor Total</p>
                   <p class="text-base font-black text-emerald-600">R$ {{ leadsInActiveGroup.reduce((a, b) => a + (b.value || 0), 0).toLocaleString('pt-BR') }}</p>
               </div>
           </div>
      </div>
      
      <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative group flex-1 md:flex-none">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">search</span>
              <input type="text" placeholder="Filtrar..." class="w-full md:w-48 pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-navy-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-navy-900 dark:text-white" />
          </div>
          <button @click="createQuickLead" class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span class="material-symbols-outlined">add</span> 
              <span class="hidden sm:inline">Negócio</span>
          </button>
      </div>
    </div>

    <!-- Kanban Board Container -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar p-6">
        <div class="flex h-full gap-6">
          <div v-for="col in currentColumns" :key="col.id" class="w-[320px] min-w-[320px] flex flex-col h-full shrink-0">
              <!-- Column Header -->
              <div class="bg-white dark:bg-navy-900 p-4 rounded-xl border-t-4 border-x border-b border-slate-200 dark:border-navy-800 mb-4 shadow-sm flex flex-col gap-2" :class="col.color || 'border-t-primary'">
                  <div class="flex justify-between items-center">
                      <h4 class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 truncate" :title="col.title">
                          {{ col.title }}
                      </h4>
                      <span class="bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ leadsInActiveGroup.filter(l => l.status === col.status).length }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-navy-800">
                       <p class="text-[10px] text-slate-400 font-bold">Total Previsto</p>
                       <p class="text-xs font-black text-emerald-600">R$ {{ leadsInActiveGroup.filter(l => l.status === col.status).reduce((acc, curr) => acc + (curr.value || 0), 0).toLocaleString('pt-BR') }}</p>
                  </div>
              </div>

              <!-- Cards Container -->
              <div class="flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1 space-y-3">
                  <div 
                      v-for="lead in leadsInActiveGroup.filter(l => l.status === col.status)"
                      :key="lead.id" 
                      @click="selectedLead = lead"
                      class="bg-white dark:bg-navy-900 p-4 rounded-xl border border-slate-200 dark:border-navy-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group relative flex flex-col gap-3"
                  >
                      <!-- Topo do Card -->
                      <div class="flex justify-between items-start">
                          <div class="flex-1 min-w-0 pr-2">
                              <h5 class="text-sm font-black text-navy-900 dark:text-white leading-tight truncate mb-1">{{ lead.name }}</h5>
                              <div class="flex items-center gap-2">
                                  <span class="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-navy-800 px-1.5 py-0.5 rounded">
                                      ID: {{ lead.id.substring(0,4) }}
                                  </span>
                                  <span class="text-[10px] text-slate-400 font-medium">
                                      {{ getEntryDate(lead.createdAt) }}
                                  </span>
                              </div>
                          </div>
                          <div class="size-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs shrink-0 border border-slate-200 dark:border-navy-700">
                              {{ lead.name.substring(0,1) }}
                          </div>
                      </div>

                      <!-- Tags -->
                      <div v-if="lead.tags && lead.tags.length > 0" class="flex flex-wrap gap-1.5">
                          <span v-for="tag in lead.tags.slice(0, 3)" :key="tag" class="px-2 py-0.5 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-md">
                              {{ tag }}
                          </span>
                      </div>

                      <!-- Valor e Ações -->
                      <div class="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-navy-800">
                          <p class="text-sm font-black text-navy-900 dark:text-white">R$ {{ (lead.value || 0).toLocaleString('pt-BR') }}</p>
                          
                          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button class="p-1.5 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors" title="Tarefa">
                                  <span class="material-symbols-outlined text-lg">task_alt</span>
                              </button>
                              
                              <div class="relative">
                                  <button 
                                      @click.stop="handleQuickMessage($event, lead.id)"
                                      class="p-1.5 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg text-slate-400 hover:text-[#25D366] transition-colors" 
                                      title="WhatsApp"
                                  >
                                      <span class="material-symbols-outlined text-lg">chat</span>
                                  </button>
                                  <div v-if="quickMessageId === lead.id" class="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in duration-150">
                                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Envio Rápido</p>
                                      <button class="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg text-navy-900 dark:text-white flex items-center gap-2">
                                          <span class="material-symbols-outlined text-sm">waving_hand</span> 
                                          Boas Vindas
                                      </button>
                                      <button class="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg text-navy-900 dark:text-white flex items-center gap-2">
                                          <span class="material-symbols-outlined text-sm">request_quote</span> 
                                          Enviar Proposta
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <button @click="createQuickLead" class="w-full py-3 border-2 border-dashed border-slate-200 dark:border-navy-700 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-navy-800 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-lg">add</span>
                      Adicionar Negócio
                  </button>
              </div>
          </div>
        </div>
    </div>

    <LeadModal v-if="selectedLead" :lead="selectedLead" @close="selectedLead = null" />

    <!-- Modal Novo Pipeline -->
    <div v-if="isNewPipelineModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isNewPipelineModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Novo Funil</h3>
            <form @submit.prevent="handleAddPipeline" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome do Funil</label>
                    <input required type="text" autofocus v-model="newPipelineName" class="w-full mt-1 p-3 border border-slate-200 dark:border-navy-700 dark:bg-navy-800 rounded-xl outline-none focus:border-primary text-sm font-bold text-navy-900 dark:text-white" placeholder="Ex: Parcerias" />
                </div>
                <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">Criar Funil</button>
            </form>
            <button @click="isNewPipelineModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>
    
    <FloatingWhatsApp />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApp } from '~/composables/useApp'
import { LeadStatus } from '~/types'

definePageMeta({
  layout: 'default'
})

const { leads, addLead, pipelines, addPipeline } = useApp()

const activeGroup = ref('Vendas')
const isDropdownOpen = ref(false)
const selectedLead = ref(null)
const isNewPipelineModalOpen = ref(false)
const newPipelineName = ref('')
const quickMessageId = ref<string | null>(null)

const activePipeline = computed(() => pipelines.value.find(p => p.name === activeGroup.value))
const currentColumns = computed(() => activePipeline.value ? activePipeline.value.columns : [])
const leadsInActiveGroup = computed(() => leads.value.filter(l => l.group === activeGroup.value))

const handleGroupChange = (group: string) => {
//   activeGroup.value = group
//   isDropdownOpen.value = false
  // Fix types if necessary or just cast
  activeGroup.value = group
  isDropdownOpen.value = false
}

const handleAddPipeline = () => {
  if (newPipelineName.value.trim()) {
    addPipeline(newPipelineName.value)
    activeGroup.value = newPipelineName.value
    isNewPipelineModalOpen.value = false
    newPipelineName.value = ''
  }
}

const createQuickLead = () => {
    const name = prompt("Nome do Cliente:")
    if(name) {
        addLead({
           name,
           value: 0,
           type: 'Pessoa Física',
           location: 'Pendente',
           status: currentColumns.value[0]?.status || LeadStatus.NEW,
           group: activeGroup.value,
           source: 'Rápido',
           tags: []
        })
    }
}

const handleQuickMessage = (e: MouseEvent, leadId: string) => {
    quickMessageId.value = quickMessageId.value === leadId ? null : leadId
}

const getEntryDate = (dateString: string) => {
    if (!dateString) return 'Hoje'
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
}
</script>
