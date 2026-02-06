<template>
  <aside 
    class="bg-white dark:bg-navy-900 flex flex-col h-screen shrink-0 border-r border-gray-200 dark:border-navy-800 transition-all duration-300 ease-in-out fixed left-0 top-0 z-50"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Header / Logo -->
    <div class="p-6 flex items-center justify-between h-20">
      <NuxtLink v-if="!isCollapsed" to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <h1 class="text-xl font-black leading-tight tracking-tighter text-navy-900 dark:text-white whitespace-nowrap">
          DIAMOND<span class="text-primary">.</span>
        </h1>
      </NuxtLink>
      <button 
        @click="isCollapsed = !isCollapsed"
        class="text-gray-400 hover:text-primary transition-colors"
        :class="{ 'mx-auto': isCollapsed }"
        :title="isCollapsed ? 'Expandir Menu' : 'Recolher Menu'"
      >
        <span class="material-symbols-outlined">{{ isCollapsed ? 'menu_open' : 'menu_open' }}</span>
      </button>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
      <div v-for="item in navItems" :key="item.label">
        <!-- Item with Children -->
        <div v-if="item.children">
          <button
            @click="toggleMenu(item.label)"
            class="w-full flex items-center px-3 py-3 rounded-xl transition-all group"
            :class="[
              isCollapsed ? 'justify-center' : 'justify-between',
              expandedMenu === item.label
                ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-navy-800 dark:text-gray-400'
            ]"
            :title="isCollapsed ? item.label : ''"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
              <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
            </div>
            <span 
              v-if="!isCollapsed" 
              class="material-symbols-outlined text-sm transition-transform duration-200"
              :class="{ 'rotate-180': expandedMenu === item.label }"
            >
              expand_more
            </span>
          </button>
          
          <!-- Submenu -->
          <div 
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="expandedMenu === item.label && !isCollapsed ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'"
          >
            <div class="pl-4 space-y-1">
              <NuxtLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.path"
                class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all"
                :class="[
                  route.path === child.path
                    ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                    : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-navy-800 dark:hover:text-white'
                ]"
              >
                <span v-if="child.icon" class="material-symbols-outlined text-[18px]">{{ child.icon }}</span>
                <span>{{ child.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Single Item -->
        <NuxtLink
          v-else
          :to="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative"
          :class="[
            isCollapsed ? 'justify-center' : 'justify-start',
            route.path === item.path
              ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-navy-800 dark:text-gray-400'
          ]"
          :title="isCollapsed ? item.label : ''"
        >
          <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
          <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
          
          <!-- Notification Dot for Chat -->
          <span v-if="item.path === '/chat' && !isCollapsed" class="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
          <span v-if="item.path === '/chat' && isCollapsed" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </NuxtLink>
      </div>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-slate-100 dark:border-navy-800" ref="profileMenuRef">
      <div 
        class="relative flex items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-navy-900 dark:bg-white dark:text-navy-900 text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-tighter">
            MI
          </div>
          
          <div v-if="!isCollapsed" class="flex flex-col">
            <p class="text-sm font-black text-navy-900 dark:text-white leading-tight">Minha Solar Ltda</p>
            <p class="text-xs text-slate-500 dark:text-gray-400 font-bold">Wellington Santos</p>
          </div>
        </div>
        
        <button 
          v-if="!isCollapsed"
          @click="isProfileMenuOpen = !isProfileMenuOpen"
          class="text-slate-400 hover:text-navy-900 dark:hover:text-white p-1 rounded-md transition-colors"
        >
          <span class="material-symbols-outlined text-xl">more_vert</span>
        </button>

        <!-- Profile Dropdown -->
        <div 
          v-if="isProfileMenuOpen && !isCollapsed"
          class="absolute bottom-full right-0 w-48 mb-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div class="p-1">
            <button @click="toggleTheme" class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg text-left">
               <span class="material-symbols-outlined text-sm">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
               {{ isDark ? 'Modo Claro' : 'Modo Escuro' }}
            </button>
            <NuxtLink to="/settings" class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg text-left">
              <span class="material-symbols-outlined text-sm">settings</span>
              Configurações
            </NuxtLink>
            <div class="h-px bg-slate-100 dark:bg-navy-800 my-1"></div>
            <button class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left">
              <span class="material-symbols-outlined text-sm">logout</span>
              Desconectar
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const route = useRoute()
const isCollapsed = ref(false)
const expandedMenu = ref('CRM')
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref(null)

// Theme state (injected from default layout or composable)
const isDark = useState('theme', () => false)

const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const toggleMenu = (label) => {
  if (isCollapsed.value) isCollapsed.value = false
  expandedMenu.value = expandedMenu.value === label ? null : label
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'grid_view' },
  { path: '/chat', label: 'Conversas', icon: 'chat_bubble_outline' },
  { 
    label: 'CRM', 
    icon: 'business_center',
    children: [
      { path: '/funnel', label: 'Negócios', icon: 'view_kanban' },
      { path: '/leads', label: 'Painel de leads', icon: 'table_chart' },
      { path: '/proposals', label: 'Propostas', icon: 'description' },
      { path: '/schedule', label: 'Agenda', icon: 'calendar_month' },
    ]
  },
  { path: '/finance', label: 'Financeiro', icon: 'attach_money' },
  { path: '/reports', label: 'Relatórios', icon: 'bar_chart' },
  { 
    label: 'Recursos', 
    icon: 'layers',
    children: [
      { path: '/automation', label: 'Automação', icon: 'smart_toy' },
      { path: '/templates', label: 'Modelos de Mensagem', icon: 'chat' },
      { path: '/settings', label: 'Configurações', icon: 'settings' },
    ]
  },
]
</script>
