<template>
  <div class="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-navy-500 dark:text-gray-400">{{ label }}</p>
        <p class="text-3xl font-bold text-navy-900 dark:text-white mt-1">{{ value }}</p>
      </div>
      <div :class="`p-3 rounded-xl ${bgColor} ${textColor}`">
        <slot name="icon">
          <div class="w-6 h-6 bg-current opacity-20" />
        </slot>
      </div>
    </div>
    <div class="mt-4 flex items-center text-xs font-semibold" :class="trendColor">
      <span>{{ trend }}</span>
      <span class="ml-1 text-navy-400 font-normal">desde ontem</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  trend: String,
  trendColor: String,
  bgColor: String,
  textColor: String
})
</script>
