<template>
  <div class="flex h-full bg-white dark:bg-navy-900 relative">
    <!-- Sidebar Local -->
    <div class="w-64 border-r border-slate-100 dark:border-navy-800 flex flex-col bg-slate-50 dark:bg-navy-900 shrink-0">
        <div class="p-6 border-b border-slate-100 dark:border-navy-800">
            <h2 class="text-lg font-black text-navy-900 dark:text-white">Dimond IA</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Automação Inteligente</p>
        </div>
        <nav class="p-4 space-y-1">
            <button
                v-for="item in navItems"
                :key="item.id"
                @click="activeTab = item.id"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
                :class="activeTab === item.id ? 'bg-white dark:bg-navy-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-navy-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'"
            >
                <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                {{ item.label }}
            </button>
        </nav>

        <div v-if="activeTab === 'workflows'" class="mt-6 px-6">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pastas</p>
            <div class="space-y-1">
                 <button
                    v-for="folder in folders"
                    :key="folder"
                    @click="activeFolder = folder"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                    :class="activeFolder === folder ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'"
                 >
                    <div class="flex items-center gap-2">
                       <span class="material-symbols-outlined text-base" :class="activeFolder === folder ? 'fill-1' : ''">folder</span>
                       {{ folder }}
                    </div>
                    <span v-if="folder === 'Todos'" class="bg-white dark:bg-navy-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-100 dark:border-navy-700">{{ workflows.length }}</span>
                  </button>
            </div>
        </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-navy-950 p-8">
        <div v-if="activeTab === 'workflows'" class="space-y-6">
             <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-2xl font-black text-navy-900 dark:text-white">Meus Fluxos</h3>
                    <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Gerencie automações de follow-up e processos.</p>
                </div>
                <button @click="isModalOpen = true" class="bg-primary text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-dark transition-all">
                    <span class="material-symbols-outlined">add</span>
                    Novo Fluxo
                </button>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 <div v-for="workflow in filteredWorkflows" :key="workflow.id" class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm hover:shadow-md transition-all group" :class="!workflow.active ? 'opacity-70' : ''">
                      <div class="flex justify-between items-start mb-6">
                          <div class="flex items-center gap-3">
                               <div class="size-10 rounded-lg flex items-center justify-center" :class="workflow.active ? 'bg-[#25D366]/10' : 'bg-slate-100 dark:bg-navy-800'">
                                    <span class="material-symbols-outlined text-2xl text-slate-500 dark:text-slate-400">smart_toy</span>
                               </div>
                               <div>
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-black text-navy-900 dark:text-white">{{ workflow.title }}</h4>
                                        <span class="bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase px-1.5 py-0.5 rounded">{{ workflow.type }}</span>
                                    </div>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Última execução: {{ workflow.lastRun }}</p>
                               </div>
                          </div>
                           <div class="flex items-center gap-2">
                                 <button @click="deleteWorkflow(workflow.id)" class="text-slate-300 hover:text-red-500 transition-colors"><span class="material-symbols-outlined">delete</span></button>
                                 <div 
                                    @click="toggleWorkflow(workflow.id)"
                                    class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in cursor-pointer"
                                 >
                                    <div class="w-12 h-6 rounded-full shadow-inner transition-colors" :class="workflow.active ? 'bg-[#25D366]' : 'bg-slate-300 dark:bg-slate-600'"></div>
                                    <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform" :class="workflow.active ? 'translate-x-6' : 'translate-x-0'"></div>
                                 </div>
                            </div>
                      </div>
                      
                      <!-- Visualização de Nós Fake -->
                      <div class="relative h-36 bg-slate-50/50 dark:bg-navy-800/50 rounded-xl border border-slate-100 dark:border-navy-700 overflow-hidden p-6 flex items-center justify-center gap-3">
                          <div class="text-xs font-bold text-slate-400">Fluxo configurado (visualização simplificada)</div>
                      </div>
                 </div>
            </div>
        </div>
        
        <div v-if="activeTab !== 'workflows'" class="flex items-center justify-center h-64 text-slate-400 font-bold">Funcionalidade em desenvolvimento</div>
    </div>

    <!-- Modal Workflow -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Novo Fluxo de Automação</h3>
            <form @submit.prevent="handleAdd" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome do Fluxo</label>
                    <input required type="text" v-model="newTitle" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Pasta / Tipo</label>
                    <select v-model="newType" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                        <option v-for="f in folders.filter(f => f !== 'Todos')" :key="f" :value="f">{{ f }}</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">Criar Automação</button>
            </form>
            <button @click="isModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApp } from '~/composables/useApp'

definePageMeta({
  layout: 'default'
})

const { workflows, addWorkflow, deleteWorkflow, toggleWorkflow } = useApp()

const activeTab = ref('workflows')
const activeFolder = ref('Todos')
const isModalOpen = ref(false)
const newTitle = ref('')
const newType = ref('Vendas')

const navItems = [
    { id: 'workflows', label: 'Fluxos de Trabalho', icon: 'account_tree' },
    { id: 'agents', label: 'Agentes Inteligentes', icon: 'smart_toy' },
    { id: 'docs', label: 'Base de Conhecimento', icon: 'library_books' },
    { id: 'api', label: 'Conexões & API', icon: 'api' },
]

const folders = ['Todos', 'Vendas', 'Pós-Venda', 'Nutrição', 'Recuperação']

const filteredWorkflows = computed(() => {
    return activeFolder.value === 'Todos' ? workflows.value : workflows.value.filter(w => w.type === activeFolder.value)
})

const handleAdd = () => {
    addWorkflow({
        title: newTitle.value,
        type: newType.value,
        nodes: []
    })
    isModalOpen.value = false
    newTitle.value = ''
}
</script>
