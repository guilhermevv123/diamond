<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto w-full">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Inteligência Comercial</h2>
            <p class="text-slate-500 dark:text-slate-400 font-bold text-sm">Análise detalhada da performance da sua equipe.</p>
        </div>
        <div class="flex gap-2">
                <button class="px-4 py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">Últimos 30 dias</button>
                <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-black shadow-lg shadow-primary/20 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">download</span>
                Exportar PDF
                </button>
        </div>
    </div>

    <!-- Cards Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(card, i) in statsCards" :key="i" class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <div class="flex items-end gap-3">
                <span class="text-2xl font-black text-navy-900 dark:text-white">{{ card.val }}</span>
                <span class="text-xs font-bold mb-1 px-2 py-0.5 rounded-full" :class="card.good ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                    {{ card.trend }}
                </span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Chart: Leads vs Vendas -->
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <h3 class="text-lg font-black text-navy-900 dark:text-white mb-6">Leads vs Vendas (Semanal)</h3>
            <div class="h-80 w-full relative">
                 <Bar :data="barChartData" :options="barChartOptions" />
            </div>
        </div>

        <!-- Chart: Origem -->
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <h3 class="text-lg font-black text-navy-900 dark:text-white mb-6">Origem dos Clientes</h3>
            <div class="h-64 w-full relative flex items-center justify-center">
                 <div class="h-full w-full max-w-[300px]">
                   <Pie :data="pieChartData" :options="pieChartOptions" />
                 </div>
            </div>
            <div class="flex justify-center gap-6 mt-6 flex-wrap">
                <div v-for="(entry, index) in sourceData" :key="index" class="flex items-center gap-2">
                    <div class="size-3 rounded-full" :style="{ backgroundColor: COLORS[index % COLORS.length] }"></div>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ entry.name }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Ranking Table -->
    <div class="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100 dark:border-navy-800">
            <h3 class="text-lg font-black text-navy-900 dark:text-white">Ranking da Equipe</h3>
            </div>
            <table class="w-full text-left">
                <thead class="bg-slate-50 dark:bg-navy-800">
                    <tr>
                        <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Vendedor</th>
                        <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Leads Atendidos</th>
                        <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Conversão</th>
                        <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Total Vendido</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
                    <tr v-for="(row, i) in rankingData" :key="i" class="hover:bg-slate-50 dark:hover:bg-navy-800">
                        <td class="px-6 py-4 flex items-center gap-3">
                            <span class="font-black text-slate-300 text-lg">#{{ i+1 }}</span>
                            <span class="font-bold text-navy-900 dark:text-white">{{ row.name }}</span>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{{ row.leads }}</td>
                        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{{ row.conv }}</td>
                        <td class="px-6 py-4 font-black text-primary">{{ row.total }}</td>
                    </tr>
                </tbody>
            </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

definePageMeta({
  layout: 'default'
})

const statsCards = [
    { label: 'Taxa de Conversão Global', val: '4.2%', trend: '+0.5%', good: true },
    { label: 'Custo por Lead (CPL)', val: 'R$ 15,40', trend: '-R$ 2,00', good: true },
    { label: 'Ciclo de Venda Médio', val: '18 Dias', trend: '+2 dias', good: false },
    { label: 'ROI de Marketing', val: '12x', trend: 'Estável', good: true }
]

const rankingData = [
    { name: 'Carlos Eduardo', leads: 145, conv: '12%', total: 'R$ 450k' },
    { name: 'Fernanda Lima', leads: 132, conv: '10%', total: 'R$ 380k' },
    { name: 'João Pedro', leads: 98, conv: '8%', total: 'R$ 210k' },
]

// Data for charts
const performanceData = [
    { name: 'Seg', leads: 40, sales: 24 },
    { name: 'Ter', leads: 30, sales: 13 },
    { name: 'Qua', leads: 20, sales: 58 },
    { name: 'Qui', leads: 27, sales: 39 },
    { name: 'Sex', leads: 18, sales: 48 },
]

const sourceData = [
    { name: 'Instagram', value: 400 },
    { name: 'Google', value: 300 },
    { name: 'Indicação', value: 300 },
    { name: 'Outbound', value: 200 },
]

const COLORS = ['#0f66bd', '#FDB813', '#10B981', '#6366f1']

const barChartData = {
    labels: performanceData.map(d => d.name),
    datasets: [
        {
            label: 'Leads',
            backgroundColor: '#e2e8f0',
            data: performanceData.map(d => d.leads),
            borderRadius: 4
        },
        {
            label: 'Vendas',
            backgroundColor: '#0f66bd',
            data: performanceData.map(d => d.sales),
            borderRadius: 4
        }
    ]
}

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' as const }
    },
    scales: {
        x: { grid: { display: false } },
        y: { grid: { display: true, color: '#f1f5f9' } }
    }
}

const pieChartData = {
    labels: sourceData.map(d => d.name),
    datasets: [
        {
            backgroundColor: COLORS,
            data: sourceData.map(d => d.value),
            borderWidth: 0
        }
    ]
}

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    }
}
</script>
