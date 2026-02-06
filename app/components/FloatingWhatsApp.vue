<template>
  <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
    <!-- Popover de Suporte -->
    <div 
      class="mb-4 transition-all duration-300 origin-bottom-right"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'"
    >
      <div class="bg-white dark:bg-navy-900 border border-slate-100 dark:border-navy-800 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 w-[280px]">
        <div class="flex items-center gap-4 mb-4">
          <div class="size-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-2xl fill-1">support_agent</span>
          </div>
          <div>
            <p class="text-base font-black text-navy-900 dark:text-white leading-tight">Suporte Dimond</p>
            <p class="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">Online agora</p>
          </div>
        </div>
        
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
          Olá! Como podemos ajudar na sua operação solar hoje?
        </p>
        
        <button 
          @click="handleNavigate"
          class="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95"
        >
           Iniciar Conversa
        </button>
      </div>
    </div>
    
    <!-- Botão Flutuante (Bolinha) -->
    <button 
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
      @click="handleNavigate"
      class="size-16 bg-primary text-white rounded-full shadow-[0_10px_30px_rgba(15,102,189,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:rotate-6"
    >
      <span class="material-symbols-outlined text-3xl fill-1">chat</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const handleNavigate = () => {
    isOpen.value = false
    navigateTo('/chat')
}
</script>
