<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto w-full relative">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <p class="text-sm font-bold text-primary uppercase tracking-widest mb-1">Pipeline de Vendas</p>
        <h3 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Leads e Oportunidades</h3>
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <button class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors text-navy-900 dark:text-white">
          <span class="material-symbols-outlined">file_download</span>
          Exportar
        </button>
        <button 
          @click="isModalOpen = true"
          class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Novo Lead
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-navy-800 p-4 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm flex flex-wrap gap-2">
      <button
        v-for="f in ['Todos', 'Pessoa Física', 'Empresa', 'Qualificado', 'Contatado']"
        :key="f"
        @click="filter = f"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
        :class="filter === f ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-navy-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700'"
      >
        {{ f }}
      </button>
    </div>

    <!-- Tabela -->
    <div class="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-navy-900/50 border-b border-slate-200 dark:border-navy-700">
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nome do Lead</th>
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tipo / Localização</th>
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Valor Potencial</th>
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Origem</th>
              <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
            <tr v-for="lead in filteredLeads" :key="lead.id" class="hover:bg-slate-50/50 dark:hover:bg-navy-700/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full flex items-center justify-center font-black text-xs text-white" :class="lead.type === 'Empresa' ? 'bg-orange-400' : 'bg-primary'">
                    {{ lead.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
                  </div>
                  <p class="font-black text-navy-900 dark:text-white text-sm">{{ lead.name }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ lead.type }}</p>
                <p class="text-xs text-slate-400">{{ lead.location }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight" :class="getStatusColor(lead.status)">
                  {{ lead.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-primary font-bold">R$ {{ lead.value?.toLocaleString('pt-BR') || 0 }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ lead.source }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button 
                    @click="confirmDelete(lead.id)"
                    class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Adicionar Lead -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl border border-slate-200 dark:border-navy-700">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Novo Lead</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome do Cliente / Empresa</label>
                    <input required type="text" v-model="newLeadName" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Valor Estimado (R$)</label>
                        <input required type="number" v-model="newLeadValue" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Cidade/UF</label>
                        <input required type="text" v-model="newLeadCity" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                    </div>
                </div>
                <div>
                      <label class="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                      <select v-model="newLeadType" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                          <option value="Pessoa Física">Pessoa Física</option>
                          <option value="Empresa">Empresa</option>
                      </select>
                </div>
                <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">Criar Card</button>
            </form>
            <button @click="isModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApp } from '~/composables/useApp'
import { LeadStatus } from '~/types'

definePageMeta({
  layout: 'default'
})

const { leads, addLead, deleteLead } = useApp()

const filter = ref('Todos')
const isModalOpen = ref(false)

// Form State
const newLeadName = ref('')
const newLeadValue = ref('')
const newLeadCity = ref('')
const newLeadType = ref('Pessoa Física')

const filteredLeads = computed(() => {
  if (filter.value === 'Todos') return leads.value
  return leads.value.filter(l => l.status === filter.value || l.type === filter.value)
})

const getStatusColor = (status: string) => {
  switch (status) {
    case LeadStatus.QUALIFIED: return 'bg-blue-100 text-blue-700'
    case LeadStatus.CONTACTED: return 'bg-sky-100 text-sky-700'
    case LeadStatus.NEW: return 'bg-slate-100 text-slate-700'
    case LeadStatus.NEGOTIATION: return 'bg-yellow-100 text-amber-700'
    case LeadStatus.CLOSED: return 'bg-purple-100 text-purple-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const handleSubmit = () => {
  addLead({
    name: newLeadName.value,
    value: Number(newLeadValue.value),
    type: newLeadType.value as 'Pessoa Física' | 'Empresa',
    location: newLeadCity.value,
    status: LeadStatus.NEW,
    group: 'Vendas',
    source: 'Manual'
  })
  
  newLeadName.value = ''
  newLeadValue.value = ''
  newLeadCity.value = ''
  isModalOpen.value = false
}

const confirmDelete = (id: string) => {
  if (confirm('Excluir este lead?')) {
    deleteLead(id)
  }
}
</script>
