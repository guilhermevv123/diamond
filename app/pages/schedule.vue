<template>
  <div class="p-8 h-full flex flex-col md:flex-row gap-8 bg-white dark:bg-navy-900 max-w-7xl mx-auto relative flex-1">
    <!-- Calendar Section -->
    <div class="flex-1 flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Novembro 2023</h2>
                <p class="text-slate-500 dark:text-slate-400 font-bold text-sm">Organize suas vistorias e reuniões</p>
            </div>
            <div class="flex gap-2">
                <button class="p-2 border border-slate-200 dark:border-navy-700 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-500 dark:text-slate-300"><span class="material-symbols-outlined">chevron_left</span></button>
                <button class="px-4 py-2 bg-slate-100 dark:bg-navy-800 rounded-lg text-sm font-black text-navy-900 dark:text-white">Hoje</button>
                <button class="p-2 border border-slate-200 dark:border-navy-700 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-500 dark:text-slate-300"><span class="material-symbols-outlined">chevron_right</span></button>
            </div>
        </div>

        <div class="grid grid-cols-7 mb-4">
            <div v-for="day in days" :key="day" class="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">
                {{ day }}
            </div>
        </div>
        
        <div class="grid grid-cols-7 grid-rows-5 gap-2 flex-1 min-h-[500px]">
            <template v-for="(date, i) in dates" :key="i">
                 <div v-if="date > 30" class="bg-slate-50/50 dark:bg-navy-800/50 rounded-xl"></div>
                 
                 <div v-else 
                    class="p-2 border border-slate-100 dark:border-navy-800 rounded-xl relative hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                    :class="date === 10 ? 'bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-navy-900'"
                 >
                    <span class="text-sm font-bold block mb-1" :class="date === 10 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'">{{ date }}</span>
                    <div class="space-y-1">
                        <div 
                            v-for="ev in getDayEvents(date)" 
                            :key="ev.id" 
                            class="text-[9px] p-1 rounded font-bold truncate cursor-pointer"
                            :class="getEventColor(ev.type)"
                            @click="handleDelete(ev.id)"
                            :title="ev.time + ' - ' + ev.title"
                        >
                            {{ ev.time }} - {{ ev.title }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- Sidebar Tasks -->
    <div class="w-full md:w-80 border-l border-slate-100 dark:border-navy-800 pl-8 space-y-8">
            <div class="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20">
            <p class="text-xs font-bold opacity-80 uppercase mb-1">Próximo Compromisso</p>
            <h3 class="text-xl font-black leading-tight mb-4 truncate">{{ events[0]?.title || 'Nenhum' }}</h3>
            <div v-if="events[0]" class="flex items-center gap-2 text-sm font-bold bg-white/10 p-2 rounded-lg">
                <span class="material-symbols-outlined text-lg">schedule</span>
                {{ formatDate(events[0].date) }}, {{ events[0].time }}
            </div>
        </div>

        <div>
            <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-black text-navy-900 dark:text-white">Tarefas do Dia</h4>
                    <button @click="isModalOpen = true" class="size-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-primary hover:bg-slate-200 dark:hover:bg-navy-700">
                    <span class="material-symbols-outlined text-lg">add</span>
                    </button>
            </div>
            <div class="space-y-3">
                <p v-if="events.length === 0" class="text-xs text-slate-400">Adicione eventos no calendário para ver aqui.</p>
                <div v-for="ev in events.slice(0, 5)" :key="ev.id" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
                     <div class="size-2 rounded-full" :class="getEventDotColor(ev.type)"></div>
                     <div class="flex-1 min-w-0">
                         <p class="text-xs font-bold text-navy-900 dark:text-white truncate">{{ ev.title }}</p>
                         <p class="text-[10px] text-slate-400 font-bold">{{ ev.time }} • {{ ev.type }}</p>
                     </div>
                </div>
            </div>
        </div>
    </div>

        <!-- Modal Evento -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
            <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Novo Evento</h3>
                <form @submit.prevent="handleAdd" class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Título</label>
                        <input required type="text" v-model="title" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                    </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                            <label class="text-xs font-bold text-slate-500 uppercase">Dia (Nov)</label>
                            <input required type="number" min="1" max="30" v-model.number="day" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                        </div>
                        <div>
                            <label class="text-xs font-bold text-slate-500 uppercase">Hora</label>
                            <input required type="time" v-model="time" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                        <select v-model="type" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                            <option value="vistoria">Vistoria</option>
                            <option value="reuniao">Reunião</option>
                            <option value="instalacao">Instalação</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">Agendar</button>
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

const { events, addEvent, deleteEvent } = useApp()

const isModalOpen = ref(false)
const title = ref('')
const time = ref('')
const type = ref('vistoria')
const day = ref(10)

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const dates = Array.from({length: 35}, (_, i) => i + 1) // Mock calendar dates

const handleAdd = () => {
    addEvent({
        title: title.value,
        time: time.value,
        type: type.value,
        date: `2023-11-${day.value}`
    })
    isModalOpen.value = false
    title.value = ''
}

const handleDelete = (id: string) => {
    if (confirm('Deletar evento?')) {
        deleteEvent(id)
    }
}

const getDayEvents = (date: number) => {
    return events.value.filter(e => {
        // Mock date parsing (assumes YYYY-MM-DD)
        const dayPart = parseInt(e.date.split('-')[2])
        return dayPart === date
    })
}

const getEventColor = (type: string) => {
    switch(type) {
        case 'vistoria': return 'bg-purple-100 text-purple-700 border-l-4 border-purple-500 dark:bg-purple-900/30 dark:text-purple-300'
        case 'reuniao': return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
        case 'instalacao': return 'bg-orange-100 text-orange-700 border-l-4 border-orange-500 dark:bg-orange-900/30 dark:text-orange-300'
        default: return 'bg-slate-100 text-slate-700 border-l-4 border-slate-300 dark:bg-navy-700 dark:text-slate-300'
    }
}

const getEventDotColor = (type: string) => {
     switch(type) {
        case 'vistoria': return 'bg-purple-500'
        case 'reuniao': return 'bg-blue-500'
        case 'instalacao': return 'bg-orange-500'
        default: return 'bg-slate-300'
    }
}

const formatDate = (date: string) => {
    const parts = date.split('-')
    return `${parts[2]}/${parts[1]}`
}
</script>
