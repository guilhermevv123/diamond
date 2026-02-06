<template>
  <div class="flex flex-col items-center justify-center h-[calc(100vh-theme('spacing.32'))] text-center p-8 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 border-dashed">
    <div class="size-20 bg-slate-50 dark:bg-navy-800 rounded-full flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-4xl text-slate-400">chat</span>
    </div>
    <h2 class="text-2xl font-black text-navy-900 dark:text-white mb-2">Modelos de Mensagem</h2>
    <p class="text-slate-500 dark:text-slate-400 max-w-md">Gerencie seus templates de resposta rápida aqui. Esta funcionalidade será implementada em breve.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
