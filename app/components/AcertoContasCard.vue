<template>
  <div
    class="rounded-2xl p-5 shadow-supabase transition-all duration-300 relative overflow-hidden backdrop-blur-md border"
    :class="cardStyle.containerClass"
  >
    <!-- Efeito de brilho de fundo -->
    <div
      class="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
      :class="cardStyle.blurClass"
    ></div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
      <!-- Ícone e Conteúdo -->
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border shadow-inner shrink-0"
          :class="cardStyle.iconClass"
        >
          {{ cardStyle.emoji }}
        </div>

        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" :class="cardStyle.badgeClass">
              🤝 Acerto de Contas do Casal
            </span>
          </div>

          <!-- Caso 1: Quites -->
          <template v-if="saldoAbsoluto === 0">
            <h4 class="text-base font-extrabold text-white">
              Vocês estão quites este mês! 🎉
            </h4>
            <p class="text-xs text-gray-400">
              O consumo total e os pagamentos de {{ nomeUsuarioLogado }} e {{ nomeParceiro }} estão 100% equilibrados.
            </p>
          </template>

          <!-- Caso 2: Você Deve -->
          <template v-else-if="saldo < 0">
            <h4 class="text-base font-extrabold text-white">
              Você deve <span class="text-expense font-mono font-black">R$ {{ saldoAbsoluto.toFixed(2) }}</span> para {{ nomeParceiro }}
            </h4>
            <p class="text-xs text-gray-300">
              {{ nomeParceiro }} pagou mais despesas de bolso do grupo neste período.
            </p>
          </template>

          <!-- Caso 3: Parceiro Deve -->
          <template v-else>
            <h4 class="text-base font-extrabold text-white">
              {{ nomeParceiro }} deve <span class="text-income font-mono font-black">R$ {{ saldoAbsoluto.toFixed(2) }}</span> para você
            </h4>
            <p class="text-xs text-gray-300">
              Você cobriu mais despesas do casal neste período.
            </p>
          </template>
        </div>
      </div>

      <!-- Botão de Liquidação -->
      <div v-if="saldoAbsoluto > 0" class="shrink-0 pt-2 sm:pt-0">
        <button
          type="button"
          @click="$emit('liquidar')"
          class="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-lg flex items-center justify-center gap-2 group backdrop-blur-md cursor-pointer"
          :class="cardStyle.btnClass"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Liquidar Acerto (R$ {{ saldoAbsoluto.toFixed(2) }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    saldo: number
    nomeUsuarioLogado?: string
    nomeParceiro?: string
  }>(),
  {
    saldo: 0,
    nomeUsuarioLogado: 'Você',
    nomeParceiro: 'Parceiro(a)'
  }
)

defineEmits<{
  (e: 'liquidar'): void
}>()

const saldoAbsoluto = computed(() => Math.abs(props.saldo))

const cardStyle = computed(() => {
  if (saldoAbsoluto.value === 0) {
    return {
      emoji: '✅',
      containerClass: 'bg-dark-800/90 border-brand/40 hover:border-brand/60',
      blurClass: 'bg-brand',
      iconClass: 'bg-brand/15 border-brand/40 text-brand',
      badgeClass: 'bg-brand/10 text-brand border-brand/30',
      btnClass: ''
    }
  }

  if (props.saldo < 0) {
    return {
      emoji: '💸',
      containerClass: 'bg-gradient-to-r from-expense/10 via-dark-800 to-dark-800 border-expense/40 hover:border-expense/60',
      blurClass: 'bg-expense',
      iconClass: 'bg-expense/15 border-expense/40 text-expense',
      badgeClass: 'bg-expense/10 text-expense border-expense/30',
      btnClass: 'bg-expense/20 hover:bg-expense/30 text-expense border-expense/40 hover:border-expense'
    }
  }

  return {
    emoji: '💰',
    containerClass: 'bg-gradient-to-r from-income/10 via-dark-800 to-dark-800 border-income/40 hover:border-income/60',
    blurClass: 'bg-income',
    iconClass: 'bg-income/15 border-income/40 text-income',
    badgeClass: 'bg-income/10 text-income border-income/30',
    btnClass: 'bg-income/20 hover:bg-income/30 text-income border-income/40 hover:border-income'
  }
})
</script>
