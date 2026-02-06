<template>
  <div class="space-y-6">
    <!-- Top Filter Bar -->
    <div class="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        
        <!-- Date Start -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 dark:text-gray-400">Data Inicial</label>
          <div class="relative">
            <input 
              type="date" 
              class="pl-3 pr-8 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-primary transition-colors"
              defaultValue="2025-01-31" 
            />
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">calendar_month</span>
          </div>
        </div>

        <!-- Date End -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 dark:text-gray-400">Data Final</label>
          <div class="relative">
            <input 
              type="date" 
              class="pl-3 pr-8 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-primary transition-colors"
              defaultValue="2025-02-19" 
            />
            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">calendar_month</span>
          </div>
        </div>

        <!-- User Select -->
        <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label class="text-xs font-bold text-slate-500 dark:text-gray-400">Usuário</label>
          <select class="w-full px-3 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-primary transition-colors appearance-none">
            <option>Todos os usuários</option>
            <option>Wellington Santos</option>
          </select>
        </div>
      </div>

      <button class="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
        Filtrar
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(metric, idx) in metrics" :key="idx" 
        class="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
        <div>
          <p class="text-xs font-extrabold text-slate-500 dark:text-gray-400 mb-1">{{ metric.title }}</p>
          <h3 class="text-3xl font-black text-navy-900 dark:text-white">{{ metric.value }}</h3>
        </div>
        <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-xl">{{ metric.icon }}</span>
        </div>
      </div>
    </div>

    <!-- Main Chart Section -->
    <div class="bg-white dark:bg-navy-900 p-8 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm">
      <div class="flex justify-between items-start mb-8">
        <h3 class="text-xl font-black text-navy-900 dark:text-white">Visão geral</h3>
        <div class="flex flex-col items-end">
          <label class="text-xs font-bold text-slate-400 mb-1">Dados do Gráfico</label>
          <select 
            class="px-4 py-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none shadow-sm focus:border-primary"
          >
            <option value="Atividades">Atividades</option>
            <option value="Financeiro">Financeiro (Receita)</option>
          </select>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="h-[400px] w-full bg-gray-50 dark:bg-navy-950 rounded-xl border border-dashed border-gray-200 dark:border-navy-800 flex items-center justify-center relative overflow-hidden group">
        <div class="text-center z-10">
          <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-navy-700 mb-4 block group-hover:scale-110 transition-transform duration-500">bar_chart</span>
          <p class="text-gray-400 dark:text-navy-500 font-bold">Gráfico de Atividades</p>
          <p class="text-xs text-gray-300 dark:text-navy-600 mt-2">Dados simulados disponíveis em useMockData</p>
        </div>
        
        <!-- Decorative subtle background pattern -->
        <div class="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { metrics } = useMockData()

definePageMeta({
  layout: 'default'
})
</script>
