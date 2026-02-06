<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-gray-50 dark:bg-navy-950 transition-colors duration-300 font-sans flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="flex-1 transition-all duration-300 ml-64">
        <!-- Top Spacer if needed or just padding -->
        <div class="p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const isDark = useState('theme', () => false)
</script>

