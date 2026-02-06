<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto w-full">
    <div>
      <h2 class="text-3xl font-black text-navy-900 dark:text-white tracking-tight">Configurações</h2>
      <p class="text-slate-500 dark:text-slate-400 font-bold text-sm">Gerencie sua conta e equipe.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-6 border-b border-slate-200 dark:border-navy-700 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="animate-in fade-in slide-in-from-left-4 duration-300">
      
      <!-- ABA USUÁRIOS -->
      <div v-if="activeTab === 'usuarios'" class="space-y-6">
        <!-- Header de Filtros e Busca -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-navy-900 p-4 rounded-xl border border-slate-200 dark:border-navy-700 shadow-sm gap-4">
          <div class="flex gap-2 items-center">
            <button class="bg-navy-900 dark:bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md">Ativos</button>
            <button class="bg-white dark:bg-navy-800 text-slate-500 dark:text-slate-300 px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors">Todos</button>
            <span class="ml-2 px-3 py-2 rounded-lg text-xs font-black" :class="userCount > USER_LIMIT ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'">
              {{ userCount }}/{{ USER_LIMIT }} Usuários
            </span>
          </div>
          <div class="flex-1 w-full md:w-auto relative group">
            <input type="text" placeholder="Pesquisar por usuários" class="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 rounded-lg text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-navy-900 dark:text-white" />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary">search</span>
          </div>
          <div class="flex gap-2">
            <button @click="openUserModal" class="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-700 shadow-md transition-all active:scale-95">
              <span class="material-symbols-outlined text-sm">add</span> + Usuário
            </button>
          </div>
        </div>

        <!-- Tabela de Usuários -->
        <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
           <div class="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
             <h4 class="text-sm font-black text-navy-900 dark:text-white">Assentos de Usuários</h4>
             <!-- Additional buttons omitted for brevity -->
           </div>

           <div class="overflow-x-auto border border-slate-200 dark:border-navy-700 rounded-lg">
             <table class="w-full text-left border-collapse">
               <thead class="bg-white dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700">
                 <tr>
                   <th class="p-4 w-10 text-center"><input type="checkbox" class="rounded border-slate-300 text-primary focus:ring-primary" /></th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ativo</th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail</th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
                   <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider"></th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-100 dark:divide-navy-700">
                 <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors group">
                   <td class="p-4 text-center"><input type="checkbox" class="rounded border-slate-300 text-primary focus:ring-primary" /></td>
                   <td class="p-4">
                     <div 
                       @click="toggleUserStatus(user.id)" 
                       class="w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200"
                       :class="user.active ? 'bg-navy-900 dark:bg-primary' : 'bg-slate-300 dark:bg-slate-600'"
                     >
                       <div class="size-3 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-200" :class="user.active ? 'left-6' : 'left-1'"></div>
                     </div>
                   </td>
                   <td class="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">{{ user.code }}</td>
                   <td class="p-4 text-xs font-black text-navy-900 dark:text-white uppercase tracking-tight">{{ user.name }}</td>
                   <td class="p-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">{{ user.email }}</td>
                   <td class="p-4 text-[11px] text-slate-500 dark:text-slate-400">{{ user.profile }}</td>
                   <td class="p-4 text-right">
                     <button @click="deleteUser(user.id)" class="text-slate-300 hover:text-red-500 transition-colors"><span class="material-symbols-outlined text-lg">delete</span></button>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>

      <!-- ABA PLANOS (Visual Only Mock) -->
      <div v-if="activeTab === 'planos'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white dark:bg-navy-900 p-8 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden">
               <div class="absolute top-0 right-0 p-6 opacity-10">
                  <span class="material-symbols-outlined text-9xl text-primary">diamond</span>
              </div>
              <div>
                  <h3 class="text-xl font-black text-navy-900 dark:text-white mb-2">Seu Plano Atual</h3>
                  <div class="flex items-baseline gap-2 mb-2">
                       <span class="text-4xl font-black text-primary">Corporate</span>
                      <span class="text-sm font-bold text-slate-400">/mensal</span>
                  </div>
                  <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide mb-6">Ativo</span>
              </div>
              <div class="space-y-4 mb-8">
                   <div class="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300 border-b border-slate-50 dark:border-navy-700 pb-2">
                      <span>Limite Base de Usuários</span>
                      <span class="text-navy-900 dark:text-white">{{ USER_LIMIT }} Pessoas</span>
                  </div>
                  <!-- ... other rows ... -->
              </div>
              <div class="p-5 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700">
                  <div class="flex justify-between items-center mb-2">
                        <span class="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Uso da Equipe</span>
                        <span class="text-xs font-bold text-navy-900 dark:text-white">{{ userCount }} / {{ USER_LIMIT }}</span>
                   </div>
                   <div class="w-full bg-slate-200 dark:bg-navy-700 rounded-full h-2 mb-3">
                        <div 
                            class="h-2 rounded-full transition-all duration-500" 
                            :class="userCount > USER_LIMIT ? 'bg-orange-500' : 'bg-primary'"
                            :style="{ width: `${Math.min((userCount / USER_LIMIT) * 100, 100)}%` }"
                        ></div>
                   </div>
              </div>
          </div>
      </div>

      <!-- ABA GERAL -->
      <div v-if="activeTab === 'geral'" class="max-w-2xl bg-white dark:bg-navy-900 p-8 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm space-y-6">
           <h3 class="text-lg font-black text-navy-900 dark:text-white">Informações da Conta</h3>
           <div class="space-y-4">
              <div>
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nome da Empresa</label>
                  <input type="text" v-model="companyNameForm" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
              </div>
              <div>
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">CNPJ</label>
                  <input type="text" v-model="cnpjForm" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
              </div>
           </div>
           <div class="pt-4 border-t border-slate-100 dark:border-navy-800 flex justify-end">
               <button @click="handleSaveAccount" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-primary/20 transition-all">Salvar Alterações</button>
           </div>
      </div>

      <!-- ABA FUNIS -->
      <div v-if="activeTab === 'funis'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm h-fit">
               <h3 class="text-lg font-black text-navy-900 dark:text-white mb-4">Selecione o Funil</h3>
               <div class="space-y-2">
                   <button
                       v-for="pipeline in pipelines"
                       :key="pipeline.id"
                       @click="selectedPipelineId = pipeline.id"
                       class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all"
                       :class="selectedPipelineId === pipeline.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-navy-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700'"
                   >
                       {{ pipeline.name }}
                       <span v-if="selectedPipelineId === pipeline.id" class="material-symbols-outlined">check</span>
                   </button>
               </div>
           </div>

           <div class="lg:col-span-2 space-y-6">
               <div class="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
                    <h3 class="text-lg font-black text-navy-900 dark:text-white mb-6">Campos Personalizados</h3>
                    
                    <form @submit.prevent="handleAddFieldToPipeline" class="bg-slate-50 dark:bg-navy-800 p-4 rounded-xl border border-slate-200 dark:border-navy-700 mb-6 flex flex-col md:flex-row gap-4 items-end">
                         <div class="flex-1 w-full">
                            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nome do Campo</label>
                            <input required type="text" v-model="newFieldName" placeholder="Ex: Potência" class="w-full mt-1 p-2.5 bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                         </div>
                         <div class="w-full md:w-48">
                            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tipo</label>
                            <select v-model="newFieldType" class="w-full mt-1 p-2.5 bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                                <option value="select">Seleção</option>
                                <option value="textarea">Texto Longo</option>
                            </select>
                         </div>
                         <button type="submit" class="w-full md:w-auto bg-navy-900 dark:bg-primary text-white px-4 py-2.5 rounded-lg font-black hover:bg-navy-800 transition-colors">Adicionar</button>
                    </form>

                    <div class="space-y-3">
                         <template v-if="selectedPipeline?.customFieldDefs && selectedPipeline.customFieldDefs.length > 0">
                             <div v-for="field in selectedPipeline.customFieldDefs" :key="field.id" class="flex items-center justify-between p-4 bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 rounded-xl">
                                  <div class="flex items-center gap-3">
                                      <div class="size-8 bg-slate-100 dark:bg-navy-700 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300">
                                          <span class="material-symbols-outlined text-lg">text_fields</span>
                                      </div>
                                      <div>
                                          <p class="text-sm font-black text-navy-900 dark:text-white">{{ field.label }}</p>
                                          <p class="text-[10px] text-slate-400 font-bold uppercase">{{ field.type }} • {{ field.required ? 'Obrigatório' : 'Opcional' }}</p>
                                      </div>
                                  </div>
                                  <button @click="handleRemoveField(field.id)" class="text-slate-300 hover:text-red-500 transition-colors">
                                      <span class="material-symbols-outlined">delete</span>
                                  </button>
                             </div>
                         </template>
                         <div v-else class="text-center py-8 text-slate-400 font-medium">Nenhum campo personalizado.</div>
                    </div>
               </div>
           </div>
      </div>
    </div>

    <!-- Modal Novo Usuário -->
    <div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="isUserModalOpen = false"></div>
        <div class="bg-white dark:bg-navy-900 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 class="text-xl font-black text-navy-900 dark:text-white mb-6">Novo Usuário</h3>
            <div v-if="userCount >= USER_LIMIT" class="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 p-3 rounded-lg mb-4 text-xs font-bold flex items-center gap-2">
                 <span class="material-symbols-outlined text-sm">info</span>
                 <p>Limite excedido. Será cobrado extra.</p>
            </div>
            
            <form @submit.prevent="handleAddUser" class="space-y-4">
                 <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                    <input required type="text" v-model="newUser.name" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                 </div>
                 <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                    <input required type="email" v-model="newUser.email" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                 </div>
                 <div>
                    <label class="text-xs font-bold text-slate-500 uppercase">Celular</label>
                    <input required type="text" v-model="newUser.phone" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white" />
                 </div>
                 <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="text-xs font-bold text-slate-500 uppercase">Função</label>
                        <select v-model="newUser.role" class="w-full mt-1 p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:border-primary text-navy-900 dark:text-white">
                            <option value="Vendedor">Vendedor</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Administrador">Admin</option>
                        </select>
                     </div>
                 </div>
                 <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl font-black mt-2 hover:bg-primary-dark transition-colors">{{ userCount >= USER_LIMIT ? 'Confirmar (+Custo)' : 'Criar Acesso' }}</button>
            </form>
            <button @click="isUserModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-navy-900 dark:hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useApp } from '~/composables/useApp'
