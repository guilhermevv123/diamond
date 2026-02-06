<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto w-full relative">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <p class="text-sm font-bold text-primary uppercase tracking-widest mb-1">Vendas e Contratos</p>
            <h3 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Propostas Geradas</h3>
        </div>
        <button @click="isModalOpen = true" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined">description</span>
            Gerar Nova Proposta
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Taxa de Conversão</p>
            <p class="text-2xl font-black text-navy-900 dark:text-white">24.8%</p>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400">
                <span class="material-symbols-outlined text-sm">trending_up</span>
                +2.4% este mês
            </div>
        </div>
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Médio</p>
            <p class="text-2xl font-black text-navy-900 dark:text-white">R$ 12.500</p>
             <div class="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                Baseado em {{ proposals.length }} propostas
            </div>
        </div>
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tempo de Fechamento</p>
            <p class="text-2xl font-black text-navy-900 dark:text-white">14 dias</p>
             <div class="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                Melhor que a média regional
            </div>
        </div>
    </div>

    <!-- Templates Section -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h4 class="text-lg font-black text-navy-900 dark:text-white">Modelos de Proposta</h4>
             <button class="text-sm font-bold text-primary hover:underline">Gerenciar Modelos</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="border-2 border-dashed border-slate-200 dark:border-navy-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group bg-white dark:bg-navy-900 h-48">
                <span class="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary mb-2 transition-colors">upload_file</span>
                <p class="text-sm font-black text-navy-900 dark:text-white">Upload de DOCX</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Implemente seu próprio modelo</p>
            </div>
            
            <div v-for="(template, idx) in ['Serviço Padrão', 'Contrato SaaS', 'Consultoria']" :key="idx" class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 p-4 relative group hover:shadow-lg transition-all h-48 flex flex-col">
                <div class="flex-1 bg-slate-100 dark:bg-navy-800 rounded-xl mb-3 overflow-hidden relative">
                    <div class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-navy-800">
                         <span class="material-symbols-outlined text-4xl text-slate-300">article</span>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                     <span class="text-sm font-black text-navy-900 dark:text-white">{{ template }}</span>
                     <button class="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
                        <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Lista de Propostas -->
    <div class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
            <h4 class="font-black text-navy-900 dark:text-white">Lista de Propostas Recentes</h4>
            <div class="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Filtrar por cliente..." 
                  class="text-xs px-4 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-navy-900 dark:text-white"
                />
            </div>
        </div>
        <div class="overflow-x-auto">
             <table class="w-full text-left">
                <thead class="bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700">
                    <tr>
                         <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">ID / Cliente</th>
                        <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Valor do Projeto</th>
                        <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Produto/Serviço</th>
                        <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Data</th>
                        <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                        <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
                    <tr v-for="prop in proposals" :key="prop.id" class="hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors group">
                        <td class="px-6 py-4">
                            <p class="text-xs font-black text-primary mb-0.5">{{ prop.id }}</p>
                            <p class="text-sm font-bold text-navy-900 dark:text-white">{{ prop.clientName }}</p>
                        </td>
                         <td class="px-6 py-4">
                            <p class="text-sm font-black text-navy-900 dark:text-white">R$ {{ prop.value.toLocaleString('pt-BR') }}</p>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                {{ prop.product }}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                            {{ formatDate(prop.date) }}
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase border" :class="getStatusStyle(prop.status)">
                                {{ prop.status }}
                            </span>
                        </td>
                         <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="Visualizar PDF">
                                    <span class="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button @click="deleteProposal(prop.id)" class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors" title="Excluir">
                                    <span class="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
             </table>
        </div>
    </div>

    <!-- Modal Proposta -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Gerar Proposta</h3>
            <form @submit.prevent="handleAdd" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Selecione o Lead</label>
                    <select required v-model="selectedLeadId" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                        <option value="">Selecione...</option>
                        <option v-for="l in leads" :key="l.id" :value="l.id">{{ l.name }} - {{ l.details?.productInterest || 'N/A' }}</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Valor Final (R$)</label>
                    <input required type="number" v-model="value" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                </div>
                <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">Criar Rascunho</button>
            </form>
            <button @click="isModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApp } from '~/composables/useApp'

definePageMeta({
  layout: 'default'
})

const { proposals, leads, addProposal, deleteProposal } = useApp()

const isModalOpen = ref(false)
const selectedLeadId = ref('')
const value = ref('')

const handleAdd = () => {
    const lead = leads.value.find(l => l.id === selectedLeadId.value)
    const clientName = lead ? lead.name : 'Cliente Avulso'
    const product = lead && lead.details ? lead.details.productInterest : 'Serviço Padrão'

    addProposal({
        clientName,
        value: Number(value.value),
        product,
        status: 'Rascunho',
        date: new Date().toISOString()
    })
    
    isModalOpen.value = false
    selectedLeadId.value = ''
    value.value = ''
}

const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Assinada': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
      case 'Enviada': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      case 'Recusada': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      case 'Rascunho': return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
      default: return 'bg-slate-100 text-slate-700'
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
}
</script>
