<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto w-full relative h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center shrink-0">
      <div>
        <h2 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Gestão Financeira</h2>
        <p class="text-slate-500 dark:text-slate-400 font-bold text-sm">Controle total de fluxo de caixa e DRE.</p>
      </div>
      <div class="flex bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-1 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === tab.id ? 'bg-navy-900 dark:bg-primary text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800'"
        >
          <span class="material-symbols-outlined text-base">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- --- DASHBOARD TAB --- -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <!-- Cards Resumo -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-5">
              <span class="material-symbols-outlined text-8xl text-emerald-500">trending_up</span>
            </div>
            <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Receita Total</p>
            <h3 class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">R$ {{ totalRevenue.toLocaleString('pt-BR') }}</h3>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-1 rounded">+15% vs mês anterior</p>
          </div>
          <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-5">
              <span class="material-symbols-outlined text-8xl text-red-500">trending_down</span>
            </div>
            <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Despesas</p>
            <h3 class="text-3xl font-black text-red-600 dark:text-red-400 mt-1">R$ {{ totalExpenses.toLocaleString('pt-BR') }}</h3>
            <p class="text-xs text-red-600 dark:text-red-400 font-bold mt-2 bg-red-50 dark:bg-red-900/20 inline-block px-2 py-1 rounded">+5% vs mês anterior</p>
          </div>
          <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-800 text-white">
            <div class="absolute top-0 right-0 p-4 opacity-10">
              <span class="material-symbols-outlined text-8xl text-white">account_balance_wallet</span>
            </div>
            <p class="text-sm font-bold text-slate-300">Lucro Líquido</p>
            <h3 class="text-3xl font-black text-white mt-1">R$ {{ (totalRevenue - totalExpenses).toLocaleString('pt-BR') }}</h3>
            <p class="text-xs text-primary-light font-bold mt-2 bg-white/10 inline-block px-2 py-1 rounded">Margem: {{ margin }}%</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Gráfico Fluxo -->
          <div class="lg:col-span-2 bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <h3 class="text-lg font-black text-navy-900 dark:text-white mb-6">Fluxo de Caixa (Novembro)</h3>
            <div class="h-72 w-full">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Mini DRE -->
          <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm flex flex-col">
            <h3 class="text-lg font-black text-navy-900 dark:text-white mb-4">DRE Resumido</h3>
            <div class="flex-1 space-y-3 font-mono text-sm">
              <div class="flex justify-between font-bold text-navy-900 dark:text-white">
                <span>Receita Bruta</span>
                <span>245.0k</span>
              </div>
              <div class="flex justify-between text-red-500">
                <span>(-) Impostos</span>
                <span>24.5k</span>
              </div>
              <div class="flex justify-between text-red-500">
                <span>(-) CMV (Kits)</span>
                <span>80.0k</span>
              </div>
              <div class="border-t border-slate-200 dark:border-navy-700 my-2"></div>
              <div class="flex justify-between font-bold text-navy-900 dark:text-white">
                <span>Lucro Bruto</span>
                <span>140.5k</span>
              </div>
              <div class="flex justify-between text-red-500">
                <span>(-) Despesas Op.</span>
                <span>35.0k</span>
              </div>
              <div class="border-t border-navy-900 dark:border-white border-2 my-2"></div>
              <div class="flex justify-between font-black text-emerald-600 dark:text-emerald-400 text-lg">
                <span>EBITDA</span>
                <span>105.5k</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- --- TRANSACTIONS TAB --- -->
      <div v-if="activeTab === 'transactions'" class="space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-black text-navy-900 dark:text-white">Registro de Movimentações</h3>
          <button @click="isModalOpen = true" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-black shadow-lg shadow-primary/20 flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Adicionar
          </button>
        </div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700">
              <tr>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Descrição</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Categoria</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Data</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase text-right">Valor</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
              <tr v-for="t in transactions" :key="t.id" class="hover:bg-slate-50 dark:hover:bg-navy-800">
                <td class="px-6 py-4 font-bold text-navy-900 dark:text-white">{{ t.desc }}</td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{{ t.cat }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{{ formatDate(t.date) }}</td>
                <td class="px-6 py-4 text-right font-black" :class="t.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  {{ t.type === 'in' ? '+' : '-' }} R$ {{ t.value.toLocaleString('pt-BR') }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="deleteTransaction(t.id)" class="text-slate-400 hover:text-red-500"><span class="material-symbols-outlined text-sm">delete</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- --- CONCILIATION TAB --- -->
      <div v-if="activeTab === 'conciliation'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl flex items-start gap-3">
          <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
          <div>
            <h4 class="font-bold text-blue-800 dark:text-blue-300 text-sm">Conciliação Bancária</h4>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">Confira as transações do sistema com o extrato bancário importado (OFX/CSV).</p>
          </div>
        </div>

        <div class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700">
              <tr>
                <th class="px-6 py-4 w-10 text-center"><input type="checkbox" /></th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Data</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Descrição Sistema</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Valor</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
              <tr v-for="t in transactions" :key="t.id" class="hover:bg-slate-50 dark:hover:bg-navy-800">
                <td class="px-6 py-4 text-center"><input type="checkbox" /></td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-bold">{{ formatDate(t.date) }}</td>
                <td class="px-6 py-4 font-bold text-navy-900 dark:text-white">{{ t.desc }}</td>
                <td class="px-6 py-4 font-black" :class="t.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  R$ {{ t.value.toLocaleString('pt-BR') }}
                </td>
                <td class="px-6 py-4">
                  <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded text-[10px] font-black uppercase">Pendente</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end">
          <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-emerald-600/20">
            Conciliar Selecionados
          </button>
        </div>
      </div>

      <!-- --- CONFIG TAB --- -->
      <div v-if="activeTab === 'config'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm h-fit">
                <h3 class="text-lg font-black text-navy-900 dark:text-white mb-4">Adicionar Categoria</h3>
                <form @submit.prevent="handleAddCategory" class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nome</label>
                        <input required type="text" v-model="newCatName" placeholder="Ex: Marketing" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tipo</label>
                        <div class="flex gap-4 mt-1">
                            <button 
                                type="button" 
                                @click="newCatType = 'Receita'"
                                class="flex-1 py-3 rounded-xl font-bold border transition-colors"
                                :class="newCatType === 'Receita' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-500 dark:text-slate-400'"
                            >Receita</button>
                            <button 
                                type="button" 
                                @click="newCatType = 'Despesa'"
                                class="flex-1 py-3 rounded-xl font-bold border transition-colors"
                                :class="newCatType === 'Despesa' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400' : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-500 dark:text-slate-400'"
                            >Despesa</button>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-navy-900 dark:bg-primary text-white py-3 rounded-xl font-black hover:opacity-90 transition-opacity">
                        Criar Categoria
                    </button>
                </form>
            </div>

            <div class="space-y-4">
                <h3 class="text-lg font-black text-navy-900 dark:text-white">Categorias Existentes</h3>
                <div class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 overflow-hidden shadow-sm">
                    <div v-for="cat in categories" :key="cat.id" class="border-b border-slate-100 dark:border-navy-800 last:border-0">
                         <div 
                            @click="expandedCat = expandedCat === cat.id ? null : cat.id"
                            class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
                        >
                            <div class="flex items-center gap-3">
                                <div class="size-3 rounded-full" :class="cat.color"></div>
                                <span class="font-bold text-navy-900 dark:text-white">{{ cat.name }}</span>
                                <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-navy-700 px-2 py-0.5 rounded">{{ cat.type }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click.stop="deleteCategory(cat.id)" class="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <span class="material-symbols-outlined text-lg">delete</span>
                                </button>
                                <span class="material-symbols-outlined text-slate-400 transition-transform" :class="expandedCat === cat.id ? 'rotate-180' : ''">expand_more</span>
                            </div>
                        </div>

                        <div v-if="expandedCat === cat.id" class="p-4 bg-slate-50 dark:bg-navy-800 border-t border-slate-100 dark:border-navy-700">
                             <p class="text-[10px] font-black uppercase text-slate-400 mb-3">Subcategorias</p>
                             <div class="space-y-2 mb-4">
                                <p v-if="cat.subcategories.length === 0" class="text-xs text-slate-400 italic">Nenhuma subcategoria.</p>
                                <div v-for="sub in cat.subcategories" :key="sub.id" class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-navy-700 rounded-lg border border-slate-200 dark:border-navy-600 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <span class="material-symbols-outlined text-sm text-slate-300">subdirectory_arrow_right</span>
                                    {{ sub.name }}
                                </div>
                             </div>
                             <div class="flex gap-2">
                                <input 
                                    type="text" 
                                    v-model="newSubName"
                                    placeholder="Nova subcategoria..."
                                    class="flex-1 px-3 py-2 bg-white dark:bg-navy-700 rounded-lg border border-slate-200 dark:border-navy-600 text-xs outline-none focus:border-primary text-navy-900 dark:text-white"
                                />
                                <button 
                                    @click="handleAddSub(cat.id)"
                                    class="bg-primary text-white px-3 py-2 rounded-lg text-xs font-black hover:bg-primary-dark"
                                >
                                    Add
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Modal Transação -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Nova Transação</h3>
            <form @submit.prevent="handleAddTransaction" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                    <input required type="text" v-model="desc" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Valor (R$)</label>
                        <input required type="number" v-model="val" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                        <select v-model="type" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                            <option value="in">Entrada (+)</option>
                            <option value="out">Saída (-)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                    <select required v-model="catId" @change="subCatId = ''" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                        <option value="">Selecione...</option>
                        <option v-for="c in filteredCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                </div>
                <!-- Subcategoria omitida no state mock mas mantida visualmente se quiserem implementar -->
                <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">Registrar</button>
            </form>
            <button @click="isModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApp } from '~/composables/useApp'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

definePageMeta({
  layout: 'default'
})

const { transactions, addTransaction, deleteTransaction, categories, addCategory, deleteCategory, addSubcategory } = useApp()

const activeTab = ref('dashboard')
const isModalOpen = ref(false)
const tabs = [
  { id: 'dashboard', label: 'Visão Geral', icon: 'dashboard' },
  { id: 'transactions', label: 'Transações', icon: 'receipt_long' },
  { id: 'conciliation', label: 'Conciliação', icon: 'fact_check' },
  { id: 'config', label: 'Configurações', icon: 'settings' }
]

// Forms
const desc = ref('')
const val = ref('')
const type = ref('in')
const catId = ref('')
const subCatId = ref('')

const newCatName = ref('')
const newCatType = ref('Despesa')
const expandedCat = ref<string | null>(null)
const newSubName = ref('')

// Computed
const totalRevenue = computed(() => transactions.value.filter(t => t.type === 'in').reduce((acc, curr) => acc + curr.value, 0))
const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'out').reduce((acc, curr) => acc + curr.value, 0))
const margin = computed(() => {
    if (totalRevenue.value === 0) return 0
    return Math.round(((totalRevenue.value - totalExpenses.value) / totalRevenue.value) * 100)
})