import type { UserRole, CustomFieldDefinition } from '~/types'

definePageMeta({
  layout: 'default'
})

const { account, updateAccount, users, addUser, deleteUser, toggleUserStatus, pipelines, updatePipeline } = useApp()

const activeTab = ref('usuarios')
const tabs = [
  { id: 'usuarios', label: 'Equipe e Acessos' },
  { id: 'planos', label: 'Planos e Faturamento' },
  { id: 'geral', label: 'Dados da Empresa' },
  { id: 'funis', label: 'Funis e Campos' }
]

const companyNameForm = ref(account.value.name)
const cnpjForm = ref(account.value.cnpj)

// Sync account changes if needed or just on mount
watch(account, (newVal) => {
    companyNameForm.value = newVal.name
    cnpjForm.value = newVal.cnpj
}, { immediate: true })

const handleSaveAccount = () => {
    updateAccount({ name: companyNameForm.value, cnpj: cnpjForm.value })
    alert('Dados salvos!')
}

// Users
const isUserModalOpen = ref(false)
const newUser = ref({ name: '', email: '', phone: '', code: 0, store: account.value.name, profile: 'Vendedor', function: 'Vendedor', team: 'Sem equipe', role: 'Vendedor' as UserRole })
const USER_LIMIT = 5
const userCount = computed(() => users.value.length)

