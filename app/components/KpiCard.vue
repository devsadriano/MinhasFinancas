<template>
  <div 
    class="bg-dark-800/90 border rounded-xl p-5 transition-all duration-200 relative overflow-hidden group hover:border-dark-600"
    :class="[
      variant === 'brand' ? 'border-brand/30 hover:border-brand/50 bg-gradient-to-b from-brand/5 to-transparent' : 
      variant === 'income' ? 'border-income/30 hover:border-income/50 bg-gradient-to-b from-income/5 to-transparent' :
      variant === 'expense' ? 'border-expense/30 hover:border-expense/50 bg-gradient-to-b from-expense/5 to-transparent' :
      'border-dark-700'
    ]"
  >
    <!-- Background Glow Effect -->
    <div 
      class="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
      :class="[
        variant === 'brand' ? 'bg-brand' :
        variant === 'income' ? 'bg-income' :
        variant === 'expense' ? 'bg-expense' :
        'bg-blue-500'
      ]"
    />

    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ title }}</span>
      <div 
        class="w-8 h-8 rounded-lg flex items-center justify-center border"
        :class="[
          variant === 'brand' ? 'bg-brand/10 border-brand/30 text-brand' :
          variant === 'income' ? 'bg-income/10 border-income/30 text-income' :
          variant === 'expense' ? 'bg-expense/10 border-expense/30 text-expense' :
          'bg-dark-700 border-dark-600 text-gray-300'
        ]"
      >
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>

    <div class="flex items-baseline justify-between">
      <span class="text-2xl font-extrabold text-white tracking-tight font-mono">
        R$ {{ valorFormatted }}
      </span>
      <span 
        v-if="badgeText"
        class="text-xs font-semibold px-2 py-0.5 rounded-full border"
        :class="badgeClass"
      >
        {{ badgeText }}
      </span>
    </div>

    <p class="text-[11px] text-gray-400 mt-2 flex items-center gap-1" v-if="descricao">
      <span>{{ descricao }}</span>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  valor: { type: Number, default: 0 },
  variant: { type: String, default: 'neutral' }, // brand, income, expense, neutral
  badgeText: { type: String, default: '' },
  badgeClass: { type: String, default: 'bg-dark-700 text-gray-300 border-dark-600' },
  descricao: { type: String, default: '' }
})

const valorFormatted = computed(() => {
  return Number(props.valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
</script>