const filteredCategories = computed(() => categories.value.filter(c => 
    type.value === 'in' ? c.type === 'Receita' : c.type === 'Despesa'
))

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
}

// Methods
const handleAddTransaction = () => {
    const category = categories.value.find(c => c.id === catId.value)
    const categoryName = category ? category.name : 'Outros'
    // Subcategory logic omitted for brevity in mock
    
    addTransaction({
        desc: desc.value,
        value: Number(val.value),
        type: type.value,
        cat: categoryName,
        date: new Date().toISOString()
    })
    
    desc.value = ''
    val.value = ''
    catId.value = ''
    isModalOpen.value = false
}

const handleAddCategory = () => {
    if (!newCatName.value) return
    addCategory({
        name: newCatName.value,
        type: newCatType.value,
        color: newCatType.value === 'Receita' ? 'bg-emerald-500' : 'bg-red-500'
    })
    newCatName.value = ''
}

const handleAddSub = (parentId: string) => {
    if (!newSubName.value) return
    addSubcategory(parentId, newSubName.value)
    newSubName.value = ''
}

// Chart Data (Mock)
const chartData = {
  labels: ['S1', 'S2', 'S3', 'S4'],
  datasets: [
    {
      label: 'Receita',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10B981',
      data: [40000, 30000, 20000, 27800],
      fill: true,
      tension: 0.4
    },
    {
      label: 'Despesa',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#EF4444',
      data: [24000, 13980, 9800, 3908],
      fill: true,
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { display: false },
    x: { grid: { display: false } }
  }
}
</script>