const openUserModal = () => {
    isUserModalOpen.value = true
}

const handleAddUser = () => {
    const newCode = users.value.length > 0 ? Math.max(...users.value.map(u => u.code)) + 1 : 1
    addUser({
        ...newUser.value,
        code: newCode,
        active: true,
        profile: newUser.value.role,
        function: newUser.value.role
    })
    isUserModalOpen.value = false
    newUser.value = { name: '', email: '', phone: '', code: 0, store: account.value.name, profile: 'Vendedor', function: 'Vendedor', team: 'Sem equipe', role: 'Vendedor' as UserRole }
}

// Funnels
const selectedPipelineId = ref(pipelines.value[0]?.id || '')
const selectedPipeline = computed(() => pipelines.value.find(p => p.id === selectedPipelineId.value))

const newFieldName = ref('')
const newFieldType = ref<CustomFieldDefinition['type']>('text')

const handleAddFieldToPipeline = () => {
    if (!newFieldName.value || !selectedPipelineId.value) return
    const pipeline = selectedPipeline.value
    if (pipeline) {
        const newField: CustomFieldDefinition = {
            id: Math.random().toString(36).substr(2, 9),
            label: newFieldName.value,
            type: newFieldType.value,
            required: false
        }
        updatePipeline(pipeline.id, {
            customFieldDefs: [...(pipeline.customFieldDefs || []), newField]
        })
        newFieldName.value = ''
    }
}

const handleRemoveField = (fieldId: string) => {
    if (selectedPipeline.value) {
        const updatedFields = (selectedPipeline.value.customFieldDefs || []).filter(f => f.id !== fieldId)
        updatePipeline(selectedPipeline.value.id, { customFieldDefs: updatedFields })
    }
}
</script>
