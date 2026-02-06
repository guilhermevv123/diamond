<template>
  <div class="min-h-screen w-full flex bg-white dark:bg-navy-950 font-sans relative">
    <!-- Botão Voltar para o Site (Simulado) -->
    <a href="#" class="absolute top-8 left-8 z-20 flex items-center gap-2 text-white lg:text-slate-500 dark:text-slate-400 font-bold text-sm hover:underline">
        <span class="material-symbols-outlined text-lg">arrow_back</span>
        Voltar para o Site
    </a>

    <!-- Lado Esquerdo - Promocional / Imagem -->
    <div class="hidden lg:flex w-1/2 bg-navy-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <!-- Background Effects -->
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <!-- Content -->
        <div class="relative z-10 mt-16">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white rounded-full text-xs font-bold mb-6 animate-pulse">
                <span class="size-2 bg-white rounded-full"></span> AO VIVO
            </div>
            
            <h1 class="text-5xl font-black leading-tight mb-4">
                QUER <span class="text-primary">ESCALAR</span><br/>
                SUA OPERAÇÃO<br/>
                DE VENDAS?
            </h1>
            
            <p class="text-lg text-slate-300 max-w-md font-medium leading-relaxed">
                Centralize leads, automatize follow-ups e gerencie suas finanças com a inteligência do Diamond CRM.
            </p>
        </div>

        <!-- Card Depoimento / Destaque -->
        <div class="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-sm mt-auto">
            <div class="flex items-center gap-3 mb-3">
                <div class="size-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">PD</div>
                <div>
                    <p class="text-sm font-bold text-white">Pedro Drumond</p>
                    <p class="text-xs text-slate-400">CEO RH Renováveis</p>
                </div>
            </div>
            <p className="text-xs text-slate-300 italic">"Com o Diamond CRM, nossa taxa de conversão aumentou 40% em apenas 3 meses de uso."</p>
        </div>
    </div>

    <!-- Lado Direito - Formulário -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-navy-950 relative">
         <div class="w-full max-w-md space-y-8">
             <div class="text-center">
                 <div class="size-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/30">
                     <span class="material-symbols-outlined text-3xl">diamond</span>
                 </div>
                 <h2 class="text-2xl font-black text-navy-900 dark:text-white tracking-tight">DIAMOND CRM</h2>
                 <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">Lobo Energia</p>
             </div>

             <form @submit.prevent="handleSubmit" class="space-y-5">
                 <div class="space-y-1">
                     <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">E-mail Corporativo</label>
                     <input 
                        type="email" 
                        v-model="email"
                        class="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-navy-900 dark:text-white"
                        placeholder="seu@email.com"
                     />
                 </div>

                 <div class="space-y-1">
                     <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Senha de Acesso</label>
                     <div class="relative">
                        <input 
                            :type="showPassword ? 'text' : 'password'" 
                            v-model="password"
                            class="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-navy-900 dark:text-white"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            @click="showPassword = !showPassword"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                        >
                            <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                        </button>
                     </div>
                     <div class="flex justify-end pt-1">
                         <a href="#" class="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Esqueceu a senha?</a>
                     </div>
                 </div>

                 <button 
                    type="submit" 
                    class="w-full bg-navy-900 dark:bg-primary hover:bg-navy-800 dark:hover:bg-primary-dark text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                     Entrar no Sistema
                 </button>
             </form>

             <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-8">
                 Versão 25.4.19 • Diamond Tech
             </p>
         </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { login } = useAuth()
const email = ref('admin@minhasolar.com.br')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
    try {
        loading.value = true
        await login(email.value, password.value)
    } catch (error: any) {
        alert('Erro ao fazer login: ' + error.message)
    } finally {
        loading.value = false
    }
}
</script>
